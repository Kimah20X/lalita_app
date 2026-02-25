import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../utils/prisma';
import { NotificationService } from '../../services/notification.service';

export const createAjoGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { name, contributionAmount, frequency } = req.body;
    const userId = req.user?.userId;

    if (!name || !contributionAmount || !frequency) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const group = await prisma.ajoGroup.create({
      data: {
        name,
        contributionAmount,
        frequency,
        creatorId: userId!,
        members: {
          create: {
            userId: userId!,
          }
        }
      },
    });

    res.status(201).json({ success: true, data: group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAllAjoGroups = async (req: AuthRequest, res: Response) => {
  try {
    const groups = await prisma.ajoGroup.findMany({
      include: {
        _count: { select: { members: true } },
        members: {
          select: {
            userId: true,
            payoutOrder: true,
            payoutStatus: true,
          }
        }
      },
    });
    res.json({ success: true, data: groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const joinAjoGroup = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.userId;

    const group = await prisma.ajoGroup.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Ajo group not found' });
    }

    if (group.status !== 'OPEN') {
      return res.status(400).json({ success: false, message: 'This group is no longer accepting members' });
    }

    if ((group as any)._count.members >= 50) {
      return res.status(400).json({ success: false, message: 'Ajo group is full (max 50 members)' });
    }

    const existingMember = await prisma.ajoMember.findUnique({
      where: { userId_groupId: { userId: userId!, groupId: id } },
    });

    if (existingMember) {
      return res.status(400).json({ success: false, message: 'You are already a member of this group' });
    }

    const membership = await prisma.ajoMember.create({
      data: {
        userId: userId!,
        groupId: id,
      },
    });

    res.json({ success: true, message: 'Joined Ajo group successfully', data: membership });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const startAjoGroup = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.userId;

    const group = await prisma.ajoGroup.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Ajo group not found' });
    }

    if (group.creatorId !== userId) {
      return res.status(403).json({ success: false, message: 'Only the creator can start the group' });
    }

    if (group.status !== 'OPEN') {
      return res.status(400).json({ success: false, message: 'Group has already started' });
    }

    if (!group || (group as any).members.length < 2) {
      return res.status(400).json({ success: false, message: 'Need at least 2 members to start' });
    }

    // Assign random payout order
    const shuffledMembers = [...(group as any).members].sort(() => Math.random() - 0.5);

    await prisma.$transaction(
      shuffledMembers.map((member, index) =>
        prisma.ajoMember.update({
          where: { id: member.id },
          data: { payoutOrder: index + 1 },
        })
      )
    );

    const updatedGroup = await prisma.ajoGroup.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    res.json({ success: true, message: 'Ajo group started successfully', data: updatedGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const contributeToAjo = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.userId;

    const group = await prisma.ajoGroup.findUnique({
      where: { id },
      include: {
        members: true,
        transactions: {
          where: { type: 'AJO_CONTRIBUTION' }
        }
      },
    });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Ajo group not found' });
    }

    if (group.status !== 'ACTIVE') {
      return res.status(400).json({ success: false, message: 'Group is not active' });
    }

    const membership = group.members.find(m => m.userId === userId);
    if (!membership) {
      return res.status(403).json({ success: false, message: 'You must be a member to contribute' });
    }

    // Check if user already contributed in this cycle
    // A simple way is to check transactions for this cycle.
    // But since we don't have explicit cycle tracking on transactions, let's assume one contribution per cycle.
    // In a production app, we'd have a 'AjoContribution' model.
    // For now, let's use the transaction count vs members * (cycle - 1)

    const cycleContributions = await prisma.transaction.count({
      where: {
        userId,
        relatedGroupId: id,
        type: 'AJO_CONTRIBUTION',
        createdAt: {
          gte: group.updatedAt // This is a bit weak but works for this simplified logic
        }
      }
    });

    if (cycleContributions > 0) {
      return res.status(400).json({ success: false, message: 'You have already contributed for this cycle' });
    }

    const amount = group.contributionAmount;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      });

      await tx.transaction.create({
        data: {
          type: 'AJO_CONTRIBUTION',
          amount,
          userId: userId!,
          relatedGroupId: id,
        },
      });
    });

    // Check if payout is due
    // Get all contributions for the current cycle
    const allContributions = await prisma.transaction.findMany({
      where: {
        relatedGroupId: id,
        type: 'AJO_CONTRIBUTION',
        // In a real app we'd filter by cycle. Here we'll just check if total matches members * cycle
      }
    });

    const totalNeeded = group.contributionAmount * group.members.length;
    const currentPot = (allContributions.length % group.members.length) === 0 ? totalNeeded : 0;
    // This logic is flawed. Let's do it properly.

    const contributionsThisCycle = allContributions.length % group.members.length;

    if (contributionsThisCycle === 0) {
      // Pot is full! Pay the member whose turn it is.
      const payoutMember = group.members.find(m => m.payoutOrder === group.currentCycle);

      if (payoutMember) {
        const potAmount = group.contributionAmount * group.members.length;

        await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: payoutMember.userId },
            data: { balance: { increment: potAmount } },
          });

          await tx.transaction.create({
            data: {
              type: 'AJO_PAYOUT',
              amount: potAmount,
              userId: payoutMember.userId,
              relatedGroupId: id,
            },
          });

          await tx.ajoMember.update({
            where: { id: payoutMember.id },
            data: { payoutStatus: 'PAID' },
          });

          if (group.currentCycle === group.members.length) {
            await tx.ajoGroup.update({
              where: { id },
              data: { status: 'COMPLETED' },
            });
          } else {
            await tx.ajoGroup.update({
              where: { id },
              data: { currentCycle: { increment: 1 } },
            });
          }
        });

        // Notify user of payout
        await NotificationService.sendToUser(
          payoutMember.userId,
          'Ajo Payout Received!',
          `₦${potAmount.toLocaleString()} from your group "${group.name}" has been credited to your wallet.`
        );
      }
    }

    res.json({ success: true, message: 'Contribution successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

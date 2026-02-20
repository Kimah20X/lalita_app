import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../utils/prisma';

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

export const contributeToAjo = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.userId;

    const membership = await prisma.ajoMember.findUnique({
      where: { userId_groupId: { userId: userId!, groupId: id } },
      include: { group: true },
    });

    if (!membership || !(membership as any).group) {
      return res.status(403).json({ success: false, message: 'You must be a member to contribute' });
    }

    const amount = (membership as any).group.contributionAmount;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      }),
      prisma.transaction.create({
        data: {
          type: 'AJO_CONTRIBUTION',
          amount,
          userId: userId!,
          relatedGroupId: id,
        },
      }),
    ]);

    res.json({ success: true, message: 'Contribution successful', data: transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

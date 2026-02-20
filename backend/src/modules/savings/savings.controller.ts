import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../utils/prisma';

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { title, targetAmount, frequency } = req.body;
    const userId = req.user?.userId;

    if (!title || !targetAmount || !frequency) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (targetAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Target amount must be greater than 0' });
    }

    const goal = await prisma.savingsGoal.create({
      data: {
        title,
        targetAmount,
        frequency,
        userId: userId!,
      },
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const goals = await prisma.savingsGoal.findMany({ where: { userId } });
    res.json({ success: true, data: goals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getGoalById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.userId;

    const goal = await prisma.savingsGoal.findFirst({ where: { id, userId: userId as string } });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, data: goal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deposit = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { amount } = req.body;
    const userId = req.user?.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid deposit amount' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId as string } });
    if (!user || user.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    const goal = await prisma.savingsGoal.findFirst({ where: { id, userId: userId as string } });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    const [updatedGoal, updatedUser, transaction] = await prisma.$transaction([
      prisma.savingsGoal.update({
        where: { id },
        data: { currentAmount: { increment: amount } },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      }),
      prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          amount,
          userId: userId!,
          relatedGoalId: id,
        },
      }),
    ]);

    res.json({ success: true, message: 'Deposit successful', data: updatedGoal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const withdraw = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { amount } = req.body;
    const userId = req.user?.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
    }

    const goal = await prisma.savingsGoal.findFirst({ where: { id, userId: userId as string } });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.currentAmount < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient goal balance' });
    }

    const [updatedGoal, transaction] = await prisma.$transaction([
      prisma.savingsGoal.update({
        where: { id },
        data: { currentAmount: { decrement: amount } },
      }),
      prisma.transaction.create({
        data: {
          type: 'WITHDRAWAL',
          amount,
          userId: userId!,
          relatedGoalId: id,
        },
      }),
    ]);

    // Note: Per user's request, money withdrawn from a goal is withdrawn completely from the app.
    // So we don't increment user.balance here.

    res.json({ success: true, message: 'Withdrawal successful', data: updatedGoal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../utils/prisma';

export const getDashboardSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const savingsGoals = await prisma.savingsGoal.findMany({
      where: { userId },
    });

    const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const activeGoals = savingsGoals.length;

    const ajoContributions = await prisma.transaction.aggregate({
      where: {
        userId,
        type: 'AJO_CONTRIBUTION',
      },
      _sum: {
        amount: true,
      },
    });

    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        goal: { select: { title: true } },
        group: { select: { name: true } },
      },
    });

    res.json({
      success: true,
      data: {
        totalSavings,
        activeGoals,
        ajoContributions: ajoContributions._sum.amount || 0,
        recentTransactions: recentTransactions.map(t => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          title: t.goal?.title || t.group?.name || 'General Transaction',
          createdAt: t.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

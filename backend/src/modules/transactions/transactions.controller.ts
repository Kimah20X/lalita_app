import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../utils/prisma';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        goal: { select: { title: true } },
        group: { select: { name: true } },
      },
    });

    res.json({
      success: true,
      data: transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        relatedTo: t.goal?.title || t.group?.name || 'Wallet',
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

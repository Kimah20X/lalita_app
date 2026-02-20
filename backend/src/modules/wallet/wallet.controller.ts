import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../utils/prisma';
import { PaymentService } from '../../services/payment.service';

export const depositToWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid deposit amount' });
    }

    // In a real flow, this would be a webhook from Monnify
    // For now, we allow manual simulation of deposit
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
    });

    await prisma.transaction.create({
      data: {
        type: 'DEPOSIT',
        amount,
        userId: userId!,
      },
    });

    res.json({
      success: true,
      message: 'Wallet deposit successful',
      data: { balance: updatedUser.balance },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const withdrawFromWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, bankDetails } = req.body;
    const userId = req.user?.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    // Call simulated payment service
    await PaymentService.processWithdrawal(userId!, amount, bankDetails);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } },
    });

    await prisma.transaction.create({
      data: {
        type: 'WITHDRAWAL',
        amount,
        userId: userId!,
      },
    });

    res.json({
      success: true,
      message: 'Withdrawal successful',
      data: { balance: updatedUser.balance },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getVirtualAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const account = await PaymentService.generateVirtualAccount({
      id: user.id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
    });

    res.json({ success: true, data: account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

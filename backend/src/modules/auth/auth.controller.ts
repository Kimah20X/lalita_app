import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password, fullName, businessType } = req.body;

    if (!phoneNumber || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existingUser = await prisma.user.findUnique({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        phoneNumber,
        password: hashedPassword,
        fullName,
        businessType,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          fullName: user.fullName,
          businessType: user.businessType,
          balance: user.balance,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          fullName: user.fullName,
          businessType: user.businessType,
          balance: user.balance,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

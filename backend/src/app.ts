import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import savingsRoutes from './modules/savings/savings.routes';
import ajoRoutes from './modules/ajo/ajo.routes';
import transactionRoutes from './modules/transactions/transactions.routes';
import walletRoutes from './modules/wallet/wallet.routes';
import { setupSwagger } from './config/swagger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Swagger
setupSwagger(app);

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/goals', savingsRoutes);
app.use('/ajo', ajoRoutes);
app.use('/transactions', transactionRoutes);
app.use('/wallet', walletRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Lalita API is running' });
});

export default app;

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  businessType?: string;
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
}

export type AutoSaveFrequency = 'Daily' | 'Weekly' | 'Monthly';

export interface SavingsGoal {
  id: string;
  name: string;
  savedAmount: number;
  targetAmount: number;
  frequency: AutoSaveFrequency;
  createdAt: string;
  targetDate?: string;
  category?: string;
}

export interface AjoGroup {
  id: string;
  name: string;
  totalContributions: number;
  targetAmount: number;
  membersCount: number;
  contributionAmount: number;
  nextPayoutDate?: string;
  status: 'Active' | 'Completed';
}

export interface AppState {
  user: User | null;
  savingsGoals: SavingsGoal[];
  ajoGroups: AjoGroup[];
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  isMoneyVisible: boolean;
  language: 'en' | 'ha' | 'yo' | 'ig';
  theme: 'light' | 'dark';
}

import { createContext } from 'react';
import { AppState, User, SavingsGoal, AjoGroup } from '@/types';

export interface AppContextType extends AppState {
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSavingsGoals: (goals: SavingsGoal[]) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'savedAmount'>) => void;
  setAjoGroups: (groups: AjoGroup[]) => void;
  addAjoGroup: (group: Omit<AjoGroup, 'id' | 'status' | 'totalContributions'>) => void;
  joinAjoGroup: (groupId: string) => Promise<void>;
  startAjoGroup: (groupId: string) => Promise<void>;
  contributeToAjo: (groupId: string) => Promise<void>;
  depositToGoal: (goalId: string, amount: number) => Promise<void>;
  withdrawFromGoal: (goalId: string, amount: number) => Promise<void>;
  updateBalance: (amount: number) => Promise<void>;
  toggleMoneyVisibility: () => void;
  setLanguage: (lang: 'en' | 'ha' | 'yo' | 'ig') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  isLoading: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

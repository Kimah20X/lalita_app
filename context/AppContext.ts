import { createContext } from 'react';
import { AppState, User, SavingsGoal, AjoGroup } from '@/types';

export interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  setSavingsGoals: (goals: SavingsGoal[]) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'savedAmount'>) => void;
  setAjoGroups: (groups: AjoGroup[]) => void;
  addAjoGroup: (group: Omit<AjoGroup, 'id' | 'status' | 'totalContributions'>) => void;
  updateBalance: (amount: number) => void;
  toggleMoneyVisibility: () => void;
  setLanguage: (lang: 'en' | 'ha' | 'yo' | 'ig') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  isLoading: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

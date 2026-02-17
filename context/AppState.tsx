import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, User, SavingsGoal, AjoGroup } from '@/types';
import { getItem, saveItem, STORAGE_KEYS } from '@/utils/storage';

interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  setSavingsGoals: (goals: SavingsGoal[]) => void;
  setAjoGroups: (groups: AjoGroup[]) => void;
  updateBalance: (amount: number) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [savingsGoals, setSavingsGoalsState] = useState<SavingsGoal[]>([]);
  const [ajoGroups, setAjoGroupsState] = useState<AjoGroup[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const storedUser = await getItem(STORAGE_KEYS.USER);
      const storedGoals = await getItem(STORAGE_KEYS.SAVINGS_GOALS);
      const storedGroups = await getItem(STORAGE_KEYS.AJO_GROUPS);

      if (storedUser) setUserState(storedUser);
      if (storedGoals) setSavingsGoalsState(storedGoals);
      if (storedGroups) setAjoGroupsState(storedGroups);
      
      // Mock some initial data if empty
      if (!storedGoals || storedGoals.length === 0) {
        const mockGoals: SavingsGoal[] = [
          { id: '1', name: 'Business Expansion', savedAmount: 150000, targetAmount: 250000, frequency: 'Weekly', createdAt: new Date().toISOString() },
        ];
        setSavingsGoalsState(mockGoals);
      }
    } catch (error) {
      console.error('Failed to load initial data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    saveItem(STORAGE_KEYS.USER, newUser);
  };

  const setSavingsGoals = (newGoals: SavingsGoal[]) => {
    setSavingsGoalsState(newGoals);
    saveItem(STORAGE_KEYS.SAVINGS_GOALS, newGoals);
  };

  const setAjoGroups = (newGroups: AjoGroup[]) => {
    setAjoGroupsState(newGroups);
    saveItem(STORAGE_KEYS.AJO_GROUPS, newGroups);
  };

  const updateBalance = (amount: number) => {
    setTotalBalance(prev => prev + amount);
    if (amount > 0) setTotalDeposits(prev => prev + amount);
    else setTotalWithdrawals(prev => prev + Math.abs(amount));
  };

  const value = {
    user,
    savingsGoals,
    ajoGroups,
    totalBalance,
    totalDeposits,
    totalWithdrawals,
    setUser,
    setSavingsGoals,
    setAjoGroups,
    updateBalance,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

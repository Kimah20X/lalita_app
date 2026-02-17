import React, { useContext, useState, useEffect } from 'react';
import { User, SavingsGoal, AjoGroup } from '@/types';
import { getItem, saveItem, STORAGE_KEYS } from '@/utils/storage';
import i18n from '@/i18n';
import { AppContext, AppContextType } from './AppContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [savingsGoals, setSavingsGoalsState] = useState<SavingsGoal[]>([]);
  const [ajoGroups, setAjoGroupsState] = useState<AjoGroup[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [isMoneyVisible, setIsMoneyVisible] = useState(true);
  const [language, setLanguageState] = useState<'en' | 'ha' | 'yo' | 'ig'>('en');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
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
      const storedVisibility = await getItem('isMoneyVisible');
      const storedLanguage = await getItem('language');
      const storedTheme = await getItem('theme');

      if (storedUser) setUserState(storedUser);
      if (storedGoals) setSavingsGoalsState(storedGoals);
      if (storedGroups) setAjoGroupsState(storedGroups);
      if (storedVisibility !== null) setIsMoneyVisible(storedVisibility);
      if (storedLanguage) {
        setLanguageState(storedLanguage);
        i18n.changeLanguage(storedLanguage);
      }
      if (storedTheme) setThemeState(storedTheme);
      
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

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'savedAmount'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      savedAmount: 0,
    };
    const updatedGoals = [...savingsGoals, newGoal];
    setSavingsGoals(updatedGoals);
  };

  const addAjoGroup = (group: Omit<AjoGroup, 'id' | 'status' | 'totalContributions'>) => {
    const newGroup: AjoGroup = {
      ...group,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Active',
      totalContributions: 0,
    };
    const updatedGroups = [...ajoGroups, newGroup];
    setAjoGroups(updatedGroups);
  };

  const updateBalance = (amount: number) => {
    setTotalBalance(prev => prev + amount);
    if (amount > 0) setTotalDeposits(prev => prev + amount);
    else setTotalWithdrawals(prev => prev + Math.abs(amount));
  };

  const toggleMoneyVisibility = () => {
    setIsMoneyVisible(prev => {
      const newValue = !prev;
      saveItem('isMoneyVisible', newValue);
      return newValue;
    });
  };

  const setLanguage = (lang: 'en' | 'ha' | 'yo' | 'ig') => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    saveItem('language', lang);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    saveItem('theme', newTheme);
  };

  const value = {
    user,
    savingsGoals,
    ajoGroups,
    totalBalance,
    totalDeposits,
    totalWithdrawals,
    isMoneyVisible,
    language,
    theme,
    setUser,
    setSavingsGoals,
    addSavingsGoal,
    setAjoGroups,
    addAjoGroup,
    updateBalance,
    toggleMoneyVisibility,
    setLanguage,
    setTheme,
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

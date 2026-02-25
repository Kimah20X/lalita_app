import React, { useContext, useState, useEffect } from 'react';
import { User, SavingsGoal, AjoGroup } from '@/types';
import { getItem, saveItem, deleteItem, STORAGE_KEYS } from '@/utils/storage';
import i18n from '@/i18n';
import { AppContext, AppContextType } from './AppContext';
import api from '@/utils/api';
import { registerForPushNotificationsAsync } from '@/utils/notifications';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [savingsGoals, setSavingsGoalsState] = useState<SavingsGoal[]>([]);
  const [ajoGroups, setAjoGroupsState] = useState<AjoGroup[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
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
      const storedVisibility = await getItem('isMoneyVisible');
      const storedLanguage = await getItem('language');
      const storedTheme = await getItem('theme');

      if (storedUser) setUserState(storedUser);
      if (storedVisibility !== null) setIsMoneyVisible(storedVisibility);
      if (storedLanguage) {
        setLanguageState(storedLanguage);
        i18n.changeLanguage(storedLanguage);
      }
      if (storedTheme) setThemeState(storedTheme);
      
      if (storedUser) {
        await refreshData();
        setupPushNotifications();
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
    if (newUser) setupPushNotifications();
  };

  const setupPushNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await api.post('/auth/push-token', { token });
      }
    } catch (error) {
      console.log('Error setting up push notifications', error);
    }
  };

  const login = async (phoneNumber: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { phoneNumber, password });
      const { token, user } = response.data.data;
      await saveItem('jwt_token', token);
      setUser(user);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const joinAjoGroup = async (groupId: string) => {
    try {
      await api.post(`/ajo/${groupId}/join`);
      await refreshData();
    } catch (error) {
      console.error('Failed to join Ajo group', error);
      throw error;
    }
  };

  const startAjoGroup = async (groupId: string) => {
    try {
      await api.post(`/ajo/${groupId}/start`);
      await refreshData();
    } catch (error) {
      console.error('Failed to start Ajo group', error);
      throw error;
    }
  };

  const contributeToAjo = async (groupId: string) => {
    try {
      await api.post(`/ajo/${groupId}/contribute`);
      await refreshData();
    } catch (error) {
      console.error('Failed to contribute to Ajo group', error);
      throw error;
    }
  };

  const depositToGoal = async (goalId: string, amount: number) => {
    try {
      await api.post(`/goals/${goalId}/deposit`, { amount });
      await refreshData();
    } catch (error) {
      console.error('Failed to deposit to goal', error);
      throw error;
    }
  };

  const withdrawFromGoal = async (goalId: string, amount: number) => {
    try {
      await api.post(`/goals/${goalId}/withdraw`, { amount });
      await refreshData();
    } catch (error) {
      console.error('Failed to withdraw from goal', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data.data;
      await saveItem('jwt_token', token);
      setUser(user);
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = async () => {
    await deleteItem('jwt_token');
    setUser(null);
  };

  const setSavingsGoals = (newGoals: SavingsGoal[]) => {
    setSavingsGoalsState(newGoals);
    saveItem(STORAGE_KEYS.SAVINGS_GOALS, newGoals);
  };

  const refreshData = async () => {
    try {
      const [goalsRes, groupsRes, dashboardRes] = await Promise.all([
        api.get('/goals'),
        api.get('/ajo'),
        api.get('/dashboard/summary')
      ]);

      const goals = goalsRes.data.data.map((g: any) => ({
        id: g.id,
        name: g.title,
        savedAmount: g.currentAmount,
        targetAmount: g.targetAmount,
        frequency: g.frequency.charAt(0) + g.frequency.slice(1).toLowerCase(),
        createdAt: g.createdAt
      }));
      setSavingsGoalsState(goals);

      const groups = groupsRes.data.data.map((g: any) => ({
        id: g.id,
        name: g.name,
        totalContributions: g.currentCycle ? (g.currentCycle - 1) * g.contributionAmount * g._count.members : 0,
        targetAmount: g.contributionAmount * g._count.members,
        membersCount: g._count.members,
        contributionAmount: g.contributionAmount,
        status: g.status,
        creatorId: g.creatorId,
        members: g.members,
        currentCycle: g.currentCycle
      }));
      setAjoGroupsState(groups);

      // Update balance if dashboard summary returns it
      if (dashboardRes.data.data.balance !== undefined) {
        setTotalBalance(dashboardRes.data.data.balance);
      }
      setRecentTransactions(dashboardRes.data.data.recentTransactions);
    } catch (error) {
      console.error('Failed to refresh data', error);
    }
  };

  const setAjoGroups = (newGroups: AjoGroup[]) => {
    setAjoGroupsState(newGroups);
  };

  const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'savedAmount'>) => {
    try {
      await api.post('/goals', {
        title: goal.name,
        targetAmount: goal.targetAmount,
        frequency: goal.frequency.toUpperCase()
      });
      await refreshData();
    } catch (error) {
      console.error('Failed to add savings goal', error);
      throw error;
    }
  };

  const addAjoGroup = async (group: Omit<AjoGroup, 'id' | 'status' | 'totalContributions'>) => {
    try {
      await api.post('/ajo', {
        name: group.name,
        contributionAmount: group.contributionAmount,
        frequency: 'MONTHLY' // Default for now
      });
      await refreshData();
    } catch (error) {
      console.error('Failed to add Ajo group', error);
      throw error;
    }
  };

  const updateBalance = async (amount: number) => {
    try {
      if (amount > 0) {
        await api.post('/wallet/deposit', { amount });
      } else {
        // Need bank details for actual withdrawal, using placeholder for now
        await api.post('/wallet/withdraw', { amount: Math.abs(amount), bankDetails: { accountNumber: '0000000000' } });
      }
      await refreshData();
    } catch (error) {
      console.error('Failed to update balance', error);
      throw error;
    }
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
    recentTransactions,
    totalBalance,
    totalDeposits,
    totalWithdrawals,
    isMoneyVisible,
    language,
    theme,
    login,
    register,
    logout,
    setUser,
    setSavingsGoals,
    addSavingsGoal,
    setAjoGroups,
    addAjoGroup,
    joinAjoGroup,
    startAjoGroup,
    contributeToAjo,
    depositToGoal,
    withdrawFromGoal,
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

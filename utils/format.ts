import { AppState } from '@/types';

export const formatCurrency = (amount: number, isVisible: boolean = true) => {
  if (!isVisible) {
    return '₦ ***';
  }
  return '₦' + amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: '@lalita_user',
  SAVINGS_GOALS: '@lalita_savings_goals',
  AJO_GROUPS: '@lalita_ajo_groups',
  APP_STATE: '@lalita_app_state',
};

export const saveItem = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error saving item', e);
  }
};

export const getItem = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting item', e);
    return null;
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing item', e);
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error('Error clearing storage', e);
  }
};

export { STORAGE_KEYS };

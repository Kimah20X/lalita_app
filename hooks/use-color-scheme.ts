import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useContext } from 'react';
// We need to import the context directly to avoid circular dependency if useApp is used
// but useApp is in AppState.tsx which might import this hook.
// Let's check AppState.tsx imports.
import { AppContext } from '@/context/AppContext';

export function useColorScheme() {
  const context = useContext(AppContext);
  const nativeScheme = useNativeColorScheme();

  if (!context) {
    return nativeScheme;
  }

  return context.theme || nativeScheme || 'light';
}

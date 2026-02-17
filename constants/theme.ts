import { Platform } from 'react-native';

const primary = '#9C27B0'; // Purple/Magenta from image
const secondary = '#E91E63';
const background = '#F8F9FE';
const cardBackground = '#FFFFFF';
const text = '#1A1A1A';
const muted = '#687076';

export const Colors = {
  light: {
    primary,
    secondary,
    text,
    background,
    card: cardBackground,
    tint: primary,
    icon: muted,
    tabIconDefault: muted,
    tabIconSelected: primary,
    border: '#EEEEEE',
    success: '#4CAF50',
    error: '#F44336',
  },
  dark: {
    primary,
    secondary,
    text: '#ECEDEE',
    background: '#151718',
    card: '#1C1C1E',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
    border: '#2C2C2E',
    success: '#4CAF50',
    error: '#F44336',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});

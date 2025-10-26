import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#4F8EF7',
  secondary: '#F7F7F7',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#D3D3D3',
  darkGray: '#333333',
  danger: '#FF3B30',
  warning: '#FFCC00',
  success: '#34C759',
  info: '#007AFF',
  blurTint: 'light',
  shadow: '#000000',
};

export const GRADIENTS = {
  primary: [COLORS.primary, '#4F8EF7'],
  divider: [COLORS.lightGray, COLORS.white],
};

export const SIZES = {
  width,
  height,
  base: 8,
  s: 12,
  sm: 16,
  m: 18,
  l: 24,
  xl: 32,
  xxl: 48,
  cardRadius: 16,
  buttonRadius: 8,
  shadowOffsetWidth: 0,
  shadowOffsetHeight: 4,
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 5,
};

export const THEME = {
  colors: COLORS,
  gradients: GRADIENTS,
  sizes: SIZES,
};

export default THEME;

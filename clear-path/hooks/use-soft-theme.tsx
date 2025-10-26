import React from 'react';
import { THEME } from '@/constants/soft-theme';

export const ThemeContext = React.createContext(THEME);

export const ThemeProvider = ({ children, theme = THEME }: { children: React.ReactNode, theme?: typeof THEME }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export default function useTheme() {
  const theme = React.useContext(ThemeContext);
  return theme;
}

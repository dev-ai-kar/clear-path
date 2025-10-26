import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { useTheme } from '@/contexts/theme-context';

export default function SettingsScreen() {
  const { isDarkTheme, toggleTheme, theme } = useTheme();

  const containerStyle = {
    ...styles.container,
    backgroundColor: theme.colors.background,
  };

  return (
    <View style={containerStyle}>
      <Text>Dark Mode</Text>
      <Switch value={isDarkTheme} onValueChange={toggleTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
});

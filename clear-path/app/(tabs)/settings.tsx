import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Switch, Text } from 'react-native-paper';
import { useTheme } from '@/contexts/theme-context';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SettingsScreen() {
  const { isDarkTheme, toggleTheme, theme } = useTheme();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: theme.colors.surface, dark: theme.colors.surface }}
      headerImage={
        <IconSymbol
          size={310}
          color={theme.colors.onSurface}
          name="gearshape.fill"
          style={styles.headerImage}
        />
      }>
      <View style={styles.titleContainer}>
        <Text style={{ color: theme.colors.onSurface, ...styles.title }}>Settings</Text>
      </View>
      <List.Item
        title="Dark Mode"
        right={() => <Switch value={isDarkTheme} onValueChange={toggleTheme} />}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

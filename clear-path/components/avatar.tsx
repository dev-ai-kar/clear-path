import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';
import { useTheme } from '@/contexts/theme-context';

type Props = {
  uri: string | null;
  onPress: () => void;
};

export default function Avatar({ uri, onPress }: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <View style={[styles.placeholder, { backgroundColor: theme.colors.surface }]}>
          <IconSymbol name="camera.fill" size={40} color={theme.colors.onSurface} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

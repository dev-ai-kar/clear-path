import { Image } from 'expo-image';
import { StyleSheet, Platform, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Link } from 'expo-router';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { useTheme } from '@/contexts/theme-context';

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: theme.colors.surface, dark: theme.colors.surface }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <View style={styles.titleContainer}>
        <Text style={{ color: theme.colors.onSurface, ...styles.title }}>Hello World!</Text>
        <HelloWave />
      </View>
      <View style={styles.stepContainer}>
        <Text style={{ color: theme.colors.onSurface, ...styles.subtitle }}>Step 1: Try it</Text>
        <Text style={{ color: theme.colors.onSurface }}>
          Edit <Text style={{ fontWeight: 'bold' }}>app/(tabs)/index.tsx</Text> to see changes.
          Press{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </Text>{' '}
          to open developer tools.
        </Text>
      </View>
      <View style={styles.stepContainer}>
        <Link href="/modal">
            <Text style={{ color: theme.colors.primary, ...styles.subtitle }}>Step 2: Explore</Text>
        </Link>

        <Text style={{ color: theme.colors.onSurface }}>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </Text>
      </View>
      <View style={styles.stepContainer}>
        <Text style={{ color: theme.colors.onSurface, ...styles.subtitle }}>Step 3: Get a fresh start</Text>
        <Text style={{ color: theme.colors.onSurface }}>
          {`When you're ready, run `}
          <Text style={{ fontWeight: 'bold' }}>npm run reset-project</Text> to get a fresh{' '}
          <Text style={{ fontWeight: 'bold' }}>app</Text> directory. This will move the current{' '}
          <Text style={{ fontWeight: 'bold' }}>app</Text> to{' '}
          <Text style={{ fontWeight: 'bold' }}>app-example</Text>.
        </Text>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

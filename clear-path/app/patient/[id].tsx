import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/theme-context';
import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', id)
        .single();
      
      if (error) {
        console.error(error);
      } else {
        setPatient(data);
      }
      setLoading(false);
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
        <Text>Patient not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `${patient.first_name} ${patient.last_name}` }} />
      <ParallaxScrollView
        headerBackgroundColor={{ light: theme.colors.surface, dark: theme.colors.surface }}
        headerImage={
          <Image source={{ uri: patient.portrait_url }} style={styles.headerImage} />
        }>
        <View style={styles.contentContainer}>
          <Text variant="headlineLarge" style={[styles.name, { color: theme.colors.onSurface }]}>{`${patient.first_name} ${patient.last_name}`}</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Phone: {patient.phone}</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Age: {patient.age}</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Gender: {patient.gender}</Text>
        </View>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

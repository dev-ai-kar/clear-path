import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/theme-context';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: `${patient.first_name} ${patient.last_name}` }} />
      <Image source={{ uri: patient.portrait_url }} style={styles.headerImage} />
      <Text style={[styles.name, { color: theme.colors.onSurface }]}>{`${patient.first_name} ${patient.last_name}`}</Text>
      <Text style={{ color: theme.colors.onSurface }}>Phone: {patient.phone}</Text>
      <Text style={{ color: theme.colors.onSurface }}>Age: {patient.age}</Text>
      <Text style={{ color: theme.colors.onSurface }}>Gender: {patient.gender}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
  },
});

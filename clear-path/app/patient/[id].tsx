import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { Text, Button, List, Title } from 'react-native-paper';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/theme-context';
import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [patient, setPatient] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', id)
        .single();
      
      if (patientError) {
        console.error(patientError);
      } else {
        setPatient(patientData);
      }

      const { data: visitsData, error: visitsError } = await supabase
        .from('visits')
        .select('*, screenings(*)')
        .eq('patient_id', id);

      if (visitsError) {
        console.error(visitsError);
      } else {
        setVisits(visitsData);
      }

      setLoading(false);
    };

    if (id) {
      fetchData();
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
        headerImage={<Image source={{ uri: patient.portrait_url }} style={styles.headerImage} />}
      >
        <View style={styles.contentContainer}>
          <Text variant="headlineLarge" style={[styles.name, { color: theme.colors.onSurface }]}>{`${patient.first_name} ${patient.last_name}`}</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Phone: {patient.phone}</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Age: {patient.age}</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Gender: {patient.gender}</Text>
          <Button
            mode="contained"
            onPress={() => router.push({ pathname: '/(tabs)/explore', params: { patient: JSON.stringify(patient) } })}
            style={styles.button}
          >
            Start Screening
          </Button>

          <Title style={{ marginTop: 20 }}>Screening History</Title>
          {visits && visits.length > 0 ? (
            <List.AccordionGroup>
              {visits.map(visit => (
                <List.Accordion
                  key={visit.visit_id}
                title={`Visit on ${new Date(visit.visit_date).toLocaleDateString()}`}
                id={visit.visit_id}
              >
                {Array.isArray(visit.screenings) && visit.screenings.length > 0 ? (
                  visit.screenings.map((screening: any) => (
                    <View key={screening.screening_id} style={styles.screeningContainer}>
                      <Text>VA: {screening.va_left_distance_sc} / {screening.va_right_distance_sc}</Text>
                      <Text>IOP: {screening.iop_left} / {screening.iop_right}</Text>
                      <Text>CDR: {screening.cdr_left} / {screening.cdr_right}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.screeningContainer}>No screening data for this visit.</Text>
                )}
              </List.Accordion>
              ))}
            </List.AccordionGroup>
          ) : (
            <Text style={{ marginTop: 10 }}>No screening history found.</Text>
          )}
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
  button: {
    marginTop: 20,
  },
  screeningContainer: {
    padding: 16,
  },
});

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, ScrollView, Linking } from 'react-native';
import { Text, Button, List, Title, Divider, Card } from 'react-native-paper';
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
        .select('*, screenings(*), visit_diagnoses(diagnoses(name)), attachments(*)')
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
        <Card style={styles.card}>
          <Card.Content>
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
                {visit.screenings ? (
                  <View style={styles.screeningContainer}>
                    <Title>Screening Details</Title>
                    <Text>VA (SC): {visit.screenings.va_left_distance_sc} / {visit.screenings.va_right_distance_sc}</Text>
                    <Text>VA (CC): {visit.screenings.va_left_distance_cc} / {visit.screenings.va_right_distance_cc}</Text>
                    <Text>IOP: {visit.screenings.iop_left} / {visit.screenings.iop_right}</Text>
                    <Text>CDR: {visit.screenings.cdr_left} / {visit.screenings.cdr_right}</Text>
                    <Divider style={styles.divider} />
                    <Title>Segment Status</Title>
                    <Text>Lens: {visit.screenings.lens_left} / {visit.screenings.lens_right}</Text>
                    <Text>Cornea: {visit.screenings.cornea_left} / {visit.screenings.cornea_right}</Text>
                    <Text>Retina: {visit.screenings.retina_left} / {visit.screenings.retina_right}</Text>
                    <Divider style={styles.divider} />
                    <Title>Diagnoses</Title>
                    {visit.visit_diagnoses.map((diag: any) => (
                      <Text key={diag.diagnoses.name}>{diag.diagnoses.name}</Text>
                    ))}
                    {visit.other_diagnoses ? <Text>Other: {visit.other_diagnoses}</Text> : null}
                    <Divider style={styles.divider} />
                    <Title>Notes</Title>
                    <Text>{visit.notes}</Text>
                    {visit.attachments && visit.attachments.length > 0 && (
                      <>
                        <Divider style={styles.divider} />
                        <Title>Attachments</Title>
                        {visit.attachments.map((att: any) => (
                          <Button key={att.attachment_id} onPress={() => Linking.openURL(att.file_url)}>
                            View Attachment
                          </Button>
                        ))}
                      </>
                    )}
                  </View>
                ) : (
                  <Text style={styles.screeningContainer}>No screening data for this visit.</Text>
                )}
              </List.Accordion>
              ))}
            </List.AccordionGroup>
          ) : (
            <Text style={{ marginTop: 10 }}>No screening history found.</Text>
          )}
          </Card.Content>
        </Card>
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
  divider: {
    marginVertical: 10,
  },
  card: {
    margin: 10,
  },
});

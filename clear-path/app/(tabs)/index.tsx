import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { Text, List } from 'react-native-paper';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/theme-context';
import Avatar from '@/components/avatar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { theme } = useTheme();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase.from('patients').select('*');
      if (error) {
        console.error(error);
      } else {
        setPatients(data);
      }
      setLoading(false);
    };

    fetchPatients();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.patient_id}
        ListHeaderComponent={() => (
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Prescreened Patients</Text>
        )}
        renderItem={({ item }) => (
          <Link href={`/patient/${item.patient_id}`} asChild>
            <List.Item
              title={`${item.first_name} ${item.last_name}`}
              titleStyle={{ color: theme.colors.onSurface }}
              left={() => <Avatar uri={item.portrait_url} onPress={() => {}} />}
            />
          </Link>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
  },
});

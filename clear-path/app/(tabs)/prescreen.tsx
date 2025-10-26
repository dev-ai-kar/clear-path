import React, { useState } from 'react';
import { StyleSheet, Alert, View, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';
import { TextInput, Button, Text } from 'react-native-paper';
import { useTheme } from '@/contexts/theme-context';

export default function FormScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const { theme } = useTheme();

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter a first and last name.');
      return;
    }

    const { data, error } = await supabase.from('Patients').insert([
      {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        age: parseInt(age, 10) || null,
        gender: gender.trim(),
      },
    ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Patient has been submitted.');
      setFirstName('');
      setLastName('');
      setPhone('');
      setAge('');
      setGender('');
    }
  };

  const containerStyle = {
    ...styles.container,
    backgroundColor: theme.colors.background,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Prescreening Form</Text>
      <TextInput
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        mode="outlined"
        keyboardType="phone-pad"
      />
      <TextInput
        label="Age"
        value={age}
        onChangeText={setAge}
        style={styles.input}
        mode="outlined"
        keyboardType="number-pad"
      />
      <TextInput
        label="Gender"
        value={gender}
        onChangeText={setGender}
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Submit
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});

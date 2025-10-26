import React, { useState } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { TextInput, Button, Text } from 'react-native-paper';
import { useTheme } from '@/contexts/theme-context';

export default function FormScreen() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const { theme } = useTheme();

  const handleSubmit = async () => {
    if (!name.trim() || !symbol.trim()) {
      Alert.alert('Error', 'Please enter a name and symbol.');
      return;
    }

    const { data, error } = await supabase
      .from('patients')
      .insert([{ name: name.trim(), symbol_name: symbol.trim() }]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Patient has been submitted.');
      setName('');
      setSymbol('');
    }
  };

  const containerStyle = {
    ...styles.container,
    backgroundColor: theme.colors.background,
  };

  return (
    <View style={containerStyle}>
      <Text style={styles.title}>Prescreening Form</Text>
      <TextInput
        label="Patient's Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Symbol Name"
        value={symbol}
        onChangeText={setSymbol}
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Submit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

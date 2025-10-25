import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function FormScreen() {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name.');
      return;
    }

    const { data, error } = await supabase
      .from('submissions')
      .insert([{ name: name.trim() }]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Your name has been submitted.');
      setName('');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Submission Form</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black',
    backgroundColor: 'white',
  },
});

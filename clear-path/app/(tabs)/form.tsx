import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';

export default function FormScreen() {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Your name has been submitted.');
        setName('');
      } else {
        Alert.alert('Error', 'Failed to submit your name.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while submitting your name.');
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

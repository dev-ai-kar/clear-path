import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView, Modal, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { TextInput, Button, Text } from 'react-native-paper';
import { useTheme } from '@/contexts/theme-context';
import CameraComponent from '@/components/camera-view';
import Avatar from '@/components/avatar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FormScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const { theme } = useTheme();

  const handlePictureTaken = async (uri: string) => {
    setPhotoUri(uri);
    setCameraVisible(false);
  };

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter a first and last name.');
      return;
    }

    let photoUrl: string | null = null;
    if (photoUri) {
      const formData = new FormData();
      formData.append('file', {
        uri: photoUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const filePath = `${new Date().getTime()}.jpg`;
      const { data, error } = await supabase.storage
        .from('patient_assets')
        .upload(filePath, formData);

      if (error) {
        Alert.alert('Error uploading image', error.message);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('patient_assets').getPublicUrl(filePath);
      photoUrl = publicUrl;
    }

    const { data, error } = await supabase.from('patients').insert([
      {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        age: parseInt(age, 10) || null,
        gender: gender.trim(),
        portrait_url: photoUrl,
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
      setPhotoUri(null);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Modal
          animationType="slide"
        transparent={false}
        visible={cameraVisible}
        onRequestClose={() => {
          setCameraVisible(!cameraVisible);
        }}>
        <CameraComponent onPictureTaken={handlePictureTaken} />
      </Modal>

      <Text style={styles.title}>Prescreening Form</Text>

      <Avatar uri={photoUri} onPress={() => setCameraVisible(true)} />

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
    </SafeAreaView>
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
    marginBottom: 20,
  },
});

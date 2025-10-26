
import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView, Modal, View, Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Picker } from '@react-native-picker/picker';
import { TextInput, Button, Text, TouchableRipple, Icon } from 'react-native-paper';
import { useTheme } from '@/contexts/theme-context';
import CameraComponent from '@/components/camera-view';
import Avatar from '@/components/avatar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FormScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [patientCode, setPatientCode] = useState('');
  const [otherAilments, setOtherAilments] = useState('');
  const [gender, setGender] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [tempGender, setTempGender] = useState(gender);
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
        national_id: nationalId.trim(),
        patient_code: patientCode.trim(),
        other_ailments: otherAilments.trim(),
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
      setNationalId('');
      setPatientCode('');
      setOtherAilments('');
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
      {Platform.OS === 'ios' ? (
        <>
          <TouchableRipple onPress={() => setPickerVisible(true)}>
            <View style={[styles.input, styles.pickerContainer, { borderColor: theme.colors.outline }]}>
              <Text style={{ color: gender ? theme.colors.onSurface : theme.colors.onSurfaceVariant, flex: 1 }}>
                {gender || 'Select Gender...'}
              </Text>
              <Icon source="chevron-down" size={24} color={theme.colors.onSurfaceVariant} />
            </View>
          </TouchableRipple>
          <Modal
            visible={pickerVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setPickerVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Button onPress={() => setPickerVisible(false)}>Cancel</Button>
                  <Button onPress={() => {
                    setGender(tempGender);
                    setPickerVisible(false);
                  }}>Done</Button>
                </View>
                <Picker
                  selectedValue={tempGender}
                  onValueChange={(itemValue) => setTempGender(itemValue)}
                >
                  <Picker.Item label="Select Gender..." value="" color="#8e8e93" />
                  <Picker.Item label="Male" value="Male" color="black" />
                  <Picker.Item label="Female" value="Female" color="black" />
                  <Picker.Item label="Non-binary" value="Non-binary" color="black" />
                  <Picker.Item label="Prefer not to say" value="Prefer not to say" color="black" />
                  <Picker.Item label="Other" value="Other" color="black" />
                </Picker>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <View style={[styles.input, styles.pickerContainer, { borderColor: theme.colors.outline }]}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue: string) => setGender(itemValue)}
            style={{ flex: 1 }}
          >
            <Picker.Item label="Select Gender..." value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Non-binary" value="Non-binary" />
            <Picker.Item label="Prefer not to say" value="Prefer not to say" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
      )}
            <TextInput
        label="National ID"
        value={nationalId}
        onChangeText={setNationalId}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Patient Code"
        value={patientCode}
        onChangeText={setPatientCode}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Other Ailments"
        value={otherAilments}
        onChangeText={setOtherAilments}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    height: 56, // Standard height for outlined TextInput
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Alert, Image } from 'react-native';
import { TextInput, Button, Text, Chip, TouchableRipple, Icon } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Platform, Modal } from 'react-native';
import { useTheme } from '@/contexts/theme-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

export default function ScreeningForm() {
  const { theme } = useTheme();
  const router = useRouter();
  const { patient: patientString } = useLocalSearchParams();

  if (!patientString) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="headlineMedium">Please select a patient first.</Text>
        <Button onPress={() => router.push('/(tabs)')} style={{ marginTop: 20 }}>Go to Patient List</Button>
      </SafeAreaView>
    );
  }

  const patient = JSON.parse(patientString as string);
  const [screenDoc, setScreenDoc] = useState<{ uri: string; name?: string; mimeType?: string; isImage: boolean } | null>(null);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [otherDiagnoses, setOtherDiagnoses] = useState('');
  const [sites, setSites] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [sitePickerVisible, setSitePickerVisible] = useState(false);
  const [tempSite, setTempSite] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  // Eye exam fields
  const [lIOP, setLIOP] = useState('');
  const [rIOP, setRIOP] = useState('');
  const [lCDR, setLCDR] = useState('');
  const [rCDR, setRCDR] = useState('');
  const [lVAsc, setLVAsc] = useState('');
  const [rVAsc, setRVAsc] = useState('');
  const [lVAcc, setLVAcc] = useState('');
  const [rVAcc, setRVAcc] = useState('');

  const lensOpts = ["clear", "PSC", "NS", "cataract", "pseudophakia", "aphakia", "PCO", "other"] as const;
  const corneaOpts = ["clear", "scar", "ulcer", "edema", "keratitis", "other"] as const;
  const retinaOpts = ["normal", "mild NPDR", "moderate NPDR", "severe NPDR", "PDR", "AMD", "retinal detachment", "macular edema", "other"] as const;

  const [lLens, setLLens] = useState<string[]>([]);
  const [rLens, setRLens] = useState<string[]>([]);
  const [lCornea, setLCornea] = useState<string[]>([]);
  const [rCornea, setRCornea] = useState<string[]>([]);
  const [lRetina, setLRetina] = useState<string[]>([]);
  const [rRetina, setRRetina] = useState<string[]>([]);

  const [lLensOther, setLLensOther] = useState('');
  const [rLensOther, setRLensOther] = useState('');
  const [lCorneaOther, setLCorneaOther] = useState('');
  const [rCorneaOther, setRCorneaOther] = useState('');
  const [lRetinaOther, setLRetinaOther] = useState('');
  const [rRetinaOther, setRRetinaOther] = useState('');

  const clearForm = () => {
    setScreenDoc(null);
    setSelectedDiagnoses([]);
    setOtherDiagnoses('');
    setSelectedSite(null);
    setTempSite(null);
    setNotes('');
    setShowErrors(false);
    setLIOP('');
    setRIOP('');
    setLCDR('');
    setRCDR('');
    setLVAsc('');
    setRVAsc('');
    setLVAcc('');
    setRVAcc('');
    setLLens([]);
    setRLens([]);
    setLCornea([]);
    setRCornea([]);
    setLRetina([]);
    setRRetina([]);
    setLLensOther('');
    setRLensOther('');
    setLCorneaOther('');
    setRCorneaOther('');
    setLRetinaOther('');
    setRRetinaOther('');
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: diagnosesData, error: diagnosesError } = await supabase.from('diagnoses').select('*');
      if (diagnosesError) {
        console.error(diagnosesError);
      } else {
        setDiagnoses(diagnosesData);
      }

      const { data: sitesData, error: sitesError } = await supabase.from('sites').select('*');
      if (sitesError) {
        console.error(sitesError);
      } else {
        setSites(sitesData);
      }
    };
    fetchData();
  }, []);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'] });
    if (result.canceled === false) {
      const asset = result.assets[0];
      const isImage = (asset.mimeType || '').startsWith('image/');
      setScreenDoc({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType, isImage });
    }
  };

  const handleSubmit = async () => {
    const diagTokens = otherDiagnoses.split(',').map(s => s.trim()).filter(Boolean);
    const hasAnyDiagnosis = selectedDiagnoses.length > 0 || diagTokens.length > 0;
    const siteMissing = !selectedSite;
    const lensOtherMissing = (lLens.includes('other') && !lLensOther.trim()) || (rLens.includes('other') && !rLensOther.trim());
    const corneaOtherMissing = (lCornea.includes('other') && !lCorneaOther.trim()) || (rCornea.includes('other') && !rCorneaOther.trim());
    const retinaOtherMissing = (lRetina.includes('other') && !lRetinaOther.trim()) || (rRetina.includes('other') && !rRetinaOther.trim());

    if (!hasAnyDiagnosis || siteMissing || lensOtherMissing || corneaOtherMissing || retinaOtherMissing) {
      setShowErrors(true);
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    const { data: visitData, error: visitError } = await supabase
      .from('visits')
      .insert([{ patient_id: patient.patient_id, site_id: selectedSite, visit_date: new Date(), notes }])
      .select()
      .single();

    if (visitError) {
      Alert.alert('Error creating visit', visitError.message);
      return;
    }

    if (screenDoc) {
      const formData = new FormData();
      formData.append('file', {
        uri: screenDoc.uri,
        name: screenDoc.name,
        type: screenDoc.mimeType,
      } as any);

      const filePath = `${new Date().getTime()}_${screenDoc.name}`;
      const { error: uploadError } = await supabase.storage
        .from('patient_assets')
        .upload(filePath, formData);

      if (uploadError) {
        Alert.alert('Error uploading document', uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('patient_assets').getPublicUrl(filePath);

      const { error: attachmentError } = await supabase.from('attachments').insert([
        { visit_id: visitData.visit_id, file_url: publicUrl },
      ]);

      if (attachmentError) {
        Alert.alert('Error saving attachment', attachmentError.message);
        return;
      }
    }

    const allDiagnoses = [...new Set([...selectedDiagnoses, ...diagTokens])];
    
    const diagnosisIds = await Promise.all(
      allDiagnoses.map(name =>
        supabase.rpc('get_or_create_diagnosis', { p_name: name })
      )
    );

    const visitDiagnoses = diagnosisIds.map(rpcResponse => {
      if (rpcResponse.error) {
        throw new Error(`Error getting or creating diagnosis: ${rpcResponse.error.message}`);
      }
      return { visit_id: visitData.visit_id, diagnosis_id: rpcResponse.data };
    });

    if (visitDiagnoses.length > 0) {
      const { error: visitDiagError } = await supabase.from('visit_diagnoses').insert(visitDiagnoses);
      if (visitDiagError) {
          Alert.alert('Error saving diagnoses', visitDiagError.message);
          return;
      }
    }

    const { error: screeningError } = await supabase.from('screenings').insert([{
      visit_id: visitData.visit_id,
      va_left_distance_sc: lVAsc,
      va_right_distance_sc: rVAsc,
      va_left_distance_cc: lVAcc,
      va_right_distance_cc: rVAcc,
      iop_left: parseInt(lIOP, 10) || null,
      iop_right: parseInt(rIOP, 10) || null,
      cdr_left: parseFloat(lCDR) || null,
      cdr_right: parseFloat(rCDR) || null,
      lens_left: lLens.includes('other') ? lLens.filter(l => l !== 'other').concat(lLensOther).join(', ') : lLens.join(', '),
      lens_right: rLens.includes('other') ? rLens.filter(l => l !== 'other').concat(rLensOther).join(', ') : rLens.join(', '),
      cornea_left: lCornea.includes('other') ? lCornea.filter(l => l !== 'other').concat(lCorneaOther).join(', ') : lCornea.join(', '),
      cornea_right: rCornea.includes('other') ? rCornea.filter(l => l !== 'other').concat(rCorneaOther).join(', ') : rCornea.join(', '),
      retina_left: lRetina.includes('other') ? lRetina.filter(l => l !== 'other').concat(lRetinaOther).join(', ') : lRetina.join(', '),
      retina_right: rRetina.includes('other') ? rRetina.filter(l => l !== 'other').concat(rRetinaOther).join(', ') : rRetina.join(', '),
    }]);

    if (screeningError) {
      Alert.alert('Error creating screening', screeningError.message);
    } else {
      Alert.alert('Success', 'Screening has been submitted.');
      clearForm();
      router.push('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Screening for {patient.first_name} {patient.last_name}</Text>

        {screenDoc?.isImage && <Image source={{ uri: screenDoc.uri }} style={styles.docImage} />}
        <Button onPress={pickDocument} mode="outlined" style={styles.button}>
          {screenDoc ? 'Change Document' : 'Attach Document'}
        </Button>

        <Text style={styles.sectionTitle}>Eye Diagnoses (*)</Text>
        <View style={styles.chipContainer}>
          {diagnoses.map((diag) => {
            const isSelected = selectedDiagnoses.includes(diag.name);
            return (
              <Chip
                key={diag.diagnosis_id}
                selected={isSelected}
                onPress={() => {
                  setSelectedDiagnoses(prev =>
                    isSelected ? prev.filter(n => n !== diag.name) : [...prev, diag.name]
                  );
                }}
                style={styles.chip}
              >
                {diag.name}
              </Chip>
            );
          })}
        </View>
        <TextInput
          label="Other Diagnoses (comma separated)"
          value={otherDiagnoses}
          onChangeText={setOtherDiagnoses}
          style={styles.input}
          mode="outlined"
          error={showErrors && selectedDiagnoses.length === 0 && otherDiagnoses.trim().length === 0}
        />

        {Platform.OS === 'ios' ? (
          <>
            <TouchableRipple onPress={() => setSitePickerVisible(true)}>
              <View style={[styles.input, styles.pickerContainer, { borderColor: theme.colors.outline }]}>
                <Text style={{ color: selectedSite ? theme.colors.onSurface : theme.colors.onSurfaceVariant, flex: 1 }}>
                  {sites.find(site => site.site_id === selectedSite)?.name || 'Select Site...'}
                </Text>
                <Icon source="chevron-down" size={24} color={theme.colors.onSurfaceVariant} />
              </View>
            </TouchableRipple>
            <Modal
              visible={sitePickerVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setSitePickerVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Button onPress={() => setSitePickerVisible(false)}>Cancel</Button>
                    <Button onPress={() => {
                      setSelectedSite(tempSite);
                      setSitePickerVisible(false);
                    }}>Done</Button>
                  </View>
                  <Picker
                    selectedValue={tempSite}
                    onValueChange={(itemValue) => setTempSite(itemValue)}
                  >
                    <Picker.Item label="Select Site..." value="" color="#8e8e93" />
                    {sites.map(site => (
                      <Picker.Item key={site.site_id} label={site.name} value={site.site_id} color="black" />
                    ))}
                  </Picker>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <View style={[styles.input, styles.pickerContainer, { borderColor: theme.colors.outline }]}>
            <Picker
              selectedValue={selectedSite}
              onValueChange={(itemValue) => setSelectedSite(itemValue)}
              style={Platform.select({ web: { height: 56, backgroundColor: 'transparent' }, default: { flex: 1 } })}
            >
              <Picker.Item label="Select Site..." value="" />
              {sites.map(site => (
                <Picker.Item key={site.site_id} label={site.name} value={site.site_id} />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.sectionTitle}>Visual Acuity (Snellen)</Text>
        <View style={styles.row}>
          <TextInput label="Left Distance SC" value={lVAsc} onChangeText={setLVAsc} style={styles.input} mode="outlined" placeholder="e.g., 6/18" />
          <TextInput label="Right Distance SC" value={rVAsc} onChangeText={setRVAsc} style={styles.input} mode="outlined" placeholder="e.g., 6/18" />
        </View>
        <View style={styles.row}>
          <TextInput label="Left Distance CC" value={lVAcc} onChangeText={setLVAcc} style={styles.input} mode="outlined" placeholder="e.g., 6/12" />
          <TextInput label="Right Distance CC" value={rVAcc} onChangeText={setRVAcc} style={styles.input} mode="outlined" placeholder="e.g., 6/12" />
        </View>

        <Text style={styles.sectionTitle}>IOP (mmHg) & CDR</Text>
        <View style={styles.row}>
          <TextInput label="Left IOP" value={lIOP} onChangeText={setLIOP} keyboardType="decimal-pad" style={styles.input} mode="outlined" />
          <TextInput label="Right IOP" value={rIOP} onChangeText={setRIOP} keyboardType="decimal-pad" style={styles.input} mode="outlined" />
        </View>
        <View style={styles.row}>
          <TextInput label="Left CDR" value={lCDR} onChangeText={setLCDR} keyboardType="decimal-pad" style={styles.input} mode="outlined" />
          <TextInput label="Right CDR" value={rCDR} onChangeText={setRCDR} keyboardType="decimal-pad" style={styles.input} mode="outlined" />
        </View>

        <Text style={styles.sectionTitle}>Segment Status</Text>
        <Text style={styles.subSectionTitle}>Lens</Text>
        <View style={styles.chipContainer}>
          {lensOpts.map(opt => <Chip key={`ll_${opt}`} selected={lLens.includes(opt)} onPress={() => setLLens(prev => prev.includes(opt) ? prev.filter(item => item !== opt) : [...prev, opt])} style={styles.chip}>L: {opt}</Chip>)}
          {lensOpts.map(opt => <Chip key={`rl_${opt}`} selected={rLens.includes(opt)} onPress={() => setRLens(prev => prev.includes(opt) ? prev.filter(item => item !== opt) : [...prev, opt])} style={styles.chip}>R: {opt}</Chip>)}
        </View>
        {lLens.includes('other') && <TextInput label="Left Lens Other (*)" value={lLensOther} onChangeText={setLLensOther} style={styles.input} mode="outlined" error={showErrors && !lLensOther.trim()} />}
        {rLens.includes('other') && <TextInput label="Right Lens Other (*)" value={rLensOther} onChangeText={setRLensOther} style={styles.input} mode="outlined" error={showErrors && !rLensOther.trim()} />}

        <Text style={styles.subSectionTitle}>Cornea</Text>
        <View style={styles.chipContainer}>
          {corneaOpts.map(opt => <Chip key={`lc_${opt}`} selected={lCornea.includes(opt)} onPress={() => setLCornea(prev => prev.includes(opt) ? prev.filter(item => item !== opt) : [...prev, opt])} style={styles.chip}>L: {opt}</Chip>)}
          {corneaOpts.map(opt => <Chip key={`rc_${opt}`} selected={rCornea.includes(opt)} onPress={() => setRCornea(prev => prev.includes(opt) ? prev.filter(item => item !== opt) : [...prev, opt])} style={styles.chip}>R: {opt}</Chip>)}
        </View>
        {lCornea.includes('other') && <TextInput label="Left Cornea Other (*)" value={lCorneaOther} onChangeText={setLCorneaOther} style={styles.input} mode="outlined" error={showErrors && !lCorneaOther.trim()} />}
        {rCornea.includes('other') && <TextInput label="Right Cornea Other (*)" value={rCorneaOther} onChangeText={setRCorneaOther} style={styles.input} mode="outlined" error={showErrors && !rCorneaOther.trim()} />}

        <Text style={styles.subSectionTitle}>Retina</Text>
        <View style={styles.chipContainer}>
          {retinaOpts.map(opt => <Chip key={`lr_${opt}`} selected={lRetina.includes(opt)} onPress={() => setLRetina(prev => prev.includes(opt) ? prev.filter(item => item !== opt) : [...prev, opt])} style={styles.chip}>L: {opt}</Chip>)}
          {retinaOpts.map(opt => <Chip key={`rr_${opt}`} selected={rRetina.includes(opt)} onPress={() => setRRetina(prev => prev.includes(opt) ? prev.filter(item => item !== opt) : [...prev, opt])} style={styles.chip}>R: {opt}</Chip>)}
        </View>
        {lRetina.includes('other') && <TextInput label="Left Retina Other (*)" value={lRetinaOther} onChangeText={setLRetinaOther} style={styles.input} mode="outlined" error={showErrors && !lRetinaOther.trim()} />}
        {rRetina.includes('other') && <TextInput label="Right Retina Other (*)" value={rRetinaOther} onChangeText={setRRetinaOther} style={styles.input} mode="outlined" error={showErrors && !rRetinaOther.trim()} />}

        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput label="Notes" value={notes} onChangeText={setNotes} multiline numberOfLines={4} style={styles.input} mode="outlined" />

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Save & Finish
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    height: 56,
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  docImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    height: 32,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
  },
  button: {
    marginTop: 12,
  },
});

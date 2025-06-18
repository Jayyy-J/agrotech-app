// In agrotech-app/src/screens/RequestServiceScreen.js
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Appbar, Text, Card } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { firestore } from '../config/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const RequestServiceScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [serviceType, setServiceType] = useState('Fumigación con Dron'); // Default service
  const [locationDetails, setLocationDetails] = useState('');
  const [preferredDateString, setPreferredDateString] = useState(''); // Optional
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestService = async () => {
    if (!locationDetails) {
      Alert.alert('Error', 'Por favor, especifique la ubicación para el servicio.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'Debe estar autenticado para solicitar un servicio.');
      return;
    }

    setLoading(true);
    try {
      let preferredDate = null;
      if (preferredDateString) {
        preferredDate = new Date(preferredDateString);
        if (isNaN(preferredDate.getTime())) {
          Alert.alert('Error', 'Fecha preferida inválida. Use YYYY-MM-DD o déjela en blanco.');
          setLoading(false);
          return;
        }
      }

      await addDoc(collection(firestore, 'serviceRequests'), {
        farmerId: user.uid,
        farmerEmail: user.email, // Denormalize for easier display for admins
        serviceType,
        locationDetails,
        preferredDate, // Store as Date object or null
        notes,
        requestDate: serverTimestamp(),
        status: 'pending', // Initial status
      });

      Alert.alert('Éxito', 'Su solicitud de servicio ha sido enviada.');
      navigation.goBack();

    } catch (error) {
      console.error("Error requesting service: ", error);
      Alert.alert('Error', 'No se pudo enviar su solicitud. Intente de nuevo.');
    }
    setLoading(false);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Solicitar Nuevo Servicio" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Tipo de Servicio"
              value={serviceType}
              onChangeText={setServiceType} // Could be a Picker/Dropdown later
              style={styles.input}
              disabled // For now, only one service type
            />
            <TextInput
              label="Detalles de Ubicación (Finca, Lote, Vereda)"
              value={locationDetails}
              onChangeText={setLocationDetails}
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="Ej: Finca La Esperanza, Lote 3, Vereda El Progreso"
            />
            <Text style={styles.label}>Fecha Preferida (YYYY-MM-DD, Opcional)</Text>
            <TextInput
                value={preferredDateString}
                onChangeText={setPreferredDateString}
                placeholder="YYYY-MM-DD"
                style={styles.input}
            />
            <TextInput
              label="Notas Adicionales (Ej: tipo de cultivo, urgencia)"
              value={notes}
              onChangeText={setNotes}
              style={styles.input}
              multiline
              numberOfLines={4}
            />
            <Button
              mode="contained"
              onPress={handleRequestService}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Enviar Solicitud
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flexGrow: 1 },
  card: { marginBottom: 16 },
  input: { marginBottom: 12 },
  button: { marginTop: 16 },
  label: {fontSize: 12, color: 'gray', marginBottom: 4, marginLeft: 8}
});

export default RequestServiceScreen;

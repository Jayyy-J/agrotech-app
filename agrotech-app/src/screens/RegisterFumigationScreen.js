// In agrotech-app/src/screens/RegisterFumigationScreen.js
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Appbar, Text, Card } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { firestore } from '../config/firebaseConfig';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const RegisterFumigationScreen = ({ route, navigation }) => {
  const { flightId, flightProduct, flightLocation } = route.params; // Expect flightId and other details
  const { user } = useAuth();

  const [fumigationDateString, setFumigationDateString] = useState(new Date().toISOString().split('T')[0]);
  const [productUsed, setProductUsed] = useState(flightProduct || '');
  const [actualQuantityApplied, setActualQuantityApplied] = useState('');
  const [weatherConditions, setWeatherConditions] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterFumigation = async () => {
    if (!productUsed || !actualQuantityApplied || !fumigationDateString) {
      Alert.alert('Error', 'Por favor complete los campos de fecha, producto y cantidad.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'Debe estar autenticado.');
      return;
    }
    if (!flightId) {
      Alert.alert('Error', 'ID de vuelo no encontrado. No se puede registrar la fumigación.');
      return;
    }

    setLoading(true);
    try {
      const finalFumigationDate = new Date(fumigationDateString);
      if (isNaN(finalFumigationDate.getTime())) {
        Alert.alert('Error', 'Fecha de fumigación inválida. Use YYYY-MM-DD.');
        setLoading(false);
        return;
      }

      // 1. Add fumigation record
      await addDoc(collection(firestore, 'fumigations'), {
        flightId: flightId,
        operatorId: user.uid,
        fumigationDate: finalFumigationDate,
        productUsed,
        actualQuantityApplied,
        weatherConditions,
        notes,
        createdAt: serverTimestamp(),
      });

      // 2. Update parent flight status to 'completed'
      const flightDocRef = doc(firestore, 'flights', flightId);
      await updateDoc(flightDocRef, {
        status: 'completed',
        updatedAt: serverTimestamp(),
      });

      Alert.alert('Éxito', 'Fumigación registrada y vuelo actualizado a "completado".');
      navigation.goBack(); // Go back to the flight list or previous screen

    } catch (error) {
      console.error("Error registering fumigation: ", error);
      Alert.alert('Error', 'No se pudo registrar la fumigación. Intente de nuevo.');
    }
    setLoading(false);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Registrar Fumigación" subtitle={`Vuelo: ${flightLocation || flightId}`} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Fecha de Fumigación (YYYY-MM-DD)</Text>
            <TextInput
                value={fumigationDateString}
                onChangeText={setFumigationDateString}
                placeholder="YYYY-MM-DD"
                style={styles.input}
            />
            <TextInput
              label="Producto Usado"
              value={productUsed}
              onChangeText={setProductUsed}
              style={styles.input}
              placeholder="Ej: Glifosato Concentrado"
            />
            <TextInput
              label="Cantidad Real Aplicada"
              value={actualQuantityApplied}
              onChangeText={setActualQuantityApplied}
              style={styles.input}
              placeholder="Ej: 18.5 Litros, 3.8 Kg"
            />
            <TextInput
              label="Condiciones Climáticas"
              value={weatherConditions}
              onChangeText={setWeatherConditions}
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="Ej: Soleado, viento 5km/h NE, 28°C"
            />
            <TextInput
              label="Notas Adicionales (Opcional)"
              value={notes}
              onChangeText={setNotes}
              style={styles.input}
              multiline
              numberOfLines={3}
            />
            <Button
              mode="contained"
              onPress={handleRegisterFumigation}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Registrar Fumigación
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

export default RegisterFumigationScreen;

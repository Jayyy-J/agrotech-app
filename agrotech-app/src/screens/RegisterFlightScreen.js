// In agrotech-app/src/screens/RegisterFlightScreen.js
import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Appbar, Provider as PaperProvider, Text } from 'react-native-paper';
// Conditional import for date picker
// import { DatePickerInput } from 'react-native-paper-dates';
import { useAuth } from '../context/AuthContext';
import { firestore } from '../config/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const RegisterFlightScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [scheduledDate, setScheduledDate] = useState(new Date()); // Default to today
  const [productUsed, setProductUsed] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState(''); // e.g., "10 Litros"
  const [estimatedTime, setEstimatedTime] = useState(''); // e.g., "2 horas"
  const [fieldLocation, setFieldLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // Fallback for date input if react-native-paper-dates is not available/working
  const [dateString, setDateString] = useState(new Date().toISOString().split('T')[0]);


  const handleRegisterFlight = async () => {
    if (!productUsed || !estimatedQuantity || !estimatedTime || !fieldLocation || !dateString) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'Debe estar autenticado para registrar un vuelo.');
      return;
    }

    setLoading(true);
    try {
      const finalDate = new Date(dateString); // Ensure dateString is converted to Date object
      if (isNaN(finalDate.getTime())) {
        Alert.alert('Error', 'Fecha inválida. Use el formato YYYY-MM-DD.');
        setLoading(false);
        return;
      }

      await addDoc(collection(firestore, 'flights'), {
        operatorId: user.uid,
        // farmerId: null, // To be added later if needed for direct assignment
        status: 'scheduled', // Default status
        scheduledDate: finalDate, // Use the parsed date
        productUsed,
        estimatedQuantity,
        estimatedTime,
        fieldLocation,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      Alert.alert('Éxito', 'Vuelo registrado correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error("Error registering flight: ", error);
      Alert.alert('Error', 'No se pudo registrar el vuelo. Intente de nuevo.');
    }
    setLoading(false);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Registrar Nuevo Vuelo" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Fecha Programada (YYYY-MM-DD)</Text>
        <TextInput
            value={dateString}
            onChangeText={setDateString}
            placeholder="YYYY-MM-DD"
            style={styles.input}
        />
        {/*
        // Uncomment if react-native-paper-dates is confirmed working
        <DatePickerInput
          locale="es" // Optional: for Spanish localization
          label="Fecha Programada"
          value={scheduledDate}
          onChange={(d) => setScheduledDate(d)}
          inputMode="start"
          style={styles.input}
        />
        */}
        <TextInput
          label="Producto a Usar (e.g., Glifosato)"
          value={productUsed}
          onChangeText={setProductUsed}
          style={styles.input}
        />
        <TextInput
          label="Cantidad Estimada de Producto (e.g., 20L, 5kg)"
          value={estimatedQuantity}
          onChangeText={setEstimatedQuantity}
          style={styles.input}
        />
        <TextInput
          label="Tiempo Estimado de Vuelo (e.g., 2 horas)"
          value={estimatedTime}
          onChangeText={setEstimatedTime}
          style={styles.input}
        />
        <TextInput
          label="Ubicación del Campo/Lote"
          value={fieldLocation}
          onChangeText={setFieldLocation}
          multiline
          numberOfLines={3}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleRegisterFlight}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Registrar Vuelo
        </Button>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flexGrow: 1 },
  input: { marginBottom: 12 },
  button: { marginTop: 16 },
  label: {fontSize: 12, color: 'gray', marginBottom: 4, marginLeft: 8}
});

// Wrap with PaperProvider if not already done at a higher level for modals/pickers
// For now, assuming App.js PaperProvider is sufficient.
export default RegisterFlightScreen;

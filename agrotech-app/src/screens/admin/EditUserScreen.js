// In agrotech-app/src/screens/admin/EditUserScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Button, RadioButton, Text, Card, Title } from 'react-native-paper';
import { firestore } from '../../config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const ROLES = ['farmer', 'operator', 'admin']; // Available roles

const EditUserScreen = ({ route, navigation }) => {
  const { userId, currentRole, userEmail } = route.params;
  const [selectedRole, setSelectedRole] = useState(currentRole || 'farmer');
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async () => {
    if (!userId || !selectedRole) {
      Alert.alert("Error", "Información de usuario o rol inválida.");
      return;
    }
    setLoading(true);
    try {
      const userDocRef = doc(firestore, 'users', userId);
      await updateDoc(userDocRef, { role: selectedRole });
      Alert.alert("Éxito", `Rol actualizado a ${selectedRole} para ${userEmail}.`);
      navigation.goBack();
    } catch (error) {
      console.error("Error updating role: ", error);
      Alert.alert("Error", "No se pudo actualizar el rol.");
    }
    setLoading(false);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Editar Rol de Usuario" subtitle={userEmail} />
      </Appbar.Header>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Cambiar Rol para:</Title>
            <Text style={styles.emailText}>{userEmail}</Text>
            <Text style={styles.currentRoleText}>Rol Actual: {currentRole ? currentRole.charAt(0).toUpperCase() + currentRole.slice(1) : 'No asignado'}</Text>

            <RadioButton.Group onValueChange={newValue => setSelectedRole(newValue)} value={selectedRole}>
              {ROLES.map(role => (
                <View key={role} style={styles.radioItem}>
                  <RadioButton value={role} />
                  <Text>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
                </View>
              ))}
            </RadioButton.Group>
            <Button
              mode="contained"
              onPress={handleUpdateRole}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Guardar Cambios
            </Button>
          </Card.Content>
        </Card>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' }, // Added background color
  card: {
    padding: 8, // Added some padding inside card
    elevation: 2, // Slight elevation
  },
  emailText: { fontSize: 16, marginBottom: 8, fontWeight: 'bold' },
  currentRoleText: { fontSize: 14, marginBottom: 16, color: 'gray' },
  radioItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  button: { marginTop: 20 }
});
export default EditUserScreen;

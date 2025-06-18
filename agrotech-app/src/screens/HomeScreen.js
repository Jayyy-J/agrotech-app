// In agrotech-app/src/screens/HomeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Appbar } from 'react-native-paper'; // Added Appbar
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => { // Add navigation prop
  const { logout, user, userRole } = useAuth();

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={userRole === 'farmer' ? "Inicio Agricultor" : "Inicio"} />
      </Appbar.Header>
      <View style={styles.container}>
        <Text variant="headlineMedium">Home Screen</Text>
        {user && <Text>Bienvenido, {user.displayName || user.email}!</Text>}
        {userRole && <Text>Tu Rol: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}</Text>}

        {userRole === 'farmer' && (
          <Button
            mode="contained-tonal"
            icon="plus-circle-outline"
            onPress={() => navigation.navigate('RequestService')}
            style={styles.actionButton}
          >
            Solicitar Nuevo Servicio
          </Button>
        )}

        <Button onPress={logout} style={styles.actionButton} mode="contained">
          Cerrar Sesión
        </Button>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  actionButton: { marginTop: 20, minWidth: 200 } // Style for buttons
});
export default HomeScreen;

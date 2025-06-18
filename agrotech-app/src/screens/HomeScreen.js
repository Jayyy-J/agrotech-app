// In agrotech-app/src/screens/HomeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { logout, user, userRole } = useAuth(); // Get user and userRole

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Home Screen</Text>
      {user && <Text>Welcome, {user.displayName || user.email}!</Text>}
      {userRole && <Text>Your Role: {userRole}</Text>} {/* Display role */}
      <Button onPress={logout} style={{marginTop: 20}} mode="contained">
        Logout
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});
export default HomeScreen;

// In agrotech-app/src/screens/AdminDashboardScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const AdminDashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Admin Dashboard Screen</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});
export default AdminDashboardScreen;

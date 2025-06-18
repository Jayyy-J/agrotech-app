// In agrotech-app/src/screens/FumigationScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const FumigationScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Fumigation Log Screen</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});
export default FumigationScreen;

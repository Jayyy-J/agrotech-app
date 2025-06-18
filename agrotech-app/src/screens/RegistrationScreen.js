// In agrotech-app/src/screens/RegistrationScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth(); // Get register function

  const handleRegister = async () => {
    // Name is optional, so not checking here, but email and password are required.
    if (!email || !password) {
        setError('Email and password are required.');
        return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Pass the name state to the register function
      await register(email, password, name);
      // User will be created, onAuthStateChanged in AuthContext will handle navigation
      // Or navigate to login: navigation.navigate('Login');
      // For now, RootNavigator handles this.
    } catch (e) {
      setError(e.message || 'Failed to register. Please try again.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Register</Text>
      <TextInput label="Name (Optional)" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput label="Password (min. 6 chars)" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
      <Button mode="contained" onPress={handleRegister} style={styles.button} loading={loading} disabled={loading}>
        Register
      </Button>
      <Button onPress={() => navigation.navigate('Login')} style={styles.linkButton} disabled={loading}>
        Already have an account? Login
      </Button>
      <Snackbar visible={!!error} onDismiss={() => setError('')} duration={Snackbar.DURATION_MEDIUM}>
        {error}
      </Snackbar>
    </View>
  );
};
// Styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 10 },
  button: { marginTop: 10 },
  linkButton: { marginTop: 15 }
});
export default RegistrationScreen;

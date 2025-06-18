// In agrotech-app/src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth(); // Get login function

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      // Navigation to main app will be handled by RootNavigator due to user state change
    } catch (e) {
      setError(e.message || 'Failed to login. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Login</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button mode="contained" onPress={handleLogin} style={styles.button} loading={loading} disabled={loading}>
        Login
      </Button>
      <Button onPress={() => navigation.navigate('Registration')} style={styles.linkButton} disabled={loading}>
        Don't have an account? Register
      </Button>
      <Button onPress={() => navigation.navigate('PasswordRecovery')} style={styles.linkButton} disabled={loading}>
        Forgot Password?
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
export default LoginScreen;

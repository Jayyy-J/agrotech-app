// In agrotech-app/src/screens/PasswordRecoveryScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const PasswordRecoveryScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // For success/error messages
  const { sendPasswordReset } = useAuth(); // Get sendPasswordReset function

  const handleSendRecoveryEmail = async () => {
    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await sendPasswordReset(email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (e) {
      setMessage(e.message || 'Failed to send password reset email.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Recover Password</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <Button mode="contained" onPress={handleSendRecoveryEmail} style={styles.button} loading={loading} disabled={loading}>
        Send Recovery Email
      </Button>
      <Button onPress={() => navigation.navigate('Login')} style={styles.linkButton} disabled={loading}>
        Back to Login
      </Button>
      <Snackbar visible={!!message} onDismiss={() => setMessage('')} duration={Snackbar.DURATION_LONG}>
        {message}
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
export default PasswordRecoveryScreen;

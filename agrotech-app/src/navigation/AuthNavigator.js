// In agrotech-app/src/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import PasswordRecoveryScreen from '../screens/PasswordRecoveryScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="PasswordRecovery" component={PasswordRecoveryScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

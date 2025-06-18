// In agrotech-app/App.js
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator'; // Import AppNavigator
import { AuthProvider, useAuth } from './src/context/AuthContext';
// Removed Button import as it's no longer used here

const RootNavigator = () => {
  const { isAuthenticated } = useAuth(); // user object also available if needed

  // Loading state is handled within AuthProvider which returns null during loading.
  // A more sophisticated app-wide loading indicator could be placed here if needed,
  // for example, by checking a loading state from useAuth if we expose it.

  if (isAuthenticated) {
    return <AppNavigator />; // Show main app navigator
  }
  return <AuthNavigator />; // Show auth flow
};

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}

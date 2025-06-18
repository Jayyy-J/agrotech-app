// In agrotech-app/src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // Import StackNavigator

import HomeScreen from '../screens/HomeScreen';
// import FlightsScreen from '../screens/FlightsScreen'; // Will be part of FlightsStack
import FumigationScreen from '../screens/FumigationScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import new screens for Flights stack
import FlightsScreen from '../screens/FlightsScreen';
import RegisterFlightScreen from '../screens/RegisterFlightScreen';

// Icons (optional for now)
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Create a stack navigator instance

// Create a Stack Navigator for the Flights Tab
const FlightsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Appbar is handled within screens */}
      <Stack.Screen name="FlightsList" component={FlightsScreen} />
      <Stack.Screen name="RegisterFlight" component={RegisterFlightScreen} />
      {/* Add FlightDetailScreen here later */}
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // tabBarIcon: ({ focused, color, size }) => { /* ... icon logic ... */ },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Headers are managed by screens or individual stacks
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Flights" component={FlightsStack} /> {/* Use FlightsStack here */}
      <Tab.Screen name="Fumigation" component={FumigationScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;

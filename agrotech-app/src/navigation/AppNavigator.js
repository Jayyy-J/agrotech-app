// In agrotech-app/src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Screen Imports
import HomeScreen from '../screens/HomeScreen';
import FumigationScreen from '../screens/FumigationScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProfileScreen from '../screens/ProfileScreen'; // Assuming you have this or will create it

import FlightsScreen from '../screens/FlightsScreen';
import RegisterFlightScreen from '../screens/RegisterFlightScreen';
import RegisterFumigationScreen from '../screens/RegisterFumigationScreen';
import RequestServiceScreen from '../screens/RequestServiceScreen';

// Admin Navigator
import AdminNavigator from './AdminNavigator'; // Import AdminNavigator
import { useAuth } from '../context/AuthContext'; // Import useAuth to check role

// Optional: Icons (ensure react-native-vector-icons is installed)
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack (already defined in previous subtask)
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="RequestService" component={RequestServiceScreen} />
    </Stack.Navigator>
  );
};

// Flights Stack (already defined in previous subtask)
const FlightsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FlightsList" component={FlightsScreen} />
      <Stack.Screen name="RegisterFlight" component={RegisterFlightScreen} />
      <Stack.Screen name="RegisterFumigation" component={RegisterFumigationScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { userRole } = useAuth(); // Get userRole

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        // Example for adding icons, uncomment and customize if MaterialCommunityIcons is set up
        // tabBarIcon: ({ focused, color, size }) => {
        //   let iconName;
        //   if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        //   else if (route.name === 'Flights') iconName = focused ? 'airplane' : 'airplane-outline';
        //   else if (route.name === 'Fumigation') iconName = focused ? 'weather-windy' : 'weather-windy-variant';
        //   else if (route.name === 'Products') iconName = focused ? 'calculator' : 'calculator-variant';
        //   else if (route.name === 'Admin') iconName = focused ? 'shield-crown' : 'shield-crown-outline';
        //   else if (route.name === 'Profile') iconName = focused ? 'account-circle' : 'account-circle-outline';
        //   return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        // },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Flights" component={FlightsStack} />
      <Tab.Screen name="Fumigation" component={FumigationScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      {userRole === 'admin' && ( // Conditionally render Admin tab
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          // options={{ // Optional: Add admin-specific icon
          //   tabBarIcon: ({ color, size }) => (
          //     <MaterialCommunityIcons name="shield-crown" color={color} size={size} />
          //   ),
          // }}
        />
      )}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;

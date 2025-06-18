// In agrotech-app/src/navigation/AdminNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import EditUserScreen from '../screens/admin/EditUserScreen';
import AdminAllFlightsScreen from '../screens/admin/AdminAllFlightsScreen';
import AdminStatisticsScreen from '../screens/admin/AdminStatisticsScreen'; // Import new screen

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
      <Stack.Screen name="EditUser" component={EditUserScreen} />
      <Stack.Screen name="AdminAllFlights" component={AdminAllFlightsScreen} />
      <Stack.Screen name="AdminStatistics" component={AdminStatisticsScreen} /> {/* Add new screen */}
    </Stack.Navigator>
  );
};
export default AdminNavigator;

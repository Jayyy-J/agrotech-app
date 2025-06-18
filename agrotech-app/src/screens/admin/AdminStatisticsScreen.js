// In agrotech-app/src/screens/admin/AdminStatisticsScreen.js
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Appbar, ActivityIndicator, Card, Title, Text, List, Divider } from 'react-native-paper';
import { firestore } from '../../config/firebaseConfig';
import { collection, getDocs,getCountFromServer } from 'firebase/firestore'; // getCountFromServer for efficient counting
import { useFocusEffect } from '@react-navigation/native';

const AdminStatisticsScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFlights: 0,
    totalServiceRequests: 0,
    flightsWithProductSpecified: 0,
    // distinctProducts: new Set(), // Could be more complex to calculate/display
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatistics = useCallback(async () => {
    // setLoading(true); // Set loading true at the beginning of fetch
    try {
      // Get total users
      const usersCol = collection(firestore, 'users');
      const usersSnapshot = await getCountFromServer(usersCol);
      const totalUsers = usersSnapshot.data().count;

      // Get total flights
      const flightsCol = collection(firestore, 'flights');
      const flightsSnapshot = await getCountFromServer(flightsCol);
      const totalFlights = flightsSnapshot.data().count;

      // Get total service requests
      const serviceRequestsCol = collection(firestore, 'serviceRequests');
      const serviceRequestsSnapshot = await getCountFromServer(serviceRequestsCol);
      const totalServiceRequests = serviceRequestsSnapshot.data().count;


      // Get flights with product specified (more detailed analysis might be slow on client)
      // For a simple count, we iterate. For many records, this should be done server-side (e.g. Cloud Function)
      let flightsWithProduct = 0;
      // const distinctProductSet = new Set(); // Example for distinct products
      const allFlightsDocs = await getDocs(flightsCol); // Re-fetch for product details, not ideal for very large datasets
      allFlightsDocs.forEach(doc => {
        if (doc.data().productUsed && doc.data().productUsed.trim() !== '') {
          flightsWithProduct++;
          // distinctProductSet.add(doc.data().productUsed.trim().toLowerCase());
        }
      });

      setStats({
        totalUsers,
        totalFlights,
        totalServiceRequests,
        flightsWithProductSpecified: flightsWithProduct,
        // distinctProducts: distinctProductSet
      });

    } catch (error) {
      console.error("Error fetching statistics: ", error);
      // Alert.alert("Error", "Could not fetch statistics.");
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Set loading to true when focusing the screen
      fetchStatistics();
    }, [fetchStatistics])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStatistics();
  };

  if (loading && !refreshing && stats.totalUsers === 0 && stats.totalFlights === 0) { // Improved loading condition
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Estadísticas Generales" />
        </Appbar.Header>
        <ActivityIndicator animating={true} size="large" style={styles.loader} />
      </>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Estadísticas Generales" />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Card style={styles.card}>
          <Card.Content>
            <List.Item
              title="Total de Usuarios Registrados"
              description={stats.totalUsers.toString()}
              left={props => <List.Icon {...props} icon="account-group" />}
            />
            <Divider />
            <List.Item
              title="Total de Vuelos Registrados"
              description={stats.totalFlights.toString()}
              left={props => <List.Icon {...props} icon="airplane-takeoff" />}
            />
            <Divider />
             <List.Item
              title="Total de Solicitudes de Servicio"
              description={stats.totalServiceRequests.toString()}
              left={props => <List.Icon {...props} icon="bell-ring-outline" />}
            />
            <Divider />
            <List.Item
              title="Vuelos con Producto Especificado"
              description={stats.flightsWithProductSpecified.toString()}
              left={props => <List.Icon {...props} icon="beaker-check-outline" />}
            />
            {/*
            <Divider />
            <List.Item
              title="Número de Productos Distintos Usados"
              description={stats.distinctProducts.size.toString()}
              left={props => <List.Icon {...props} icon="flask-empty-outline" />}
            />
            */}
          </Card.Content>
        </Card>
        <Text style={styles.note}>Las estadísticas se actualizan al cargar la pantalla o al deslizar hacia abajo.</Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flexGrow: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginBottom: 16, elevation: 2 },
  note: { textAlign: 'center', color: 'gray', marginTop: 20, fontStyle: 'italic' }
});

export default AdminStatisticsScreen;

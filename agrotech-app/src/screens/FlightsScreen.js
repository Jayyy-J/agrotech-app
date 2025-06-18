// In agrotech-app/src/screens/FlightsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, Appbar, Chip, Title } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { firestore } from '../config/firebaseConfig';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const FlightsScreen = ({ navigation }) => {
  const { user, userRole } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFlights = useCallback(() => {
    if (user && userRole === 'operator') {
      setLoading(true);
      const flightsCollectionRef = collection(firestore, 'flights');
      const q = query(
        flightsCollectionRef,
        where('operatorId', '==', user.uid),
        orderBy('scheduledDate', 'desc') // Sort by newest first
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedFlights = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore Timestamp to JS Date for display
          scheduledDate: doc.data().scheduledDate?.toDate ? doc.data().scheduledDate.toDate() : null,
        }));
        setFlights(fetchedFlights);
        setLoading(false);
        setRefreshing(false);
      }, (error) => {
        console.error("Error fetching flights: ", error);
        setLoading(false);
        setRefreshing(false);
      });
      return unsubscribe; // Return unsubscribe function for cleanup
    } else {
      setFlights([]);
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, userRole]);

  // Use useFocusEffect to re-fetch when the screen comes into focus
  // and on initial mount. onSnapshot will keep it updated.
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = fetchFlights();
      return () => {
        if (unsubscribe) unsubscribe(); // Cleanup listener on blur/unmount
      };
    }, [fetchFlights])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchFlights(); // This will re-setup the listener if needed or just refresh data
  };

  if (loading && !refreshing) {
    return (
      <>
        <Appbar.Header><Appbar.Content title="Mis Vuelos Programados" /></Appbar.Header>
        <ActivityIndicator animating={true} size="large" style={styles.loader} />
      </>
    );
  }

  if (userRole !== 'operator') {
    return (
      <>
        <Appbar.Header><Appbar.Content title="Vuelos" /></Appbar.Header>
        <View style={styles.centeredMessage}>
          <Title>Acceso Restringido</Title>
          <Text>Esta sección es para operadores de drones.</Text>
        </View>
      </>
    );
  }

  const renderFlightItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`Vuelo: ${item.fieldLocation || 'Ubicación Pendiente'}`}
        subtitle={`Producto: ${item.productUsed || 'N/A'}`}
      />
      <Card.Content>
        <Text>Fecha: {item.scheduledDate ? item.scheduledDate.toLocaleDateString() : 'Fecha no especificada'}</Text>
        <Text>Estado: <Chip icon="information" mode="outlined">{item.status}</Chip></Text>
        <Text>Tiempo Estimado: {item.estimatedTime || 'N/A'}</Text>
      </Card.Content>
      {/* Add actions like view details or edit later */}
    </Card>
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Mis Vuelos Programados" />
      </Appbar.Header>
      <View style={styles.container}>
        {flights.length === 0 && !loading ? (
          <View style={styles.centeredMessage}>
             <Text>No tienes vuelos programados.</Text>
          </View>
        ) : (
          <FlatList
            data={flights}
            renderItem={renderFlightItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
        {userRole === 'operator' && (
          <FAB
            style={styles.fab}
            icon="plus"
            onPress={() => navigation.navigate('RegisterFlight')}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
  card: { marginHorizontal: 16, marginVertical: 8 },
  listContent: { paddingBottom: 80 }, // To avoid FAB overlapping last item
  centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, textAlign: 'center' }
});

export default FlightsScreen;

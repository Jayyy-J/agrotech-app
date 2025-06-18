// In agrotech-app/src/screens/FlightsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, Appbar, Chip, Title, Button } from 'react-native-paper'; // Added Button
import { useAuth } from '../context/AuthContext';
import { firestore } from '../config/firebaseConfig';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const FlightsScreen = ({ navigation }) => { // Ensure navigation is destructured
  const { user, userRole } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFlights = useCallback(() => {
    if (user && userRole === 'operator') {
      // setLoading(true); // setLoading only on initial full load, not for snapshot updates if not desired
      const flightsCollectionRef = collection(firestore, 'flights');
      const q = query(
        flightsCollectionRef,
        where('operatorId', '==', user.uid),
        orderBy('scheduledDate', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedFlights = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
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
      return unsubscribe;
    } else {
      setFlights([]);
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, userRole]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Show loader when screen comes into focus before data is ready
      const unsubscribe = fetchFlights();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, [fetchFlights])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchFlights();
  };

  const renderFlightItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`Vuelo: ${item.fieldLocation || 'Ubicación Pendiente'}`}
        subtitle={`Producto Estimado: ${item.productUsed || 'N/A'}`}
      />
      <Card.Content>
        <Text>Fecha Programada: {item.scheduledDate ? item.scheduledDate.toLocaleDateString() : 'Fecha no especificada'}</Text>
        <View style={styles.statusContainer}>
          <Text>Estado: </Text>
          <Chip
            icon={item.status === 'completed' ? "check-circle" : item.status === 'scheduled' ? "calendar-clock" : "progress-wrench"}
            mode="outlined"
            style={item.status === 'completed' ? styles.chipCompleted : styles.chipScheduled}
          >
            {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Desconocido'}
          </Chip>
        </View>
        <Text>Tiempo Estimado: {item.estimatedTime || 'N/A'}</Text>
      </Card.Content>
      {userRole === 'operator' && item.status !== 'completed' && (
        <Card.Actions>
          <Button
            icon="spray-bottle"
            mode="contained"
            onPress={() => navigation.navigate('RegisterFumigation', {
                flightId: item.id,
                flightProduct: item.productUsed,
                flightLocation: item.fieldLocation
            })}
            style={styles.actionButton}
          >
            Registrar Fumigación
          </Button>
        </Card.Actions>
      )}
       {userRole === 'operator' && item.status === 'completed' && (
        <Card.Actions>
          <Button
            icon="check-all"
            disabled
            style={styles.actionButton}
          >
            Fumigación Registrada
          </Button>
        </Card.Actions>
      )}
    </Card>
  );

  if (loading && !refreshing && flights.length === 0) { // Show loader only if flights are empty and not refreshing
    return (
      <>
        <Appbar.Header><Appbar.Content title={userRole === 'operator' ? "Mis Vuelos Programados" : "Vuelos"} /></Appbar.Header>
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

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Mis Vuelos Programados" />
      </Appbar.Header>
      <View style={styles.container}>
        {flights.length === 0 && !loading ? (
          <View style={styles.centeredMessage}>
             <Text>No tienes vuelos programados.</Text>
             <Text style={{marginTop: 8}}>Puedes registrar uno usando el botón (+).</Text>
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
  listContent: { paddingBottom: 80 },
  centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, textAlign: 'center' },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 4 },
  chipScheduled: { backgroundColor: '#fff8e1', borderColor: '#ffe082' },
  chipCompleted: { backgroundColor: '#e8f5e9', borderColor: '#a5d6a7' },
  actionButton: { flex: 1, marginHorizontal: 8 }
});

export default FlightsScreen;

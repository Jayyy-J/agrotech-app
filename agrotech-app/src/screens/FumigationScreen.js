// In agrotech-app/src/screens/FumigationScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, ActivityIndicator, Appbar, Title, List, Divider } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { firestore } from '../config/firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const FumigationScreen = ({ navigation }) => {
  const { user, userRole } = useAuth();
  const [fumigations, setFumigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFarmerFumigations = useCallback(async () => {
    if (!user || userRole !== 'farmer') {
      setFumigations([]);
      setLoading(false);
      setRefreshing(false); // Ensure refreshing is also reset
      return;
    }
    setLoading(true);
    try {
      // 1. Get flights completed for this farmer
      // This assumes 'farmerId' field exists on flight documents.
      // For testing, manually add 'farmerId: user.uid' to some 'completed' flight documents.
      const flightsQuery = query(
        collection(firestore, 'flights'),
        where('farmerId', '==', user.uid),
        where('status', '==', 'completed')
      );
      const flightsSnapshot = await getDocs(flightsQuery);
      const completedFlightIds = flightsSnapshot.docs.map(doc => doc.id);

      if (completedFlightIds.length === 0) {
        setFumigations([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // 2. Get fumigations for those flights
      // Firestore 'in' query supports up to 30 items in the array.
      const MAX_IN_QUERIES = 30;
      let allFumigations = [];

      for (let i = 0; i < completedFlightIds.length; i += MAX_IN_QUERIES) {
        const batchFlightIds = completedFlightIds.slice(i, i + MAX_IN_QUERIES);
        if (batchFlightIds.length > 0) {
            const fumigationsQuery = query(
                collection(firestore, 'fumigations'),
                where('flightId', 'in', batchFlightIds),
                orderBy('fumigationDate', 'desc')
            );
            const fumigationsSnapshot = await getDocs(fumigationsQuery);
            const fetchedFumigations = fumigationsSnapshot.docs.map(doc => {
                const data = doc.data();
                // Find corresponding flight details (e.g. location)
                const flight = flightsSnapshot.docs.find(f => f.id === data.flightId)?.data();
                return {
                    id: doc.id,
                    ...data,
                    fumigationDate: data.fumigationDate?.toDate ? data.fumigationDate.toDate() : null,
                    flightLocation: flight?.fieldLocation || 'N/A',
                    flightProduct: flight?.productUsed || 'N/A'
                };
            });
            allFumigations = allFumigations.concat(fetchedFumigations);
        }
      }

      allFumigations.sort((a,b) => (b.fumigationDate || 0) - (a.fumigationDate || 0));

      setFumigations(allFumigations);
    } catch (error) {
      console.error("Error fetching farmer fumigations: ", error);
      // Alert.alert("Error", "Could not fetch fumigation history.");
    }
    setLoading(false);
    setRefreshing(false);
  }, [user, userRole]);

  useFocusEffect(
    useCallback(() => {
      fetchFarmerFumigations();
    }, [fetchFarmerFumigations])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchFarmerFumigations();
  };

  if (loading && !refreshing) {
    return (
      <>
        <Appbar.Header><Appbar.Content title="Mis Fumigaciones" /></Appbar.Header>
        <ActivityIndicator animating={true} size="large" style={styles.loader} />
      </>
    );
  }

  if (userRole !== 'farmer') {
    return (
      <>
        <Appbar.Header><Appbar.Content title="Registro de Fumigaciones" /></Appbar.Header>
        <View style={styles.centeredMessage}>
          <Title>Acceso Restringido</Title>
          <Text>Esta vista es para agricultores.</Text>
          {userRole === 'operator' && <Text>Los operadores registran fumigaciones desde la pantalla de Vuelos.</Text>}
        </View>
      </>
    );
  }

  const renderFumigationItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`Fumigación en: ${item.flightLocation}`}
        subtitle={`Fecha: ${item.fumigationDate ? item.fumigationDate.toLocaleDateString() : 'N/A'}`}
      />
      <Card.Content>
        <List.Item
          title="Producto Aplicado"
          description={item.productUsed || 'No especificado'}
          left={props => <List.Icon {...props} icon="spray-bottle" />}
        />
        <List.Item
          title="Cantidad Aplicada"
          description={item.actualQuantityApplied || 'No especificado'}
          left={props => <List.Icon {...props} icon="beaker-outline" />}
        />
        {item.weatherConditions && (
          <List.Item
            title="Condiciones Climáticas"
            description={item.weatherConditions}
            left={props => <List.Icon {...props} icon="weather-partly-cloudy" />}
          />
        )}
        {item.notes && (
           <List.Item
            title="Notas Adicionales"
            description={item.notes}
            left={props => <List.Icon {...props} icon="note-text-outline" />}
          />
        )}
      </Card.Content>
    </Card>
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Historial de Fumigaciones" />
      </Appbar.Header>
      <View style={styles.container}>
        {fumigations.length === 0 && !loading ? (
          <View style={styles.centeredMessage}>
             <Text>No tienes fumigaciones registradas.</Text>
             <Text style={{marginTop: 8, color: 'gray'}}>Asegúrate que los vuelos completados tengan tu ID de agricultor asignado.</Text>
          </View>
        ) : (
          <FlatList
            data={fumigations}
            renderItem={renderFumigationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginHorizontal: 16, marginVertical: 8 },
  listContent: { paddingBottom: 16 },
  centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, textAlign: 'center' }
});

export default FumigationScreen;

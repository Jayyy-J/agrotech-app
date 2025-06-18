// In agrotech-app/src/screens/admin/AdminAllFlightsScreen.js
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Appbar, ActivityIndicator, Card, Text, Chip, List } from 'react-native-paper';
import { firestore } from '../../config/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const AdminAllFlightsScreen = ({ navigation }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFlights = useCallback(async () => {
    setLoading(true);
    try {
      const flightsQuery = query(collection(firestore, 'flights'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(flightsQuery);
      const fetchedFlights = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scheduledDate: doc.data().scheduledDate?.toDate ? doc.data().scheduledDate.toDate() : null,
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : null,
      }));
      setFlights(fetchedFlights);
    } catch (error) {
      console.error("Error fetching all flights: ", error);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFlights();
    }, [fetchFlights]) // Ensure fetchFlights is in dependency array
  );

  const onRefresh = () => { setRefreshing(true); fetchFlights(); };

  if (loading && !refreshing && flights.length === 0) {
     return (
        <>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Todos los Vuelos" />
          </Appbar.Header>
          <ActivityIndicator animating={true} size="large" style={{flex: 1, justifyContent: 'center'}} />
        </>
      );
  }

  const renderFlightItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={`Vuelo: ${item.fieldLocation || 'N/A'}`} subtitle={`ID: ${item.id}`} />
      <Card.Content>
        <List.Item
          title="Fecha Programada"
          description={item.scheduledDate ? item.scheduledDate.toLocaleDateString() : 'N/A'}
          left={props => <List.Icon {...props} icon="calendar" />}
        />
        <List.Item
          title="Estado"
          description={<Chip style={item.status === 'completed' ? styles.chipCompleted : styles.chipScheduled}>{item.status || 'N/A'}</Chip>}
          left={props => <List.Icon {...props} icon="information-outline" />}
        />
        <List.Item
          title="Operador ID"
          description={item.operatorId || 'N/A'}
          left={props => <List.Icon {...props} icon="account-hard-hat" />}
        />
        {item.farmerId && (
          <List.Item
            title="Agricultor ID"
            description={item.farmerId}
            left={props => <List.Icon {...props} icon="account" />}
          />
        )}
        <List.Item
          title="Producto Estimado"
          description={item.productUsed || 'N/A'}
          left={props => <List.Icon {...props} icon="spray-bottle" />}
        />
         <Text style={styles.dateText}>Registrado: {item.createdAt ? item.createdAt.toLocaleDateString() : 'N/A'}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Todos los Vuelos" />
      </Appbar.Header>
      <FlatList
        data={flights}
        renderItem={renderFlightItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text>No se encontraron vuelos.</Text>
            </View>
          ) : null
        }
      />
    </>
  );
};
const styles = StyleSheet.create({
  list: { padding: 8, flexGrow: 1 },
  card: { margin: 8, elevation: 2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  chipScheduled: { backgroundColor: '#fff8e1', borderColor: '#ffe082' },
  chipCompleted: { backgroundColor: '#e8f5e9', borderColor: '#a5d6a7' },
  dateText: { fontSize: 12, color: 'grey', marginTop: 8, textAlign: 'right'}
});
export default AdminAllFlightsScreen;

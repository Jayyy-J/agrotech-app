// In agrotech-app/src/screens/admin/AdminUsersScreen.js
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Appbar, ActivityIndicator, Card, Text, Button, List, Divider } from 'react-native-paper';
import { firestore } from '../../config/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const AdminUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const usersQuery = query(collection(firestore, 'users'), orderBy('email', 'asc'));
      const querySnapshot = await getDocs(usersQuery);
      const fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users: ", error);
      // Alert.alert("Error", "Could not fetch users.");
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [fetchUsers]) // Ensure fetchUsers is in dependency array
  );

  const onRefresh = () => { setRefreshing(true); fetchUsers(); };

  if (loading && !refreshing) {
    // To avoid flashing loader when onSnapshot updates, check if users array is empty
    if (users.length === 0) {
      return (
        <>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Gestionar Usuarios" />
          </Appbar.Header>
          <ActivityIndicator animating={true} size="large" style={{flex: 1, justifyContent: 'center'}} />
        </>
      );
    }
  }


  const renderUserItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name || 'Sin Nombre Registrado'} subtitle={item.email} />
      <Card.Content>
        <Text>Rol: {item.role ? item.role.charAt(0).toUpperCase() + item.role.slice(1) : 'No asignado'}</Text>
        <Text>UID: {item.id}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('EditUser', { userId: item.id, currentRole: item.role, userEmail: item.email })}>
          Editar Rol
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Gestionar Usuarios" />
      </Appbar.Header>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading ? ( // Only show if not loading
            <View style={styles.emptyContainer}>
              <Text>No se encontraron usuarios.</Text>
            </View>
          ) : null
        }
      />
    </>
  );
};
const styles = StyleSheet.create({
  list: { padding: 8, flexGrow: 1 }, // Added flexGrow
  card: { margin: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }
});
export default AdminUsersScreen;

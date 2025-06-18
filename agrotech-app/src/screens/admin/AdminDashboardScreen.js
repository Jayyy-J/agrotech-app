// In agrotech-app/src/screens/admin/AdminDashboardScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Button, Card, Title } from 'react-native-paper';

const AdminDashboardScreen = ({ navigation }) => {
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Panel de Administrador" />
      </Appbar.Header>
      <View style={styles.container}>
        <Card style={styles.card} onPress={() => navigation.navigate('AdminUsers')}>
          <Card.Content style={styles.cardContent}>
            <Title>Gestionar Usuarios</Title>
          </Card.Content>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate('AdminAllFlights')}>
              <Card.Content style={styles.cardContent}><Title>Ver Todos los Vuelos</Title></Card.Content>
            </Card>
            <Card style={styles.card} onPress={() => navigation.navigate('AdminStatistics')}> {/* New Card */}
              <Card.Content style={styles.cardContent}><Title>Ver Estadísticas</Title></Card.Content>
        </Card>
        {/* Add more admin features later */}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 16, elevation: 4 },
  cardContent: { alignItems: 'center', paddingVertical: 20 }
});
export default AdminDashboardScreen;

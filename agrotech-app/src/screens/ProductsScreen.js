// In agrotech-app/src/screens/ProductsScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, RadioButton, Divider, Appbar } from 'react-native-paper';

const PRODUCT_DOSAGES = {
  glifosato: { rate: 2000, unit: 'ml', perUnit: 'ha', name: 'Glifosato (e.g., 2 L/ha)' },
  mancozeb: { rate: 1500, unit: 'ml', perUnit: 'ha', name: 'Mancozeb (e.g., 1.5 L/ha)' }, // Assuming liquid for ml
  clorpirifos: { rate: 1000, unit: 'ml', perUnit: 'ha', name: 'Clorpirifós (e.g., 1 L/ha)' },
};

const ProductsScreen = () => {
  const [hectares, setHectares] = useState('');
  const [waterVolumePerHectare, setWaterVolumePerHectare] = useState('200'); // Default 200 L/ha
  const [selectedProduct, setSelectedProduct] = useState('glifosato'); // Default product

  const [totalWaterNeeded, setTotalWaterNeeded] = useState(0);
  const [totalProductNeeded, setTotalProductNeeded] = useState(0);
  const [productDoseInfo, setProductDoseInfo] = useState('');

  const handleCalculate = () => {
    const numHectares = parseFloat(hectares);
    const numWaterVolPerHa = parseFloat(waterVolumePerHectare);

    if (isNaN(numHectares) || numHectares <= 0 || isNaN(numWaterVolPerHa) || numWaterVolPerHa <= 0) {
      alert('Por favor, ingrese valores válidos para hectáreas y volumen de agua.');
      setTotalWaterNeeded(0);
      setTotalProductNeeded(0);
      setProductDoseInfo('');
      return;
    }

    const product = PRODUCT_DOSAGES[selectedProduct];
    if (!product) {
      alert('Producto no válido seleccionado.');
      return;
    }

    setTotalWaterNeeded(numHectares * numWaterVolPerHa);
    setTotalProductNeeded(numHectares * product.rate);
    setProductDoseInfo(`${product.rate} ${product.unit}/${product.perUnit}`);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Calculadora de Mezcla" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Datos de Aplicación" />
          <Card.Content>
            <TextInput
              label="Número de Hectáreas (ha)"
              value={hectares}
              onChangeText={setHectares}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Litros de Agua por Hectárea (L/ha)"
              value={waterVolumePerHectare}
              onChangeText={setWaterVolumePerHectare}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Seleccionar Producto" />
          <Card.Content>
            <RadioButton.Group onValueChange={newValue => setSelectedProduct(newValue)} value={selectedProduct}>
              {Object.keys(PRODUCT_DOSAGES).map((key) => (
                <View key={key} style={styles.radioButtonItem}>
                  <RadioButton value={key} />
                  <Text>{PRODUCT_DOSAGES[key].name}</Text>
                </View>
              ))}
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <Button mode="contained" onPress={handleCalculate} style={styles.button}>
          Calcular
        </Button>

        {totalWaterNeeded > 0 && (
          <Card style={styles.resultsCard}>
            <Card.Title title="Resultados del Cálculo" />
            <Card.Content>
              <Text style={styles.resultText}>Agua Total Necesaria: {totalWaterNeeded.toFixed(2)} Litros</Text>
              <Divider style={styles.divider} />
              <Text style={styles.resultText}>Producto Seleccionado: {PRODUCT_DOSAGES[selectedProduct].name}</Text>
              <Text style={styles.resultText}>Dosis de Producto: {productDoseInfo}</Text>
              <Text style={styles.resultTextBold}>Total de Producto Necesario: {totalProductNeeded.toFixed(2)} {PRODUCT_DOSAGES[selectedProduct].unit}</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    marginBottom: 24,
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultsCard: {
    marginTop: 16,
    backgroundColor: '#e7f5e7', // Light green background for results
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
  },
  resultTextBold: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'green',
  },
  divider: {
    marginVertical: 8,
  }
});

export default ProductsScreen;

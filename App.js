import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AddProductScreen from './src/screens/AddProductScreen';
import HomeScreen from './src/screens/HomeScreen';
import InventoryScreen from './src/screens/InventoryScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [products, setProducts] = useState([]);

  const lowStockProducts = products.filter(
    (product) => product.currentStock <= product.minimumStock
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {currentScreen === 'home' && (
        <HomeScreen
          totalProducts={products.length}
          totalLowStock={lowStockProducts.length}
          goToScreen={setCurrentScreen}
        />
      )}

      {currentScreen === 'addProduct' && (
        <AddProductScreen
          products={products}
          setProducts={setProducts}
          goToScreen={setCurrentScreen}
        />
      )}

      {currentScreen === 'inventory' && (
        <InventoryScreen
          products={products}
          goToScreen={setCurrentScreen}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
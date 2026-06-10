import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import AddProductScreen from './src/screens/AddProductScreen';
import HomeScreen from './src/screens/HomeScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import { loadProducts, saveProducts } from './src/services/productStorage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    async function getStoredProducts() {
      try {
        const storedProducts = await loadProducts();
        setProducts(storedProducts);
      } catch (error) {
        Alert.alert(
          'Error',
          'No se pudieron cargar los productos guardados.'
        );
      } finally {
        setIsLoadingProducts(false);
      }
    }

    getStoredProducts();
  }, []);

  useEffect(() => {
    if (!isLoadingProducts) {
      saveProducts(products).catch(() => {
        Alert.alert(
          'Error',
          'No se pudieron guardar los cambios del inventario.'
        );
      });
    }
  }, [products, isLoadingProducts]);

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
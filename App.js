import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import AddProductScreen from './src/screens/AddProductScreen';
import HomeScreen from './src/screens/HomeScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import MovementHistoryScreen from './src/screens/MovementHistoryScreen';
import StockMovementScreen from './src/screens/StockMovementScreen';
import { loadMovements, saveMovements } from './src/services/movementStorage';
import { loadProducts, saveProducts } from './src/services/productStorage';
import DailyCountScreen from './src/screens/DailyCountScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);

  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedProducts = await loadProducts();
        const storedMovements = await loadMovements();

        setProducts(storedProducts);
        setMovements(storedMovements);
      } catch (error) {
        Alert.alert(
          'Error',
          'No se pudieron cargar los datos guardados.'
        );
      } finally {
        setIsLoadingData(false);
      }
    }

    loadStoredData();
  }, []);

  useEffect(() => {
    if (!isLoadingData) {
      saveProducts(products).catch(() => {
        Alert.alert(
          'Error',
          'No se pudieron guardar los productos.'
        );
      });
    }
  }, [products, isLoadingData]);

  useEffect(() => {
    if (!isLoadingData) {
      saveMovements(movements).catch(() => {
        Alert.alert(
          'Error',
          'No se pudieron guardar los movimientos.'
        );
      });
    }
  }, [movements, isLoadingData]);

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

      {currentScreen === 'stockMovement' && (
        <StockMovementScreen
          products={products}
          setProducts={setProducts}
          movements={movements}
          setMovements={setMovements}
          goToScreen={setCurrentScreen}
        />
      )}

      {currentScreen === 'movementHistory' && (
        <MovementHistoryScreen
          movements={movements}
          goToScreen={setCurrentScreen}
        />
      )}
      
      {currentScreen === 'dailyCount' && (
        <DailyCountScreen
          products={products}
          setProducts={setProducts}
          movements={movements}
          setMovements={setMovements}
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
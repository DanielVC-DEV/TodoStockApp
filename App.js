import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import AppMessage from './src/components/AppMessage';
import COLORS from './src/constants/colors';
import SCREEN_NAMES from './src/navigation/screenNames';

import AddProductScreen from './src/screens/AddProductScreen';
import DailyCountScreen from './src/screens/DailyCountScreen';
import HomeScreen from './src/screens/HomeScreen';
import EditProductScreen from './src/screens/EditProductScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import MovementHistoryScreen from './src/screens/MovementHistoryScreen';
import StockMovementScreen from './src/screens/StockMovementScreen';

import { loadMovements, saveMovements } from './src/services/movementStorage';
import { loadProducts, saveProducts } from './src/services/productStorage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [appMessage, setAppMessage] = useState(null);

  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedProducts = await loadProducts();
        const storedMovements = await loadMovements();

        setProducts(storedProducts);
        setMovements(storedMovements);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los datos guardados.');
      } finally {
        setIsLoadingData(false);
      }
    }

    loadStoredData();
  }, []);

  useEffect(() => {
    if (!isLoadingData) {
      saveProducts(products).catch(() => {
        showAppMessage(
          'error',
          'Error al guardar',
          'No se pudieron guardar los productos.'
        );
      });
    }
  }, [products, isLoadingData]);

  useEffect(() => {
    if (!isLoadingData) {
      saveMovements(movements).catch(() => {
        showAppMessage(
          'error',
          'Error al guardar',
          'No se pudieron guardar los movimientos.'
        );
      });
    }
  }, [movements, isLoadingData]);

  function showAppMessage(type, title, description) {
    setAppMessage({
      type,
      title,
      description,
    });

    setTimeout(() => {
      setAppMessage(null);
    }, 3500);
  }

  function getLowStockProducts() {
    return products.filter(
      (product) => product.currentStock <= product.minimumStock
    );
  }

  function navigateToScreen(navigation, screenKey, params = {}) {
    const screenMap = {
      home: SCREEN_NAMES.HOME,
      addProduct: SCREEN_NAMES.ADD_PRODUCT,
      editProduct: SCREEN_NAMES.EDIT_PRODUCT,
      inventory: SCREEN_NAMES.INVENTORY,
      stockMovement: SCREEN_NAMES.STOCK_MOVEMENT,
      dailyCount: SCREEN_NAMES.DAILY_COUNT,
      movementHistory: SCREEN_NAMES.MOVEMENT_HISTORY,
    };

    if (screenKey === 'home') {
      navigation.navigate(SCREEN_NAMES.HOME);
      return;
    }

    navigation.navigate(screenMap[screenKey], params);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={SCREEN_NAMES.HOME}
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.white,
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              color: COLORS.textDark,
            },
            headerTintColor: COLORS.primary,
            contentStyle: {
              backgroundColor: COLORS.background,
            },
          }}
        >
          <Stack.Screen
            name={SCREEN_NAMES.HOME}
            options={{ title: 'TodoStock' }}
          >
            {({ navigation }) => (
              <HomeScreen
                totalProducts={products.length}
                totalLowStock={getLowStockProducts().length}
                goToScreen={(screenKey) =>
                  navigateToScreen(navigation, screenKey)
                }
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name={SCREEN_NAMES.ADD_PRODUCT}
            options={{ title: 'Agregar producto' }}
          >
            {({ navigation }) => (
              <AddProductScreen
                products={products}
                setProducts={setProducts}
                goToScreen={(screenKey) =>
                  navigateToScreen(navigation, screenKey)
                }
                showAppMessage={showAppMessage}
              />
            )}
          </Stack.Screen>
          
          <Stack.Screen
            name={SCREEN_NAMES.EDIT_PRODUCT}
            options={{ title: 'Editar producto' }}
          >
            {({ navigation, route }) => (
              <EditProductScreen
                route={route}
                products={products}
                setProducts={setProducts}
                movements={movements}
                setMovements={setMovements}
                goToScreen={(screenKey, params) =>
                  navigateToScreen(navigation, screenKey, params)
              }
                showAppMessage={showAppMessage}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name={SCREEN_NAMES.INVENTORY}
            options={{ title: 'Inventario' }}
          >
            {({ navigation }) => (
              <InventoryScreen
                products={products}
                setProducts={setProducts}
                goToScreen={(screenKey, params) =>
                  navigateToScreen(navigation, screenKey, params)
                }
                showAppMessage={showAppMessage}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name={SCREEN_NAMES.STOCK_MOVEMENT}
            options={{ title: 'Movimiento de stock' }}
          >
            {({ navigation }) => (
              <StockMovementScreen
                products={products}
                setProducts={setProducts}
                movements={movements}
                setMovements={setMovements}
                goToScreen={(screenKey) =>
                  navigateToScreen(navigation, screenKey)
                }
                showAppMessage={showAppMessage}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name={SCREEN_NAMES.DAILY_COUNT}
            options={{ title: 'Conteo de cierre' }}
          >
            {({ navigation }) => (
              <DailyCountScreen
                products={products}
                setProducts={setProducts}
                movements={movements}
                setMovements={setMovements}
                goToScreen={(screenKey) =>
                  navigateToScreen(navigation, screenKey)
                }
                showAppMessage={showAppMessage}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name={SCREEN_NAMES.MOVEMENT_HISTORY}
            options={{ title: 'Historial' }}
          >
            {({ navigation }) => (
              <MovementHistoryScreen
                movements={movements}
                products={products}
                goToScreen={(screenKey, params) =>
                  navigateToScreen(navigation, screenKey, params)
                }
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>

      <AppMessage
        message={appMessage}
        onClose={() => setAppMessage(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
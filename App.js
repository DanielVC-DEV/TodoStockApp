import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppMessage from './src/components/AppMessage';

import SCREEN_NAMES from './src/navigation/screenNames';

import HomeScreen from './src/screens/HomeScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import EditProductScreen from './src/screens/EditProductScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import StockMovementScreen from './src/screens/StockMovementScreen';
import DailyCountScreen from './src/screens/DailyCountScreen';
import MovementHistoryScreen from './src/screens/MovementHistoryScreen';
import DailySummaryScreen from './src/screens/DailySummaryScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

import COLORS from './src/constants/colors';

import { getProducts, saveProducts } from './src/services/productStorage';
import { getMovements, saveMovements } from './src/services/movementStorage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);

  const [appMessage, setAppMessage] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    saveMovements(movements);
  }, [movements]);

  async function loadInitialData() {
    const storedProducts = await getProducts();
    const storedMovements = await getMovements();

    setProducts(storedProducts);
    setMovements(storedMovements);
  }

  function showAppMessage(type, title, message) {
    setAppMessage({
      visible: true,
      type,
      title,
      message,
    });
  }

  function hideAppMessage() {
    setAppMessage({
      visible: false,
      type: 'info',
      title: '',
      message: '',
    });
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
      dailySummary: SCREEN_NAMES.DAILY_SUMMARY,
      notifications: SCREEN_NAMES.NOTIFICATIONS,
    };

    if (screenKey === 'home') {
      navigation.navigate(SCREEN_NAMES.HOME);
      return;
    }

    navigation.navigate(screenMap[screenKey], params);
  }

  const totalLowStockProducts = products.filter(
    (product) =>
      Number(product.currentStock) > 0 &&
      Number(product.currentStock) <= Number(product.minimumStock)
  ).length;

  const totalOutOfStockProducts = products.filter(
    (product) => Number(product.currentStock) === 0
  ).length;

  const totalNotifications =
    totalLowStockProducts + totalOutOfStockProducts;

  return (
    <>
      <NavigationContainer>
        <StatusBar style="light" />

        <Stack.Navigator
          initialRouteName={SCREEN_NAMES.HOME}
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
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
                totalLowStock={totalNotifications}
                movements={movements}
                goToScreen={(screenKey, params) =>
                  navigateToScreen(navigation, screenKey, params)
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
            name={SCREEN_NAMES.EDIT_PRODUCT}
            options={{ title: 'Editar producto' }}
          >
            {({ navigation, route }) => (
              <EditProductScreen
                products={products}
                setProducts={setProducts}
                productId={route.params?.productId}
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
                goToScreen={(screenKey, params) =>
                  navigateToScreen(navigation, screenKey, params)
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
                goToScreen={(screenKey, params) =>
                  navigateToScreen(navigation, screenKey, params)
                }
                showAppMessage={showAppMessage}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name={SCREEN_NAMES.DAILY_SUMMARY}
            options={{ title: 'Resumen del día' }}
          >
            {({ navigation }) => (
              <DailySummaryScreen
                products={products}
                movements={movements}
                goToScreen={(screenKey, params) =>
                  navigateToScreen(navigation, screenKey, params)
                }
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name={SCREEN_NAMES.MOVEMENT_HISTORY}
            options={{ title: 'Historial de movimientos' }}
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

          <Stack.Screen
            name={SCREEN_NAMES.NOTIFICATIONS}
            options={{ title: 'Notificaciones' }}
          >
            {({ navigation }) => (
              <NotificationsScreen
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
        visible={appMessage.visible}
        type={appMessage.type}
        title={appMessage.title}
        message={appMessage.message}
        onClose={hideAppMessage}
      />
    </>
  );
}
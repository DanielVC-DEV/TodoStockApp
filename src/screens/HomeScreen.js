import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import COLORS from '../constants/colors';

const MENU_OPTIONS = [
  {
    title: 'Agregar producto',
    screenKey: 'addProduct',
  },
  {
    title: 'Ver inventario',
    screenKey: 'inventory',
  },
  {
    title: 'Registrar movimiento',
    screenKey: 'stockMovement',
  },
  {
    title: 'Conteo de cierre',
    screenKey: 'dailyCount',
  },
  {
    title: 'Resumen del día',
    screenKey: 'dailySummary',
  },
  {
    title: 'Historial de movimientos',
    screenKey: 'movementHistory',
  },
  {
    title: 'Notificaciones',
    screenKey: 'notifications',
  },
];

export default function HomeScreen({
  totalProducts,
  totalLowStock,
  movements,
  goToScreen,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const today = new Date().toLocaleDateString('es-CL');

  const todayMovements = movements.filter(
    (movement) => movement.createdAt === today
  );

  const todayEntries = todayMovements.filter(
    (movement) => movement.type === 'entrada'
  );

  const todayExits = todayMovements.filter(
    (movement) => movement.type === 'salida'
  );

  const todayCounts = todayMovements.filter(
    (movement) => movement.type === 'conteo_cierre'
  );

  const lastMovements = movements.slice(0, 3);

  const totalNotifications = totalLowStock;

  function handleMenuOptionPress(screenKey) {
    setIsMenuOpen(false);
    goToScreen(screenKey);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.headerTextBox}>
          <Text style={styles.appName}>TodoStock</Text>
          <Text style={styles.subtitle}>Control diario de inventario</Text>
        </View>

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => goToScreen('notifications')}
        >
          <Text style={styles.notificationIcon}>🔔</Text>

          {totalNotifications > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {totalNotifications}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {isMenuOpen && (
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menú principal</Text>

          {MENU_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.screenKey}
              style={styles.menuOption}
              onPress={() => handleMenuOptionPress(option.screenKey)}
            >
              <Text style={styles.menuOptionText}>{option.title}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.mainCard}>
        <Text style={styles.cardTitle}>Operación de hoy</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Movimientos registrados</Text>
          <Text style={styles.rowValue}>{todayMovements.length}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Entradas realizadas</Text>
          <Text style={styles.rowValue}>{todayEntries.length}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Salidas realizadas</Text>
          <Text style={styles.rowValue}>{todayExits.length}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Conteos de cierre</Text>
          <Text style={styles.rowValue}>{todayCounts.length}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Productos registrados</Text>
          <Text style={styles.rowValue}>{totalProducts}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.mainCard}
        activeOpacity={0.8}
        onPress={() => goToScreen('movementHistory')}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Últimos movimientos</Text>
          <Text style={styles.cardLink}>Ver historial</Text>
        </View>

        {lastMovements.length === 0 ? (
          <Text style={styles.emptyText}>
            Todavía no hay movimientos registrados.
          </Text>
        ) : (
          lastMovements.map((movement) => (
            <View key={movement.id} style={styles.movementItem}>
              <Text style={styles.movementTitle}>
                {getMovementLabel(movement.type)} - {movement.productName}
              </Text>

              {movement.type !== 'conteo_cierre' ? (
                <Text style={styles.movementText}>
                  Cantidad: {movement.quantity}
                </Text>
              ) : (
                <Text style={styles.movementText}>
                  Conteo físico registrado
                </Text>
              )}

              <Text style={styles.movementDate}>
                {movement.createdAt} - {movement.createdTime}
              </Text>
            </View>
          ))
        )}
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Consejo del día</Text>

        <Text style={styles.infoText}>
          Revisa las notificaciones antes de cerrar el turno para evitar
          problemas de stock en el local.
        </Text>
      </View>
    </ScrollView>
  );
}

function getMovementLabel(type) {
  if (type === 'entrada') {
    return 'Entrada';
  }

  if (type === 'salida') {
    return 'Salida';
  }

  if (type === 'conteo_cierre') {
    return 'Conteo';
  }

  return 'Movimiento';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 24,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
  },
  menuIcon: {
    fontSize: 26,
    color: COLORS.textDark,
    fontWeight: 'bold',
  },
  headerTextBox: {
    flex: 1,
    marginHorizontal: 14,
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMedium,
    marginTop: 3,
  },
  notificationButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 25,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  notificationBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 4,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  menuOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuOptionText: {
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: 'bold',
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.textLight,
  },
  mainCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  cardLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowLabel: {
    fontSize: 15,
    color: COLORS.textMedium,
  },
  rowValue: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMedium,
    lineHeight: 22,
  },
  movementItem: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  movementTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  movementText: {
    fontSize: 13,
    color: COLORS.textMedium,
    marginBottom: 3,
  },
  movementDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  infoBox: {
    backgroundColor: COLORS.infoLight,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.infoText,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.infoText,
    lineHeight: 21,
  },
});
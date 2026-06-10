import { StyleSheet, Text, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import COLORS from '../constants/colors';

export default function HomeScreen({
  totalProducts,
  totalLowStock,
  goToScreen,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TodoStock</Text>
        <Text style={styles.subtitle}>Control de inventario profesional</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen del local</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Productos registrados</Text>
          <Text style={styles.value}>{totalProducts}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Productos con bajo stock</Text>
          <Text style={styles.warning}>{totalLowStock}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Próximos a vencer</Text>
          <Text style={styles.value}>0</Text>
        </View>
      </View>

      <CustomButton
        title="Agregar producto"
        onPress={() => goToScreen('addProduct')}
      />

      <CustomButton
        title="Ver inventario"
        variant="secondary"
        onPress={() => goToScreen('inventory')}
      />
      <CustomButton
        title="Registrar movimiento"
        variant="secondary"
        onPress={() => goToScreen('stockMovement')}
      />

      <CustomButton
        title="Historial de movimientos"
        variant="secondary"
        onPress={() => goToScreen('movementHistory')}
      />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 17,
    color: COLORS.textLight,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    color: COLORS.textDark,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    color: COLORS.textMedium,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  warning: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.danger,
  },
  infoBox: {
    backgroundColor: COLORS.infoLight,
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  infoText: {
    color: COLORS.infoText,
    fontSize: 14,
    lineHeight: 20,
  },
});
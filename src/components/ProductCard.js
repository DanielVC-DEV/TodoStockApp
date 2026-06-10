import { StyleSheet, Text, View } from 'react-native';

import CustomButton from './CustomButton';
import COLORS from '../constants/colors';

export default function ProductCard({ product, onEdit, onDelete }) {
  const isLowStock = product.currentStock <= product.minimumStock;

  return (
    <View style={[styles.card, isLowStock && styles.lowStockCard]}>
      <View style={styles.header}>
        <Text style={styles.name}>{product.name}</Text>

        {isLowStock && <Text style={styles.badge}>Bajo stock</Text>}
      </View>

      <Text style={styles.text}>Categoría: {product.category}</Text>

      <Text style={styles.text}>
        Stock actual: {product.currentStock} {product.unit}
      </Text>

      <Text style={styles.text}>
        Stock mínimo: {product.minimumStock} {product.unit}
      </Text>

      <Text style={styles.date}>Registrado: {product.createdAt}</Text>

      {product.updatedAt ? (
        <Text style={styles.date}>Última edición: {product.updatedAt}</Text>
      ) : null}

      <View style={styles.actions}>
        <CustomButton title="Editar" variant="secondary" onPress={onEdit} />

        <CustomButton title="Eliminar" variant="danger" onPress={onDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lowStockCard: {
    borderColor: COLORS.danger,
    backgroundColor: '#FFF7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  name: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  badge: {
    backgroundColor: COLORS.danger,
    color: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
    color: COLORS.textMedium,
    marginBottom: 5,
  },
  date: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 6,
  },
  actions: {
    marginTop: 12,
  },
});
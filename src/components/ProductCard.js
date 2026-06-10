import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../constants/colors';

export default function ProductCard({ product }) {
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
  },
  name: {
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
    marginTop: 8,
  },
});
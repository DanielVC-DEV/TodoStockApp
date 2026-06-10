import { ScrollView, StyleSheet, Text, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import ProductCard from '../components/ProductCard';
import COLORS from '../constants/colors';

export default function InventoryScreen({ products, goToScreen }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Inventario</Text>

      <Text style={styles.description}>
        Aquí se muestran los productos registrados. Los productos con cantidad
        menor o igual al stock mínimo aparecerán como bajo stock.
      </Text>

      {products.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin productos registrados</Text>
          <Text style={styles.emptyText}>
            Agrega tu primer producto para comenzar a controlar el inventario
            del local.
          </Text>
        </View>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}

      <CustomButton
        title="Agregar producto"
        onPress={() => goToScreen('addProduct')}
      />

      <CustomButton
        title="Volver al inicio"
        variant="secondary"
        onPress={() => goToScreen('home')}
      />
    </ScrollView>
  );
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
  screenTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 10,
    marginTop: 30,
  },
  description: {
    fontSize: 15,
    color: COLORS.textMedium,
    lineHeight: 22,
    marginBottom: 22,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMedium,
    lineHeight: 22,
  },
});
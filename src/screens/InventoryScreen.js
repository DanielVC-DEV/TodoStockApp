import { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import CustomButton from '../components/CustomButton';
import ProductCard from '../components/ProductCard';
import COLORS from '../constants/colors';
import PRODUCT_CATEGORIES from '../constants/categories';

export default function InventoryScreen({
  products,
  setProducts,
  goToScreen,
  showAppMessage,
}) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

  const categories = ['Todas', ...PRODUCT_CATEGORIES];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Todas' || product.category === selectedCategory;

      const isLowStock = product.currentStock <= product.minimumStock;

      const matchesLowStockFilter = showOnlyLowStock ? isLowStock : true;

      return matchesSearch && matchesCategory && matchesLowStockFilter;
    });
  }, [products, searchText, selectedCategory, showOnlyLowStock]);

  function confirmDeleteProduct(productId) {
    const selectedProduct = products.find((product) => product.id === productId);

    if (!selectedProduct) {
      showAppMessage(
        'error',
        'Producto no encontrado',
        'El producto que intentas eliminar no existe.'
      );

      return;
    }

    Alert.alert(
      'Eliminar producto',
      `¿Seguro que deseas eliminar "${selectedProduct.name}"? Esta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteProduct(productId),
        },
      ]
    );
  }

  function deleteProduct(productId) {
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );

    setProducts(updatedProducts);

    showAppMessage(
      'success',
      'Producto eliminado',
      'El producto fue eliminado correctamente del inventario.'
    );
  }

  function clearFilters() {
    setSearchText('');
    setSelectedCategory('Todas');
    setShowOnlyLowStock(false);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Inventario</Text>

      <Text style={styles.description}>
        Aquí se muestran los productos registrados. Puedes buscar por nombre,
        filtrar por categoría o revisar solo productos con bajo stock.
      </Text>

      <View style={styles.filtersCard}>
        <Text style={styles.filterTitle}>Buscar producto</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Ej: bebida, pan, papas..."
          placeholderTextColor={COLORS.textLight}
          value={searchText}
          onChangeText={setSearchText}
        />

        <Text style={styles.filterTitle}>Categoría</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category &&
                    styles.categoryButtonTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.lowStockButton,
            showOnlyLowStock && styles.lowStockButtonSelected,
          ]}
          onPress={() => setShowOnlyLowStock(!showOnlyLowStock)}
        >
          <Text
            style={[
              styles.lowStockButtonText,
              showOnlyLowStock && styles.lowStockButtonTextSelected,
            ]}
          >
            {showOnlyLowStock
              ? 'Mostrando bajo stock'
              : 'Mostrar solo bajo stock'}
          </Text>
        </TouchableOpacity>

        {(searchText !== '' ||
          selectedCategory !== 'Todas' ||
          showOnlyLowStock) && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Limpiar filtros</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          Productos encontrados: {filteredProducts.length}
        </Text>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin productos registrados</Text>

          <Text style={styles.emptyText}>
            Agrega tu primer producto para comenzar a controlar el inventario
            del local.
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin resultados</Text>

          <Text style={styles.emptyText}>
            No se encontraron productos con los filtros aplicados.
          </Text>
        </View>
      ) : (
        filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() =>
              goToScreen('editProduct', {
                productId: product.id,
              })
            }
            onDelete={() => confirmDeleteProduct(product.id)}
          />
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
  filtersCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    color: COLORS.textDark,
  },
  categoryScroll: {
    marginBottom: 14,
  },
  categoryButton: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    color: COLORS.textMedium,
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryButtonTextSelected: {
    color: COLORS.white,
  },
  lowStockButton: {
    backgroundColor: COLORS.dangerLight,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  lowStockButtonSelected: {
    backgroundColor: COLORS.danger,
  },
  lowStockButtonText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  lowStockButtonTextSelected: {
    color: COLORS.white,
  },
  clearButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  resultBox: {
    backgroundColor: COLORS.infoLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  resultText: {
    color: COLORS.infoText,
    fontWeight: 'bold',
    fontSize: 14,
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
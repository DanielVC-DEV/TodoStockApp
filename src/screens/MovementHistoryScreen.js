import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import CustomButton from '../components/CustomButton';
import COLORS from '../constants/colors';

const MOVEMENT_FILTERS = [
  {
    label: 'Todos',
    value: 'todos',
  },
  {
    label: 'Entradas',
    value: 'entrada',
  },
  {
    label: 'Salidas',
    value: 'salida',
  },
  {
    label: 'Conteos',
    value: 'conteo_cierre',
  },
];

export default function MovementHistoryScreen({
  movements,
  products,
  goToScreen,
}) {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');

  function getProductName(movement) {
    const currentProduct = products.find(
      (product) => product.id === movement.productId
    );

    return currentProduct ? currentProduct.name : movement.productName;
  }

  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
      const productName = getProductName(movement).toLowerCase();

      const matchesSearch = productName.includes(searchText.toLowerCase());

      const matchesFilter =
        selectedFilter === 'todos' || movement.type === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [movements, products, searchText, selectedFilter]);

  function clearFilters() {
    setSearchText('');
    setSelectedFilter('todos');
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Historial</Text>

      <Text style={styles.description}>
        Registro de entradas, salidas y conteos de cierre realizados en el
        inventario.
      </Text>

      <View style={styles.filtersCard}>
        <Text style={styles.filterTitle}>Buscar por producto</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Ej: bebida, pan, papas..."
          placeholderTextColor={COLORS.textLight}
          value={searchText}
          onChangeText={setSearchText}
        />

        <Text style={styles.filterTitle}>Tipo de movimiento</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {MOVEMENT_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterButton,
                selectedFilter === filter.value && styles.filterButtonSelected,
              ]}
              onPress={() => setSelectedFilter(filter.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter.value &&
                    styles.filterButtonTextSelected,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {(searchText !== '' || selectedFilter !== 'todos') && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Limpiar filtros</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          Movimientos encontrados: {filteredMovements.length}
        </Text>
      </View>

      {movements.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin movimientos registrados</Text>

          <Text style={styles.emptyText}>
            Cuando registres entradas, salidas o conteos de stock, aparecerán en
            esta sección.
          </Text>
        </View>
      ) : filteredMovements.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin resultados</Text>

          <Text style={styles.emptyText}>
            No se encontraron movimientos con los filtros aplicados.
          </Text>
        </View>
      ) : (
        filteredMovements.map((movement) => {
          const productName = getProductName(movement);

          return (
            <View key={movement.id} style={styles.movementCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.productName}>{productName}</Text>

                <Text
                  style={[
                    styles.badge,
                    movement.type === 'entrada' && styles.entryBadge,
                    movement.type === 'salida' && styles.exitBadge,
                    movement.type === 'conteo_cierre' && styles.countBadge,
                  ]}
                >
                  {getMovementLabel(movement.type)}
                </Text>
              </View>

              {movement.type !== 'conteo_cierre' ? (
                <Text style={styles.text}>Cantidad: {movement.quantity}</Text>
              ) : null}

              {movement.type === 'conteo_cierre' ? (
                <>
                  <Text style={styles.text}>
                    Stock anterior: {movement.previousStock}
                  </Text>

                  <Text style={styles.text}>
                    Stock contado: {movement.countedStock}
                  </Text>

                  {movement.difference < 0 ? (
                    <Text style={styles.outputText}>
                      Salida calculada: {Math.abs(movement.difference)}
                    </Text>
                  ) : null}

                  {movement.difference === 0 ? (
                    <Text style={styles.text}>Sin diferencia de stock</Text>
                  ) : null}
                </>
              ) : null}

              <Text style={styles.text}>Motivo: {movement.reason}</Text>

              <Text style={styles.date}>
                Fecha: {movement.createdAt} - {movement.createdTime}
              </Text>
            </View>
          );
        })
      )}

      <CustomButton
        title="Registrar movimiento"
        onPress={() => goToScreen('stockMovement')}
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
  filterScroll: {
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.textMedium,
    fontWeight: 'bold',
    fontSize: 14,
  },
  filterButtonTextSelected: {
    color: COLORS.white,
  },
  clearButton: {
    marginTop: 8,
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
  movementCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  productName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  badge: {
    color: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
  },
  entryBadge: {
    backgroundColor: COLORS.success,
  },
  exitBadge: {
    backgroundColor: COLORS.danger,
  },
  countBadge: {
    backgroundColor: COLORS.warning,
  },
  text: {
    fontSize: 15,
    color: COLORS.textMedium,
    marginBottom: 5,
  },
  outputText: {
    fontSize: 15,
    color: COLORS.danger,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 8,
  },
});
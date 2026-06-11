import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import COLORS from '../constants/colors';
import PRODUCT_CATEGORIES from '../constants/categories';

export default function CategorySelector({
  selectedCategory,
  onSelectCategory,
  error,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categoría *</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {PRODUCT_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonSelected,
            ]}
            onPress={() => onSelectCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextSelected,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.helperText}>
        Si no encuentras la categoría necesaria, más adelante podrá crearla un administrador.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    color: COLORS.textDark,
    marginBottom: 8,
    fontWeight: '600',
  },
  scroll: {
    marginBottom: 6,
  },
  categoryButton: {
    backgroundColor: COLORS.white,
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
  categoryText: {
    color: COLORS.textMedium,
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    lineHeight: 17,
  },
});
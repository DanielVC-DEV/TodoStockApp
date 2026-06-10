import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import COLORS from '../constants/colors';
import { validateMovementForm } from '../utils/movementValidations';

export default function StockMovementScreen({
  products,
  setProducts,
  movements,
  setMovements,
  goToScreen,
}) {
  const [formData, setFormData] = useState({
    productId: '',
    type: '',
    quantity: '',
    reason: '',
  });

  const [errors, setErrors] = useState({});

  function handleChange(fieldName, value) {
    setFormData({
      ...formData,
      [fieldName]: value,
    });

    if (errors[fieldName]) {
      setErrors({
        ...errors,
        [fieldName]: '',
      });
    }
  }

  function selectProduct(productId) {
    handleChange('productId', productId);
  }

  function selectType(type) {
    handleChange('type', type);
  }

  function handleSaveMovement() {
    const validationErrors = validateMovementForm(formData);
    const hasErrors = Object.keys(validationErrors).length > 0;

    if (hasErrors) {
      setErrors(validationErrors);

      Alert.alert(
        'Datos incompletos',
        'Revisa los campos marcados antes de registrar el movimiento.'
      );

      return;
    }

    const selectedProduct = products.find(
      (product) => product.id === formData.productId
    );

    if (!selectedProduct) {
      Alert.alert('Error', 'El producto seleccionado no existe.');
      return;
    }

    const movementQuantity = Number(formData.quantity);

    if (
      formData.type === 'salida' &&
      movementQuantity > selectedProduct.currentStock
    ) {
      Alert.alert(
        'Stock insuficiente',
        'No puedes retirar más stock del que existe actualmente.'
      );
      return;
    }

    const updatedProducts = products.map((product) => {
      if (product.id !== selectedProduct.id) {
        return product;
      }

      const newStock =
        formData.type === 'entrada'
          ? product.currentStock + movementQuantity
          : product.currentStock - movementQuantity;

      return {
        ...product,
        currentStock: newStock,
      };
    });

    const newMovement = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: formData.type,
      quantity: movementQuantity,
      reason: formData.reason.trim(),
      createdAt: new Date().toLocaleDateString('es-CL'),
      createdTime: new Date().toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setProducts(updatedProducts);
    setMovements([newMovement, ...movements]);

    Alert.alert(
      'Movimiento registrado',
      'El stock fue actualizado correctamente.'
    );

    goToScreen('inventory');
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Movimiento de stock</Text>

      <Text style={styles.description}>
        Registra entradas o salidas de productos. Cada movimiento queda guardado
        para mantener trazabilidad del inventario.
      </Text>

      <Text style={styles.sectionTitle}>Seleccionar producto *</Text>

      {products.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No hay productos registrados. Primero debes agregar un producto.
          </Text>
        </View>
      ) : (
        products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[
              styles.optionCard,
              formData.productId === product.id && styles.optionSelected,
            ]}
            onPress={() => selectProduct(product.id)}
          >
            <Text style={styles.optionTitle}>{product.name}</Text>
            <Text style={styles.optionText}>
              Stock actual: {product.currentStock} {product.unit}
            </Text>
          </TouchableOpacity>
        ))
      )}

      {errors.productId ? (
        <Text style={styles.errorText}>{errors.productId}</Text>
      ) : null}

      <Text style={styles.sectionTitle}>Tipo de movimiento *</Text>

      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            formData.type === 'entrada' && styles.typeSelected,
          ]}
          onPress={() => selectType('entrada')}
        >
          <Text
            style={[
              styles.typeText,
              formData.type === 'entrada' && styles.typeTextSelected,
            ]}
          >
            Entrada
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            formData.type === 'salida' && styles.typeSelected,
          ]}
          onPress={() => selectType('salida')}
        >
          <Text
            style={[
              styles.typeText,
              formData.type === 'salida' && styles.typeTextSelected,
            ]}
          >
            Salida
          </Text>
        </TouchableOpacity>
      </View>

      {errors.type ? <Text style={styles.errorText}>{errors.type}</Text> : null}

      <InputField
        label="Cantidad *"
        placeholder="Ej: 10"
        keyboardType="numeric"
        value={formData.quantity}
        onChangeText={(value) => handleChange('quantity', value)}
        error={errors.quantity}
      />

      <InputField
        label="Motivo *"
        placeholder="Ej: Compra de mercadería, venta diaria, merma"
        value={formData.reason}
        onChangeText={(value) => handleChange('reason', value)}
        error={errors.reason}
      />

      <CustomButton
        title="Guardar movimiento"
        onPress={handleSaveMovement}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 10,
    marginTop: 10,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMedium,
  },
  optionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.infoLight,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.textMedium,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  typeSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeText: {
    color: COLORS.textDark,
    fontWeight: 'bold',
  },
  typeTextSelected: {
    color: COLORS.white,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginBottom: 8,
  },
});
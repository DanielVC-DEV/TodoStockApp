import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import FormScreenWrapper from '../components/FormScreenWrapper';
import InputField from '../components/InputField';
import COLORS from '../constants/colors';
import { validateMovementForm } from '../utils/movementValidations';

export default function StockMovementScreen({
  products,
  setProducts,
  movements,
  setMovements,
  goToScreen,
  showAppMessage,
}) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [movementType, setMovementType] = useState('entrada');

  const [formData, setFormData] = useState({
    quantity: '',
    reason: '',
  });

  const [errors, setErrors] = useState({});

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId
  );

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
    setSelectedProductId(productId);

    if (errors.productId) {
      setErrors({
        ...errors,
        productId: '',
      });
    }
  }

  function handleSaveMovement() {
    const validationErrors = validateMovementForm({
      productId: selectedProductId,
      type: movementType,
      quantity: formData.quantity,
      reason: formData.reason,
    });

    const hasErrors = Object.keys(validationErrors).length > 0;

    if (hasErrors) {
      setErrors(validationErrors);

      showAppMessage(
        'error',
        'Datos incompletos',
        'Revisa los campos marcados antes de registrar el movimiento.'
      );

      return;
    }

    if (!selectedProduct) {
      showAppMessage(
        'error',
        'Producto no encontrado',
        'Selecciona un producto válido para registrar el movimiento.'
      );

      return;
    }

    const movementQuantity = Number(formData.quantity);

    if (
      movementType === 'salida' &&
      movementQuantity > Number(selectedProduct.currentStock)
    ) {
      showAppMessage(
        'error',
        'Stock insuficiente',
        'No puedes retirar más unidades de las que existen en stock.'
      );

      return;
    }

    const updatedProducts = products.map((product) => {
      if (product.id !== selectedProductId) {
        return product;
      }

      const newStock =
        movementType === 'entrada'
          ? Number(product.currentStock) + movementQuantity
          : Number(product.currentStock) - movementQuantity;

      return {
        ...product,
        currentStock: newStock,
      };
    });

    const currentDate = new Date();

    const newMovement = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: movementType,
      quantity: movementQuantity,
      reason: formData.reason.trim(),
      createdAt: currentDate.toLocaleDateString('es-CL'),
      createdTime: currentDate.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setProducts(updatedProducts);
    setMovements([newMovement, ...movements]);

    showAppMessage(
      'success',
      'Movimiento registrado',
      'El stock fue actualizado correctamente.'
    );

    goToScreen('inventory');
  }

  return (
    <FormScreenWrapper>
      <Text style={styles.screenTitle}>Movimiento de stock</Text>

      <Text style={styles.description}>
        Registra entradas o salidas de productos para mantener actualizado el
        inventario.
      </Text>

      <Text style={styles.sectionTitle}>Tipo de movimiento</Text>

      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            movementType === 'entrada' && styles.entryButtonSelected,
          ]}
          onPress={() => setMovementType('entrada')}
        >
          <Text
            style={[
              styles.typeButtonText,
              movementType === 'entrada' && styles.typeButtonTextSelected,
            ]}
          >
            Entrada
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            movementType === 'salida' && styles.exitButtonSelected,
          ]}
          onPress={() => setMovementType('salida')}
        >
          <Text
            style={[
              styles.typeButtonText,
              movementType === 'salida' && styles.typeButtonTextSelected,
            ]}
          >
            Salida
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Producto</Text>

      {errors.productId ? (
        <Text style={styles.errorText}>{errors.productId}</Text>
      ) : null}

      {products.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin productos registrados</Text>

          <Text style={styles.emptyText}>
            Primero debes agregar productos al inventario.
          </Text>
        </View>
      ) : (
        products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[
              styles.productOption,
              selectedProductId === product.id && styles.productOptionSelected,
            ]}
            onPress={() => selectProduct(product.id)}
          >
            <View>
              <Text
                style={[
                  styles.productName,
                  selectedProductId === product.id &&
                    styles.productNameSelected,
                ]}
              >
                {product.name}
              </Text>

              <Text
                style={[
                  styles.productStock,
                  selectedProductId === product.id &&
                    styles.productStockSelected,
                ]}
              >
                Stock actual: {product.currentStock} {product.unit}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

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
        placeholder="Ej: Compra proveedor, venta diaria, merma..."
        value={formData.reason}
        onChangeText={(value) => handleChange('reason', value)}
        error={errors.reason}
      />

      <CustomButton
        title="Registrar movimiento"
        onPress={handleSaveMovement}
      />

      <CustomButton
        title="Volver al inicio"
        variant="secondary"
        onPress={() => goToScreen('home')}
      />
    </FormScreenWrapper>
  );
}

const styles = StyleSheet.create({
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
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  typeButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
  },
  entryButtonSelected: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  exitButtonSelected: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  typeButtonText: {
    color: COLORS.textMedium,
    fontWeight: 'bold',
    fontSize: 15,
  },
  typeButtonTextSelected: {
    color: COLORS.white,
  },
  productOption: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  productOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  productNameSelected: {
    color: COLORS.white,
  },
  productStock: {
    fontSize: 14,
    color: COLORS.textMedium,
  },
  productStockSelected: {
    color: COLORS.white,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 21,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
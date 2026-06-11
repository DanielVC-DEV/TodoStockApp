import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import FormScreenWrapper from '../components/FormScreenWrapper';
import InputField from '../components/InputField';
import COLORS from '../constants/colors';
import { validateDailyCountForm } from '../utils/dailyCountValidations';

export default function DailyCountScreen({
  products,
  setProducts,
  movements,
  setMovements,
  goToScreen,
  showAppMessage,
}) {
  const [selectedProductId, setSelectedProductId] = useState('');

  const [formData, setFormData] = useState({
    countedStock: '',
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

  function handleSaveDailyCount() {
    const validationErrors = validateDailyCountForm({
      productId: selectedProductId,
      countedStock: formData.countedStock,
      reason: formData.reason,
    });

    const hasErrors = Object.keys(validationErrors).length > 0;

    if (hasErrors) {
      setErrors(validationErrors);

      showAppMessage(
        'error',
        'Datos incompletos',
        'Revisa los campos marcados antes de registrar el conteo.'
      );

      return;
    }

    if (!selectedProduct) {
      showAppMessage(
        'error',
        'Producto no encontrado',
        'Selecciona un producto válido para registrar el conteo.'
      );

      return;
    }

    const previousStock = Number(selectedProduct.currentStock);
    const countedStock = Number(formData.countedStock);

    if (countedStock > previousStock) {
      showAppMessage(
        'warning',
        'Conteo mayor al sistema',
        'El stock contado no puede ser mayor al stock del sistema. Si llegó mercadería nueva, registra una entrada.'
      );

      return;
    }

    const difference = countedStock - previousStock;

    const updatedProducts = products.map((product) => {
      if (product.id !== selectedProductId) {
        return product;
      }

      return {
        ...product,
        currentStock: countedStock,
      };
    });

    const currentDate = new Date();

    const newMovement = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: 'conteo_cierre',
      previousStock,
      countedStock,
      difference,
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
      'Conteo registrado',
      'El stock físico fue registrado correctamente.'
    );

    goToScreen('inventory');
  }

  return (
    <FormScreenWrapper>
      <Text style={styles.screenTitle}>Conteo de cierre</Text>

      <Text style={styles.description}>
        Registra el stock físico contado al final del día para calcular
        diferencias con el sistema.
      </Text>

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
                Stock en sistema: {product.currentStock} {product.unit}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      {selectedProduct ? (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Stock actual del sistema</Text>

          <Text style={styles.infoText}>
            {selectedProduct.currentStock} {selectedProduct.unit}
          </Text>
        </View>
      ) : null}

      <InputField
        label="Stock físico contado *"
        placeholder="Ej: 45"
        keyboardType="numeric"
        value={formData.countedStock}
        onChangeText={(value) => handleChange('countedStock', value)}
        error={errors.countedStock}
      />

      <InputField
        label="Motivo u observación *"
        placeholder="Ej: Conteo de cierre diario"
        value={formData.reason}
        onChangeText={(value) => handleChange('reason', value)}
        error={errors.reason}
      />

      <CustomButton
        title="Registrar conteo"
        onPress={handleSaveDailyCount}
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
  infoBox: {
    backgroundColor: COLORS.infoLight,
    borderRadius: 16,
    padding: 16,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.info,
  },
  infoTitle: {
    fontSize: 14,
    color: COLORS.infoText,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 20,
    color: COLORS.infoText,
    fontWeight: 'bold',
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
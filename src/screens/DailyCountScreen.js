import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import COLORS from '../constants/colors';
import { validateDailyCountForm } from '../utils/dailyCountValidations';

export default function DailyCountScreen({
  products,
  setProducts,
  movements,
  setMovements,
  goToScreen,
}) {
  const [formData, setFormData] = useState({
    productId: '',
    countedStock: '',
  });

  const [errors, setErrors] = useState({});

  const selectedProduct = products.find(
    (product) => product.id === formData.productId
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
    handleChange('productId', productId);
  }

  function handleSaveDailyCount() {
    const validationErrors = validateDailyCountForm(formData);
    const hasErrors = Object.keys(validationErrors).length > 0;

    if (hasErrors) {
      setErrors(validationErrors);

      Alert.alert(
        'Datos incompletos',
        'Revisa los campos marcados antes de guardar el conteo.'
      );

      return;
    }

    if (!selectedProduct) {
      Alert.alert('Error', 'El producto seleccionado no existe.');
      return;
    }

    const previousStock = selectedProduct.currentStock;
    const countedStock = Number(formData.countedStock);
    const difference = countedStock - previousStock;
    const calculatedOutput = previousStock - countedStock;

    if (countedStock > previousStock) {
      Alert.alert(
        'Conteo inválido',
        'La cantidad contada no puede ser mayor al stock registrado en el sistema. Si llegó más mercadería, debes registrarla desde la opción Entrada.'
      );
      return;
    }

    const updatedProducts = products.map((product) => {
      if (product.id !== selectedProduct.id) {
        return product;
      }

      return {
        ...product,
        currentStock: countedStock,
      };
    });

    const newMovement = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: 'conteo_cierre',
      quantity: Math.abs(difference),
      previousStock,
      countedStock,
      difference,
      calculatedOutput: calculatedOutput > 0 ? calculatedOutput : 0,
      reason: 'Conteo físico de cierre',
      createdAt: new Date().toLocaleDateString('es-CL'),
      createdTime: new Date().toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setProducts(updatedProducts);
    setMovements([newMovement, ...movements]);

    if (difference < 0) {
      Alert.alert(
        'Conteo guardado',
        `Se registró una salida calculada de ${Math.abs(
          difference
        )} ${selectedProduct.unit}.`
      );
    } else {
      Alert.alert(
        'Conteo guardado',
        'El stock contado coincide con el stock registrado. No se realizaron salidas.'
      );
    }

    goToScreen('inventory');
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Conteo de cierre</Text>

      <Text style={styles.description}>
        Cuenta cuánto queda físicamente al final del día. La app calculará
        cuántos productos salieron y actualizará el stock real.
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
              Stock en sistema: {product.currentStock} {product.unit}
            </Text>
          </TouchableOpacity>
        ))
      )}

      {errors.productId ? (
        <Text style={styles.errorText}>{errors.productId}</Text>
      ) : null}

      {selectedProduct ? (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Producto seleccionado</Text>
          <Text style={styles.summaryText}>
            {selectedProduct.name}
          </Text>
          <Text style={styles.summaryText}>
            Stock actual en sistema: {selectedProduct.currentStock}{' '}
            {selectedProduct.unit}
          </Text>
        </View>
      ) : null}

      <InputField
        label="Cantidad contada al cierre *"
        placeholder="Ej: 27"
        keyboardType="numeric"
        value={formData.countedStock}
        onChangeText={(value) => handleChange('countedStock', value)}
        error={errors.countedStock}
      />

      {selectedProduct && formData.countedStock.trim() !== '' ? (
        <View style={styles.calculationBox}>
          <Text style={styles.calculationTitle}>Resultado estimado</Text>

          <Text style={styles.calculationText}>
            Stock sistema: {selectedProduct.currentStock} {selectedProduct.unit}
          </Text>

          <Text style={styles.calculationText}>
            Stock contado: {formData.countedStock} {selectedProduct.unit}
          </Text>

          {!isNaN(Number(formData.countedStock)) &&
            Number(formData.countedStock) <= selectedProduct.currentStock ? (
            <Text style={styles.outputText}>
              Salida calculada:{' '}
              {selectedProduct.currentStock - Number(formData.countedStock)}{' '}
              {selectedProduct.unit}
            </Text>
          ) : null}

          {!isNaN(Number(formData.countedStock)) &&
            Number(formData.countedStock) > selectedProduct.currentStock ? (
            <Text style={styles.errorText}>
              La cantidad contada es mayor al stock del sistema. Para aumentar stock usa
              la opción Entrada.
            </Text>
          ) : null}
          
        </View>
      ) : null}

      <CustomButton
        title="Guardar conteo"
        onPress={handleSaveDailyCount}
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
  summaryBox: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    color: COLORS.textMedium,
    marginBottom: 4,
  },
  calculationBox: {
    backgroundColor: COLORS.infoLight,
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  calculationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.infoText,
    marginBottom: 8,
  },
  calculationText: {
    fontSize: 15,
    color: COLORS.infoText,
    marginBottom: 4,
  },
  outputText: {
    fontSize: 16,
    color: COLORS.danger,
    fontWeight: 'bold',
    marginTop: 8,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginBottom: 8,
  },
});
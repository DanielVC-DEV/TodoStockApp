import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CategorySelector from '../components/CategorySelector';
import CustomButton from '../components/CustomButton';
import FormScreenWrapper from '../components/FormScreenWrapper';
import InputField from '../components/InputField';
import COLORS from '../constants/colors';
import { validateProductForm } from '../utils/productValidations';

export default function EditProductScreen({
  products,
  setProducts,
  productId,
  goToScreen,
  showAppMessage,
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    currentStock: '',
    minimumStock: '',
    unit: '',
  });

  const [errors, setErrors] = useState({});

  const selectedProduct = products.find((product) => product.id === productId);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        category: selectedProduct.category,
        currentStock: selectedProduct.currentStock.toString(),
        minimumStock: selectedProduct.minimumStock.toString(),
        unit: selectedProduct.unit,
      });
    }
  }, [selectedProduct]);

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

  function handleUpdateProduct() {
    if (!selectedProduct) {
      showAppMessage(
        'error',
        'Producto no encontrado',
        'No se pudo encontrar el producto seleccionado.'
      );

      goToScreen('inventory');
      return;
    }

    const validationErrors = validateProductForm(formData);
    const hasErrors = Object.keys(validationErrors).length > 0;

    if (hasErrors) {
      setErrors(validationErrors);

      showAppMessage(
        'error',
        'Datos incompletos',
        'Revisa los campos marcados antes de guardar los cambios.'
      );

      return;
    }

    const updatedProducts = products.map((product) => {
      if (product.id !== productId) {
        return product;
      }

      return {
        ...product,
        name: formData.name.trim(),
        category: formData.category.trim(),
        currentStock: Number(formData.currentStock),
        minimumStock: Number(formData.minimumStock),
        unit: formData.unit.trim(),
      };
    });

    setProducts(updatedProducts);

    showAppMessage(
      'success',
      'Producto actualizado',
      'Los cambios fueron guardados correctamente.'
    );

    goToScreen('inventory');
  }

  if (!selectedProduct) {
    return (
      <FormScreenWrapper>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Producto no encontrado</Text>

          <Text style={styles.emptyText}>
            El producto que intentas editar no existe o fue eliminado.
          </Text>
        </View>

        <CustomButton
          title="Volver al inventario"
          onPress={() => goToScreen('inventory')}
        />
      </FormScreenWrapper>
    );
  }

  return (
    <FormScreenWrapper>
      <Text style={styles.screenTitle}>Editar producto</Text>

      <Text style={styles.description}>
        Modifica los datos del producto seleccionado. Los cambios se verán
        reflejados en el inventario.
      </Text>

      <InputField
        label="Nombre del producto *"
        placeholder="Ej: Pan de completo"
        value={formData.name}
        onChangeText={(value) => handleChange('name', value)}
        error={errors.name}
      />

      <CategorySelector
        selectedCategory={formData.category}
        onSelectCategory={(category) => handleChange('category', category)}
        error={errors.category}
      />

      <InputField
        label="Cantidad actual *"
        placeholder="Ej: 50"
        keyboardType="numeric"
        value={formData.currentStock}
        onChangeText={(value) => handleChange('currentStock', value)}
        error={errors.currentStock}
      />

      <InputField
        label="Stock mínimo *"
        placeholder="Ej: 10"
        keyboardType="numeric"
        value={formData.minimumStock}
        onChangeText={(value) => handleChange('minimumStock', value)}
        error={errors.minimumStock}
      />

      <InputField
        label="Unidad de medida *"
        placeholder="Ej: unidades, kilos, litros"
        value={formData.unit}
        onChangeText={(value) => handleChange('unit', value)}
        error={errors.unit}
      />

      <CustomButton
        title="Guardar cambios"
        onPress={handleUpdateProduct}
      />

      <CustomButton
        title="Volver al inventario"
        variant="secondary"
        onPress={() => goToScreen('inventory')}
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
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginTop: 30,
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
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
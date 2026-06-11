import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import COLORS from '../constants/colors';
import { validateProductForm } from '../utils/productValidations';
import CategorySelector from '../components/CategorySelector';

export default function AddProductScreen({
  products,
  setProducts,
  movements,
  setMovements,
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

  function resetForm() {
    setFormData({
      name: '',
      category: '',
      currentStock: '',
      minimumStock: '',
      unit: '',
    });

    setErrors({});
  }

  function handleSaveProduct() {
    const validationErrors = validateProductForm(formData);
    const hasErrors = Object.keys(validationErrors).length > 0;

    if (hasErrors) {
      setErrors(validationErrors);

      showAppMessage(
        'error',
        'Datos incompletos',
        'Revisa los campos marcados antes de guardar el producto.'
      );

      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      category: formData.category.trim(),
      currentStock: Number(formData.currentStock),
      minimumStock: Number(formData.minimumStock),
      unit: formData.unit.trim(),
      createdAt: new Date().toLocaleDateString('es-CL'),
    };

    const updatedProducts = [...products, newProduct];

    if (newProduct.currentStock > 0) {
      const initialMovement = {
        id: `${Date.now()}-entrada-inicial`,
        productId: newProduct.id,
        productName: newProduct.name,
        type: 'entrada',
        quantity: newProduct.currentStock,
        reason: 'Registro inicial del producto',
        createdAt: new Date().toLocaleDateString('es-CL'),
        createdTime: new Date().toLocaleTimeString('es-CL', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMovements([initialMovement, ...movements]);
    }

    setProducts(updatedProducts);

    showAppMessage(
      'success',
      'Producto guardado',
      'El producto fue registrado correctamente.'
    );

    resetForm();
    goToScreen('inventory');
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Agregar producto</Text>

      <Text style={styles.description}>
        Completa los datos del producto. Los campos marcados son obligatorios
        para mantener un inventario confiable.
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
        title="Guardar producto"
        onPress={handleSaveProduct}
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
});
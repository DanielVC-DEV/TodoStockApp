import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import COLORS from '../constants/colors';
import { validateProductForm } from '../utils/productValidations';
import CategorySelector from '../components/CategorySelector';

export default function EditProductScreen({
  route,
  products,
  setProducts,
  movements,
  setMovements,
  goToScreen,
  showAppMessage,
}) {
  const productId = route.params?.productId;

  const productToEdit = products.find((product) => product.id === productId);

  const [formData, setFormData] = useState({
    name: productToEdit?.name || '',
    category: productToEdit?.category || '',
    currentStock: productToEdit?.currentStock?.toString() || '',
    minimumStock: productToEdit?.minimumStock?.toString() || '',
    unit: productToEdit?.unit || '',
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

  function handleUpdateProduct() {
    if (!productToEdit) {
      showAppMessage(
        'error',
        'Producto no encontrado',
        'No se pudo encontrar el producto que intentas editar.'
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
        'Revisa los campos marcados antes de actualizar el producto.'
      );

      return;
    }

    const updatedName = formData.name.trim();

    const updatedProducts = products.map((product) => {
      if (product.id !== productToEdit.id) {
        return product;
      }

      return {
        ...product,
        name: updatedName,
        category: formData.category.trim(),
        currentStock: Number(formData.currentStock),
        minimumStock: Number(formData.minimumStock),
        unit: formData.unit.trim(),
        updatedAt: new Date().toLocaleDateString('es-CL'),
      };
    });

    const updatedMovements = movements.map((movement) => {
      if (movement.productId !== productToEdit.id) {
        return movement;
      }

      return {
        ...movement,
        productName: updatedName,
      };
    });

    setProducts(updatedProducts);
    setMovements(updatedMovements);

    showAppMessage(
      'success',
      'Producto actualizado',
      'El producto y su historial fueron actualizados correctamente.'
    );

    goToScreen('movementHistory');
  }

  if (!productToEdit) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.screenTitle}>Producto no encontrado</Text>

        <Text style={styles.description}>
          El producto que intentas editar no existe o fue eliminado.
        </Text>

        <CustomButton
          title="Volver al inventario"
          variant="secondary"
          onPress={() => goToScreen('inventory')}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Editar producto</Text>

      <Text style={styles.description}>
        Modifica los datos necesarios. Si cambias el nombre, también se
        actualizará en el historial de movimientos.
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

      <CustomButton title="Guardar cambios" onPress={handleUpdateProduct} />

      <CustomButton
        title="Cancelar"
        variant="secondary"
        onPress={() => goToScreen('inventory')}
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
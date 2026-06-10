export function validateProductForm(productData) {
  const errors = {};

  if (!productData.name.trim()) {
    errors.name = 'El nombre del producto es obligatorio.';
  }

  if (!productData.category.trim()) {
    errors.category = 'La categoría es obligatoria.';
  }

  if (!productData.currentStock.trim()) {
    errors.currentStock = 'La cantidad actual es obligatoria.';
  } else if (isNaN(Number(productData.currentStock))) {
    errors.currentStock = 'La cantidad debe ser un número válido.';
  } else if (Number(productData.currentStock) < 0) {
    errors.currentStock = 'La cantidad no puede ser negativa.';
  }

  if (!productData.minimumStock.trim()) {
    errors.minimumStock = 'El stock mínimo es obligatorio.';
  } else if (isNaN(Number(productData.minimumStock))) {
    errors.minimumStock = 'El stock mínimo debe ser un número válido.';
  } else if (Number(productData.minimumStock) < 0) {
    errors.minimumStock = 'El stock mínimo no puede ser negativo.';
  }

  if (!productData.unit.trim()) {
    errors.unit = 'La unidad de medida es obligatoria.';
  }

  return errors;
}
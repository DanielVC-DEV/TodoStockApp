export function validateDailyCountForm(countData) {
  const errors = {};

  if (!countData.productId) {
    errors.productId = 'Debes seleccionar un producto.';
  }

  if (!countData.countedStock.trim()) {
    errors.countedStock = 'Debes ingresar la cantidad contada.';
  } else if (isNaN(Number(countData.countedStock))) {
    errors.countedStock = 'La cantidad contada debe ser un número válido.';
  } else if (Number(countData.countedStock) < 0) {
    errors.countedStock = 'La cantidad contada no puede ser negativa.';
  }

  return errors;
}
export function validateMovementForm(movementData) {
  const errors = {};

  if (!movementData.productId) {
    errors.productId = 'Debes seleccionar un producto.';
  }

  if (!movementData.type) {
    errors.type = 'Debes seleccionar el tipo de movimiento.';
  }

  if (!movementData.quantity.trim()) {
    errors.quantity = 'La cantidad es obligatoria.';
  } else if (isNaN(Number(movementData.quantity))) {
    errors.quantity = 'La cantidad debe ser un número válido.';
  } else if (Number(movementData.quantity) <= 0) {
    errors.quantity = 'La cantidad debe ser mayor a 0.';
  }

  if (!movementData.reason.trim()) {
    errors.reason = 'El motivo del movimiento es obligatorio.';
  }

  return errors;
}
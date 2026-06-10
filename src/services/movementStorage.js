import AsyncStorage from '@react-native-async-storage/async-storage';

const MOVEMENTS_STORAGE_KEY = '@TodoStock:movements';

export async function saveMovements(movements) {
  try {
    const movementsAsText = JSON.stringify(movements);
    await AsyncStorage.setItem(MOVEMENTS_STORAGE_KEY, movementsAsText);
  } catch (error) {
    console.log('Error al guardar movimientos:', error);
    throw new Error('No se pudieron guardar los movimientos.');
  }
}

export async function loadMovements() {
  try {
    const storedMovements = await AsyncStorage.getItem(MOVEMENTS_STORAGE_KEY);

    if (storedMovements === null) {
      return [];
    }

    return JSON.parse(storedMovements);
  } catch (error) {
    console.log('Error al cargar movimientos:', error);
    throw new Error('No se pudieron cargar los movimientos.');
  }
}
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRODUCTS_STORAGE_KEY = '@TodoStock:products';

export async function saveProducts(products) {
  try {
    const productsAsText = JSON.stringify(products);
    await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, productsAsText);
  } catch (error) {
    console.log('Error al guardar productos:', error);
    throw new Error('No se pudieron guardar los productos.');
  }
}

export async function loadProducts() {
  try {
    const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);

    if (storedProducts === null) {
      return [];
    }

    return JSON.parse(storedProducts);
  } catch (error) {
    console.log('Error al cargar productos:', error);
    throw new Error('No se pudieron cargar los productos.');
  }
}
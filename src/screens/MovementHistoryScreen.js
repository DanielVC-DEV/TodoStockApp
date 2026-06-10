import { ScrollView, StyleSheet, Text, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import COLORS from '../constants/colors';

export default function MovementHistoryScreen({ movements, goToScreen }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Historial</Text>

      <Text style={styles.description}>
        Registro de entradas y salidas realizadas en el inventario.
      </Text>

      {movements.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin movimientos registrados</Text>
          <Text style={styles.emptyText}>
            Cuando registres entradas o salidas de stock, aparecerán en esta
            sección.
          </Text>
        </View>
      ) : (
        movements.map((movement) => (
          <View key={movement.id} style={styles.movementCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.productName}>{movement.productName}</Text>

              <Text
                style={[
                  styles.badge,
                  movement.type === 'entrada'
                    ? styles.entryBadge
                    : styles.exitBadge,
                ]}
              >
                {movement.type === 'entrada' ? 'Entrada' : 'Salida'}
              </Text>
            </View>

            <Text style={styles.text}>
              Cantidad: {movement.quantity}
            </Text>

            <Text style={styles.text}>
              Motivo: {movement.reason}
            </Text>

            <Text style={styles.date}>
              Fecha: {movement.createdAt} - {movement.createdTime}
            </Text>
          </View>
        ))
      )}

      <CustomButton
        title="Registrar movimiento"
        onPress={() => goToScreen('stockMovement')}
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
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
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
  movementCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  badge: {
    color: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
  },
  entryBadge: {
    backgroundColor: COLORS.success,
  },
  exitBadge: {
    backgroundColor: COLORS.danger,
  },
  text: {
    fontSize: 15,
    color: COLORS.textMedium,
    marginBottom: 5,
  },
  date: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 8,
  },
});
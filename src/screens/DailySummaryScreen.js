import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import COLORS from '../constants/colors';

export default function DailySummaryScreen({
  products,
  movements,
  goToScreen,
}) {
  const today = new Date().toLocaleDateString('es-CL');

  const todayMovements = useMemo(() => {
    return movements.filter((movement) => movement.createdAt === today);
  }, [movements, today]);

  const todayEntries = todayMovements.filter(
    (movement) => movement.type === 'entrada'
  );

  const todayExits = todayMovements.filter(
    (movement) => movement.type === 'salida'
  );

  const todayCounts = todayMovements.filter(
    (movement) => movement.type === 'conteo_cierre'
  );

  const lowStockProducts = products.filter(
    (product) => product.currentStock <= product.minimumStock
  );

  const totalEntryQuantity = todayEntries.reduce(
    (total, movement) => total + movement.quantity,
    0
  );

  const totalExitQuantity = todayExits.reduce(
    (total, movement) => total + movement.quantity,
    0
  );

  const totalCountOutput = todayCounts.reduce((total, movement) => {
    if (movement.difference < 0) {
      return total + Math.abs(movement.difference);
    }

    return total;
  }, 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Resumen del día</Text>

      <Text style={styles.description}>
        Vista rápida de los movimientos registrados hoy en el inventario.
      </Text>

      <View style={styles.dateBox}>
        <Text style={styles.dateLabel}>Fecha</Text>
        <Text style={styles.dateText}>{today}</Text>
      </View>

      <View style={styles.grid}>
        <SummaryCard
          title="Movimientos hoy"
          value={todayMovements.length}
          description="Total de registros del día"
        />

        <SummaryCard
          title="Entradas"
          value={todayEntries.length}
          description={`Cantidad ingresada: ${totalEntryQuantity}`}
          type="success"
        />

        <SummaryCard
          title="Salidas"
          value={todayExits.length}
          description={`Cantidad retirada: ${totalExitQuantity}`}
          type="danger"
        />

        <SummaryCard
          title="Conteos"
          value={todayCounts.length}
          description={`Salida calculada: ${totalCountOutput}`}
          type="warning"
        />

        <SummaryCard
          title="Bajo stock"
          value={lowStockProducts.length}
          description="Productos que necesitan revisión"
          type="danger"
        />

        <SummaryCard
          title="Productos"
          value={products.length}
          description="Total registrados"
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Lectura del resumen</Text>

        <Text style={styles.infoText}>
          Las salidas manuales muestran retiros registrados directamente. Los
          conteos de cierre muestran salidas calculadas según el stock físico
          contado al final del día.
        </Text>
      </View>

      <CustomButton
        title="Ver historial completo"
        onPress={() => goToScreen('movementHistory')}
      />

      <CustomButton
        title="Ir al inventario"
        variant="secondary"
        onPress={() => goToScreen('inventory')}
      />

      <CustomButton
        title="Volver al inicio"
        variant="secondary"
        onPress={() => goToScreen('home')}
      />
    </ScrollView>
  );
}

function SummaryCard({ title, value, description, type = 'info' }) {
  const cardStyle = getCardStyle(type);
  const valueStyle = getValueStyle(type);

  return (
    <View style={[styles.summaryCard, cardStyle]}>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={[styles.summaryValue, valueStyle]}>{value}</Text>
      <Text style={styles.summaryDescription}>{description}</Text>
    </View>
  );
}

function getCardStyle(type) {
  if (type === 'success') {
    return {
      borderColor: COLORS.success,
      backgroundColor: COLORS.successLight,
    };
  }

  if (type === 'danger') {
    return {
      borderColor: COLORS.danger,
      backgroundColor: COLORS.dangerLight,
    };
  }

  if (type === 'warning') {
    return {
      borderColor: COLORS.warning,
      backgroundColor: COLORS.warningLight,
    };
  }

  return {
    borderColor: '#E2E8F0',
    backgroundColor: COLORS.white,
  };
}

function getValueStyle(type) {
  if (type === 'success') {
    return {
      color: COLORS.successDark,
    };
  }

  if (type === 'danger') {
    return {
      color: COLORS.dangerDark,
    };
  }

  if (type === 'warning') {
    return {
      color: COLORS.warningDark,
    };
  }

  return {
    color: COLORS.primary,
  };
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
    marginBottom: 18,
  },
  dateBox: {
    backgroundColor: COLORS.infoLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },
  dateLabel: {
    fontSize: 13,
    color: COLORS.infoText,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    color: COLORS.infoText,
    fontWeight: 'bold',
  },
  grid: {
    gap: 12,
    marginBottom: 18,
  },
  summaryCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 15,
    color: COLORS.textMedium,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryDescription: {
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 21,
  },
});
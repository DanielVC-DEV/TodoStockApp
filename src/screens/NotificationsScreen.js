import { ScrollView, StyleSheet, Text, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import COLORS from '../constants/colors';

export default function NotificationsScreen({ products, goToScreen }) {
  const outOfStockProducts = products.filter(
    (product) => product.currentStock === 0
  );

  const lowStockProducts = products.filter(
    (product) =>
      product.currentStock > 0 && product.currentStock <= product.minimumStock
  );

  const totalNotifications =
    outOfStockProducts.length + lowStockProducts.length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Notificaciones</Text>

      <Text style={styles.description}>
        Aquí se muestran las alertas importantes del inventario, como productos
        sin stock o con bajo stock.
      </Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Alertas activas</Text>
        <Text style={styles.summaryNumber}>{totalNotifications}</Text>
        <Text style={styles.summaryText}>
          Notificaciones que requieren revisión.
        </Text>
      </View>

      {totalNotifications === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin notificaciones</Text>

          <Text style={styles.emptyText}>
            No hay productos sin stock ni productos con bajo stock por el
            momento.
          </Text>
        </View>
      ) : (
        <>
          {outOfStockProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Productos sin stock</Text>

              {outOfStockProducts.map((product) => (
                <NotificationCard
                  key={product.id}
                  product={product}
                  type="danger"
                  message="Este producto está en 0 y necesita reposición."
                />
              ))}
            </View>
          )}

          {lowStockProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Productos con bajo stock</Text>

              {lowStockProducts.map((product) => (
                <NotificationCard
                  key={product.id}
                  product={product}
                  type="warning"
                  message="Este producto está igual o bajo el stock mínimo."
                />
              ))}
            </View>
          )}
        </>
      )}

      <CustomButton
        title="Ir al inventario"
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

function NotificationCard({ product, type, message }) {
  const cardStyle = type === 'danger' ? styles.dangerCard : styles.warningCard;
  const badgeStyle =
    type === 'danger' ? styles.dangerBadge : styles.warningBadge;
  const badgeText = type === 'danger' ? 'Sin stock' : 'Bajo stock';

  return (
    <View style={[styles.notificationCard, cardStyle]}>
      <View style={styles.cardHeader}>
        <Text style={styles.productName}>{product.name}</Text>

        <View style={[styles.badge, badgeStyle]}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      </View>

      <Text style={styles.productText}>
        Stock actual: {product.currentStock} {product.unit}
      </Text>

      <Text style={styles.productText}>
        Stock mínimo: {product.minimumStock} {product.unit}
      </Text>

      <Text style={styles.messageText}>{message}</Text>
    </View>
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
    marginBottom: 18,
  },
  summaryBox: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: COLORS.textMedium,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  summaryNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.textMedium,
    marginTop: 4,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  notificationCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
  },
  dangerCard: {
    backgroundColor: COLORS.dangerLight,
    borderColor: COLORS.danger,
  },
  warningCard: {
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  productName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dangerBadge: {
    backgroundColor: COLORS.danger,
  },
  warningBadge: {
    backgroundColor: COLORS.warning,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  productText: {
    fontSize: 15,
    color: COLORS.textMedium,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: 'bold',
    marginTop: 6,
  },
});
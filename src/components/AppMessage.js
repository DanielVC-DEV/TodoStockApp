import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import COLORS from '../constants/colors';

export default function AppMessage({ message, onClose }) {
  if (!message) {
    return null;
  }

  const stylesByType = getStylesByType(message.type);

  return (
    <View style={[styles.container, stylesByType.container]}>
      <View style={[styles.iconCircle, stylesByType.iconCircle]}>
        <Text style={styles.icon}>{stylesByType.icon}</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, stylesByType.title]}>
          {message.title}
        </Text>

        <Text style={[styles.description, stylesByType.description]}>
          {message.description}
        </Text>
      </View>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={[styles.closeText, stylesByType.title]}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

function getStylesByType(type) {
  if (type === 'success') {
    return {
      icon: '✓',
      container: {
        backgroundColor: COLORS.successLight,
        borderColor: COLORS.success,
      },
      iconCircle: {
        backgroundColor: COLORS.success,
      },
      title: {
        color: COLORS.successDark,
      },
      description: {
        color: COLORS.successDark,
      },
    };
  }

  if (type === 'error') {
    return {
      icon: '✕',
      container: {
        backgroundColor: COLORS.dangerLight,
        borderColor: COLORS.danger,
      },
      iconCircle: {
        backgroundColor: COLORS.danger,
      },
      title: {
        color: COLORS.dangerDark,
      },
      description: {
        color: COLORS.dangerDark,
      },
    };
  }

  if (type === 'warning') {
    return {
      icon: '!',
      container: {
        backgroundColor: COLORS.warningLight,
        borderColor: COLORS.warning,
      },
      iconCircle: {
        backgroundColor: COLORS.warning,
      },
      title: {
        color: COLORS.warningDark,
      },
      description: {
        color: COLORS.warningDark,
      },
    };
  }

  return {
    icon: 'i',
    container: {
      backgroundColor: COLORS.infoLight,
      borderColor: COLORS.primary,
    },
    iconCircle: {
      backgroundColor: COLORS.primary,
    },
    title: {
      color: COLORS.infoText,
    },
    description: {
      color: COLORS.infoText,
    },
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 45,
    left: 16,
    right: 16,
    zIndex: 100,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    paddingLeft: 10,
    paddingVertical: 4,
  },
  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
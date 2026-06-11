import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import COLORS from '../constants/colors';

export default function AppMessage({
  visible,
  type = 'info',
  title,
  message,
  onClose,
}) {
  if (!visible) {
    return null;
  }

  const stylesByType = getStylesByType(type);

  return (
    <View style={[styles.container, stylesByType.container]}>
      <View style={[styles.iconBox, stylesByType.iconBox]}>
        <Text style={styles.iconText}>{getIcon(type)}</Text>
      </View>

      <View style={styles.textBox}>
        <Text style={[styles.title, stylesByType.title]}>
          {title || 'Aviso'}
        </Text>

        {message ? (
          <Text style={[styles.message, stylesByType.message]}>
            {message}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={[styles.closeText, stylesByType.title]}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

function getIcon(type) {
  if (type === 'success') {
    return '✓';
  }

  if (type === 'error') {
    return '!';
  }

  if (type === 'warning') {
    return '!';
  }

  return 'i';
}

function getStylesByType(type) {
  if (type === 'success') {
    return {
      container: {
        backgroundColor: COLORS.successLight,
        borderColor: COLORS.success,
      },
      iconBox: {
        backgroundColor: COLORS.success,
      },
      title: {
        color: COLORS.successDark,
      },
      message: {
        color: COLORS.successDark,
      },
    };
  }

  if (type === 'error') {
    return {
      container: {
        backgroundColor: COLORS.dangerLight,
        borderColor: COLORS.danger,
      },
      iconBox: {
        backgroundColor: COLORS.danger,
      },
      title: {
        color: COLORS.dangerDark,
      },
      message: {
        color: COLORS.dangerDark,
      },
    };
  }

  if (type === 'warning') {
    return {
      container: {
        backgroundColor: COLORS.warningLight,
        borderColor: COLORS.warning,
      },
      iconBox: {
        backgroundColor: COLORS.warning,
      },
      title: {
        color: COLORS.warningDark,
      },
      message: {
        color: COLORS.warningDark,
      },
    };
  }

  return {
    container: {
      backgroundColor: COLORS.infoLight,
      borderColor: COLORS.info,
    },
    iconBox: {
      backgroundColor: COLORS.info,
    },
    title: {
      color: COLORS.infoText,
    },
    message: {
      color: COLORS.infoText,
    },
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 18,
    right: 18,
    zIndex: 999,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    paddingLeft: 10,
    paddingVertical: 4,
  },
  closeText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import COLORS from '../constants/colors';

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}) {
  const buttonStyle = getButtonStyle(variant, disabled);
  const textStyle = getTextStyle(variant, disabled);

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

function getButtonStyle(variant, disabled) {
  if (disabled) {
    return {
      backgroundColor: COLORS.border,
      borderColor: COLORS.border,
    };
  }

  if (variant === 'secondary') {
    return {
      backgroundColor: COLORS.secondaryLight,
      borderColor: COLORS.secondary,
    };
  }

  if (variant === 'danger') {
    return {
      backgroundColor: COLORS.danger,
      borderColor: COLORS.danger,
    };
  }

  if (variant === 'outline') {
    return {
      backgroundColor: COLORS.white,
      borderColor: COLORS.primary,
    };
  }

  return {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  };
}

function getTextStyle(variant, disabled) {
  if (disabled) {
    return {
      color: COLORS.textLight,
    };
  }

  if (variant === 'secondary') {
    return {
      color: COLORS.secondaryDark,
    };
  }

  if (variant === 'outline') {
    return {
      color: COLORS.primary,
    };
  }

  return {
    color: COLORS.white,
  };
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1.5,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
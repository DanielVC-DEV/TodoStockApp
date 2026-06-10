import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import COLORS from '../constants/colors';

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
}) {
  const buttonStyle = getButtonStyle(variant);
  const textStyle = getTextStyle(variant);

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

function getButtonStyle(variant) {
  if (variant === 'secondary') {
    return styles.secondaryButton;
  }

  if (variant === 'danger') {
    return styles.dangerButton;
  }

  return styles.primaryButton;
}

function getTextStyle(variant) {
  if (variant === 'secondary') {
    return styles.secondaryText;
  }

  return styles.primaryText;
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondaryButton,
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.textDark,
  },
});
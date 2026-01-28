import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

type ButtonType = 'primary' | 'secondary' | 'outline';

interface OtamaButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  loading?: boolean;
  type?: ButtonType;
}

export const OtamaButton: React.FC<OtamaButtonProps> = ({ 
  title, 
  onPress, 
  style, 
  loading, 
  type = 'primary' 
}) => {
  const { colors, spacing, borderRadius, typography, shadows } = useTheme();

  const isPrimary = type === 'primary';
  const isOutline = type === 'outline';

  let backgroundColor = isPrimary ? colors.primary : colors.card;
  let textColor = isPrimary ? '#FDFDFD' : colors.text;
  let borderColor = 'transparent';
  let borderWidth = 0;

  if (isOutline) {
    backgroundColor = 'transparent';
    textColor = colors.primary;
    borderColor = colors.primary;
    borderWidth = 1;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor,
          borderWidth,
          borderRadius: borderRadius.sm,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xxl,
          ...shadows.soft
        },
        style
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[
          styles.text,
          {
            color: textColor,
            fontSize: typography.size.lg,
            fontWeight: typography.weight.bold as TextStyle['fontWeight'],
            fontFamily: typography.fontFamily.bold,
          }
        ]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    // Typography handled dynamically
  },
});

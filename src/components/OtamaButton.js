import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * OtamaButton
 * Custom button component for Otamaker Lite.
 *
 * @param {string} title - Button text
 * @param {function} onPress - Function to call on press
 * @param {object} style - Additional styles
 * @param {boolean} loading - Show loading indicator
 * @param {string} type - 'primary' | 'secondary' | 'outline'
 */
export const OtamaButton = ({ title, onPress, style, loading, type = 'primary' }) => {
    const { colors, spacing, borderRadius, typography, shadows } = useTheme();

    const isPrimary = type === 'primary';
    const isOutline = type === 'outline';

    let backgroundColor = isPrimary ? colors.primary : colors.card;
    let textColor = isPrimary ? '#FFFFFF' : colors.text;
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
                    ...shadows.soft // Clean shadow
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
                        fontWeight: typography.weight.bold,
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

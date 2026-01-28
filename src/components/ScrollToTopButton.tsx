import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScrollToTopButtonProps {
  onPress: () => void;
  visible: boolean;
  style?: ViewStyle;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ onPress, visible, style }) => {
  const { colors, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      friction: 6,
      tension: 40,
    }).start();
  }, [visible]);

  // Calcula posição: 60px (navbar) + insets.bottom + 4px (gap)
  const bottomPosition = 60 + insets.bottom + 4;

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ scale }] },
        { opacity: scale.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 1] }) },
        style, // style prop do usuário
        { bottom: bottomPosition }, // Garante que bottom não seja sobrescrito
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button, 
          { 
            backgroundColor: colors.surface, // Fundo sólido do card (não transparente)
            borderWidth: 1,
            borderColor: colors.border,
            ...shadows.soft
          }
        ]}
        activeOpacity={0.7}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
           {/* Arrow Up Icon */}
           <Path d="M12 20V4M5 11l7-7 7 7" stroke={colors.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // bottom é definido dinamicamente no componente
    left: '50%', // Centralizado
    marginLeft: -24,
    zIndex: 999,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Android shadow reduzido para mais discreto
  },
});

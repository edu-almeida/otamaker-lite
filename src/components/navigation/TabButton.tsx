import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ANIMATIONS } from '../../constants';

/**
 * Props do TabButton
 */
export interface TabButtonProps {
  accessibilityState?: { selected?: boolean };
  children?: React.ReactNode;
  onPress: () => void;
  /** Função que renderiza o ícone da aba */
  icon: (props: { color: string; focused: boolean }) => React.ReactNode;
  /** Texto que aparece quando a aba está selecionada */
  label: string;
  /** Se esta aba está atualmente selecionada */
  isFocused: boolean;
}

/**
 * TabButton - Botão individual de uma aba.
 * 
 * Animações:
 * - Quando selecionada: mostra o label com fade-in
 * - Quando deselecionada: esconde o label
 */
export const TabButton: React.FC<TabButtonProps> = ({ 
  onPress, 
  icon, 
  label, 
  isFocused 
}) => {
  const { colors } = useTheme();
  
  // Valor animado para controlar a opacidade do label
  // 0 = invisível, 1 = visível
  const animation = useRef(new Animated.Value(0)).current;

  // Sempre que o foco mudar, anima a opacidade
  useEffect(() => {
    Animated.timing(animation, {
      toValue: isFocused ? 1 : 0,
      duration: ANIMATIONS.TAB_TRANSITION_DURATION,
      useNativeDriver: true, // Usa GPU para performance
      easing: Easing.out(Easing.cubic), // Desacelera no final
    }).start();
  }, [isFocused, animation]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1} // Sem feedback visual de toque
      accessibilityRole="button"
      style={styles.tabButton}
    >
      <View style={styles.tabContent}>
        {/* Ícone - sempre visível, muda cor baseado no foco */}
        {icon({
          color: isFocused ? colors.primary : colors.textSecondary,
          focused: isFocused
        })}

        {/* Label - só aparece quando focado, com animação de fade */}
        {isFocused && (
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.tabLabel,
              {
                color: colors.primary,
                opacity: animation, // Opacidade animada
              }
            ]}
          >
            {label}
          </Animated.Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 1, // Acima do slider animado
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  }
});

import React, { useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { TabButton } from './TabButton';
import { NAVIGATION } from '../../constants';
import { 
  HomeIcon, 
  SearchIcon, 
  LibraryIcon 
} from '..'; // Import icons directly from parent index

// Calcula larguras baseado na tela
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_WIDTH = SCREEN_WIDTH / NAVIGATION.TAB_COUNT;
const SLIDER_WIDTH = TAB_WIDTH - NAVIGATION.SLIDER_PADDING;

// Map routes to indices and icons
const TAB_CONFIG = [
  { name: 'HomeTab', label: 'Home', icon: HomeIcon },
  { name: 'AnimeCatalogTab', label: 'Catalog', icon: SearchIcon },
  { name: 'OtamaLibraryTab', label: 'Biblioteca', icon: LibraryIcon },
];

interface GlobalTabBarProps {
  currentRouteName?: string;
  onNavigate: (route: string) => void;
}

/**
 * BubbleTabBar - Barra de abas customizada e global.
 * 
 * Agora aceita props simplificadas para funcionar fora do navigator.
 */
export const BubbleTabBar: React.FC<GlobalTabBarProps> = ({ 
  currentRouteName,
  onNavigate
}) => {
  const { colors, shadows, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();

  // Determina o índice ativo
  const activeIndex = useMemo(() => {
    // Se a rota atual não estiver na config (ex: Details), retorna -1
    return TAB_CONFIG.findIndex(tab => tab.name === currentRouteName);
  }, [currentRouteName]);

  // Valor animado para posição X do slider
  const translateValue = useRef(new Animated.Value(0)).current;
  // Opacidade do slider (esconde se nenhum selecionado)
  const opacityValue = useRef(new Animated.Value(0)).current; // Começa escondido por padrão

  // Anima o slider
  useEffect(() => {
    if (activeIndex >= 0) {
      // Mostra e move para a posicão
      Animated.parallel([
        Animated.spring(translateValue, {
          toValue: activeIndex * TAB_WIDTH,
          velocity: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Esconde
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [activeIndex, translateValue, opacityValue]);

  return (
    <View style={[
      styles.tabBarContainer,
      {
        backgroundColor: colors.background,
        paddingBottom: insets.bottom, 
        height: NAVIGATION.TAB_BAR_HEIGHT + insets.bottom,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }
    ]}>
      {/* Slider animado */}
      <Animated.View style={[
        styles.slider,
        {
          width: SLIDER_WIDTH,
          height: 40,
          backgroundColor: colors.primary + '20',
          borderRadius: borderRadius.round,
          transform: [{ translateX: translateValue }],
          left: (TAB_WIDTH - SLIDER_WIDTH) / 2,
          opacity: opacityValue,
        }
      ]} />

      {/* Renderiza abas */}
      {TAB_CONFIG.map((tab, index) => {
        const isFocused = activeIndex === index;
        
        return (
          <TabButton
            key={tab.name}
            onPress={() => onNavigate(tab.name)}
            isFocused={isFocused}
            label={tab.label}
            icon={({ color, focused }) => {
              const Icon = tab.icon;
              return <Icon color={color} filled={focused} />;
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  slider: {
    position: 'absolute',
    top: 10,
    zIndex: 0,
  },
});

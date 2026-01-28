/**
 * AnimatedBrokenHeart - Ícone de coração animado com efeito de "quebrar".
 * 
 * Animações:
 * - Quando curtido: coração se une com efeito elástico + sparkles
 * - Quando descurtido: coração se "quebra" com bounce
 * - Pulse: escala aumenta/diminui no clique
 * 
 * O coração é dividido em duas metades (SVG paths) que se movem
 * independentemente para criar o efeito de quebra.
 */
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { range } from '../utils';

// Cria versões animadas dos componentes SVG
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

/**
 * Props do Sparkles
 */
interface SparklesProps {
  /** Se as partículas devem ser mostradas e animadas */
  active: boolean;
}

/**
 * Sparkles - Partículas que explodem do centro quando o coração é curtido.
 * 
 * Cria 6 partículas distribuídas em círculo (60° cada).
 * As partículas:
 * - Saem do centro em direção às bordas
 * - Diminuem de tamanho enquanto se movem
 * - Desaparecem com fade-out
 */
const Sparkles: React.FC<SparklesProps> = ({ active }) => {
  const { colors } = useTheme();
  
  // Cria 6 partículas distribuídas em círculo
  // Cada partícula tem posição X/Y calculada por trigonometria
  const particles = range(6).map((_, i) => {
    const angle = (i * 60) * (Math.PI / 180); // 0°, 60°, 120°, 180°, 240°, 300°
    const radius = 25; // Distância final do centro
    return {
      x: Math.cos(angle) * radius, // Posição X final
      y: Math.sin(angle) * radius, // Posição Y final
      anim: useRef(new Animated.Value(0)).current, // Progresso da animação
    };
  });

  // Anima as partículas quando ativado
  useEffect(() => {
    if (active) {
      // Reset todas as animações
      particles.forEach(p => p.anim.setValue(0));
      
      // Anima com stagger (delay entre cada partícula)
      Animated.stagger(50, particles.map(p =>
        Animated.timing(p.anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp), // Desacelera exponencialmente
        })
      )).start();
    }
  }, [active]);

  // Não renderiza se inativo
  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => {
        // Interpola posição do centro para a borda
        const translateX = p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, p.x] });
        const translateY = p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, p.y] });
        
        // Fade out no final
        const opacity = p.anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
        
        // Diminui de tamanho
        const scale = p.anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.primary,
              transform: [{ translateX }, { translateY }, { scale }],
              opacity,
              marginLeft: -3, // Centraliza
              marginTop: -3,
            }}
          />
        );
      })}
    </View>
  );
};

/**
 * Props do AnimatedBrokenHeart
 */
interface AnimatedBrokenHeartProps {
  /** Se está curtido (coração cheio) ou não (coração quebrado) */
  isLiked: boolean;
  /** Callback quando clicado */
  onToggle: () => void;
  /** Tamanho em pixels (padrão: 28) */
  size?: number;
  /** Cor quando curtido */
  activeColor: string;
  /** Cor quando não curtido */
  inactiveColor: string;
}

/**
 * AnimatedBrokenHeart - Componente principal.
 * 
 * Estrutura SVG:
 * - O coração é dividido em metade esquerda (pLeft) e direita (pRight)
 * - Cada metade tem animações independentes de rotação e translação
 * - Quando progress = 0: metades separadas (quebrado)
 * - Quando progress = 1: metades unidas (inteiro)
 */
export const AnimatedBrokenHeart: React.FC<AnimatedBrokenHeartProps> = ({
  isLiked,
  onToggle,
  size = 28,
  activeColor,
  inactiveColor
}) => {
  // Progresso da animação quebrado/inteiro (0 a 1)
  const progress = useRef(new Animated.Value(isLiked ? 1 : 0)).current;
  
  // Animação de pulse (escala)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Controla exibição dos sparkles
  const [triggerSparkles, setTriggerSparkles] = useState(false);

  // Anima quando o estado de curtida muda
  useEffect(() => {
    if (isLiked) {
      // Curtindo: une o coração com sparkles
      setTriggerSparkles(true);
      Animated.parallel([
        // Anima progress para 1 (coração inteiro)
        Animated.timing(progress, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false, // Cor não suporta native driver
          easing: Easing.elastic(1.2), // Efeito "bounce"
        }),
        // Pulse: cresce e volta
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        ])
      ]).start();
    } else {
      // Descurtindo: quebra o coração
      setTriggerSparkles(false);
      Animated.timing(progress, {
        toValue: 0, // Coração quebrado
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.bounce),
      }).start();
    }
  }, [isLiked, progress, pulseAnim]);

  // SVG Paths das metades do coração
  const pLeft = "M12 21.35 C5.4 15.36 2 12.28 2 8.5 C2 5.42 4.42 3 7.5 3 C9.24 3 10.91 3.81 12 5.09 L12 21.35 Z";
  const pRight = "M12 21.35 L12 5.09 C13.09 3.81 14.76 3 16.5 3 C19.58 3 22 5.42 22 8.5 C22 12.28 18.6 15.36 12 21.35 Z";

  // Interpolações para metade esquerda
  const leftRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['-20deg', '0deg'] });
  const leftX = progress.interpolate({ inputRange: [0, 1], outputRange: [-4, 0] });
  const leftY = progress.interpolate({ inputRange: [0, 1], outputRange: [2, 0] });

  // Interpolações para metade direita
  const rightRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['20deg', '0deg'] });
  const rightX = progress.interpolate({ inputRange: [0, 1], outputRange: [4, 0] });
  const rightY = progress.interpolate({ inputRange: [0, 1], outputRange: [-2, 0] });

  // Interpolações de cor
  const strokeColor = progress.interpolate({ inputRange: [0, 1], outputRange: [inactiveColor, activeColor] });
  const fillColor = progress.interpolate({ inputRange: [0, 0.8, 1], outputRange: ["transparent", "transparent", activeColor] });

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{ padding: 4 }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* Container com animação de pulse */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            {/* Metade esquerda do coração */}
            {/* @ts-ignore - AnimatedG transform typing issue with react-native-svg */}
            <AnimatedG style={{ transform: [{ translateX: leftX }, { translateY: leftY }, { rotate: leftRotate }] }} origin="12, 12">
              <AnimatedPath d={pLeft} fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
            </AnimatedG>
            {/* Metade direita do coração */}
            {/* @ts-ignore - AnimatedG transform typing issue with react-native-svg */}
            <AnimatedG style={{ transform: [{ translateX: rightX }, { translateY: rightY }, { rotate: rightRotate }] }} origin="12, 12">
              <AnimatedPath d={pRight} fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
            </AnimatedG>
          </Svg>
        </Animated.View>
        
        {/* Sparkles por cima do coração */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Sparkles active={triggerSparkles} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

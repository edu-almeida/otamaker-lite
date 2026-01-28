/**
 * AnimatedWaterfallCard - Efeito cachoeira para cards.
 * Sombra só aparece após TODAS as animações terminarem.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

interface AnimatedWaterfallCardProps {
  children: React.ReactElement<{ showShadow?: boolean }>;
  index: number;
  duration?: number;
  staggerDelay?: number;
  translateYStart?: number;
  maxStaggerIndex?: number;
}

export const AnimatedWaterfallCard: React.FC<AnimatedWaterfallCardProps> = ({
  children,
  index,
  duration = 400,
  staggerDelay = 50, // Aumentado levemente para ser mais perceptível
  translateYStart = 40,
}) => {
  const translateY = useRef(new Animated.Value(translateYStart)).current;
  const opacity = useRef(new Animated.Value(0)).current; 
  // Removido useIsFocused para garantir animação ao montar (scroll infinito)
  
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    
    hasAnimated.current = true;

    // Resetar index para efeito cascata em lotes (Infinite Scroll)
    // A cada 10 itens, o delay reseta.
    // Index 0 -> 0ms
    // Index 16 -> 6 * 50 = 300ms (Cascatas em chunks)
    const effectiveIndex = index % 10;
    const delay = effectiveIndex * staggerDelay;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();

  }, []); // Rodar apenas na montagem

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};


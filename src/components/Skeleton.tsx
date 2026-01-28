import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, ViewStyle, DimensionValue } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface SkeletonProps {
  width: DimensionValue;
  height: number;
  style?: ViewStyle;
  borderRadius?: number;
}

// Basic pulsing block
export const Skeleton: React.FC<SkeletonProps> = ({ width: skeletonWidth, height, style, borderRadius }) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: skeletonWidth,
          height,
          backgroundColor: colors.border,
          opacity,
          borderRadius: borderRadius || 4,
        },
        style,
      ]}
    />
  );
};

// Full Page Skeleton Layout mimicking our Grid
export const ScreenSkeleton: React.FC = () => {
  const { spacing } = useTheme();
  const CARD_WIDTH = (width - 48) / 2;

  return (
    <View style={styles.container}>
      {/* Header / Search Bar Placeholder */}
      <View style={{ margin: 16 }}>
        <Skeleton width="100%" height={50} borderRadius={12} />
      </View>

      {/* Grid Content */}
      <View style={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={{ marginBottom: 16 }}>
            <Skeleton width={CARD_WIDTH} height={CARD_WIDTH * 1.5} borderRadius={8} />
            <View style={{ marginTop: 8 }}>
              <Skeleton width={CARD_WIDTH * 0.8} height={16} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  }
});

// Skeleton específico para o Sticker Card (Feed)
export const StickerCardSkeleton: React.FC = () => {
  const { colors, borderRadius } = useTheme();
  
  return (
    <View style={{ 
      padding: 12, 
      marginBottom: 12, 
      backgroundColor: colors.surface, 
      borderRadius: 16, // borderRadius.lg
      borderWidth: 1,
      borderColor: colors.border
    }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Skeleton width={32} height={32} borderRadius={16} />
            <Skeleton width={100} height={14} borderRadius={4} />
         </View>
         <Skeleton width={80} height={24} borderRadius={6} />
      </View>

      {/* Body */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
         <Skeleton width={68} height={68} borderRadius={8} />
         <View style={{ flex: 1, gap: 8 }}>
            <Skeleton width="60%" height={16} borderRadius={4} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
               <Skeleton width={44} height={44} borderRadius={6} />
               <Skeleton width={44} height={44} borderRadius={6} />
               <Skeleton width={44} height={44} borderRadius={6} />
            </View>
         </View>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
         <View style={{ flexDirection: 'row', gap: 12 }}>
            <Skeleton width={60} height={20} borderRadius={4} />
            <Skeleton width={40} height={20} borderRadius={4} />
         </View>
         <View style={{ flexDirection: 'row', gap: 8 }}>
            <Skeleton width={32} height={32} borderRadius={10} />
            <Skeleton width={32} height={32} borderRadius={10} />
         </View>
      </View>
    </View>
  );
};

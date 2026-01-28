import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ImageSourcePropType, TextStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SHADOWS } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMNS_COUNT = 3;
const SIDEBAR_WIDTH = 30;
// O espaçamento horizontal e vertical entre cards deve ser igual ao padding do container
const CONTAINER_PADDING = 12; // Padding do container para a borda
const SPACING_GUTTER = CONTAINER_PADDING; // Mesmo valor para consistência

// Cálculo: largura disponível - (espaçamentos entre colunas) / número de colunas
// Largura disponível = SCREEN_WIDTH - SIDEBAR_WIDTH - (CONTAINER_PADDING * 2)
// Espaçamentos entre colunas = SPACING_GUTTER * (COLUMNS_COUNT - 1)
const AVAILABLE_WIDTH = SCREEN_WIDTH - SIDEBAR_WIDTH - (CONTAINER_PADDING * 2);
const ITEM_WIDTH = (AVAILABLE_WIDTH - (SPACING_GUTTER * (COLUMNS_COUNT - 1))) / COLUMNS_COUNT;

interface AnimeCoverCardProps {
  title: string;
  image?: ImageSourcePropType;
  onPress?: () => void;
  showShadow?: boolean;
}

export const AnimeCoverCard: React.FC<AnimeCoverCardProps> = ({ title, image, onPress, showShadow = false }) => {
  const { colors, borderRadius, typography } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.surface,
          borderRadius: borderRadius.lg,
          ...(showShadow ? SHADOWS.card : {})
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.cardImageWrapper, { borderTopLeftRadius: borderRadius.lg, borderTopRightRadius: borderRadius.lg }]}>
        {image ? (
          <Image
            source={image}
            style={[styles.cardImage, { backgroundColor: colors.border }]}
          />
        ) : (
          <View style={[styles.cardImage, { backgroundColor: colors.border }]} />
        )}
      </View>
      <View style={[
        styles.cardFooter,
        {
          backgroundColor: colors.surface,
          borderBottomLeftRadius: borderRadius.lg,
          borderBottomRightRadius: borderRadius.lg
        }
      ]}>
        <Text numberOfLines={2} style={[
          styles.cardTitle,
          {
            color: colors.textSecondary,
            fontWeight: typography.weight.medium as TextStyle['fontWeight'],
            fontSize: typography.size.xs
          }
        ]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: ITEM_WIDTH,
    marginBottom: 0,
  },
  cardImageWrapper: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3,
    overflow: 'hidden',
  },
  cardImage: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3,
    resizeMode: 'cover',
  },
  cardFooter: {
    paddingHorizontal: 4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    textAlign: 'center',
    lineHeight: 13,
  },
});

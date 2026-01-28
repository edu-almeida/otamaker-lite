import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface NativeAdCardProps {
  id?: string;
}

export const NativeAdCard: React.FC<NativeAdCardProps> = ({ id }) => {
  const { colors, borderRadius, typography, spacing, shadows } = useTheme();

  // Variações de CTA usando as mesmas cores do StickerCard
  const ctaVariations = [
    { text: 'Saber Mais', color: colors.primary, textColor: '#FFFFFF' },
    { text: 'Baixar Agora', color: colors.secondary, textColor: '#000000' },
    { text: 'Instalar', color: colors.primary, textColor: '#FFFFFF' }, // Mesma cor do Telegram/WhatsApp no StickerCard
    { text: 'Abrir', color: colors.primary, textColor: '#FFFFFF' }, // Mesma cor do Telegram/WhatsApp no StickerCard
    { text: 'Ver Oferta', color: colors.primary, textColor: '#FFFFFF' },
  ];

  // Seleciona uma variação aleatória (ou baseada no ID)
  const ctaIndex = id ? parseInt(id.split('-').pop() || '0') % ctaVariations.length : 0;
  const selectedCTA = ctaVariations[ctaIndex];

  // Mock visual de um anúncio nativo para Expo Go / Fallback
  // Em produção com build nativa, isso poderia ser substituído por um wrapper real de Native Advanced Ad
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.surface, // Usa tema
        borderRadius: borderRadius.md, // Usa tema
        borderColor: colors.border, // Usa tema
      }
    ]}>
      {/* Badge de Anúncio */}
      <View style={[styles.adBadge, { backgroundColor: colors.primary }]}>
        <Text style={styles.adBadgeText}>Ad</Text>
      </View>

      {/* Conteúdo do Anúncio (Simulado) */}
      <View style={styles.content}>
        <View style={[styles.iconContainer, { 
          backgroundColor: colors.primary + '20', // Primary com opacidade
          borderRadius: borderRadius.md 
        }]}>
          <Text style={{ fontSize: 24 }}>📣</Text> 
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.headline, { color: colors.text }]}>
            Anúncio Patrocinado {id ? `#${id.split('-').pop()}` : ''}
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={2}>
            Conheça os melhores produtos com ofertas incríveis. Clique para saber mais.
          </Text>
        </View>
      </View>

      {/* Botão de Ação com cor variável */}
      <TouchableOpacity 
        style={[styles.callToAction, { 
          backgroundColor: selectedCTA.color,
          borderRadius: borderRadius.md
        }]}
        onPress={() => console.log('Ad Clicked')}
      >
        <Text style={[styles.ctaText, { color: selectedCTA.textColor }]}>
          {selectedCTA.text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12, // Igual ao StickerCard.cardWrapper
    padding: 12,
    borderWidth: 1,
    overflow: 'hidden',
    // Flat Style - Sem sombras
  },
  adBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderBottomRightRadius: 8,
    zIndex: 1,
  },
  adBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  headline: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  body: {
    fontSize: 12,
    lineHeight: 16,
  },
  callToAction: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

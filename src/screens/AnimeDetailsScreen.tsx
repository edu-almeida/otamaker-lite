/**
 * AnimeDetailsScreen - Tela de detalhes de um anime.
 * 
 * Dois modos:
 * - fromCatalog=true: Card de info do anime + lista de pacotes (já está na seção de pacotes)
 * - fromCatalog=false: Info completa do anime com botão "See Anime Packages"
 */
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { StickerCard, AnimatedWaterfallCard, StickerCardSkeleton, NativeAdCard } from '../components';
import { ANIME_PACKS, MOCK_STICKERS, MOCK_COVERS, getAnimeByTitle } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList, AnimePack } from '../types';
import AdService from '../services/AdService';
import { injectAds } from '../utils';

type AnimeDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'AnimeDetails'>;

/**
 * AnimeFullInfoCard - Tela de info completa do anime (imagem 2 do mockup).
 * Usada quando NÃO vem do catálogo.
 */
interface AnimeFullInfoCardProps {
  title: string;
  description: string;
  image: any;
  onSeePackages: () => void;
  showButton: boolean;
}

const AnimeFullInfoCard: React.FC<AnimeFullInfoCardProps> = ({ 
  title, 
  description, 
  image, 
  onSeePackages,
  showButton 
}) => {
  const { colors, borderRadius, spacing, typography, dark: isDark } = useTheme();

  return (
    <ScrollView 
      style={[styles.fullInfoContainer, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.fullInfoContent}
    >
      {/* Imagem do Anime - Retangular */}
      <View style={[
        styles.fullImageContainer,
        { backgroundColor: colors.border, borderRadius: borderRadius.lg }
      ]}>
        <Image source={image} style={styles.fullImage} resizeMode="cover" />
      </View>

      {/* Título */}
      <Text style={[
        styles.fullTitle,
        { color: colors.text, fontSize: typography.size.xl }
      ]}>
        {title}
      </Text>

      {/* Descrição */}
      <Text style={[
        styles.fullDescription,
        { color: colors.textSecondary, fontSize: typography.size.sm }
      ]}>
        {description}
      </Text>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        <View style={[
          styles.tag, 
          { 
            backgroundColor: isDark ? colors.surface : colors.text, 
            borderColor: isDark ? colors.border : colors.text 
          }
        ]}>
          <Text style={[styles.tagText, { color: isDark ? colors.text : '#FFFFFF' }]}>Release</Text>
        </View>
        <View style={[
          styles.tag, 
          { 
            backgroundColor: isDark ? colors.surface : colors.text, 
            borderColor: isDark ? colors.border : colors.text 
          }
        ]}>
          <Text style={[styles.tagText, { color: isDark ? colors.text : '#FFFFFF' }]}>Seasons</Text>
        </View>
        <View style={[
          styles.tag, 
          { 
            backgroundColor: isDark ? colors.surface : colors.text, 
            borderColor: isDark ? colors.border : colors.text 
          }
        ]}>
          <Text style={[styles.tagText, { color: isDark ? colors.text : '#FFFFFF' }]}>Genres</Text>
        </View>
      </View>

      {/* Botão "See Anime Packages" */}
      {showButton && (
        <TouchableOpacity 
          onPress={onSeePackages}
          style={[styles.packagesButton, { backgroundColor: colors.primary }]}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
            <Path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
              fill="#FFFFFF"
            />
          </Svg>
          <Text style={styles.packagesButtonText}>See Anime Packages</Text>
        </TouchableOpacity>
      )}

      {/* Área de Ads */}
      <View style={[styles.adsPlaceholder, { backgroundColor: colors.border }]}>
        <Text style={[styles.adsText, { color: colors.textSecondary }]}>Ads</Text>
      </View>
    </ScrollView>
  );
};

/**
 * AnimeInfoCard - Card resumido do anime no topo da lista de pacotes (imagem 3).
 * Design: imagem quadrada pequena à esquerda, título e descrição, seta sutil à direita.
 */
interface AnimeInfoCardProps {
  title: string;
  description: string;
  image: any;
  onActionPress: () => void;
}

const AnimeInfoCard: React.FC<AnimeInfoCardProps> = ({ title, description, image, onActionPress }) => {
  const { colors, borderRadius, spacing, typography } = useTheme();

  return (
    <View style={[
      styles.animeInfoCard,
      {
        marginHorizontal: spacing.lg,
        marginTop: 24, // Aumentado (era spacing.sm)
        marginBottom: 32, // Aumentado (era spacing.md)
      }
    ]}>
      <View style={styles.animeInfoContent}>
        {/* Imagem do anime - formato mais quadrado como no mockup */}
        <View style={[
          styles.animeImageContainer,
          { backgroundColor: colors.border, borderRadius: borderRadius.md }
        ]}>
          <Image source={image} style={styles.animeImage} resizeMode="cover" />
        </View>

        {/* Título e descrição - texto preenche área disponível com "..." */}
        <View style={styles.animeTextContainer}>
          <Text 
            style={[styles.animeTitle, { color: colors.text }]} 
            numberOfLines={1}
          >
            {title}
          </Text>
          
          {/* Descrição com ellipsis quando não couber */}
          <Text 
            style={[styles.animeDescription, { color: colors.textSecondary, fontSize: typography.size.sm }]}
            numberOfLines={5}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        </View>

        {/* Botão de seta - circular com cor primária */}
        <TouchableOpacity 
          onPress={onActionPress}
          style={[styles.arrowButton, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
          activeOpacity={0.7}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill={colors.textSecondary}/>
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * StickerPackCard - Card de pacote de stickers.
 */
interface StickerPackCardProps {
  item: AnimePack;
  onSteal: () => void;
  onStickerPress: (liked: boolean, favorited: boolean) => void;
  animeName: string;
}

const StickerPackCard: React.FC<StickerPackCardProps> = ({ item, onSteal, onStickerPress, animeName }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { navigation } = useNavigation<any>() as any;

  return (
    <StickerCard
      packageTitle={item.package || `Pacote de número ${item.id}`}
      makerAccountName={item.author || "Otamaker"}
      makerAvatar={item.image || MOCK_COVERS.avatar}
      mainIcon={item.image || MOCK_COVERS.mainIcon}
      stickers={item.stickers || MOCK_STICKERS.slice(0, 4)}
      totalStickers={(item.stickers?.length || 4) + 22}
      isLiked={isLiked}
      isFavorited={isFavorited}
      onSteal={onSteal}
      onLike={() => setIsLiked(!isLiked)}
      onFavorite={() => setIsFavorited(!isFavorited)}
      onMakerPress={() => navigation.navigate('Profile', { creatorName: item.author || 'Otamaker' })}
      onStickerPress={() => onStickerPress(isLiked, isFavorited)}
      showShadow={true}
    />
  );
};



export const AnimeDetailsScreen: React.FC<AnimeDetailsScreenProps> = ({ route, navigation }) => {
  const { colors, spacing, typography } = useTheme();
  const { animeTitle, fromCatalog = false } = route.params || {};

  // Mostra Interstitial ao abrir o anime (com controle de frequência)
  React.useEffect(() => {
    AdService.showInterstitial();
  }, []);

  // Refs e Estados para Infinite Scroll
  const [rawData, setRawData] = React.useState<AnimePack[]>([]);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  // Encontra dados do anime
  const animeData = getAnimeByTitle(animeTitle || '');
  
  // Mock Base
  const basePacks: AnimePack[] = React.useMemo(() => [
    { ...ANIME_PACKS[0], id: 'pack-1', title: animeTitle || '', package: `${animeTitle} - Pack 1` },
    { ...ANIME_PACKS[1], id: 'pack-2', title: animeTitle || '', package: `${animeTitle} - Pack 2` },
    { ...ANIME_PACKS[2], id: 'pack-3', title: animeTitle || '', package: `${animeTitle} - Pack 3` },
  ], [animeTitle]);

  // Helper para gerar mocks
  const generateBatch = React.useCallback((startIndex: number, count: number = 12) => {
    return Array.from({ length: count }).map((_, i) => ({
      ...basePacks[i % basePacks.length],
      id: `gen-pack-${startIndex + i}`,
      package: `${animeTitle} - Edição Especial #${startIndex + i + 1}`,
    }));
  }, [basePacks, animeTitle]);

  // Carga Inicial
  React.useEffect(() => {
    setRawData(generateBatch(0, 12));
  }, [generateBatch]);

  // Load More
  const handleLoadMore = React.useCallback(() => {
    if (isLoadingMore || rawData.length >= 230) return;
    setIsLoadingMore(true);

    setTimeout(() => {
      setRawData(prev => [...prev, ...generateBatch(prev.length, 12)]);
      setIsLoadingMore(false);
    }, 1000);
  }, [isLoadingMore, rawData.length, generateBatch]);

  // Injetar Ads
  const dataWithAds = React.useMemo(() => injectAds(rawData, 4), [rawData]);

  // Seta do card de info → vai para tela de info completa do anime (fromCatalog: false)
  const handleGoToAnimeInfo = () => {
    navigation.push('AnimeDetails', { 
      animeTitle: animeTitle || '', 
      fromCatalog: false,
      hidePackagesButton: true // New param to hide button when coming from List
    });
  };

  // Botão "See Anime Packages" → vai para lista de pacotes (fromCatalog: true)
  const handleSeePackages = () => {
    navigation.push('AnimeDetails', { animeTitle: animeTitle || '', fromCatalog: true });
  };

  const handleStealPackage = (packId: string) => {
    console.log('Steal package:', packId);
  };

  // Se NÃO veio do catálogo, mostra a tela de info completa (imagem 2)
  if (!fromCatalog) {
    const shouldHideButton = (route.params as any)?.hidePackagesButton;
    
    return (
      <AnimeFullInfoCard
        title={animeTitle || 'Anime'}
        description={animeData?.description || 
          'Lorem ipsum dolor sit amet consectetur. Sed a purus enim tristique...'}
        image={animeData?.image || MOCK_COVERS.animeCover}
        onSeePackages={handleSeePackages}
        showButton={!shouldHideButton}
      />
    );
  }

  // Se veio do catálogo, mostra card de info + lista de pacotes (imagem 3)
  const renderItem = React.useCallback(({ item, index }: any) => {
    // Renderiza Ad
    if ('type' in item && item.type === 'ad') {
      return (
        <View style={{ paddingHorizontal: spacing.lg }}>
          <AnimatedWaterfallCard index={index}>
             <NativeAdCard id={item.id} />
          </AnimatedWaterfallCard>
        </View>
      );
    }

    // Renderiza Pack
    return (
      <View style={{ paddingHorizontal: spacing.lg }}>
        <AnimatedWaterfallCard index={index}>
          <StickerPackCard
            item={item as AnimePack}
            animeName={animeTitle || 'Nome do Anime'}
            onSteal={() => handleStealPackage((item as AnimePack).id)}
            onStickerPress={(liked, favorited) => navigation.navigate('PackDetails', {
              packageId: (item as AnimePack).id,
              packageTitle: (item as AnimePack).package || `Pacote #${(item as AnimePack).id}`,
              animeTitle: animeTitle || '',
              mainIcon: (item as AnimePack).image,
              stickers: (item as AnimePack).stickers || [],
              isLiked: liked,
              isFavorited: favorited,
              hideAnimeName: true
            })}
          />
        </AnimatedWaterfallCard>
      </View>
    );
  }, [spacing.lg, animeTitle, navigation]);

  const renderFooter = React.useCallback(() => {
    if (!isLoadingMore) return <View style={{ height: 20 }} />;
    return (
      <View style={{ paddingVertical: 12, gap: 12, paddingHorizontal: spacing.lg }}>
         <StickerCardSkeleton />
         <StickerCardSkeleton />
      </View>
    );
  }, [isLoadingMore, spacing.lg]);

  // Se NÃO veio do catálogo, mostra a tela de info completa (imagem 2)
  if (!fromCatalog) {
    const shouldHideButton = (route.params as any)?.hidePackagesButton;
    
    return (
      <AnimeFullInfoCard
        title={animeTitle || 'Anime'}
        description={animeData?.description || 
          'Lorem ipsum dolor sit amet consectetur. Sed a purus enim tristique...'}
        image={animeData?.image || MOCK_COVERS.animeCover}
        onSeePackages={handleSeePackages}
        showButton={!shouldHideButton}
      />
    );
  }

  // Se veio do catálogo, mostra card de info + lista de pacotes (imagem 3)
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={dataWithAds}
        keyExtractor={(item) => ('type' in item && item.type === 'ad' ? item.id : (item as AnimePack).id)}
        ListHeaderComponent={
          <AnimeInfoCard
            title={animeTitle || 'Anime'}
            description={animeData?.description || 'Lorem ipsum dolor sit amet consectetur. Sed a purus enim tristique...'}
            image={animeData?.image || MOCK_COVERS.animeCover}
            onActionPress={handleGoToAnimeInfo}
          />
        }
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.6}
        ListFooterComponent={renderFooter}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  // AnimeInfoCard styles (card resumido - imagem 3)
  animeInfoCard: {},
  animeInfoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  animeImageContainer: {
    width: 85,
    height: 120,
    overflow: 'hidden',
    marginRight: 16, // Aumentei um pouco a margem lateral também para respirar
  },
  animeImage: {
    width: '100%',
    height: '100%',
  },
  animeTextContainer: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'flex-start',
    height: 120, // Altura fixa para alinhar com a imagem
    overflow: 'hidden', // Corta se passar
  },
  animeTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4, // Reduzido para caber mais texto (era 12)
  },
  descriptionContainer: {
    position: 'relative',
  },
  animeDescription: {
    lineHeight: 18,
  },
  textFadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  fadeGradient: {
    flex: 1,
    opacity: 0.9,
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  // AnimeFullInfoCard styles (info completa - imagem 2)
  fullInfoContainer: {
    flex: 1,
  },
  fullInfoContent: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  fullImageContainer: {
    width: 120,
    height: 160,
    overflow: 'hidden',
    marginBottom: 20,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  fullTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  fullDescription: {
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
  },
  packagesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 24,
  },
  packagesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  adsPlaceholder: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

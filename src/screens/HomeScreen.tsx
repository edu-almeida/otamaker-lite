/**
 * HomeScreen - Tela inicial com feed de pacotes de stickers.
 * 
 * Exibe uma lista vertical de StickerCards, cada um representando
 * um pacote de stickers disponível.
 * 
 * Funcionalidades:
 * - Lista de pacotes com scroll vertical
 * - Cada card permite curtir (like) e "roubar" (steal) o pacote
 * - Clique no card navega para detalhes do anime
 */
import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StickerCard, AnimatedWaterfallCard } from '../components';
import { ANIME_PACKS, MOCK_STICKERS, MOCK_COVERS } from '../data/mockData';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList, AnimePack } from '../types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

/**
 * Props do StatefulStickerCard
 */
interface StatefulStickerCardProps {
  item: AnimePack;
  onMakerPress: () => void;
  onStickerPress: (liked: boolean, favorited: boolean) => void;
  showShadow?: boolean;
}

/**
 * StatefulStickerCard - Wrapper que adiciona estado de "curtido" ao StickerCard.
 * 
 * O estado de like é local a cada card. Em produção, isso viria de uma API.
 */
const StatefulStickerCard: React.FC<StatefulStickerCardProps> = ({ item, onMakerPress, onStickerPress, showShadow }) => {
  // Estado local de curtida e favorito (em produção viria de uma API)
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <StickerCard
      packageTitle={item.package || item.title}
      makerAccountName="Otamaker" // Mock value as requested
      makerAvatar={MOCK_COVERS.avatar} // Assuming this exists or falls back
      mainIcon={item.image || MOCK_COVERS.mainIcon}
      stickers={item.stickers || MOCK_STICKERS}
      totalStickers={item.stickers?.length || 0}
      isLiked={isLiked}
      isFavorited={isFavorited}
      onSteal={() => console.log('Steal Package', item.id)}
      onLike={() => setIsLiked(!isLiked)}
      onFavorite={() => setIsFavorited(!isFavorited)}
      onMakerPress={onMakerPress}
      onStickerPress={() => onStickerPress(isLiked, isFavorited)}
      showShadow={showShadow}
      isAnimated={item.isAnimated}
    />
  );
};

/**
 * HomeScreen - Componente principal da tela.
 */
import { injectAds } from '../utils';
import { NativeAdCard } from '../components/NativeAdCard';

// ... (imports existentes)

import { StickerCardSkeleton, ScrollToTopButton, SeasonalBannerList } from '../components';

// ...

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors, spacing, typography } = useTheme();

  // Navigation handlers
  const handleBannerPress = useCallback((animeTitle: string) => {
    navigation.navigate('AnimeDetails', { animeTitle, fromCatalog: true });
  }, [navigation]);

  // Refs e Estados para Scroll To Top
  const flatListRef = React.useRef<FlatList>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Mostrar botão apenas se scroll for considerável (> 400px)
    setShowScrollButton(offsetY > 400);
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  // Estado para Infinite Scroll
  const [rawData, setRawData] = useState<AnimePack[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);

  // Helper para gerar mocks únicos baseados em índice global
  const generateBatch = useCallback((startIndex: number, count: number = 16) => {
    return Array.from({ length: count }).map((_, i) => ({
      ...ANIME_PACKS[i % ANIME_PACKS.length],
      id: `pack-${startIndex + i}`, // ID sequencial global
      package: `${ANIME_PACKS[i % ANIME_PACKS.length].package || 'Pack'} #${startIndex + i + 1}`,
    }));
  }, []);

  // Carga Inicial (16 itens)
  React.useEffect(() => {
    setRawData(generateBatch(0, 16));
    setPage(1);
  }, []);

  // Injetar anúncios na lista completa (Memoizado)
  const dataWithAds = React.useMemo(() => injectAds(rawData, 5), [rawData]);

  // Função de Load More simula requisição
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    // Simula delay de rede (1.5s)
    setTimeout(() => {
       // Usa o comprimento ATUAL para gerar IDs seguintes
       setRawData(prev => {
          const newBatch = generateBatch(prev.length, 16);
          return [...prev, ...newBatch];
       });
       setPage(p => p + 1);
       setIsLoadingMore(false);
    }, 1500);
  }, [isLoadingMore, generateBatch]); // Removeu 'page' da dependência pois usamos prev.length

  // Handlers memoizados para evitar re-render dos cards
  const handleMakerPress = useCallback(() => {
    navigation.navigate('OtamaProfile', { creatorName: 'Otamaker' });
  }, [navigation]);

  const handleStickerPress = useCallback((item: AnimePack, liked: boolean, favorited: boolean) => {
     navigation.navigate('PackDetails', { 
        packageId: item.id,
        packageTitle: item.package || item.title,
        animeTitle: item.title,
        mainIcon: item.image,
        stickers: item.stickers || [],
        isLiked: liked,
        isFavorited: favorited,
      });
  }, [navigation]);

  /**
   * Renderiza cada item da lista (Pode ser Pack ou Ad)
   */
  const renderItem = useCallback(({ item, index }: { item: AnimePack | { type: 'ad', id: string }; index: number }) => {
    // Renderiza Anúncio
    if ('type' in item && item.type === 'ad') {
       return (
         <View style={{ paddingHorizontal: 16 }}>
           <AnimatedWaterfallCard index={index}>
              <NativeAdCard id={item.id} />
           </AnimatedWaterfallCard>
         </View>
       );
    }

    // Renderiza Pack Normal com Animação
    return (
      <View style={{ paddingHorizontal: 16 }}>
        <AnimatedWaterfallCard index={index}>
          <StatefulStickerCard
            item={item as AnimePack}
            onMakerPress={handleMakerPress}
            // Adaptador para passar argumentos corretos
            onStickerPress={(liked, favorited) => handleStickerPress(item as AnimePack, liked, favorited)}
          />
        </AnimatedWaterfallCard>
      </View>
    );
  }, [handleMakerPress, handleStickerPress]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return <View style={{ height: 16 }} />;
    return (
      <View style={{ paddingVertical: 12, gap: 12 }}>
         <StickerCardSkeleton />
         <StickerCardSkeleton />
         <StickerCardSkeleton />
      </View>
    );
  }, [isLoadingMore]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={flatListRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={dataWithAds}
        renderItem={renderItem}
        // Identifica se é Pack (id) ou Ad (id gerado)
        keyExtractor={item => ('type' in item && item.type === 'ad' ? item.id : (item as AnimePack).id)}
        contentContainerStyle={[styles.listContent, { paddingTop: 0 }]}
        ListHeaderComponent={
          <View style={{ paddingTop: 16 }}>
            {/* Section: Esta Estação */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16 }}>
              <View style={[
                styles.badgeContainer, 
                { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }
              ]}>
                <Text style={[
                  styles.sectionTitle, 
                  { 
                    color: colors.primary, 
                    fontSize: typography.size.xxs,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontFamily: typography.fontFamily.bold,
                  }
                ]}>
                  Destaques da Estação
                </Text>
              </View>
            </View>

            <SeasonalBannerList onPressAnime={handleBannerPress} />

            {/* Section: Explorar */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginTop: 16, marginBottom: 16 }}>
              <View style={[
                styles.badgeContainer, 
                { backgroundColor: colors.text + '08', borderColor: colors.text + '15' }
              ]}>
                <Text style={[
                  styles.sectionTitle, 
                  { 
                    color: colors.text, 
                    fontSize: typography.size.xxs,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontFamily: typography.fontFamily.bold,
                  }
                ]}>
                  Explorar Descobertas
                </Text>
              </View>
            </View>
          </View>
        }
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.8}
        ListFooterComponent={renderFooter}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={15} // Buffer seguro
        removeClippedSubviews={true}
      />
      <ScrollToTopButton visible={showScrollButton} onPress={scrollToTop} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16, // Reduzido de 80 para 16
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

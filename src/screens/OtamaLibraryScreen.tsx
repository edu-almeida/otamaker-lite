/**
 * UserAccountScreen - Conta do usuário (não-criador)
 * 
 * Tela simplificada com apenas duas abas:
 * - Em Uso: Pacotes que o usuário está usando
 * - Favoritos: Pacotes favoritos do usuário
 * 
 * Sem informações de perfil (avatar, bio, stats) pois o usuário não é maker
 */
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { StickerCard, AnimatedWaterfallCard, ScrollToTopButton, StickerCardSkeleton } from '../components';
import { ANIME_PACKS } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList, AnimePack } from '../types';
import { injectAds } from '../utils';
import { NativeAdCard } from '../components/NativeAdCard';

type OtamaLibraryScreenProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

interface StatefulStickerCardProps {
  item: AnimePack;
  onMakerPress: (author: string) => void;
  onStickerPress: (item: AnimePack, liked: boolean, favorited: boolean) => void;
  variant?: 'default' | 'compact';
}

const StatefulStickerCard: React.FC<StatefulStickerCardProps> = ({ item, onMakerPress, onStickerPress, variant }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isFavorited, setIsFavorited] = React.useState(true);

  return (
    <StickerCard
      packageTitle={item.package || item.title}
      makerAccountName={item.author || "Otamaker"}
      makerAvatar={item.image}
      mainIcon={item.image}
      stickers={item.stickers}
      totalStickers={item.stickers.length}
      onSteal={() => console.log('Steal', item.title)}
      onLike={() => setIsLiked(!isLiked)}
      onFavorite={() => setIsFavorited(!isFavorited)}
      onMakerPress={() => onMakerPress(item.author || "Otamaker")}
      onStickerPress={() => onStickerPress(item, isLiked, isFavorited)}
      isLiked={isLiked}
      isFavorited={isFavorited}
      isAnimated={item.isAnimated}
      variant={variant}
    />
  );
};

export const OtamaLibraryScreen: React.FC<OtamaLibraryScreenProps> = ({ navigation }) => {
  const { colors, spacing, typography, dark: isDark } = useTheme();
  
  // Refs e Estados para Scroll To Top
  const flatListRef = React.useRef<FlatList>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = useCallback((event: any) => {
    setShowScrollButton(event.nativeEvent.contentOffset.y > 400);
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const [activeTab, setActiveTab] = useState<'inUse' | 'favorites'>('inUse');

  // Estados para Infinite Scroll
  const [inUseRaw, setInUseRaw] = useState<AnimePack[]>([]);
  const [favoritesRaw, setFavoritesRaw] = useState<AnimePack[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Helper para gerar mocks
  const generateBatch = useCallback((startIndex: number, count: number = 8, prefix: string) => {
    return Array.from({ length: count }).map((_, i) => ({
      ...ANIME_PACKS[i % ANIME_PACKS.length],
      id: `${prefix}-batch-${startIndex + i}`,
      package: `${ANIME_PACKS[i % ANIME_PACKS.length].package} #${startIndex + i + 1}`,
    }));
  }, []);

  // Carga Inicial
  React.useEffect(() => {
    setInUseRaw(generateBatch(0, 8, 'inuse'));
    setFavoritesRaw(generateBatch(0, 8, 'fav'));
  }, [generateBatch]);

  // Load More
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    setTimeout(() => {
      if (activeTab === 'inUse') {
        setInUseRaw(prev => [...prev, ...generateBatch(prev.length, 8, 'inuse')]);
      } else {
        setFavoritesRaw(prev => [...prev, ...generateBatch(prev.length, 8, 'fav')]);
      }
      setIsLoadingMore(false);
    }, 1000);
  }, [isLoadingMore, activeTab, generateBatch]);

  const currentRaw = useMemo(() => 
    activeTab === 'inUse' ? inUseRaw : favoritesRaw,
    [activeTab, inUseRaw, favoritesRaw]
  );
  
  // Injetar Anúncios
  const currentPacks = useMemo(() => injectAds(currentRaw, 5), [currentRaw]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return <View style={{ height: 24 }} />;
    return (
      <View style={{ gap: 12, paddingBottom: 20 }}>
         <StickerCardSkeleton />
         <StickerCardSkeleton />
      </View>
    );
  }, [isLoadingMore]);

  // Callbacks memoizados para evitar re-criação
  const handleMakerPress = useCallback((author: string) => {
    navigation.navigate('OtamaProfile', { creatorName: author || 'Otamaker' });
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

  // renderItem deve lidar com AnimePack | { type: 'ad' }
  const renderItem = useCallback(({ item, index }: { item: AnimePack | { type: 'ad', id: string }; index: number }) => {
    // Renderiza Ad
    if ('type' in item && item.type === 'ad') {
       return (
         <AnimatedWaterfallCard index={index}>
            <NativeAdCard id={item.id} />
         </AnimatedWaterfallCard>
       );
    }

    // Renderiza Pack
    return (
      <AnimatedWaterfallCard index={index}>
        <StatefulStickerCard
          item={item as AnimePack}
          onMakerPress={handleMakerPress}
          onStickerPress={handleStickerPress}
          variant={activeTab === 'inUse' ? 'compact' : 'default'}
        />
      </AnimatedWaterfallCard>
    );
  }, [handleMakerPress, handleStickerPress, activeTab]);

  const keyExtractor = useCallback((item: AnimePack | { type: 'ad', id: string }) => {
      return ('type' in item && item.type === 'ad') ? item.id : `${activeTab}-${item.id}`;
  }, [activeTab]);

  // Otimização de layout para FlatList
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 292, // Altura aproximada do card (280) + margem (12)
    offset: 292 * index,
    index,
  }), []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tabs Fixas no Topo */}
      <View style={[styles.tabsContainer, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'inUse' && styles.activeTab]}
          onPress={() => setActiveTab('inUse')}
          activeOpacity={0.7}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
            {activeTab === 'inUse' ? (
              <Path 
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
                fill={colors.primary}
              />
            ) : (
              <Path 
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" 
                stroke={colors.textSecondary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </Svg>
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'inUse' ? colors.primary : colors.textSecondary }
          ]}>
            Em Uso ({inUseRaw.length})
          </Text>
          {activeTab === 'inUse' && (
            <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
          activeOpacity={0.7}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
            <Path 
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
              fill={activeTab === 'favorites' ? colors.primary : 'transparent'}
              stroke={activeTab === 'favorites' ? colors.primary : colors.textSecondary} 
              strokeWidth={2} 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'favorites' ? colors.primary : colors.textSecondary }
          ]}>
            Favoritos ({favoritesRaw.length})
          </Text>
          {activeTab === 'favorites' && (
            <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Lista de Pacotes */}
      <FlatList
        ref={flatListRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={currentPacks as any}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={50}
        initialNumToRender={4}
        windowSize={6}
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
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '15%',
    right: '15%',
    height: 3,
    borderRadius: 3,
  },
});

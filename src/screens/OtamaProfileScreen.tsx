/**
 * OtamaProfileScreen - Perfil do criador (maker)
 * 
 * Exibe informações completas do perfil e duas abas:
 * - Em Uso: Pacotes que o criador está usando atualmente
 * - Favoritos: Pacotes marcados como favoritos
 */
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { StickerCard, AnimatedWaterfallCard, StickerCardSkeleton, NativeAdCard } from '../components';
import { ANIME_PACKS, MOCK_COVERS } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList, AnimePack } from '../types';
import { injectAds } from '../utils';

type OtamaProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'OtamaProfile'>;

interface StatefulStickerCardProps {
  item: AnimePack;
  onMakerPress: (author: string) => void;
  onStickerPress: (item: AnimePack, liked: boolean, favorited: boolean) => void;
}

const StatefulStickerCard: React.FC<StatefulStickerCardProps> = ({ item, onMakerPress, onStickerPress }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isFavorited, setIsFavorited] = React.useState(true); // Favoritos começam marcados

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
    />
  );
};

export const OtamaProfileScreen: React.FC<OtamaProfileScreenProps> = ({ navigation, route }) => {
  const { colors, spacing, typography, borderRadius, dark: isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'inUse' | 'favorites'>('inUse');
  
  // Extrair o nome do criador da rota (parametro)
  const { creatorName } = route.params;

  // Listas reais (em produção viriam da API)
  const [inUseRaw, setInUseRaw] = useState<AnimePack[]>([]);
  const [favoritesRaw, setFavoritesRaw] = useState<AnimePack[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Helper para gerar mocks
  const generateBatch = useCallback((startIndex: number, count: number = 8, prefix: string) => {
    return Array.from({ length: count }).map((_, i) => ({
      ...ANIME_PACKS[i % ANIME_PACKS.length],
      id: `${prefix}-${startIndex + i}`,
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

  // Injetar Ads
  const inUseWithAds = useMemo(() => injectAds(inUseRaw, 4), [inUseRaw]);
  const favoritesWithAds = useMemo(() => injectAds(favoritesRaw, 4), [favoritesRaw]);

  const dataWithAds = useMemo(() => 
    activeTab === 'inUse' ? inUseWithAds : favoritesWithAds,
    [activeTab, inUseWithAds, favoritesWithAds]
  );

  // Callbacks memoizados
  const handleMakerPress = useCallback((author: string) => {
    // Se clicar no próprio nome/avatar nesta tela, não faz nada ou recarrega
    if (author !== creatorName) {
        navigation.push('OtamaProfile', { creatorName: author || 'Otamaker' });
    }
  }, [navigation, creatorName]);

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

  const renderItem = useCallback(({ item, index }: any) => {
    if ('type' in item && item.type === 'ad') {
      return (
        <AnimatedWaterfallCard index={index}>
          <NativeAdCard id={item.id} />
        </AnimatedWaterfallCard>
      );
    }
    return (
      <AnimatedWaterfallCard index={index}>
        <StatefulStickerCard
          item={item as AnimePack}
          onMakerPress={handleMakerPress}
          onStickerPress={handleStickerPress}
        />
      </AnimatedWaterfallCard>
    );
  }, [handleMakerPress, handleStickerPress]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return <View style={{ height: 20 }} />;
    return (
      <View style={{ gap: 12, marginBottom: 20 }}>
         <StickerCardSkeleton />
         <StickerCardSkeleton />
      </View>
    );
  }, [isLoadingMore]);

  // Perfil Memoizado - Agora usa o creatorName do parametro
  // OBS: Em um app real, buscaríamos os dados do usuário via API usando o creatorName/ID
  const userProfile = useMemo(() => {
    // Simulação: Se for "Eu" (o usuário logado, hipoteticamente), mostra o Eduardo
    // Se for outro, gera um perfil baseado no nome
    const isMe = creatorName === 'Eduardo Almeida'; 
    
    return {
      name: creatorName,
      username: `@${creatorName.toLowerCase().replace(/\s+/g, '_')}`,
      avatar: MOCK_COVERS.avatar, // Poderia variar o avatar com base no nome
      bio: isMe ? 'Criador de stickers e amantes de anime 🎨✨' : `Apaixonado por criar stickers de ${creatorName}!`,
      stats: {
        inUse: Math.floor(Math.random() * 200) + 50,
        favorites: Math.floor(Math.random() * 100) + 20,
        created: Math.floor(Math.random() * 300) + 10,
      },
      isMe // Flag para saber se é o próprio usuário
    };
  }, [creatorName]);

  const keyExtractor = useCallback((item: AnimePack) => `${activeTab}-${item.id}`, [activeTab]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 280,
    offset: 280 * index,
    index,
  }), []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Avatar e Info do Usuário */}
      <View style={styles.profileSection}>
        <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
          <Image source={userProfile.avatar} style={styles.avatar} resizeMode="cover" />
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {userProfile.name}
          </Text>
          <Text style={[styles.userHandle, { color: colors.textSecondary }]}>
            {userProfile.username}
          </Text>
          <Text style={[styles.userBio, { color: colors.textSecondary }]}>
            {userProfile.bio}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={[styles.statsContainer, { backgroundColor: isDark ? colors.surface : colors.border + '30', borderColor: colors.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{userProfile.stats.inUse}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Em Uso</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{userProfile.stats.favorites}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favoritos</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{userProfile.stats.created}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Criados</Text>
        </View>
      </View>

      {/* Botão Editar Perfil - Só mostra se for o próprio usuário (simulado) */}
      {/* Como o usuário pediu que essa tela é para quem tem cards (criadores),
          assumimos que se eu estou vendo, é o perfil DELE.
          Mas se eu entrei no perfil de OUTRO, não devo editar.
          Por enquanto, vamos esconder o botão de editar sempre, a menos que tenhamos certeza que é "My Profile" feature.
          O request diz: "Tela de Otama... só estará disponível para quem tem cards... ou seja o usuário do app não vai ter"
          Isso sugere que o usuário COMUM vê essa tela dos CRIADORES.
          Então o botão 'Editar Perfil' não faz sentido para o visitante.
       */}
       {/* 
      <TouchableOpacity 
        style={[styles.editButton, { backgroundColor: isDark ? colors.surface : colors.border + '40', borderColor: colors.border }]}
        activeOpacity={0.7}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
          <Path 
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" 
            stroke={colors.text} 
            strokeWidth={2} 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </Svg>
        <Text style={[styles.editButtonText, { color: colors.text }]}>Editar Perfil</Text>
      </TouchableOpacity>
      */}

      {/* Tabs */}
      <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'inUse' && styles.activeTab]}
          onPress={() => setActiveTab('inUse')}
          activeOpacity={0.7}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
            <Path 
              d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" 
              stroke={activeTab === 'inUse' ? colors.primary : colors.textSecondary} 
              strokeWidth={2} 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'inUse' ? colors.primary : colors.textSecondary }
          ]}>
            Em Uso ({userProfile.stats.inUse})
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
              fill={activeTab === 'favorites' ? colors.secondary : 'transparent'}
              stroke={activeTab === 'favorites' ? colors.secondary : colors.textSecondary} 
              strokeWidth={2} 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'favorites' ? colors.secondary : colors.textSecondary }
          ]}>
            Favoritos ({userProfile.stats.favorites})
          </Text>
          {activeTab === 'favorites' && (
            <View style={[styles.tabIndicator, { backgroundColor: colors.secondary }]} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={dataWithAds as any}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
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
    paddingBottom: 80,
  },
  headerContainer: {
    marginBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 16,
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
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

/**
 * DetailsScreen - Tela de detalhes de um pacote de stickers.
 * 
 * Exibe:
 * - Ícone do pacote (circular)
 * - Nome do pacote
 * - Stats (tamanho, quantidade de stickers, autor)
 * - Grid com todos os stickers do pacote (Zoomável via pinch)
 * - Footer fixo com botões de compartilhamento e Ads
 * - Overlay de sticker em tela cheia ao clicar
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, BackHandler, Modal, Animated, Easing, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { PinchGestureHandler, State, PinchGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';
import { MOCK_STICKERS } from '../data/mockData';
import { Sparkles, ShineEffect } from '../components/StickerCard';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import { BannerAd, AdUnitIds, BannerAdSize } from '../services/AdService';
import AdService from '../services/AdService';

type PackDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'PackDetails'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);

export const PackDetailsScreen: React.FC<PackDetailsScreenProps> = ({ route }) => {
  const navigation = useNavigation<any>();
  const { colors, spacing, typography, borderRadius, shadows, dark: isDark } = useTheme();
  const { packageId, packageTitle, mainIcon, stickers } = route.params || {};

  // Mock data se necessário
  const allStickers = stickers?.length > 0 ? stickers : [...MOCK_STICKERS, ...MOCK_STICKERS, ...MOCK_STICKERS, ...MOCK_STICKERS, ...MOCK_STICKERS];

  // Scroll To Top Logic
  const flatListRef = useRef<FlatList>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = useCallback((event: any) => {
    setShowScrollButton(event.nativeEvent.contentOffset.y > 400);
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  // --- Grid State & Logic ---
  const [numColumns, setNumColumns] = useState(4); // Padrão 4 colunas
  const MIN_COLS = 2; // Mínimo 2
  const MAX_COLS = 6; // Máximo 6
  
  // Largura disponível: tela - espaço lateral
  const SIDEBAR_SPACE = 76; // 12(margem) + 48(btn) + 16(gap)
  const GRID_PADDING = 20; // Padding Left
  const GAP = 8; // Gap entre stickers aumentado para 8
  
  // paddingLeft (20) + paddingRight (76) -> Total 96
  const availableWidth = SCREEN_WIDTH - GRID_PADDING - SIDEBAR_SPACE;
  const stickerSize = (availableWidth - (GAP * (numColumns - 1))) / numColumns;

  // Lógica de Pinch Zoom em Tempo Real
  const startColumnsRef = useRef(numColumns);

  const onPinchHandlerStateChange = ({ nativeEvent }: PinchGestureHandlerStateChangeEvent) => {
    if (nativeEvent.state === State.BEGAN) {
      startColumnsRef.current = numColumns;
    }
  };

  const onPinchGestureEvent = ({ nativeEvent }: any) => { // Using any properly typed event import would be better but keeping simple
    const scale = nativeEvent.scale;
    // Zoom In (Scale > 1) -> Menos colunas (Itens maiores)
    // Zoom Out (Scale < 1) -> Mais colunas (Itens menores)
    // Fórmula: Novas Colunas = Colunas Iniciais / Escala
    let targetCols = Math.round(startColumnsRef.current / scale);
    
    // Clamp limits
    targetCols = Math.max(MIN_COLS, Math.min(MAX_COLS, targetCols));
    
    if (targetCols !== numColumns) {
      setNumColumns(targetCols);
    }
  };

  // --- Overlay State ---
  const [selectedSticker, setSelectedSticker] = useState<any>(null);

  // --- Handlers ---
  const handleShareTelegram = () => console.log('Share to Telegram');
  const handleShareWhatsApp = () => console.log('Share to WhatsApp');

  // --- Interaction States ---
  const [isLiked, setIsLiked] = useState(route.params?.isLiked || false);
  const [isFavorited, setIsFavorited] = useState(route.params?.isFavorited || false);
  const [triggerSparkles, setTriggerSparkles] = useState(false);

  // Animations (Synced with StickerCard style)
  const likedProgress = useRef(new Animated.Value(isLiked ? 1 : 0)).current;
  const favoriteAnim = useRef(new Animated.Value(isFavorited ? 1 : 0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Like Animation
    if (isLiked) {
      setTriggerSparkles(true);
      Animated.parallel([
        Animated.timing(likedProgress, { toValue: 1, duration: 400, useNativeDriver: false, easing: Easing.elastic(1.2) }),
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        ])
      ]).start();
    } else {
      setTriggerSparkles(false);
      Animated.timing(likedProgress, { toValue: 0, duration: 300, useNativeDriver: false, easing: Easing.out(Easing.bounce) }).start();
    }
  }, [isLiked]);

  useEffect(() => {
    // Favorite Animation
    Animated.timing(favoriteAnim, {
      toValue: isFavorited ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }).start();
  }, [isFavorited]);

  const toggleLike = () => setIsLiked(!isLiked);
  const toggleFavorite = () => setIsFavorited(!isFavorited);

  // Mostra Interstitial ao abrir o pack (com controle de frequência)
  useEffect(() => {
    AdService.showInterstitial();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Fixo (não faz scroll) */}
      <View style={styles.headerContent}>
        {/* Top Info Area */}
        <View style={styles.topInfoContainer}>
           {/* Ícone do Pacote - Minimalista */}
           <View style={[styles.minimalIconContainer, { backgroundColor: colors.surface }]}>
             <Image 
               source={mainIcon || require('../assets/xd/ComponentTMP_0-image.jpg')} 
               style={styles.packageIcon} 
               resizeMode="cover" 
             />
           </View>
           
           <View style={styles.titleMetadataColumn}>
              {/* Nome do Pacote */}
              <Text 
                style={[styles.minimalPackageTitle, { color: colors.text }]}
              >
                {packageTitle || 'Pacote de Stickers'}
              </Text>

              {/* Anime Context */}
              {!((route.params as any)?.hideAnimeName) && (
                <TouchableOpacity 
                  onPress={() => {
                    const target = (route.params as any)?.animeTitle || packageTitle;
                    navigation.navigate('AnimeDetails', { animeTitle: target });
                  }}
                  style={[
                    styles.animeLinkContainer,
                    { 
                      borderColor: colors.border,
                      backgroundColor: colors.surface // Mesma cor do card
                    }
                  ]}
                >
                  <Text style={[styles.animeLinkText, { color: colors.textSecondary }]}>
                    Anime: {(route.params as any)?.animeTitle || 'Reference'} ›
                  </Text>
                </TouchableOpacity>
              )}
           </View>
        </View>
      </View>

      {/* Grid com Pinch Zoom (APENAS ISSO FAZ SCROLL) */}
      <PinchGestureHandler 
        onHandlerStateChange={onPinchHandlerStateChange}
        onGestureEvent={onPinchGestureEvent}
      >
        <FlatList
          ref={flatListRef}
          data={allStickers}
          key={`grid-${numColumns}`}
          numColumns={numColumns}
          renderItem={({ item, index }) => (
              <TouchableOpacity 
                style={[
                  styles.stickerItem,
                  { 
                    backgroundColor: isDark ? colors.border : '#DCCEC6',
                    width: stickerSize,
                    height: stickerSize,
                    marginRight: (index + 1) % numColumns === 0 ? 0 : GAP,
                    marginBottom: GAP,
                  }
                ]}
                onPress={() => setSelectedSticker(item)}
                activeOpacity={0.7}
              >
                <Image source={item} style={styles.stickerImage} resizeMode="cover" />
              </TouchableOpacity>
          )}
          ListHeaderComponent={
            <View style={styles.infoTagsContainer}>
              <View style={[
                  styles.infoTag, 
                  { 
                    backgroundColor: route.params?.isAnimated 
                      ? (isDark ? '#9C27B020' : '#BA68C8') 
                      : (isDark ? '#4CAF5020' : '#66BB6A'),
                  }
                ]}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
                    {route.params?.isAnimated ? (
                      <Path d="M5 3l14 9-14 9V3z" fill={isDark ? '#BA68C8' : '#FFFFFF'} />
                    ) : (
                      <Path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill={isDark ? '#66BB6A' : '#FFFFFF'} />
                    )}
                  </Svg>
                  <Text style={[
                    styles.infoTagText, 
                    { color: route.params?.isAnimated 
                      ? (isDark ? '#BA68C8' : '#FFFFFF') 
                      : (isDark ? '#66BB6A' : '#FFFFFF') 
                    }
                  ]}>
                    {route.params?.isAnimated ? 'Figurinhas animadas' : 'Figurinhas estáticas'}
                  </Text>
                </View>

                <View style={[styles.infoTag, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.infoTagText, { color: colors.textSecondary }]}>
                    {allStickers.length} Stickers
                  </Text>
                </View>

                <View style={[styles.infoTag, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.infoTagText, { color: colors.textSecondary }]}>
                    920 KB
                  </Text>
                </View>
            </View>
          }
          style={styles.gridScrollContainer}
          contentContainerStyle={styles.gridContentContainer}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </PinchGestureHandler>

      {/* TikTok Style Side Actions (Floating) */}
      <View style={styles.detailsSideActions}>
        
        {/* Profile / Maker */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('OtamaProfile', { creatorName: 'Otamaker' })} 
          style={styles.sideActionBtn}
          activeOpacity={0.6}
        >
          <View style={[styles.sideProfileAvatarBox, { backgroundColor: colors.primary + '30', borderColor: colors.primary }]}>
            <Image 
              source={require('../assets/xd/ComponentTMP_0-image.jpg')} 
              style={styles.sideProfileImage} 
            />
            <View style={styles.profilePlus}>
              <Text style={{ color: 'white', fontSize: 9, fontWeight: '900' }}>+</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Like */}
        <TouchableOpacity onPress={toggleLike} style={styles.sideActionBtn} activeOpacity={0.6}>
          <View style={[
            styles.sideActionBox, 
            { 
              backgroundColor: isLiked ? colors.primary + '30' : colors.surface,
              borderColor: isLiked ? colors.primary : colors.border
            }
          ]}>
            <Sparkles active={triggerSparkles} />
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
               <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                 <Path 
                   d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                   fill={isLiked ? colors.primary : (isDark ? colors.textSecondary : "#A0A0A0")} 
                 />
               </Svg>
            </Animated.View>
          </View>
          <Text style={[styles.actionCount, { color: isLiked ? colors.primary : colors.textSecondary }]}>
            12k
          </Text>
        </TouchableOpacity>

        {/* Save / Favorite */}
        <TouchableOpacity onPress={toggleFavorite} style={styles.sideActionBtn} activeOpacity={0.6}>
          <View style={[
            styles.sideActionBox, 
            { 
              backgroundColor: isFavorited ? colors.secondary + '30' : colors.surface,
              borderColor: isFavorited ? colors.secondary : colors.border
            }
          ]}>
            <Animated.View style={{ 
              transform: [{ rotate: favoriteAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] 
            }}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                 <AnimatedPath 
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                    fill={isFavorited ? colors.secondary : (isDark ? colors.textSecondary : "#A0A0A0")}
                 />
              </Svg>
            </Animated.View>
          </View>
          <Text style={[styles.actionCount, { color: isFavorited ? colors.secondary : colors.textSecondary }]}>
            Save
          </Text>
        </TouchableOpacity>

        {/* WhatsApp */}
        <TouchableOpacity onPress={handleShareWhatsApp} style={styles.sideActionBtn} activeOpacity={0.6}>
           <View style={[styles.sideActionBox, { backgroundColor: '#25D366', borderColor: '#25D366' }]}>
             <Svg width={22} height={22} viewBox="0 0 24 24" fill="#FFFFFF">
               <Path 
                fillRule="evenodd"
                d="M12.01 0C5.38 0 0 5.38 0 12.01c0 2.12.55 4.18 1.6 5.96L0 24l6.19-1.62c1.7 0.93 3.63 1.42 5.59 1.42h0c6.63 0 12.02-5.38 12.02-12.01C23.8 5.38 18.42 0 12.01 0z M17.2 14.8c-0.2-0.1-1.3-0.65-1.5-0.7c-0.2-0.05-0.4-0.1-0.6 0.2c-0.2 0.3-0.7 0.8-0.8 1c-0.1 0.2-0.3 0.2-0.5 0.1c-0.3-0.15-1.2-0.45-2.3-1.4c-0.8-0.7-1.4-1.6-1.5-1.9c-0.1-0.3 0-0.4 0.1-0.5c0.1-0.1 0.2-0.2 0.4-0.4c0.1-0.2 0.2-0.3 0.3-0.4c0.1-0.1 0-0.3 0-0.4c-0.05-0.1-0.5-1.2-0.7-1.7c-0.2-0.5-0.4-0.4-0.6-0.4h-0.5c-0.2 0-0.5 0.1-0.7 0.3c-0.2 0.2-1 0.9-1 2.2c0 1.3 0.9 2.5 1.1 2.7c0.2 0.2 1.9 2.9 4.6 4.1c0.6 0.3 1.1 0.5 1.5 0.6c0.7 0.2 1.3 0.2 1.8 0.1c0.6-0.1 1.7-0.7 2-1.4c0.3-0.7 0.3-1.3 0.2-1.4c-0.1-0.1-0.3-0.2-0.6-0.3z" 
               />
             </Svg>
           </View>
        </TouchableOpacity>

        {/* Telegram */}
        <TouchableOpacity onPress={handleShareTelegram} style={styles.sideActionBtn} activeOpacity={0.6}>
           <View style={[styles.sideActionBox, { backgroundColor: '#0088CC', borderColor: '#0088CC' }]}>
             <Svg width={22} height={22} viewBox="0 0 24 24" fill="#FFFFFF">
               <Path d="M21.174 2.398a1.187 1.187 0 0 0-1.168-.142L2.09 9.387a1.188 1.188 0 0 0 .153 2.193l5.08 1.63 1.936 6.13a1.187 1.187 0 0 0 2.193.153l2.844-5.454 5.336 4.3c.7.561 1.745.064 1.745-.832V3.535a1.187 1.187 0 0 0-.597-1.137zm-9.088 11.39l-2.43 4.659-1.29-4.084 10.435-8.452-6.715 7.877z" />
             </Svg>
           </View>
        </TouchableOpacity>

      </View>

      {/* Banner de Anúncio */}
      <View style={styles.detailsFooter}>
        <BannerAd 
          unitId={AdUnitIds.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>

      <ScrollToTopButton visible={showScrollButton} onPress={scrollToTop} />
      
      {/* Overlay - Modal */}
      <Modal
        visible={!!selectedSticker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedSticker(null)}
        statusBarTranslucent={true}
      >
        <TouchableOpacity 
          style={[styles.backdrop, { backgroundColor: colors.overlay }]} 
          activeOpacity={1} 
          onPress={() => setSelectedSticker(null)}
        >
          <View style={styles.overlayContent}>
            <Image 
              source={selectedSticker} 
              style={styles.fullImage} 
              resizeMode="contain" 
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  minimalIconContainer: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    overflow: 'hidden',
  },
  packageIcon: { width: '100%', height: '100%' },
  titleMetadataColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  minimalPackageTitle: { 
    fontSize: 20, 
    fontWeight: '900', 
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  detailsStatsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
    marginBottom: 10,
  },
  detailsStatText: { 
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  detailsStatSeparator: { 
    fontSize: 10, 
    opacity: 0.4
  },
  animeLinkContainer: { 
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  animeLinkText: { 
    fontSize: 11, 
    fontWeight: '600',
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 0,
  },
  gridScrollContainer: {
    flex: 1,
  },
  gridContentContainer: {
    paddingLeft: 20,
    paddingRight: 76, // 12(margem) + 48(btn) + 16(gap) = 76
    paddingBottom: 16,
  },
  infoTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  infoTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stickersGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    width: '100%' 
  },
  stickerItem: { 
    overflow: 'hidden',
    borderRadius: 6,
  },
  stickerImage: { width: '100%', height: '100%' },
  
  // Floating Sidebar Styles
  detailsSideActions: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    zIndex: 100,
  },
  sideActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  sideActionBox: {
    width: 48,
    height: 48,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    // Removed elevation/shadow as it causes ugly behavior on touch
  },
  sideProfileAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 13,
    borderWidth: 1.5,
    overflow: 'visible', // Allow plus badge to hang out
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  sideProfileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  profilePlus: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    width: 16,
    height: 16,
    borderRadius: 5,
    backgroundColor: '#FF3B5C',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCount: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  stickerTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  stickerTypeText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // Final Footer 
  detailsFooter: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  adsPlaceholder: { 
    width: '100%', 
    height: 80, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,0.1)',
  },
  adsText: { fontSize: 14, fontWeight: '600', opacity: 0.5 },
  
  overlayContainer: { zIndex: 999, elevation: 999 },
  backdrop: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlayContent: { width: '90%', height: '70%', justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: '100%', height: '100%' },
});

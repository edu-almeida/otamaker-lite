import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated, Easing, ImageSourcePropType } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { range } from '../utils';
import { CARDS, SHADOWS } from '../constants';
import { MOCK_COVERS } from '../data/mockData';

// --- Types ---
export interface StickerCardProps {
  packageTitle: string;
  makerAccountName: string;
  makerAvatar?: ImageSourcePropType;
  mainIcon: ImageSourcePropType;
  stickers: ImageSourcePropType[];
  totalStickers: number;
  isLiked?: boolean;
  isFavorited?: boolean; // New prop for star favorite
  onSteal?: () => void;
  onLike?: () => void;
  onFavorite?: () => void; // New callback
  onWhatsApp?: () => void; // New callback
  onTelegram?: () => void; // New callback
  onMakerPress?: () => void;
  onStickerPress?: () => void;
  showShadow?: boolean;
  hideMaker?: boolean;
  isAnimated?: boolean;
  variant?: 'default' | 'compact';
}

const { width } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

// Usando constantes centralizadas
const { MAIN_ICON_SIZE, PREVIEW_SIZE, MAX_PREVIEWS } = CARDS;

// --- Sparkles Component ---
interface SparklesProps {
  active: boolean;
}

export const Sparkles: React.FC<SparklesProps> = ({ active }) => {
  const { colors } = useTheme();
  // Multiple colors for more "fun" sparkles
  const particleColors = [colors.primary, colors.secondary, '#FFD700', '#FF69B4', '#00FFAD'];
  
  // Create fixed animation values at the TOP LEVEL (Fixes Hook violation)
  const particleAnims = useRef(range(8).map(() => new Animated.Value(0))).current;

  const particles = range(8).map((_, i) => {
    const angle = (i * 45) * (Math.PI / 180);
    const radius = 30;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      anim: particleAnims[i],
      color: particleColors[i % particleColors.length],
      size: Math.random() * 4 + 2
    };
  });

  useEffect(() => {
    if (active) {
      particleAnims.forEach(anim => anim.setValue(0));
      Animated.stagger(20, particleAnims.map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        })
      )).start();
    }
  }, [active]);

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => {
        const translateX = p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, p.x] });
        const translateY = p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, p.y] });
        const opacity = p.anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1, 0] });
        const scale = p.anim.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1.2, 0] });

        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              transform: [{ translateX }, { translateY }, { scale }],
              opacity,
              marginLeft: -p.size/2,
              marginTop: -p.size/2,
            }}
          />
        );
      })}
    </View>
  );
};

// --- Shine Effect Component ---
interface ShineEffectProps {
  active: boolean;
}

export const ShineEffect: React.FC<ShineEffectProps> = ({ active }) => {
  const shineAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    if (active) {
      shineAnim.setValue(-1);
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }).start();
    }
  }, [active]);

  if (!active) return null;

  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: 6 }]} pointerEvents="none">
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '40%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          transform: [
            { translateX: shineAnim.interpolate({ inputRange: [-1, 1], outputRange: [-100, 150] }) },
            { skewX: '-20deg' }
          ],
        }}
      />
    </View>
  );
};

// --- Animated Broken Heart Component ---
interface AnimatedBrokenHeartInternalProps {
  progress: Animated.Value;
  scale: Animated.Value;
  color: string;
  size?: number;
}

const AnimatedBrokenHeartInternal: React.FC<AnimatedBrokenHeartInternalProps> = ({ progress, scale, color, size = 28 }) => {
  const pLeft = "M12 21.35 C5.4 15.36 2 12.28 2 8.5 C2 5.42 4.42 3 7.5 3 C9.24 3 10.91 3.81 12 5.09 L12 21.35 Z";
  const pRight = "M12 21.35 L12 5.09 C13.09 3.81 14.76 3 16.5 3 C19.58 3 22 5.42 22 8.5 C22 12.28 18.6 15.36 12 21.35 Z";

  const leftRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['-15deg', '0deg'] });
  const leftX = progress.interpolate({ inputRange: [0, 1], outputRange: [-3, 0] });
  const leftY = progress.interpolate({ inputRange: [0, 1], outputRange: [2, 0] });

  const rightRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['15deg', '0deg'] });
  const rightX = progress.interpolate({ inputRange: [0, 1], outputRange: [3, 0] });
  const rightY = progress.interpolate({ inputRange: [0, 1], outputRange: [-2, 0] });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* @ts-ignore - AnimatedG transform typing issue with react-native-svg */}
        <AnimatedG style={{ transform: [{ translateX: leftX }, { translateY: leftY }, { rotate: leftRotate }] }} origin="12, 12">
          <AnimatedPath
            d={pLeft}
            fill={progress.interpolate({ inputRange: [0, 1], outputRange: ["transparent", color] })}
            stroke={color}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </AnimatedG>
        {/* @ts-ignore - AnimatedG transform typing issue with react-native-svg */}
        <AnimatedG style={{ transform: [{ translateX: rightX }, { translateY: rightY }, { rotate: rightRotate }] }} origin="12, 12">
          <AnimatedPath
            d={pRight}
            fill={progress.interpolate({ inputRange: [0, 1], outputRange: ["transparent", color] })}
            stroke={color}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </AnimatedG>
      </Svg>
    </Animated.View>
  );
};



// --- StickerCard Component ---
export const StickerCard = React.memo<StickerCardProps>(({
  packageTitle = "Pacote de stickers",
  makerAccountName = "Otamaker",
  makerAvatar,
  mainIcon,
  stickers = [],
  totalStickers = 0,
  onSteal,
  onLike,
  onFavorite,
  onWhatsApp,
  onTelegram,
  onMakerPress,
  onStickerPress,
  isLiked = false,
  isFavorited = false,
  showShadow = true,
  hideMaker = false,
  isAnimated = false,
  variant = 'default',
}) => {
  const { colors, typography, borderRadius, shadows, spacing, dark: isDark } = useTheme();
  const isCompact = variant === 'compact';

  // --- Animations ---
  const likedProgress = useRef(new Animated.Value(isLiked ? 1 : 0)).current;
  const favoriteAnim = useRef(new Animated.Value(isFavorited ? 1 : 0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [triggerSparkles, setTriggerSparkles] = useState(false);

  useEffect(() => {
    // Like Animation
    if (isLiked) {
      setTriggerSparkles(true);
      Animated.parallel([
        Animated.timing(likedProgress, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
          easing: Easing.elastic(1.2),
        }),
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        ])
      ]).start();
    } else {
      setTriggerSparkles(false);
      Animated.timing(likedProgress, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.bounce),
      }).start();
    }
  }, [isLiked]);

  useEffect(() => {
    // Favorite Animation (Star spin + Fill)
    Animated.timing(favoriteAnim, {
      toValue: isFavorited ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }).start();
  }, [isFavorited, favoriteAnim]);

  const displayCount = Math.min(stickers.length, MAX_PREVIEWS);
  const visibleStickers = stickers.slice(0, displayCount);

  const hasMore = totalStickers > MAX_PREVIEWS;
  const remainingCount = Math.max(0, totalStickers - MAX_PREVIEWS + 1);

  return (
    <View style={styles.cardWrapper}>

      {/* Main Content Card */}
      <View style={[
        styles.mainCard,
        {
          backgroundColor: colors.surface,
          borderRadius: borderRadius.lg, // Using lg as verified in tokens
          borderWidth: 1,
          borderColor: colors.border,
          ...(showShadow ? SHADOWS.card : {}),
        }
      ]}>
        
        {/* Header: Maker Information (Avatar + Name) + Type Indicator */}
        {!hideMaker && (
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              onPress={onMakerPress} 
              style={[
                styles.headerInfo, 
                { 
                  backgroundColor: isDark ? colors.border + '40' : colors.border + '30',
                  borderColor: isDark ? colors.border : colors.border + '50',
                  maxWidth: isCompact ? '45%' : undefined,
                }
              ]}
            >
              <View style={[styles.animeAvatar, { 
                backgroundColor: isDark ? colors.border + '30' : 'rgba(0,0,0,0.03)', // Estilo Like Inativo
                borderColor: 'transparent'
              }]}>
                 {makerAvatar ? (
                    <Image source={makerAvatar} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                 ) : (
                   <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: colors.textSecondary }}>{makerAccountName.charAt(0).toUpperCase()}</Text>
                   </View>
                 )}
              </View>
              <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.animeNameText, { color: colors.textSecondary }]}>
                {makerAccountName}
              </Text>
            </TouchableOpacity>

            {/* Sticker Type and Favorite Area */}
            <View style={styles.headerActions}>
              <View style={[
                styles.stickerTypeBadge, 
                { backgroundColor: isAnimated 
                  ? (isDark ? '#9C27B020' : '#BA68C8') // Roxo (fundo invertido light)
                  : (isDark ? '#4CAF5020' : '#66BB6A') // Verde (fundo invertido light)
                }
              ]}>
                <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
                  {isAnimated ? (
                    <Path d="M5 3l14 9-14 9V3z" fill={isDark ? '#BA68C8' : '#FFFFFF'} /> 
                  ) : (
                    <Path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill={isDark ? '#66BB6A' : '#FFFFFF'} /> 
                  )}
                </Svg>
                <Text style={[
                  styles.stickerTypeText, 
                  { color: isAnimated 
                    ? (isDark ? '#BA68C8' : '#FFFFFF') 
                    : (isDark ? '#66BB6A' : '#FFFFFF') 
                  }
                ]}>
                  {isAnimated ? 'GIF' : 'IMG'}
                </Text>
              </View>

              {isCompact ? (
                /* Compact Mode: Show Social Buttons here instead of Favorite */
                <View style={{ flexDirection: 'row', gap: 8 }}>
                   <TouchableOpacity 
                      onPress={onTelegram}
                      style={[
                        styles.socialBtn, 
                        { 
                          backgroundColor: isDark ? colors.border + '30' : 'rgba(0,0,0,0.03)', // Neutral/Inactive Like
                          width: 28, 
                          height: 28,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: 'rgba(0,0,0,0.05)'
                        }
                      ]}
                    >
                       <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                         <Path d="M21.174 2.398a1.187 1.187 0 0 0-1.168-.142L2.09 9.387a1.188 1.188 0 0 0 .153 2.193l5.08 1.63 1.936 6.13a1.187 1.187 0 0 0 2.193.153l2.844-5.454 5.336 4.3c.7.561 1.745.064 1.745-.832V3.535a1.187 1.187 0 0 0-.597-1.137zm-9.088 11.39l-2.43 4.659-1.29-4.084 10.435-8.452-6.715 7.877z" fill={isDark ? colors.textSecondary : "#A0A0A0"} />
                       </Svg>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={onWhatsApp}
                      style={[
                        styles.socialBtn, 
                        { 
                          backgroundColor: isDark ? colors.border + '30' : 'rgba(0,0,0,0.03)', // Neutral/Inactive Like
                          width: 28, 
                          height: 28,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: 'rgba(0,0,0,0.05)'
                        }
                      ]}
                    >
                       <Svg width={16} height={16} viewBox="0 0 24 24" fill={isDark ? colors.textSecondary : "#A0A0A0"}>
                         <Path 
                          fillRule="evenodd"
                          d="M12.01 0C5.38 0 0 5.38 0 12.01c0 2.12.55 4.18 1.6 5.96L0 24l6.19-1.62c1.7 0.93 3.63 1.42 5.59 1.42h0c6.63 0 12.02-5.38 12.02-12.01C23.8 5.38 18.42 0 12.01 0z M17.2 14.8c-0.2-0.1-1.3-0.65-1.5-0.7c-0.2-0.05-0.4-0.1-0.6 0.2c-0.2 0.3-0.7 0.8-0.8 1c-0.1 0.2-0.3 0.2-0.5 0.1c-0.3-0.15-1.2-0.45-2.3-1.4c-0.8-0.7-1.4-1.6-1.5-1.9c-0.1-0.3 0-0.4 0.1-0.5c0.1-0.1 0.2-0.2 0.4-0.4c0.1-0.2 0.2-0.3 0.3-0.4c0.1-0.1 0-0.3 0-0.4c-0.05-0.1-0.5-1.2-0.7-1.7c-0.2-0.5-0.4-0.4-0.6-0.4h-0.5c-0.2 0-0.5 0.1-0.7 0.3c-0.2 0.2-1 0.9-1 2.2c0 1.3 0.9 2.5 1.1 2.7c0.2 0.2 1.9 2.9 4.6 4.1c0.6 0.3 1.1 0.5 1.5 0.6c0.7 0.2 1.3 0.2 1.8 0.1c0.6-0.1 1.7-0.7 2-1.4c0.3-0.7 0.3-1.3 0.2-1.4c-0.1-0.1-0.3-0.2-0.6-0.3z" 
                        />
                       </Svg>
                    </TouchableOpacity>
                </View>
              ) : (
                /* Default Mode: Favorite Button */
                <TouchableOpacity 
                  onPress={onFavorite} 
                  style={[
                    styles.favoriteBtn, 
                    { 
                      backgroundColor: isFavorited ? colors.secondary + '1A' : (isDark ? colors.border + '30' : 'rgba(0,0,0,0.03)'), // Suave igual Like
                      borderColor: 'transparent', // Sem borda forte
                      borderWidth: 0,
                    }
                  ]} 
                  activeOpacity={0.7}
                >
                  <Animated.View style={{ 
                    transform: [{ 
                      rotate: favoriteAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      }) 
                    }] 
                  }}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                       <AnimatedPath 
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                          fill={isFavorited ? colors.secondary : (isDark ? colors.textSecondary : "#A0A0A0")}
                       />
                    </Svg>
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Body: Icon + Title/Stickers */}
        <TouchableOpacity 
          onPress={onStickerPress} 
          activeOpacity={0.9} 
          style={styles.bodyContent}
        >
          {/* Left: Main Icon */}
          <Image 
            source={mainIcon || MOCK_COVERS.mainIcon} 
            style={[styles.largeIcon, { backgroundColor: colors.border, borderColor: colors.border }]} 
            resizeMode="cover" 
          />

          {/* Right: Title + Sticker Grid */}
          <View style={styles.rightColumn}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.titleText, { color: colors.text }]}>
              {packageTitle}
            </Text>

            <View style={styles.smallStickersRow}>
              {visibleStickers.map((sticker, index) => {
                const isLastItem = index === MAX_PREVIEWS - 1;
                const showOverlay = isLastItem && hasMore;
                return (
                  <View key={index} style={[
                    styles.smallStickerBox,
                    { borderColor: colors.border, backgroundColor: colors.border }
                  ]}>
                    <Image source={sticker} style={{ width: '100%', height: '100%' }} />
                    {showOverlay && (
                      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
                       <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text }}>+{remainingCount}</Text>
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          </View>
        </TouchableOpacity>

        {/* Footer: Stats + Button (Apenas se não for compact) */}
        {!isCompact && (
          <View style={styles.footerBar}>
            
            {/* Left Side Group */}
            <View style={styles.footerLeft}>
              
              {/* Like Button (Blue Square style) */}
              <TouchableOpacity onPress={onLike} style={styles.statItem} activeOpacity={0.7}>
                <View>
                  <Sparkles active={triggerSparkles} />
                  <Animated.View style={[
                    styles.blueIconBox, 
                    { 
                      backgroundColor: isLiked 
                        ? colors.primary + '1A' // More discreet (10% opacity)
                        : (isDark ? colors.border + '30' : 'rgba(0,0,0,0.03)'),
                      transform: [
                        { scale: pulseAnim },
                        { rotate: pulseAnim.interpolate({
                            inputRange: [1, 1.3],
                            outputRange: ['0deg', '15deg']
                          })
                        }
                      ]
                    }
                  ]}>
                     <ShineEffect active={triggerSparkles} />
                     <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                       <Path 
                         d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                         fill={isLiked ? colors.primary : (isDark ? colors.textSecondary : "#A0A0A0")} 
                         stroke="none" 
                       />
                     </Svg>
                  </Animated.View>
                </View>
                <Animated.Text style={[
                  styles.statValue, 
                  { 
                    color: isLiked ? colors.primary : colors.textSecondary,
                    transform: [{ scale: likedProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }]
                  }
                ]}>
                  12.32k
                </Animated.Text>
              </TouchableOpacity>

              {/* Download Stats (Read-only) */}
              <View style={[styles.statItem, { opacity: 0.6 }]}>
                 <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                   <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke={colors.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                 </Svg>
                 <Text style={[styles.statValue, { color: colors.textSecondary, fontWeight: '400', fontSize: 12 }]}>320</Text>
              </View>

              {/* File Size Metadata (Cloud icon) */}
              <View style={[styles.statItem, { opacity: 0.6 }]}>
                 <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                   <Path d="M12 16l-4-4h2.5V8h3v4H16l-4 4zm7-2.7c0-2.5-1.9-4.6-4.4-4.8C14.1 6.6 12.2 5 10 5c-2.8 0-5 2.2-5 5-2.8 0-5 2.2-5 5 0 2.8 2.2 5 5 5h12c2.8 0 5-2.2 5-5z" stroke={colors.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                 </Svg>
                 <Text style={[styles.statValue, { color: colors.textSecondary, fontWeight: '400', fontSize: 12 }]}>920 Kb</Text>
              </View>

            </View>

            {/* Social Share Group (Right Side) - Minimalist System Style */}
            <View style={styles.socialGroup}>
              <TouchableOpacity 
                onPress={onTelegram}
                style={[
                  styles.socialBtn, 
                  { 
                    backgroundColor: isDark ? colors.border + '30' : 'rgba(0,0,0,0.03)', // Neutral/Inactive Like
                    width: 32, 
                    height: 32, 
                    borderRadius: 8, 
                    borderWidth: 1, 
                    borderColor: 'rgba(0,0,0,0.05)'
                  }
                ]} 
              >
                 <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                   <Path d="M21.174 2.398a1.187 1.187 0 0 0-1.168-.142L2.09 9.387a1.188 1.188 0 0 0 .153 2.193l5.08 1.63 1.936 6.13a1.187 1.187 0 0 0 2.193.153l2.844-5.454 5.336 4.3c.7.561 1.745.064 1.745-.832V3.535a1.187 1.187 0 0 0-.597-1.137zm-9.088 11.39l-2.43 4.659-1.29-4.084 10.435-8.452-6.715 7.877z" fill={isDark ? colors.textSecondary : "#A0A0A0"} />
                 </Svg>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={onWhatsApp}
                style={[
                  styles.socialBtn, 
                  { 
                    backgroundColor: isDark ? colors.border + '30' : 'rgba(0,0,0,0.03)', // Neutral/Inactive Like
                    width: 32, 
                    height: 32, 
                    borderRadius: 8, 
                    borderWidth: 1, 
                    borderColor: 'rgba(0,0,0,0.05)'
                  }
                ]} 
              >
                 <Svg width={16} height={16} viewBox="0 0 24 24" fill={isDark ? colors.textSecondary : "#A0A0A0"}>
                   <Path 
                    fillRule="evenodd"
                    d="M12.01 0C5.38 0 0 5.38 0 12.01c0 2.12.55 4.18 1.6 5.96L0 24l6.19-1.62c1.7 0.93 3.63 1.42 5.59 1.42h0c6.63 0 12.02-5.38 12.02-12.01C23.8 5.38 18.42 0 12.01 0z M17.2 14.8c-0.2-0.1-1.3-0.65-1.5-0.7c-0.2-0.05-0.4-0.1-0.6 0.2c-0.2 0.3-0.7 0.8-0.8 1c-0.1 0.2-0.3 0.2-0.5 0.1c-0.3-0.15-1.2-0.45-2.3-1.4c-0.8-0.7-1.4-1.6-1.5-1.9c-0.1-0.3 0-0.4 0.1-0.5c0.1-0.1 0.2-0.2 0.4-0.4c0.1-0.2 0.2-0.3 0.3-0.4c0.1-0.1 0-0.3 0-0.4c-0.05-0.1-0.5-1.2-0.7-1.7c-0.2-0.5-0.4-0.4-0.6-0.4h-0.5c-0.2 0-0.5 0.1-0.7 0.3c-0.2 0.2-1 0.9-1 2.2c0 1.3 0.9 2.5 1.1 2.7c0.2 0.2 1.9 2.9 4.6 4.1c0.6 0.3 1.1 0.5 1.5 0.6c0.7 0.2 1.3 0.2 1.8 0.1c0.6-0.1 1.7-0.7 2-1.4c0.3-0.7 0.3-1.3 0.2-1.4c-0.1-0.1-0.3-0.2-0.6-0.3z" 
                  />
                 </Svg>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>
    </View>
  )
});

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickerTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  stickerTypeText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  animeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 1, 
    borderColor: '#EEEEEE'
  },
  animeNameText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mainCard: {
    overflow: 'hidden',
    padding: 12,
  },
  bodyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  largeIcon: {
    width: 68,
    height: 68,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 12,
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'space-between', 
    height: 68,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 4,
  },
  smallStickersRow: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  smallStickerBox: {
    width: PREVIEW_SIZE, // Fixed size to prevent stretching
    height: PREVIEW_SIZE,
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  blueIconBox: {
    width: 32, // Reduced size
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  socialGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  socialBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

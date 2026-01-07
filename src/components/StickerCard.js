import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

// Constants for layout
const MAIN_ICON_SIZE = 80;
const PREVIEW_SIZE = 48;
const MAX_PREVIEWS = 5;

// --- Components ---

// Sparkle Component (Reused)
const Sparkles = ({ active }) => {
    const { colors } = useTheme();
    const particles = range(6).map((_, i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const radius = 25;
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            anim: useRef(new Animated.Value(0)).current,
        };
    });

    useEffect(() => {
        if (active) {
            particles.forEach(p => p.anim.setValue(0));
            Animated.stagger(50, particles.map(p =>
                Animated.timing(p.anim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.exp),
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
                const opacity = p.anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
                const scale = p.anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

                return (
                    <Animated.View
                        key={i}
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: colors.primary,
                            transform: [{ translateX }, { translateY }, { scale }],
                            opacity,
                            marginLeft: -3,
                            marginTop: -3,
                        }}
                    />
                );
            })}
        </View>
    );
};

// Animated Broken Heart Component
const AnimatedBrokenHeart = ({ progress, scale, color, size = 28 }) => {
    // Split the heart path into Left and Right halves
    // Approximate split around x=12
    // Full: M12 21.35...

    // Left Half Path (Cut line: 12,21.35 -> 12,5)
    // Using a simple cut for clean animation
    const leftPath = "M12 21.35 C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3 c1.74 0 3.41.81 4.5 2.09 C12.5 5.8 12 7 12 8 L12 21.35 Z";
    // Wait, the path needs to be precise. 
    // Let's use the full path but Clip it? No, SVG clipping in RN is tricky with animation.
    // Let's use two distinct paths that LOOK like a heart when joined.

    // Simpler Paths for "Broken Heart" style
    const leftHalf = "M12 21.35 L12 8 C12 8 11.5 6 10 5.5 C8 4.5 7.5 3 7.5 3 C4.42 3 2 5.42 2 8.5 C2 12.28 5.4 15.36 12 21.35 Z";
    // Fixed curve logic for left side
    const pLeft = "M12 21.35 C5.4 15.36 2 12.28 2 8.5 C2 5.42 4.42 3 7.5 3 C9.24 3 10.91 3.81 12 5.09 L12 21.35 Z";

    const pRight = "M12 21.35 L12 5.09 C13.09 3.81 14.76 3 16.5 3 C19.58 3 22 5.42 22 8.5 C22 12.28 18.6 15.36 12 21.35 Z";

    // Animation: 0 = Broken, 1 = Whole

    // Left Piece transforms
    const leftRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['-15deg', '0deg'] });
    const leftX = progress.interpolate({ inputRange: [0, 1], outputRange: [-3, 0] });
    const leftY = progress.interpolate({ inputRange: [0, 1], outputRange: [2, 0] });

    // Right Piece transforms
    const rightRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['15deg', '0deg'] });
    const rightX = progress.interpolate({ inputRange: [0, 1], outputRange: [3, 0] });
    const rightY = progress.interpolate({ inputRange: [0, 1], outputRange: [-2, 0] });

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <AnimatedG style={{ transform: [{ translateX: leftX }, { translateY: leftY }, { rotate: leftRotate }] }} origin="12, 12">
                    <AnimatedPath
                        d={pLeft}
                        fill={progress.interpolate({ inputRange: [0, 1], outputRange: ["transparent", color] })}
                        stroke={color}
                        strokeWidth={1.5}
                        strokeLinejoin="round"
                    />
                </AnimatedG>
                <AnimatedG style={{ transform: [{ translateX: rightX }, { translateY: rightY }, { rotate: rightRotate }] }} origin="12, 12">
                    <AnimatedPath
                        d={pRight}
                        fill={progress.interpolate({ inputRange: [0, 1], outputRange: ["transparent", color] })}
                        stroke={color}
                        strokeWidth={1.5} // slightly thinner to match when joined?
                        strokeLinejoin="round"
                    />
                </AnimatedG>
            </Svg>
        </Animated.View>
    );
};


// Helper
const range = n => Array.from({ length: n }, (_, i) => i);

export const StickerCard = ({
    packageTitle = "Pacote de stickers",
    animeTitle = "Nome do Anime",
    animeCover,
    mainIcon,
    stickers = [],
    totalStickers = 0,
    onSteal,
    onLike,
    onAnimePress,
    isLiked = false,
}) => {
    const { colors, typography, borderRadius, shadows, spacing } = useTheme();

    // --- Animations ---
    const likedProgress = useRef(new Animated.Value(isLiked ? 1 : 0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [triggerSparkles, setTriggerSparkles] = useState(false);

    useEffect(() => {
        if (isLiked) {
            setTriggerSparkles(true);
            // 1. Join Parts (0 -> 1)
            Animated.parallel([
                Animated.timing(likedProgress, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: false, // SVG Colors/Paths usually need JS driver or Layout props
                    easing: Easing.elastic(1.2),
                }),
                // 2. Pulse
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
                ])
            ]).start();
        } else {
            setTriggerSparkles(false);
            // Break Parts (1 -> 0)
            Animated.timing(likedProgress, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
                easing: Easing.out(Easing.bounce),
            }).start();
        }
    }, [isLiked]);

    const displayCount = Math.min(stickers.length, MAX_PREVIEWS);
    const visibleStickers = stickers.slice(0, displayCount);

    const hasMore = totalStickers > MAX_PREVIEWS;
    const remainingCount = Math.max(0, totalStickers - MAX_PREVIEWS + 1);

    return (
        <View style={[
            styles.cardContainer,
            {
                backgroundColor: colors.surface,
                borderRadius: borderRadius.xl,
                ...shadows.soft, // Using existing shadow
                borderColor: colors.border,
                borderWidth: 1,
            }
        ]}>
            {/* Top Row: Main Icon + Content */}
            <View style={styles.mainRow}>
                <View style={styles.iconColumn}>
                    <View style={[
                        styles.mainIconWrapper,
                        {
                            backgroundColor: colors.background,
                            borderRadius: borderRadius.round,
                            width: MAIN_ICON_SIZE,
                            height: MAIN_ICON_SIZE,
                        }
                    ]}>
                        {mainIcon ? (
                            <Image source={mainIcon} style={styles.mainIcon} resizeMode="cover" />
                        ) : (
                            <View style={{ flex: 1, backgroundColor: colors.border, borderRadius: borderRadius.round }} />
                        )}
                    </View>
                </View>

                <View style={styles.contentColumn}>
                    <View style={styles.headerRow}>
                        <Text numberOfLines={1} style={[styles.packageTitle, { color: colors.text, fontSize: typography.size.md }]}>
                            {packageTitle}
                        </Text>

                        {/* Interactive Heart */}
                        <TouchableOpacity onPress={onLike} style={{ padding: 4 }} activeOpacity={0.8} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <View>
                                <Sparkles active={triggerSparkles} />
                                <AnimatedBrokenHeart
                                    progress={likedProgress}
                                    scale={pulseAnim}
                                    color={colors.primary}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.previewRow, { justifyContent: 'space-between' }]}>
                        {visibleStickers.map((sticker, index) => {
                            const isLastItem = index === MAX_PREVIEWS - 1;
                            const showOverlay = isLastItem && hasMore;

                            return (
                                <View key={index} style={[
                                    styles.previewBox,
                                    {
                                        backgroundColor: colors.border,
                                        borderRadius: borderRadius.md,
                                        width: '18%',
                                        aspectRatio: 1,
                                    }
                                ]}>
                                    <Image source={sticker} style={styles.previewImage} resizeMode="cover" />
                                    {showOverlay && (
                                        <View style={[
                                            StyleSheet.absoluteFill,
                                            {
                                                backgroundColor: 'rgba(255,255,255,0.85)',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }
                                        ]}>
                                            <Text style={[styles.moreText, { color: colors.text, fontWeight: 'bold' }]}>
                                                +{remainingCount}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>

            <View style={[styles.footerRow, { marginTop: spacing.md }]}>
                <TouchableOpacity onPress={onAnimePress} style={styles.animeLinkContainer}>
                    <View style={[
                        styles.animeDotWrapper,
                        {
                            width: 24, height: 24, borderRadius: 12, marginRight: 8,
                            backgroundColor: colors.border, overflow: 'hidden'
                        }
                    ]}>
                        {animeCover ? (
                            <Image source={animeCover} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                        ) : null}
                    </View>
                    <Text numberOfLines={1} style={[styles.animeName, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
                        {animeTitle}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onSteal}
                    style={[
                        styles.stealButton,
                        {
                            borderColor: colors.error,
                            borderWidth: 1.5,
                            borderRadius: borderRadius.round,
                        }
                    ]}
                >
                    <Text style={[styles.stealButtonText, { color: colors.error, fontWeight: '700' }]}>
                        Steal package
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        padding: 12,
        marginBottom: 16,
        width: '100%',
    },
    mainRow: {
        flexDirection: 'row',
    },
    iconColumn: {
        marginRight: 12,
        justifyContent: 'center',
    },
    mainIconWrapper: {
        overflow: 'hidden',
    },
    mainIcon: {
        width: '100%',
        height: '100%',
    },
    contentColumn: {
        flex: 1,
        justifyContent: 'space-between',
        height: MAIN_ICON_SIZE,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    packageTitle: {
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    previewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    previewBox: {
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    moreText: {
        fontSize: 12,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
    },
    animeLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    animeDotWrapper: {
    },
    animeName: {
        flex: 1,
        fontWeight: '500',
    },
    stealButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    stealButtonText: {
        fontSize: 12,
    }
});

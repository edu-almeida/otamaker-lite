import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

const range = n => Array.from({ length: n }, (_, i) => i);

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

export const AnimatedBrokenHeart = ({
    isLiked,
    onToggle,
    size = 28,
    activeColor,
    inactiveColor
}) => {
    const progress = useRef(new Animated.Value(isLiked ? 1 : 0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [triggerSparkles, setTriggerSparkles] = useState(false);

    useEffect(() => {
        if (isLiked) {
            setTriggerSparkles(true);
            Animated.parallel([
                Animated.timing(progress, {
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
            Animated.timing(progress, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
                easing: Easing.out(Easing.bounce),
            }).start();
        }
    }, [isLiked]);

    // Paths
    const pLeft = "M12 21.35 C5.4 15.36 2 12.28 2 8.5 C2 5.42 4.42 3 7.5 3 C9.24 3 10.91 3.81 12 5.09 L12 21.35 Z";
    const pRight = "M12 21.35 L12 5.09 C13.09 3.81 14.76 3 16.5 3 C19.58 3 22 5.42 22 8.5 C22 12.28 18.6 15.36 12 21.35 Z";

    // Interpolations
    const leftRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['-20deg', '0deg'] });
    const leftX = progress.interpolate({ inputRange: [0, 1], outputRange: [-4, 0] });
    const leftY = progress.interpolate({ inputRange: [0, 1], outputRange: [2, 0] });

    const rightRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['20deg', '0deg'] });
    const rightX = progress.interpolate({ inputRange: [0, 1], outputRange: [4, 0] });
    const rightY = progress.interpolate({ inputRange: [0, 1], outputRange: [-2, 0] });

    const strokeColor = progress.interpolate({ inputRange: [0, 1], outputRange: [inactiveColor, activeColor] });
    const fillColor = progress.interpolate({ inputRange: [0, 0.8, 1], outputRange: ["transparent", "transparent", activeColor] });

    return (
        <TouchableOpacity
            onPress={onToggle}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ padding: 4 }}
        >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                        <AnimatedG style={{ transform: [{ translateX: leftX }, { translateY: leftY }, { rotate: leftRotate }] }} origin="12, 12">
                            <AnimatedPath d={pLeft} fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
                        </AnimatedG>
                        <AnimatedG style={{ transform: [{ translateX: rightX }, { translateY: rightY }, { rotate: rightRotate }] }} origin="12, 12">
                            <AnimatedPath d={pRight} fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
                        </AnimatedG>
                    </Svg>
                </Animated.View>
                {/* Sparkles on top */}
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                    <Sparkles active={triggerSparkles} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

// Basic pulsing block
export const Skeleton = ({ width, height, style, borderRadius }) => {
    const { colors } = useTheme();
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    backgroundColor: colors.border, // Use border color as base gray
                    opacity,
                    borderRadius: borderRadius || 4,
                },
                style,
            ]}
        />
    );
};

// Full Page Skeleton Layout mimicking our Grid
export const ScreenSkeleton = () => {
    const { spacing } = useTheme();
    const CARD_WIDTH = (width - 48) / 2; // Mimic SearchScreen grid

    return (
        <View style={styles.container}>
            {/* Header / Search Bar Placeholder */}
            <View style={{ margin: 16 }}>
                <Skeleton width="100%" height={50} borderRadius={12} />
            </View>

            {/* Grid Content */}
            <View style={styles.grid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <View key={i} style={{ marginBottom: 16 }}>
                        <Skeleton width={CARD_WIDTH} height={CARD_WIDTH * 1.5} borderRadius={8} />
                        <View style={{ marginTop: 8 }}>
                            <Skeleton width={CARD_WIDTH * 0.8} height={16} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    }
});

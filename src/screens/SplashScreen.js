import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

/**
 * SplashScreen
 * Displays the app logo with an animation before navigating to Home.
 */
export const SplashScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Start animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Wait a bit and then navigate
            setTimeout(() => {
                navigation.replace('Main');
            }, 1500);
        });
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
                <Text style={styles.title}>Otamaker <Text style={styles.lite}>LITE</Text></Text>
                <Text style={styles.subtitle}>ステッカーでアニメ</Text>
            </Animated.View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Design by S Stheck</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    lite: {
        fontWeight: '300',
    },
    subtitle: {
        fontSize: 18,
        color: '#EEEEEE',
        textAlign: 'center',
        marginTop: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
    },
    footerText: {
        color: '#FFFFFF',
        fontSize: 12,
        opacity: 0.8,
    },
});

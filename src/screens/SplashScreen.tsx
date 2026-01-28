import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';
import AdService from '../services/AdService';

const { width } = Dimensions.get('window');

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { colors, dark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const initApp = async () => {
      // Animação de entrada
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
      ]).start();

      // Inicializar serviços essenciais
      try {
        await Promise.all([
          AdService.initialize(), // Inicializa AdMob
          AdService.preloadAds(), // Pré-carrega primeiro Interstitial
          // Simula carregamento de outros recursos (temas/idiomas já são carregados nos Providers)
          new Promise(resolve => setTimeout(resolve, 2000)), 
        ]);
      } catch (e) {
        console.warn('Erro na inicialização:', e);
      } finally {
        navigation.replace('Main');
      }
    };

    initApp();
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        backgroundColor="transparent" 
        translucent 
        barStyle={dark ? 'light-content' : 'dark-content'} 
      />
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <Text style={[styles.title, { color: colors.primary }]}>
          Otamaker <Text style={[styles.lite, { color: colors.secondary }]}>LITE</Text>
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>ステッカーでアニメ</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Design by S Stheck</Text>
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

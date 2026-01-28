import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  Image,
  Modal,
  Platform
} from 'react-native';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useSideMenu } from '../contexts/SideMenuContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Helper for staggered animation
const FadeInView: React.FC<{ delay: number; children: React.ReactNode; show: boolean; align?: 'flex-start' | 'center' | 'flex-end' }> = ({ delay, children, show, align = 'center' }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (show) {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(translateAnim, {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          })
        ])
      ]).start();
    } else {
      fadeAnim.setValue(0);
      translateAnim.setValue(20);
    }
  }, [show, delay]);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: translateAnim }], width: '100%', alignItems: align }}>
      {children}
    </Animated.View>
  );
};

const PremiumFeature: React.FC<{ icon: string, text: string, color: string }> = ({ icon, text, color }) => {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIconContainer}>
        {icon === 'ads' && (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}>
            <Circle cx="12" cy="12" r="10" />
            <Path d="m15 9-6 6M9 9l6 6" />
          </Svg>
        )}
        {icon === 'support' && (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill={color}>
            <Path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
          </Svg>
        )}
        {icon === 'pigeon' && (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M16 7h.01" />
            <Path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
            <Path d="m20 7 2 .5-2 .5" />
            <Path d="M10 18v3" />
            <Path d="M14 17.75V21" />
            <Path d="M7 18a6 6 0 0 0 3.84-10.61" />
          </Svg>
        )}
        {icon === 'bolt' && (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill={color}>
            <Path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </Svg>
        )}
        {icon === 'heart' && (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill={color}>
            <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </Svg>
        )}
        {icon === 'star' && (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill={color}>
            <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </Svg>
        )}
        {icon === 'updates' && (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
             <Path d="M21.5 2v6h-6M2.5 22v-6h6M2 12c0-4.4 3.6-8 8-8 3.3 0 6.2 2 7.4 5M22 12c0 4.4-3.6 8-8 8-3.3 0-6.2-2-7.4-5" />
          </Svg>
        )}
        {icon === 'fire' && (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill={color}>
            <Path d="M12 18c-2.21 0-4-1.79-4-4 0-1.22.55-2.31 1.42-3.04.14-.13.36-.02.32.17-.4.99-.25 2.13.43 2.97.07.09.22.09.28.01.63-.84.81-2.07.49-3.07-.05-.16.14-.3.26-.18 1.01.99 1.7 2.41 1.7 4.02 0 1.66-1.34 3-3 3z" />
            <Path d="M15.26 13c-.09-.08-.13-.21-.06-.31.84-1.21 1.1-2.61.73-3.95-.14-.52-.36-1.01-.65-1.46-.07-.12.04-.26.16-.21.82.35 1.54.91 2.08 1.62.9 1.18 1.16 2.76.71 4.19-.15.48-.39.93-.72 1.34-.09.11-.27.1-.34-.03-.1-.13-.2-.25-.32-.36l.24.16z" />
            <Path d="M12 2c0 0-3.34 2.89-3.34 7 0 1.25.43 2.4 1.15 3.3.06.08.06.18 0 .25C8.82 13.55 8 14.68 8 16c0 2.21 1.79 4 4 4s4-1.79 4-4c0-1.32-.82-2.45-1.81-3.45-.06-.07-.06-.17 0-.25.72-.9 1.15-2.05 1.15-3.3C15.34 4.89 12 2 12 2z" />
          </Svg>
        )}
        {icon === 'shield' && (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </Svg>
        )}
      </View>
      <Text style={[styles.featureText, { color }]}>{text}</Text>
    </View>
  );
};

export const PremiumModal: React.FC = () => {
  const { colors, shadows, dark: isDark } = useTheme();
  const { isPremiumModalOpen, closePremiumModal } = useSideMenu();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  
  const fullText = "Eu sabia que você era especial! Torne-se meu Senpai e desbloqueie tudo 💖 UwU";
  const [displayedText, setDisplayedText] = React.useState("");
  const [showContent, setShowContent] = React.useState(false);

  useEffect(() => {
    if (isPremiumModalOpen) {
      setDisplayedText("");
      setShowContent(false);
      
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setTimeout(() => setShowContent(true), 500);
        }
      }, 25);

      return () => clearInterval(intervalId);
    }
  }, [isPremiumModalOpen]);

  useEffect(() => {
    if (isPremiumModalOpen) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [isPremiumModalOpen]);

  if (!isPremiumModalOpen) return null;

  return (
    <Modal
      transparent
      visible={isPremiumModalOpen}
      animationType="fade"
      onRequestClose={closePremiumModal}
    >
      <View style={styles.overlay}>
        <Animated.View style={[
          styles.modalContainer, 
          { 
            backgroundColor: isDark ? '#1C1C1E' : '#E8E2DE',
            transform: [{ scale: scaleAnim }] 
          }
        ]}>
          
          {/* Character Image */}
          <View style={styles.imageContainer}>
             <Image 
                source={require('../assets/xd/maki-coracao.gif')} 
                style={styles.characterImage}
                resizeMode="contain"
             />
          </View>

          {/* Speech Bubble */}
          <View style={styles.speechBubbleContainer}>
             <View style={styles.speechBubbleTriangle} />
             <View style={styles.speechBubble}>
                <Text style={styles.speechText}>{displayedText}</Text>
             </View>
          </View>

          {/* Content */}
          {/* Content - Only shown after typing finishes */}
          {showContent && (
            <View style={styles.contentContainer}>
              <FadeInView show={showContent} delay={0} align="flex-start">
                <Text style={[styles.title, { color: colors.text }]}>Como um verdadeiro Senpai:</Text>
              </FadeInView>
              
              <View style={styles.featuresList}>
                <FadeInView show={showContent} delay={100} align="flex-start">
                  <PremiumFeature icon="ads" text="Zero Anúncios" color={colors.primary} />
                </FadeInView>
                <FadeInView show={showContent} delay={200} align="flex-start">
                  <PremiumFeature icon="bolt" text="Downloads Ilimitados" color={isDark ? colors.text : '#444'} />
                </FadeInView>
                <FadeInView show={showContent} delay={300} align="flex-start">
                  <PremiumFeature icon="updates" text="Conteúdo Sempre Atualizado" color={isDark ? colors.text : '#444'} />
                </FadeInView>
                <FadeInView show={showContent} delay={400} align="flex-start">
                  <PremiumFeature icon="fire" text="Acesso Antecipado a Recursos" color={isDark ? colors.text : '#444'} />
                </FadeInView>
                <FadeInView show={showContent} delay={500} align="flex-start">
                  <PremiumFeature icon="pigeon" text="Dê comida aos pombos" color={isDark ? colors.text : '#444'} />
                </FadeInView>
              </View>

              <FadeInView show={showContent} delay={600}>
                {/* CTA Button */}
                <TouchableOpacity 
                  style={[styles.ctaButton, { backgroundColor: colors.primary }]}
                  activeOpacity={0.8}
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="white" style={{ marginRight: 8 }}>
                    <Path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5zM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19z" />
                  </Svg>
                  <Text style={styles.ctaText}>Virar Senpai</Text>
                </TouchableOpacity>
              </FadeInView>

              <FadeInView show={showContent} delay={700}>
                <Text style={[styles.priceText, { color: colors.textSecondary }]}>
                  Apenas <Text style={{ color: colors.text, fontWeight: 'bold' }}>R$ 5,97</Text> por mês
                </Text>
              </FadeInView>

              <FadeInView show={showContent} delay={800}>
                {/* Close Button */}
                <TouchableOpacity 
                  style={styles.closeBtn} 
                  onPress={closePremiumModal}
                  activeOpacity={0.6}
                >
                  <Text style={[styles.closeBtnText, { color: colors.textSecondary }]}>Talvez na próxima...</Text>
                </TouchableOpacity>
              </FadeInView>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    overflow: 'hidden',
    paddingBottom: 24,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  characterImage: {
    width: '90%',
    height: '100%',
  },
  speechBubbleContainer: {
    paddingHorizontal: 20,
    marginTop: -40,
    alignItems: 'center',
  },
  speechBubbleTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12, // +2 of each side to add 4 in total width
    borderRightWidth: 12,
    borderBottomWidth: 23, // 15 + 8
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#262626',
    alignSelf: 'center',
    marginBottom: -1, 
  },
  speechBubble: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 12,
    width: '100%',
  },
  speechText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  speechTextSub: {
    color: 'white',
    fontSize: 15,
    opacity: 0.9,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  featuresList: {
    width: '100%',
    gap: 12,
    marginBottom: 30,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIconContainer: {
    width: 24,
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
  },
  ctaButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 16,
    shadowColor: '#E31C25',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    paddingVertical: 8,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  priceText: {
    fontSize: 14,
    marginBottom: 12,
  }
});

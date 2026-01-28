import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  Linking,
  BackHandler,
  PanResponder,
  Easing,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Line, Polyline, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useSideMenu } from '../contexts/SideMenuContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MENU_WIDTH = SCREEN_WIDTH * 0.75;

// --- Icons ---

const MenuIcon = ({ name, color, mirrored }: { name: string, color: string, mirrored?: boolean }) => {
  const iconContent = (() => {
    switch (name) {
      case 'instagram':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <Path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <Line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </Svg>
        );
      case 'tiktok':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
          </Svg>
        );
      case 'globe':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
            <Line x1="2" y1="12" x2="22" y2="12" />
            <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </Svg>
        );
      case 'plus':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Line x1="12" y1="5" x2="12" y2="19" />
            <Line x1="5" y1="12" x2="19" y2="12" />
          </Svg>
        );
      case 'apps':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="7.5" cy="7.5" r="1.5" fill={color} />
            <Circle cx="16.5" cy="7.5" r="1.5" fill={color} />
            <Circle cx="7.5" cy="16.5" r="1.5" fill={color} />
            <Circle cx="16.5" cy="16.5" r="1.5" fill={color} />
          </Svg>
        );
      case 'bug':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Rect width="8" height="14" x="8" y="6" rx="4" />
            <Path d="m19 7-3 2" />
            <Path d="m5 7 3 2" />
            <Path d="m19 19-3-2" />
            <Path d="m5 19 3-2" />
            <Path d="M20 13h-4" />
            <Path d="M4 13h4" />
            <Path d="m10 4 1 2" />
            <Path d="m14 4-1 2" />
          </Svg>
        );
      case 'privacy':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <Path d="M12 8v4" />
            <Path d="M12 16h.01" />
          </Svg>
        );
      case 'terms':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <Polyline points="14 2 14 8 20 8" />
            <Line x1="16" y1="13" x2="8" y2="13" />
            <Line x1="16" y1="17" x2="8" y2="17" />
            <Polyline points="10 9 9 9 8 9" />
          </Svg>
        );
      case 'crown':
        return (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="white">
            <Path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5zM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19z" />
          </Svg>
        );
      case 'hamburger':
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M4 7h16M4 12h12M4 17h16"
              stroke={color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'shopping':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <Path d="M3 6h18" />
            <Path d="M16 10a4 4 0 0 1-8 0" />
          </Svg>
        );
      case 'history':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <Path d="M3 3v5h5" />
            <Path d="M12 7v5l4 2" />
          </Svg>
        );
      case 'x':
        return (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill={color}>
            <Path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </Svg>
        );
      case 'youtube':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <Polyline points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill={color} />
          </Svg>
        );
      case 'threads':
        return (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M10 13c0 2.21 1.79 4 4 4s4-1.79 4-4a8 8 0 1 0-8 8" />
            <Path d="M10 8c0 2.2 1.8 4 4 4" />
          </Svg>
        );
      default:
        return null;
    }
  })();

  if (mirrored) {
    return (
      <View style={{ transform: [{ scaleX: -1 }] }}>
        {iconContent}
      </View>
    );
  }

  return iconContent;
};

// --- Animated Star Component ---

const AnimatedStar = ({ delay }: { delay: number }) => {
  const startX = MENU_WIDTH - 40;
  const startY = Math.random() * 80;
  const animX = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const runAnimation = () => {
      animX.setValue(0);
      animY.setValue(0);
      opacity.setValue(0);
      scale.setValue(0.5);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(animX, {
            toValue: -MENU_WIDTH,
            duration: 3000 + Math.random() * 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(animY, {
            toValue: (Math.random() - 0.5) * 60,
            duration: 3000 + Math.random() * 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.6, duration: 500, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 2500, useNativeDriver: true }),
          ]),
          Animated.timing(scale, {
            toValue: 0.4 + Math.random() * 2.1, // Increased max size and variety
            duration: 3000,
            useNativeDriver: true,
          })
        ])
      ]).start(() => runAnimation());
    };

    runAnimation();
  }, [delay, animX, animY, opacity, scale]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        top: startY,
        transform: [{ translateX: animX }, { translateY: animY }, { scale }],
        opacity,
      }}
    >
      <Svg width={12} height={12} viewBox="0 0 24 24" fill="white">
        <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21L12 17.77L5.82 21L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </Svg>
    </Animated.View>
  );
};

// --- Menu Item Component ---

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  color: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress, color }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.6}>
    <View style={styles.menuIconContainer}>
      <MenuIcon name={icon} color={color} />
    </View>
    <Text style={[styles.menuItemLabel, { color }]}>{label}</Text>
  </TouchableOpacity>
);

// --- SideMenu Component ---

export const SideMenu: React.FC = () => {
  const { colors, typography, dark: isDark } = useTheme();
  const { isOpen, closeMenu, openPremiumModal } = useSideMenu();
  const insets = useSafeAreaInsets();
  
  const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Fechar no botão voltar do Android
  useEffect(() => {
    const onBackPress = () => {
      if (isOpen) {
        closeMenu();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [isOpen, closeMenu]);

  // Gesto para arrastar e fechar (PanResponder)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Ativa se arrastar para a esquerda com certa distância
        return isOpen && Math.abs(gestureState.dx) > 10 && gestureState.dx < 0;
      },
      onPanResponderMove: (_, gestureState) => {
        // Apenas para a esquerda, e não deixa passar da origem
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(-MENU_WIDTH, gestureState.dx));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Se arrastou mais de 25% da largura, fecha. Senão, volta.
        if (Math.abs(gestureState.dx) > MENU_WIDTH / 4) {
          closeMenu();
        } else {
          // Re-anima para aberto
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    })
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isOpen ? 0 : -MENU_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  // No early return to avoid internal property access, transform keeps it hidden

  const handleLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    closeMenu();
  };

  const internalHeaderHeight = 56 + insets.top;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 10000 }]} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={closeMenu}>
        <Animated.View 
          style={[
            styles.backdrop, 
            { opacity: backdropOpacity }
          ]} 
        />
      </TouchableWithoutFeedback>

      {/* Menu Content */}
      <Animated.View 
        {...panResponder.panHandlers}
        style={[
          styles.menuContainer, 
          { 
            backgroundColor: colors.background,
            transform: [{ translateX }],
            width: MENU_WIDTH,
          }
        ]}
      >
        {/* Internal Header (Mirrored Toggle) */}
        <View style={[styles.internalHeader, { height: internalHeaderHeight, paddingTop: insets.top }]}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={closeMenu}
            activeOpacity={0.7}
          >
            <View style={styles.closeMenuButton}>
              <MenuIcon name="hamburger" color={colors.text} mirrored />
            </View>
            <Text style={[styles.internalHeaderText, { color: colors.text }]}>Menu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bannerWrapper}>
          {/* Seja Otafan! Luxury Banner */}
          <TouchableOpacity 
            onPress={() => {
              closeMenu();
              openPremiumModal();
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FF3B5C', '#E31C25']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.banner}
            >
              {/* Background Stars - Even more quantity for a rich feel */}
              {[...Array(24)].map((_, i) => (
                <AnimatedStar key={i} delay={i * 200} />
              ))}

              <View style={styles.bannerLeftContent}>
                <View style={styles.crownContainer}>
                  <MenuIcon name="crown" color="white" />
                </View>
                <View style={styles.bannerTextContainer}>
                  <Text style={styles.bannerText}>Seja Senpai!</Text>
                </View>
              </View>

              <Image 
                source={require('../assets/xd/maki-oculos-burguesa.webp')} 
                style={styles.makiAsset}
                resizeMode="contain"
              />
              
              {/* Overlay Gradient for readability */}
              <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0.5, y: 0.5 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Follow Us Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Follow Us</Text>
            <MenuItem icon="instagram" label="Instagram" onPress={() => handleLink('https://instagram.com')} color={colors.text} />
            <MenuItem icon="tiktok" label="TikTok" onPress={() => handleLink('https://tiktok.com')} color={colors.text} />
            <MenuItem icon="x" label="X" onPress={() => handleLink('https://x.com')} color={colors.text} />
            <MenuItem icon="youtube" label="YouTube" onPress={() => handleLink('https://youtube.com')} color={colors.text} />
            <MenuItem icon="threads" label="Threads" onPress={() => handleLink('https://threads.net')} color={colors.text} />
            <MenuItem icon="globe" label="Otamaker project" onPress={() => handleLink('https://otamaker.com')} color={colors.text} />
          </View>

          {/* App Info Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>App Info</Text>
            <MenuItem icon="plus" label="Collaborate" onPress={() => console.log('Collaborate')} color={colors.text} />
            <MenuItem icon="apps" label="More apps" onPress={() => console.log('More apps')} color={colors.text} />
            <MenuItem icon="bug" label="Report a bug" onPress={() => console.log('Bug report')} color={colors.text} />
            <MenuItem icon="privacy" label="Terms of privacy" onPress={() => console.log('Privacy')} color={colors.text} />
            <MenuItem icon="terms" label="Terms of use" onPress={() => console.log('Terms')} color={colors.text} />
          </View>
        </ScrollView>

        {/* Version Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
           <Text style={[styles.versionText, { color: colors.textSecondary }]}>v1.0.0 Stable</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9998,
  },
  menuContainer: {
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 9999,
  },
  header: {
    backgroundColor: 'transparent',
  },
  internalHeader: {
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  closeMenuButton: {
    padding: 8,
  },
  internalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  bannerWrapper: {
    marginTop: 0,
  },
  banner: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    height: 100,
  },
  bannerLeftContent: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  bannerTextContainer: {
    padding: 4,
  },
  bannerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  makiAsset: {
    width: 160,
    height: 160,
    position: 'absolute',
    right: -10,
    bottom: -38, // More aggressive negative to ensure she touches the floor
    zIndex: 5,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crownContainer: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    paddingVertical: 24,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuIconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 'auto',
  },
  versionText: {
    fontSize: 12,
    opacity: 0.6,
  },
  otaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  otaBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

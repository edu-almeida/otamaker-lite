import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated, Easing } from 'react-native';
import { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useSideMenu } from '../contexts/SideMenuContext';

interface BackButtonProps {
  color: string;
  activeColor: string;
  onPress: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ color, activeColor, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backButton} activeOpacity={0.7}>
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M15 19l-7-7 7-7"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
};

const MenuButton: React.FC<{ color: string, onPress: () => void }> = ({ color, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backButton} activeOpacity={0.7}>
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 7h16M4 12h12M4 17h16"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
};

/**
 * Props do GlobalHeader
 * Permite props adicionais do React Navigation serem passados
 */
export interface GlobalHeaderProps {
  title?: string;
  showBack?: boolean;
  rightComponent?: ReactNode;
  // Permite props adicionais do React Navigation
  [key: string]: any;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ title, showBack, rightComponent, ...rest }) => {
  const { colors, typography, spacing, shadows, dark: isDark } = useTheme();
  const { toggleMenu } = useSideMenu();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const headerHeight = 56 + insets.top;

  return (
    <View style={[
      styles.headerWrapper,
      {
        backgroundColor: colors.background,
        height: headerHeight,
        paddingTop: insets.top,
      }
    ]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />

      <View style={styles.toolbarContainer}>

        {/* Left Section (Back Button, Menu or Spacer) */}
        <View style={styles.leftContainer}>
          {showBack ? (
            <BackButton
              color={colors.text}
              activeColor={colors.primary}
              onPress={() => navigation.goBack()}
            />
          ) : (
            <MenuButton
              color={colors.text}
              onPress={() => toggleMenu()}
            />
          )}
        </View>

        {/* Center Section (Title) */}
        <View style={styles.centerContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Otamaker <Text style={{ fontWeight: '300' }}>LITE</Text>
          </Text>
        </View>

        {/* Right Section (Actions) */}
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    zIndex: 100,
  },
  toolbarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  }
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { DEV_CONFIG } from '../config/devConfig';

// Import all screens
// Import all screens
import { 
  HomeScreen, 
  AnimeCatalogScreen, 
  OtamaLibraryScreen,
  OtamaProfileScreen, 
  PackDetailsScreen, 
  AnimeDetailsScreen, 
  SplashScreen 
} from '../screens';

/**
 * Map of screen names to their components.
 * Used by DevScreen to render the target screen.
 */
const SCREEN_MAP: Record<string, React.FC<any>> = {
  HomeScreen,
  AnimeCatalogScreen,
  OtamaLibraryScreen,
  OtamaProfileScreen,
  PackDetailsScreen,
  AnimeDetailsScreen,
  SplashScreen,
};

/**
 * DevScreen renders a single screen in isolation for development/testing.
 * It wraps the screen in a NavigationContainer to provide navigation context.
 */
export const DevScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const { targetScreen, mockProps } = DEV_CONFIG;
  
  const TargetComponent = SCREEN_MAP[targetScreen];
  
  if (!TargetComponent) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Screen "{targetScreen}" not found!
        </Text>
        <Text style={[styles.helpText, { color: colors.textSecondary }]}>
          Available screens: {Object.keys(SCREEN_MAP).join(', ')}
        </Text>
      </View>
    );
  }

  // Create mock navigation and route objects
  const mockNavigation = {
    navigate: (screen: string, params?: any) => {
      console.log(`[DEV] Navigate to: ${screen}`, params);
    },
    goBack: () => {
      console.log('[DEV] Go back');
    },
    replace: (screen: string, params?: any) => {
      console.log(`[DEV] Replace with: ${screen}`, params);
    },
    setOptions: () => {},
    addListener: () => () => {},
    removeListener: () => {},
    isFocused: () => true,
    canGoBack: () => false,
    getParent: () => null,
    getState: () => ({}),
    dispatch: () => {},
    reset: () => {},
    setParams: () => {},
    getId: () => undefined,
  };

  const mockRoute = {
    key: 'dev-screen',
    name: targetScreen,
    params: mockProps || {},
  };

  return (
    <NavigationContainer>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.devBanner, { backgroundColor: colors.primary }]}>
          <Text style={styles.devBannerText}>
            🛠️ DEV MODE: {targetScreen}
          </Text>
        </View>
        <View style={styles.screenContainer}>
          <TargetComponent 
            navigation={mockNavigation as any} 
            route={mockRoute as any}
          />
        </View>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  devBanner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  devBannerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  screenContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

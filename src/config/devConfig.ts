/**
 * Configuration for development mode.
 * Allows testing individual screens without going through the full app flow.
 * 
 * Usage:
 * 1. Set `enabled: true`
 * 2. Set `targetScreen` to the screen you want to test
 * 3. Run the app
 * 4. Set `enabled: false` when done to restore normal app flow
 */

export type DevTargetScreen = 
  | 'HomeScreen'
  | 'SearchScreen'
  | 'DownloadsScreen'
  | 'DetailsScreen'
  | 'InfoScreen'
  | 'AnimeDetailsScreen'
  | 'SplashScreen';

interface DevConfig {
  /** Enable dev mode to bypass normal navigation */
  enabled: boolean;
  /** Which screen to render in isolation */
  targetScreen: DevTargetScreen;
  /** Mock props to pass to the screen */
  mockProps?: Record<string, unknown>;
}

export const DEV_CONFIG: DevConfig = {
  enabled: false,
  targetScreen: 'HomeScreen',
  mockProps: {
    // Add mock route params here when needed
    // e.g., animeTitle: 'Test Anime'
  },
};

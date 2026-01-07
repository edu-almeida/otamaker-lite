import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { DownloadsScreen } from '../screens/DownloadsScreen';
import { InfoScreen } from '../screens/InfoScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { AnimeDetailsScreen } from '../screens/AnimeDetailsScreen';
import { SplashScreen } from '../screens/SplashScreen';

import { HomeIcon, SearchIcon, DownloadIcon } from '../components/TabIcons';
import { useTheme } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
    const { t } = useTranslation();
    const { colors, shadows } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    ...shadows.top // Use 'top' shadow for tab bar if standard, or just flat
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => <HomeIcon color={color} filled={focused} />,
                }}
            />
            <Tab.Screen
                name="SearchTab"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => <SearchIcon color={color} filled={focused} />,
                }}
            />
            <Tab.Screen
                name="DownloadsTab"
                component={DownloadsScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => <DownloadIcon color={color} filled={focused} />,
                }}
            />

        </Tab.Navigator>
    );
};

export const AppNavigator = () => {
    const { colors, fonts } = useTheme();

    // React Navigation Theme Structure
    const navigationTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
            primary: colors.primary,
        },
        fonts: fonts, // Explicitly pass our fonts object
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="Details" component={DetailsScreen} />
                <Stack.Screen name="AnimeDetails" component={AnimeDetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

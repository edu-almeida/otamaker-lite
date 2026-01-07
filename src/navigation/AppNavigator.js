import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { DownloadsScreen } from '../screens/DownloadsScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { AnimeDetailsScreen } from '../screens/AnimeDetailsScreen';
import { SplashScreen } from '../screens/SplashScreen';

import { HomeIcon, SearchIcon, DownloadIcon } from '../components/TabIcons';
import { GlobalHeader } from '../components/GlobalHeader'; // Import GlobalHeader
import { useTheme } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- Bubble Tab Bar Logic ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TabButton = ({ accessibilityState, children, onPress, icon, label, isFocused }) => {
    const { colors, borderRadius } = useTheme();
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: isFocused ? 1 : 0,
            duration: 300,
            useNativeDriver: false, // width/color interp needs false
            easing: Easing.out(Easing.cubic),
        }).start();
    }, [isFocused]);

    const backgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', colors.primaryLight + '20'] // 20% opacity of primary light or just primary with opacity
    });

    // Fallback if primaryLight is not distinct enough, use primary with low opacity
    const activeBgColor = colors.primary + '15'; // 15% opacity hex

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={styles.tabButton}
        >
            <Animated.View style={[
                styles.tabBubble,
                {
                    backgroundColor: isFocused ? activeBgColor : 'transparent',
                    borderRadius: borderRadius.round, // Pill shape
                    paddingHorizontal: isFocused ? 16 : 0,
                }
            ]}>
                {/* Icon is usually passed as children by React Nav, but we want custom layout */}
                {/* We will ignore 'children' passed by Nav and use our own structure */}
                {icon({
                    color: isFocused ? colors.primary : colors.textSecondary,
                    focused: isFocused
                })}

                {isFocused && (
                    <Text style={[styles.tabLabel, { color: colors.primary, marginLeft: 8 }]}>
                        {label}
                    </Text>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

// Custom Tab Bar using standard component prop
const BubbleTabBar = ({ state, descriptors, navigation }) => {
    const { colors, shadows } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.tabBarContainer,
            {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
                paddingBottom: insets.bottom,
                height: 65 + insets.bottom, // Adjust height to include safe area
                ...shadows.top
            }
        ]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                // Get icon from options (we'll define it there)
                const IconFunc = options.tabBarIcon;

                return (
                    <TabButton
                        key={index}
                        onPress={onPress}
                        isFocused={isFocused}
                        label={label}
                        icon={IconFunc}
                    />
                );
            })}
        </View>
    );
};

const MainTabs = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            tabBar={props => <BubbleTabBar {...props} />}
            screenOptions={{
                header: (props) => <GlobalHeader {...props} />, // Use GlobalHeader
                headerShown: true, // Show header by default in tabs
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    headerShown: true, // Use GlobalHeader
                    title: "Home", // Header Title (can be overridden by GlobalHeader logic)
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, focused }) => <HomeIcon color={color} filled={focused} />,
                }}
            />
            <Tab.Screen
                name="SearchTab"
                component={SearchScreen}
                options={{
                    headerShown: true, // Use GlobalHeader
                    title: "Search",
                    tabBarLabel: "Search",
                    tabBarIcon: ({ color, focused }) => <SearchIcon color={color} filled={focused} />,
                }}
            />
            <Tab.Screen
                name="DownloadsTab"
                component={DownloadsScreen}
                options={{
                    headerShown: true,
                    title: "Downloads",
                    tabBarLabel: "Downloads",
                    tabBarIcon: ({ color, focused }) => <DownloadIcon color={color} filled={focused} />,
                }}
            />
        </Tab.Navigator>
    );
};

export const AppNavigator = () => {
    const { colors, fonts } = useTheme();

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
        fonts: fonts,
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator screenOptions={{
                headerShown: false,
                // If we want GlobalHeader on Stack screens:
                // header: (props) => <GlobalHeader {...props} showBack={true} />
            }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Main" component={MainTabs} />
                {/* Details screens usually have their own header with back button */}
                <Stack.Screen
                    name="Details"
                    component={DetailsScreen}
                    options={{
                        headerShown: true,
                        header: (props) => <GlobalHeader {...props} showBack={true} />
                    }}
                />
                <Stack.Screen
                    name="AnimeDetails"
                    component={AnimeDetailsScreen}
                    options={{
                        headerShown: true,
                        header: (props) => <GlobalHeader {...props} showBack={true} />
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        height: 65, // Taller for bubble effect
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        borderTopWidth: 1,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    tabBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        height: 40,
        minWidth: 50,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
    }
});

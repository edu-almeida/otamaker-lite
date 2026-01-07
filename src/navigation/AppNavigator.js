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
import { GlobalHeader } from '../components/GlobalHeader';
import { useTheme } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Constant config for the slider
const TAB_COUNT = 3;
// Calculate width per tab (assuming equal distribution)
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;
const SLIDER_WIDTH = TAB_WIDTH - 24; // Padding 12 on each side for the "Pill" look

const TabButton = ({ accessibilityState, children, onPress, icon, label, isFocused }) => {
    const { colors } = useTheme();
    // Animation for Text/Icon color only
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: isFocused ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
        }).start();
    }, [isFocused]);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1} // No opacity change on press, let the slider do the talking
            accessibilityRole="button"
            style={styles.tabButton}
        >
            <View style={styles.tabContent}>
                {icon({
                    color: isFocused ? colors.primary : colors.textSecondary,
                    focused: isFocused
                })}

                {/* Only render label if focused, with opacity fade */}
                {isFocused && (
                    <Animated.Text
                        numberOfLines={1}
                        style={[
                            styles.tabLabel,
                            {
                                color: colors.primary,
                                opacity: animation,
                            }
                        ]}
                    >
                        {label}
                    </Animated.Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

// Custom Tab Bar using standard component prop
const BubbleTabBar = ({ state, descriptors, navigation }) => {
    const { colors, shadows, borderRadius } = useTheme();
    const insets = useSafeAreaInsets();

    // Animation for the Slider Position (Driven by Index, not Pager Position)
    const translateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(translateValue, {
            toValue: state.index * TAB_WIDTH,
            velocity: 10,
            useNativeDriver: true,
        }).start();
    }, [state.index]);

    return (
        <View style={[
            styles.tabBarContainer,
            {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
                paddingBottom: insets.bottom,
                height: 60 + insets.bottom,
                ...shadows.top
            }
        ]}>
            {/* Sliding Background Pill */}
            <Animated.View style={[
                styles.slider,
                {
                    width: SLIDER_WIDTH,
                    height: 40, // Height of the pill
                    backgroundColor: colors.primary + '20', // Light primary
                    borderRadius: borderRadius.round,
                    transform: [{ translateX: translateValue }],
                    // Centering the slider within the tab slot:
                    // Tab Slot is TAB_WIDTH wide. Slider is SLIDER_WIDTH wide.
                    // Margin left to center it: (TAB_WIDTH - SLIDER_WIDTH) / 2
                    left: (TAB_WIDTH - SLIDER_WIDTH) / 2,
                }
            ]} />

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
                header: (props) => <GlobalHeader {...props} />,
                headerShown: true,
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    headerShown: true,
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => <HomeIcon color={color} filled={focused} />,
                }}
            />
            <Tab.Screen
                name="SearchTab"
                component={SearchScreen}
                options={{
                    headerShown: true,
                    title: "Search",
                    tabBarIcon: ({ color, focused }) => <SearchIcon color={color} filled={focused} />,
                }}
            />
            <Tab.Screen
                name="DownloadsTab"
                component={DownloadsScreen}
                options={{
                    headerShown: true,
                    title: "Downloads",
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
            }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Main" component={MainTabs} />
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
        elevation: 10,
        alignItems: 'center',
        paddingHorizontal: 0,
        borderTopWidth: 1,
    },
    slider: {
        position: 'absolute',
        top: 10, // Vertically center within container
        zIndex: 0,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        zIndex: 1,
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 8,
    }
});

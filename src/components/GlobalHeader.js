import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
const BackButton = ({ color, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
        <Text style={[styles.backText, { color }]}>{'<'}</Text>
    </TouchableOpacity>
);

export const GlobalHeader = ({ title, showBack, rightComponent }) => {
    const { colors, typography, spacing, shadows } = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const headerHeight = 56 + insets.top;

    return (
        <View style={[
            styles.headerWrapper,
            {
                backgroundColor: colors.surface,
                height: headerHeight,
                paddingTop: insets.top,
                ...shadows.soft,
                borderBottomColor: colors.border,
                borderBottomWidth: 1,
            }
        ]}>
            <StatusBar
                barStyle={colors.text === '#ffffff' ? 'light-content' : 'dark-content'}
                backgroundColor="transparent" // Translucent for modern look
                translucent={true}
            />

            <View style={styles.toolbarContainer}>

                {/* Left Section (Back Button or Spacer) */}
                <View style={styles.leftContainer}>
                    {showBack && (
                        <BackButton
                            color={colors.text}
                            onPress={() => navigation.goBack()}
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
        zIndex: 100, // Ensure it sits above content
        elevation: 4, // Android shadow
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
    },
    backText: {
        fontSize: 24,
        fontWeight: '300',
    }
});

import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { AnimeCard } from '../components/AnimeCard';
import { ANIME_PACKS } from '../data/mockData';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export const HomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { colors, spacing, typography } = useTheme();

    const renderItem = ({ item }) => (
        <AnimeCard item={item} />
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={ANIME_PACKS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
                showsVerticalScrollIndicator={false}

            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 20,
    },
    headerTitle: {
        // Dynamic via styles
    },
});

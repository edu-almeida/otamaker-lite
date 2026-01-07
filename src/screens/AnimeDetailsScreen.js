import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { AnimeCard } from '../components/AnimeCard';
import { ANIME_PACKS } from '../data/mockData';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export const AnimeDetailsScreen = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { colors, spacing, typography } = useTheme();
    const { animeTitle } = route.params || {};

    // Filter packs by anime title
    const animePacks = ANIME_PACKS.filter(pack => pack.title === animeTitle);

    const renderItem = ({ item }) => (
        <AnimeCard item={item} />
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { padding: spacing.lg }]}>
                <Text style={[styles.headerTitle, { color: colors.text, fontSize: typography.size.xxl, fontWeight: typography.weight.bold }]}>{animeTitle}</Text>
                <Text style={[styles.packCount, { color: colors.textSecondary }]}>{animePacks.length} packs</Text>
            </View>

            <FlatList
                data={animePacks}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.lg }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginBottom: 8,
    },
    headerTitle: {
        marginBottom: 4,
    },
    packCount: {
        fontSize: 14,
    },
    listContent: {
        paddingBottom: 20,
    },
});

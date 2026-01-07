import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { AnimeCard } from '../components/AnimeCard';
import { ANIME_PACKS } from '../data/mockData';
import { useTranslation } from 'react-i18next';

export const DownloadsScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    // Mock: Show all packs as "Downloaded" for now, or filter by a 'downloaded' prop if added
    const downloadedPacks = ANIME_PACKS;

    const renderItem = ({ item }) => (
        <AnimeCard item={item} />
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>


            <FlatList
                data={downloadedPacks}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    list: {
        padding: 16,
    },
});

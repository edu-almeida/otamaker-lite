import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { StickerCard } from '../components/StickerCard';
import { ANIME_PACKS } from '../data/mockData';
import { useTranslation } from 'react-i18next';

export const DownloadsScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    // Mock: Show all packs as "Downloaded" for now, or filter by a 'downloaded' prop if added
    const downloadedPacks = ANIME_PACKS;

    const renderItem = ({ item }) => (
        <StickerCard
            packageTitle={`${item.title} Pack`}
            animeTitle={item.title}
            animeCover={item.image}
            mainIcon={item.image}
            stickers={item.stickers}
            totalStickers={item.stickers.length}
            onSteal={() => console.log('Steal', item.title)}
            onLike={() => console.log('Like', item.title)}
            onAnimePress={() => console.log('Anime', item.title)}
            isLiked={false} // Default for mock
        />
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

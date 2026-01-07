import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { StickerCard } from '../components/StickerCard';
import { ANIME_PACKS } from '../data/mockData';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

// Using known valid assets
const MOCK_STICKERS = [
    require('../assets/xd/ComponentTMP_2-image.png'),
    require('../assets/xd/ComponentTMP_2-image2.png'),
    require('../assets/xd/ComponentTMP_2-image3.png'),
    require('../assets/xd/ComponentTMP_2-image4.png'),
    require('../assets/xd/ComponentTMP_2-image5.png'),
    require('../assets/xd/ComponentTMP_6-image.png'),
];

export const HomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { colors, spacing, typography } = useTheme();

    // Internal component to handle individual card state
    const StatefulStickerCard = ({ item }) => {
        const [isLiked, setIsLiked] = useState(false);

        return (
            <StickerCard
                packageTitle={item.title}
                animeTitle={item.title}
                // FIXED ASSETS: Pass verified images for both Cover and Main Icon
                // We use different images for variety if possible, or same if limited.
                animeCover={require('../assets/xd/ComponentTMP_6-image6.jpg')}
                mainIcon={require('../assets/xd/ComponentTMP_0-image.jpg')}
                stickers={MOCK_STICKERS}
                totalStickers={ANIME_PACKS.length * 5} // Dynamic fake number
                isLiked={isLiked}
                onSteal={() => console.log('Steal Package', item.id)}
                onLike={() => setIsLiked(!isLiked)} // Toggle state
                onAnimePress={() => navigation.navigate('AnimeDetails', { animeTitle: item.title })}
            />
        );
    };

    const renderItem = ({ item }) => (
        <StatefulStickerCard item={item} />
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={ANIME_PACKS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Text style={[styles.headerTitle, { color: colors.text, fontSize: typography.size.xl, marginBottom: spacing.md }]}>
                        {t('new_packages')}
                    </Text>
                }
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
        fontWeight: 'bold',
    },
});

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { OtamaButton } from '../components/OtamaButton';
import { useTheme } from '../contexts/ThemeContext';

export const DetailsScreen = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { colors, spacing, typography, borderRadius } = useTheme();
    const { item } = route.params || {};

    if (!item) return null;

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { marginBottom: spacing.xl }]}>
                <Image source={item.image} style={styles.headerImage} resizeMode="contain" />
                <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => navigation.navigate('Info', { item })}
                >
                    <Text style={{ fontSize: 24, color: colors.primary }}>ℹ️</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.section, { marginBottom: spacing.xl, paddingHorizontal: spacing.lg }]}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginBottom: spacing.md }]}>{t('stickerAnime')}</Text>
                <View style={styles.grid}>
                    {item.stickers.map((sticker, index) => (
                        <View key={index} style={[styles.stickerContainer, { borderColor: colors.border, borderRadius: borderRadius.md, marginBottom: spacing.md }]}>
                            <Image source={sticker} style={styles.stickerImage} />
                        </View>
                    ))}
                </View>
            </View>

            <View style={[styles.actions, { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }]}>
                <OtamaButton title={t('download')} onPress={() => { }} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: '100%',
        height: 300,
        position: 'relative',
        backgroundColor: 'rgba(0,0,0,0.05)', // Subtle placeholder
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    infoButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
    },
    section: {
    },
    sectionTitle: {
        textTransform: 'uppercase',
        opacity: 0.8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    stickerContainer: {
        width: '30%',
        aspectRatio: 1,
        borderWidth: 1,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stickerImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    actions: {
        alignItems: 'center',
    },
});

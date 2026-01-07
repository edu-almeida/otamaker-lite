import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { OtamaButton } from './OtamaButton';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export const AnimeCard = ({ item }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { colors, spacing, borderRadius, typography, shadows } = useTheme();

    return (
        <View style={[styles.card, {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.lg,
            ...shadows.soft // Apply clean shadow token
        }]}>
            <TouchableOpacity
                style={styles.header}
                onPress={() => navigation.navigate('Details', { item })}
                activeOpacity={0.7}
            >
                <View style={[styles.avatarContainer, { marginRight: spacing.sm }]}>
                    <Image
                        source={item.image}
                        style={[styles.avatar, { borderRadius: borderRadius.xl }]}
                    />
                </View>

                <Text style={[styles.title, {
                    color: colors.text,
                    fontSize: typography.size.md,
                    fontWeight: typography.weight.bold
                }]}>{item.title}</Text>

                <OtamaButton
                    title={t('download')}
                    onPress={() => console.log('Download', item.id)}
                    style={styles.downloadBtn}
                    type="primary"
                />
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stickerList}>
                {item.stickers.map((sticker, index) => (
                    <Image
                        key={index}
                        source={sticker}
                        style={[
                            styles.stickerPreview,
                            {
                                borderRadius: borderRadius.md,
                                backgroundColor: colors.border,
                                marginRight: spacing.sm
                            }
                        ]}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginBottom: 16,
        // Visuals handled by theme
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarContainer: {
        width: 40,
        height: 40,
    },
    avatar: {
        width: 40,
        height: 40,
    },
    title: {
        flex: 1,
    },
    downloadBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        // Override for pill shape if needed, though OtamaButton handles it
    },
    stickerList: {
        flexDirection: 'row',
    },
    stickerPreview: {
        width: 60,
        height: 60,
    },
});

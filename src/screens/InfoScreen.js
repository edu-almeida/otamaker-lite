import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export const InfoScreen = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { colors, spacing, typography, borderRadius } = useTheme();
    const { item } = route.params || {};

    if (!item) return null;

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.section, { marginBottom: spacing.xl }]}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.size.md, fontWeight: typography.weight.bold, marginBottom: spacing.md }]}>{t('aboutAnime')}</Text>
                <View style={styles.animeInfo}>
                    <Image source={item.image} style={[styles.poster, { borderRadius: borderRadius.md, marginRight: spacing.lg, backgroundColor: colors.border }]} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.animeTitle, { color: colors.text, fontSize: typography.size.lg, fontWeight: typography.weight.bold }]}>{item.title}</Text>
                        <Text style={[styles.description, { color: colors.textSecondary, fontSize: typography.size.sm, lineHeight: 20 }]}>{item.description}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.section, { marginBottom: spacing.xl }]}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.size.md, fontWeight: typography.weight.bold, marginBottom: spacing.md }]}>{t('aboutMaker')}</Text>

                <View style={[styles.makerRow, { marginBottom: spacing.lg }]}>
                    <Text style={[styles.label, { color: colors.text, fontSize: typography.size.xxl, fontWeight: typography.weight.bold, marginRight: spacing.md, width: 40, textAlign: 'center' }]}>T</Text>
                    <View>
                        <Text style={[styles.makerLabel, { color: colors.text, fontWeight: typography.weight.bold, fontSize: typography.size.sm }]}>{t('packName')}</Text>
                        <Text style={[styles.makerValue, { color: colors.textSecondary, fontSize: typography.size.sm }]}>{item.package}</Text>
                    </View>
                </View>

                <View style={[styles.makerRow, { marginBottom: spacing.lg }]}>
                    <Text style={[styles.label, { color: colors.text, fontSize: typography.size.xxl, fontWeight: typography.weight.bold, marginRight: spacing.md, width: 40, textAlign: 'center' }]}>P</Text>
                    <View>
                        <Text style={[styles.makerLabel, { color: colors.text, fontWeight: typography.weight.bold, fontSize: typography.size.sm }]}>{t('author')}</Text>
                        <Text style={[styles.makerValue, { color: colors.textSecondary, fontSize: typography.size.sm }]}>{item.author}</Text>
                    </View>
                </View>

                <View style={[styles.makerRow, { marginBottom: spacing.lg }]}>
                    <Text style={[styles.label, { color: colors.text, fontSize: typography.size.xxl, fontWeight: typography.weight.bold, marginRight: spacing.md, width: 40, textAlign: 'center' }]}>C</Text>
                    <View>
                        <Text style={[styles.makerLabel, { color: colors.text, fontWeight: typography.weight.bold, fontSize: typography.size.sm }]}>{t('communities')}</Text>
                        <Text style={[styles.makerValue, { color: colors.primary, fontSize: typography.size.sm }]}>join.whatsapp/otamaker</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        // Spacing via theme
    },
    sectionTitle: {
        textTransform: 'uppercase',
        opacity: 0.8,
    },
    animeInfo: {
        flexDirection: 'row',
    },
    poster: {
        width: 100,
        height: 140,
    },
    infoContent: {
        flex: 1,
    },
    animeTitle: {
        marginBottom: 8,
    },
    description: {
        opacity: 0.8,
    },
    makerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {},
    makerLabel: {},
    makerValue: {
        opacity: 0.7,
    },
});

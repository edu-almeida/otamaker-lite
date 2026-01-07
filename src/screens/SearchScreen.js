import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, TextInput, SectionList, StyleSheet, TouchableOpacity, Text, Image, Dimensions, PanResponder, Animated, Easing } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SearchIcon } from '../components/TabIcons';
import { ANIME_PACKS } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';

// --- Global Constants ---
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const COLUMNS_COUNT = 3;
const SIDEBAR_WIDTH = 30;
const SPACING_GUTTER = 6;
const LIST_HORIZONTAL_PADDING = 12;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = (SCREEN_WIDTH - (LIST_HORIZONTAL_PADDING * 2) - SIDEBAR_WIDTH - (SPACING_GUTTER * 2)) / COLUMNS_COUNT;

// Extend Mock Data for demonstration
const EXTENDED_MOCK_DATA = [
    ...ANIME_PACKS,
    { id: '101', title: 'Absolute Duo', image: require('../assets/xd/ComponentTMP_4-image4.jpg'), package: 'Maker', author: 'Author' },
    { id: '102', title: 'A Record of a Mortal\'s Journey', image: require('../assets/xd/ComponentTMP_4-image5.jpg'), package: 'Maker', author: 'Author' },
    { id: '103', title: 'AIKa ZERO', image: require('../assets/xd/ComponentTMP_4-image6.jpg'), package: 'Maker', author: 'Author' },
    { id: '104', title: 'B Gata H Kei', image: require('../assets/xd/ComponentTMP_4-image7.jpg'), package: 'Maker', author: 'Author' },
    { id: '105', title: 'Bakuman', image: require('../assets/xd/ComponentTMP_4-image8.jpg'), package: 'Maker', author: 'Author' },
    { id: '106', title: 'Bakumatsu', image: require('../assets/xd/ComponentTMP_4-image9.jpg'), package: 'Maker', author: 'Author' },
    { id: '201', title: 'C Control', image: require('../assets/xd/ComponentTMP_4-image4.jpg'), package: 'Maker', author: 'Author' },
    { id: '203', title: 'Cannon Busters', image: require('../assets/xd/ComponentTMP_4-image6.jpg'), package: 'Maker', author: 'Author' },
    { id: '301', title: 'D.Gray-man', image: require('../assets/xd/ComponentTMP_4-image7.jpg'), package: 'Maker', author: 'Author' },
    { id: '302', title: 'Death Note', image: require('../assets/xd/ComponentTMP_4-image8.jpg'), package: 'Maker', author: 'Author' },
    { id: '401', title: 'K-On!', image: require('../assets/xd/ComponentTMP_4-image9.jpg'), package: 'Maker', author: 'Author' },
    { id: '601', title: 'Sailor Moon', image: require('../assets/xd/ComponentTMP_4-image6.jpg'), package: 'Maker', author: 'Author' },
    { id: '602', title: 'Saint Seiya', image: require('../assets/xd/ComponentTMP_4-image7.jpg'), package: 'Maker', author: 'Author' },
    { id: '603', title: 'Sakura Card Captor', image: require('../assets/xd/ComponentTMP_4-image8.jpg'), package: 'Maker', author: 'Author' },
    { id: '604', title: 'Samurai Champloo', image: require('../assets/xd/ComponentTMP_4-image9.jpg'), package: 'Maker', author: 'Author' },
    { id: '605', title: 'School Rumble', image: require('../assets/xd/ComponentTMP_6-image.png'), package: 'Maker', author: 'Author' },
    { id: '606', title: 'Seven Deadly Sins', image: require('../assets/xd/ComponentTMP_6-image2.png'), package: 'Maker', author: 'Author' },
    { id: '607', title: 'Shaman King', image: require('../assets/xd/ComponentTMP_4-image4.jpg'), package: 'Maker', author: 'Author' },
    { id: '608', title: 'Spy x Family', image: require('../assets/xd/ComponentTMP_4-image5.jpg'), package: 'Maker', author: 'Author' },
    { id: '609', title: 'Steins;Gate', image: require('../assets/xd/ComponentTMP_4-image6.jpg'), package: 'Maker', author: 'Author' },
    { id: '610', title: 'Sword Art Online', image: require('../assets/xd/ComponentTMP_4-image7.jpg'), package: 'Maker', author: 'Author' },
];

const AnimatedWaterfallCard = ({ children, index }) => {
    const translateY = useRef(new Animated.Value(50)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            translateY.setValue(50);
            opacity.setValue(0);

            const staggerDelay = index * 100;

            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 600,
                    delay: staggerDelay,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic),
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 600,
                    delay: staggerDelay,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isFocused]);

    return (
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
            {children}
        </Animated.View>
    );
};

// Extracted Header Component
const Header = () => {
    const { colors, typography } = useTheme();
    return (
        <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
            <Text style={[styles.appTitle, { color: colors.text, fontSize: typography.size.xl }]}>Otamaker <Text style={styles.appTitleLite}>LITE</Text></Text>
            <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>ステッカーでアニメ</Text>
        </View>
    );
};

// Extracted SearchBar Component
const SearchBar = React.memo(({ searchQuery, onChangeText, t }) => {
    const { colors, spacing, typography, borderRadius } = useTheme();

    // Use Animated.Value to drive focus visuals without triggering re-renders that kill focus
    const focusAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        Animated.timing(focusAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false, // Color interpolation requires false
        }).start();
    };

    const handleBlur = () => {
        Animated.timing(focusAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const borderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.border, colors.primary]
    });

    const backgroundColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.surface, colors.background] // Subtle shift
    });

    return (
        <View style={[styles.searchContainer, { padding: spacing.lg }]}>
            <Animated.View style={[
                styles.searchBox,
                {
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderRadius: borderRadius.xl,
                    borderWidth: 1.5, // Slightly thicker for elegance
                }
            ]}>
                <View style={[styles.searchIconWrapper, { marginRight: spacing.sm }]}>
                    <SearchIcon color={colors.textSecondary} filled={false} />
                </View>
                <TextInput
                    style={[styles.searchInput, { color: colors.text, fontSize: typography.size.md }]}
                    placeholder="Looking for an anime?"
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => onChangeText('')} style={[styles.clearButton, { backgroundColor: colors.border }]}>
                        <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>✕</Text>
                    </TouchableOpacity>
                )}
            </Animated.View>
        </View>
    );
});

export const SearchScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { colors, spacing, typography, borderRadius, shadows } = useTheme();

    const [searchQuery, setSearchQuery] = useState('');
    // Debounced query for list filtering to prevent heavy re-renders while typing
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const [activeSidebarLetter, setActiveSidebarLetter] = useState('A');

    const sidebarHeightRef = useRef(0);
    const sectionDataRef = useRef([]);
    const availableLettersRef = useRef([]);
    const sectionListRef = useRef(null);

    // Debounce Logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300); // 300ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const sortedUniqueAnimes = useMemo(() => {
        const unique = new Map();
        EXTENDED_MOCK_DATA.forEach(item => {
            if (!unique.has(item.title)) {
                unique.set(item.title, item);
            }
        });
        return Array.from(unique.values()).sort((a, b) => a.title.localeCompare(b.title));
    }, []);

    const filteredAnimes = useMemo(() => {
        if (!debouncedQuery) return sortedUniqueAnimes;
        return sortedUniqueAnimes.filter(item =>
            item.title.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
    }, [debouncedQuery, sortedUniqueAnimes]);

    const groupedSections = useMemo(() => {
        const groups = {};
        filteredAnimes.forEach(item => {
            const firstLetter = item.title[0].toUpperCase();
            if (!groups[firstLetter]) groups[firstLetter] = [];
            groups[firstLetter].push(item);
        });

        return Object.keys(groups).sort().map(letter => ({
            title: letter,
            data: groups[letter]
        }));
    }, [filteredAnimes]);

    const sectionsWithGridRows = useMemo(() => {
        return groupedSections.map(section => {
            const rows = [];
            for (let i = 0; i < section.data.length; i += COLUMNS_COUNT) {
                rows.push(section.data.slice(i, i + COLUMNS_COUNT));
            }
            return { ...section, data: rows };
        });
    }, [groupedSections]);

    useEffect(() => {
        sectionDataRef.current = sectionsWithGridRows;
        availableLettersRef.current = groupedSections.map(s => s.title);
    }, [sectionsWithGridRows, groupedSections]);

    const scrollToSection = (letter) => {
        const sections = sectionDataRef.current;
        const sectionIndex = sections.findIndex(s => s.title >= letter);

        if (sectionIndex !== -1 && sectionListRef.current) {
            try {
                sectionListRef.current.scrollToLocation({
                    sectionIndex,
                    itemIndex: 0,
                    viewPosition: 0,
                    viewOffset: 20,
                    animated: false
                });
                setActiveSidebarLetter(sections[sectionIndex].title);
            } catch (error) {
                console.warn("Error scrolling list:", error);
            }
        }
    };

    const handleSidebarTouch = (localY) => {
        const sidebarHeight = sidebarHeightRef.current;
        if (!sidebarHeight) return;

        const clampedY = Math.max(0, Math.min(localY, sidebarHeight));
        const letterIndex = Math.floor((clampedY / sidebarHeight) * ALPHABET.length);

        if (letterIndex >= 0 && letterIndex < ALPHABET.length) {
            const targetLetter = ALPHABET[letterIndex];
            const availableLetters = availableLettersRef.current;
            if (availableLetters.includes(targetLetter)) {
                scrollToSection(targetLetter);
            }
        }
    };

    const sidebarPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: (evt) => {
                const { locationY } = evt.nativeEvent;
                handleSidebarTouch(locationY);
            },
            onPanResponderMove: (evt) => {
                const { locationY } = evt.nativeEvent;
                handleSidebarTouch(locationY);
            },
        })
    ).current;

    const onScrollVisibleItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const targetIndex = Math.floor(viewableItems.length * 0.25);
            const targetItem = viewableItems[targetIndex];
            if (targetItem && targetItem.section && targetItem.section.title) {
                setActiveSidebarLetter(targetItem.section.title);
            }
        }
    }).current;

    const renderSectionHeader = ({ section: { title } }) => (
        <Text style={[
            styles.listSectionHeader,
            {
                color: colors.primary,
                backgroundColor: colors.background,
                borderBottomColor: colors.primary,
                fontSize: typography.size.xl
            }
        ]}>
            {title}
        </Text>
    );

    const GridCard = ({ anime }) => (
        <TouchableOpacity
            style={[
                styles.cardContainer,
                {
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.lg,
                    ...shadows.soft
                }
            ]}
            onPress={() => navigation.navigate('AnimeDetails', { animeTitle: anime.title })}
            activeOpacity={0.8}
        >
            <View style={[styles.cardImageWrapper, { borderTopLeftRadius: borderRadius.lg, borderTopRightRadius: borderRadius.lg }]}>
                <Image
                    source={anime.image}
                    style={[styles.cardImage, { backgroundColor: colors.border }]}
                />
            </View>
            <View style={[
                styles.cardFooter,
                {
                    backgroundColor: colors.surface,
                    borderBottomLeftRadius: borderRadius.lg,
                    borderBottomRightRadius: borderRadius.lg
                }
            ]}>
                <Text numberOfLines={2} style={[
                    styles.cardTitle,
                    {
                        color: colors.textSecondary,
                        fontWeight: typography.weight.medium,
                        fontSize: typography.size.xs
                    }
                ]}>{anime.title}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderGridRow = ({ item, index }) => (
        <View style={[styles.gridRowContainer, { gap: SPACING_GUTTER, marginBottom: SPACING_GUTTER }]}>
            {item.map((anime, colIndex) => {
                const staggerIndex = (index * COLUMNS_COUNT + colIndex) % 15;
                return (
                    <AnimatedWaterfallCard key={anime.id} index={staggerIndex}>
                        <GridCard anime={anime} />
                    </AnimatedWaterfallCard>
                );
            })}
        </View>
    );

    return (
        <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
            <Header />
            <SearchBar
                searchQuery={searchQuery}
                onChangeText={setSearchQuery}
                t={t}
            />

            <View style={styles.contentWrapper}>
                <SectionList
                    ref={sectionListRef}
                    sections={sectionsWithGridRows}
                    renderItem={renderGridRow}
                    renderSectionHeader={renderSectionHeader}
                    keyExtractor={(item, index) => `row-${index}`}
                    contentContainerStyle={[styles.listContentContainer, { paddingHorizontal: LIST_HORIZONTAL_PADDING, paddingBottom: spacing.xl }]}
                    stickySectionHeadersEnabled={false}
                    onViewableItemsChanged={onScrollVisibleItemsChanged}
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    keyboardShouldPersistTaps="handled"
                />

                <View
                    style={[styles.sidebarContainer, { width: SIDEBAR_WIDTH }]}
                    {...sidebarPanResponder.panHandlers}
                    onLayout={(e) => {
                        sidebarHeightRef.current = e.nativeEvent.layout.height;
                    }}
                >
                    {ALPHABET.map((letter) => {
                        const isActive = activeSidebarLetter === letter;
                        const isAvailableRender = groupedSections.some(s => s.title === letter);
                        return (
                            <View key={letter} style={styles.sidebarLetterWrapper}>
                                <Text style={[
                                    styles.sidebarLetterText,
                                    { color: colors.textSecondary, fontSize: typography.size.xxs },
                                    isActive && { color: colors.primary, fontWeight: typography.weight.bold, fontSize: typography.size.sm },
                                    !isAvailableRender && styles.inactiveSidebarLetterText
                                ]}>
                                    {letter}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    headerContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    appTitle: {
        fontWeight: 'bold',
    },
    appTitleLite: {
        fontWeight: '300',
    },
    appSubtitle: {
        fontSize: 12,
    },
    searchContainer: {
        paddingTop: 8,
        paddingBottom: 8,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 45,
        borderWidth: 1,
    },
    searchIconWrapper: {
        opacity: 0.5,
    },
    searchInput: {
        flex: 1,
        height: '100%',
    },
    clearButton: {
        padding: 4,
        borderRadius: 12,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearButtonText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: -2,
    },
    contentWrapper: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    list: {
        flex: 1,
    },
    listContentContainer: {
    },
    listSectionHeader: {
        paddingVertical: 8,
        marginBottom: 8,
        borderBottomWidth: 1,
    },
    gridRowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    cardContainer: {
        width: ITEM_WIDTH,
        marginBottom: 0,
    },
    cardImageWrapper: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH * 1.3,
        overflow: 'hidden',
    },
    cardImage: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH * 1.3,
        resizeMode: 'cover',
    },
    cardFooter: {
        paddingHorizontal: 4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        textAlign: 'center',
        lineHeight: 13,
    },
    sidebarContainer: {
        height: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: 'transparent',
    },
    sidebarLetterWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    sidebarLetterText: {
        textAlign: 'center',
    },
    inactiveSidebarLetterText: {
        opacity: 0.3,
    },
});

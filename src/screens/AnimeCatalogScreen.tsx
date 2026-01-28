/**
 * SearchScreen - Tela de busca de animes A-Z
 * 
 * Funcionalidades:
 * - Grid de animes organizado alfabeticamente
 * - Sidebar com letras do alfabeto para navegação rápida
 * - Barra de busca com debounce
 * - Animação "waterfall" nos cards ao entrar na tela
 */
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View, TextInput, SectionList, StyleSheet, TouchableOpacity, Text, Dimensions, PanResponder, Animated, Easing, LayoutChangeEvent, ViewToken, TextStyle } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SearchIcon } from '../components/TabIcons';
import { ANIME_CATALOG, AnimeItem } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { AnimeCoverCard, AnimatedWaterfallCard, ScrollToTopButton } from '../components';
import { RootStackParamList } from '../types';
import { SEARCH, ANIMATIONS } from '../constants';

// Constantes de layout calculadas
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = (SCREEN_WIDTH - SEARCH.LIST_HORIZONTAL_PADDING - SEARCH.SIDEBAR_WIDTH - (SEARCH.SPACING_GUTTER * 2)) / SEARCH.COLUMNS_COUNT;

// AnimatedWaterfallCard agora é importado de ../components

interface SearchBarProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
  t: (key: string) => string;
}

const SearchBar = React.memo<SearchBarProps>(({ searchQuery, onChangeText, t }) => {
  const { colors, spacing, typography, borderRadius, dark } = useTheme();
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
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

  const glassColor = dark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const focusedColor = dark ? 'rgba(30, 30, 30, 1)' : 'rgba(255, 255, 255, 1)';

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [glassColor, focusedColor]
  });

  return (
    <View style={styles.searchContainer}>
      <Animated.View style={[
        styles.searchBox,
        {
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderRadius: borderRadius.xl,
          borderWidth: 1.5,
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

interface SectionData {
  title: string;
  data: AnimeItem[][];
}

type AnimeCatalogScreenProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

export const AnimeCatalogScreen: React.FC<AnimeCatalogScreenProps> = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { colors, spacing, typography, borderRadius, shadows } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeSidebarLetter, setActiveSidebarLetter] = useState('A');

  // Scroll to Top Logic
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const handleScroll = useCallback((event: any) => {
    setShowScrollButton(event.nativeEvent.contentOffset.y > 400);
  }, []);

  const sidebarHeightRef = useRef(0);
  const sectionDataRef = useRef<SectionData[]>([]);
  const availableLettersRef = useRef<string[]>([]);
  const sectionListRef = useRef<SectionList<AnimeItem[], SectionData>>(null);

  const scrollToTop = () => {
    sectionListRef.current?.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      viewOffset: 0,
      animated: true
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const sortedUniqueAnimes = useMemo(() => {
    const unique = new Map<string, AnimeItem>();
    ANIME_CATALOG.forEach(item => {
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
    const groups: Record<string, AnimeItem[]> = {};
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

  const sectionsWithGridRows = useMemo((): SectionData[] => {
    return groupedSections.map(section => {
      const rows: AnimeItem[][] = [];
      for (let i = 0; i < section.data.length; i += SEARCH.COLUMNS_COUNT) {
        rows.push(section.data.slice(i, i + SEARCH.COLUMNS_COUNT));
      }
      return { ...section, data: rows };
    });
  }, [groupedSections]);

  useEffect(() => {
    sectionDataRef.current = sectionsWithGridRows;
    availableLettersRef.current = groupedSections.map(s => s.title);
  }, [sectionsWithGridRows, groupedSections]);

  const scrollToSection = (letter: string) => {
    const sections = sectionDataRef.current;
    const sectionIndex = sections.findIndex(s => s.title >= letter);

    if (sectionIndex !== -1 && sectionListRef.current) {
      try {
        sectionListRef.current.scrollToLocation({
          sectionIndex,
          itemIndex: 0,
          viewPosition: 0,
          viewOffset: 75,
          animated: false
        });
        setActiveSidebarLetter(sections[sectionIndex].title);
      } catch (error) {
        console.warn("Error scrolling list:", error);
      }
    }
  };

  const handleSidebarTouch = (localY: number) => {
    const sidebarHeight = sidebarHeightRef.current;
    if (!sidebarHeight) return;

    const clampedY = Math.max(0, Math.min(localY, sidebarHeight));
    const letterIndex = Math.floor((clampedY / sidebarHeight) * SEARCH.ALPHABET.length);

    if (letterIndex >= 0 && letterIndex < SEARCH.ALPHABET.length) {
      const targetLetter = SEARCH.ALPHABET[letterIndex];
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

  const onScrollVisibleItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const lastVisibleItem = viewableItems[viewableItems.length - 1];
      const sections = sectionDataRef.current;
      const lastSection = sections[sections.length - 1];

      const isAtBottom = lastVisibleItem &&
        lastSection &&
        (lastVisibleItem.section as SectionData)?.title === lastSection.title &&
        lastVisibleItem.index === lastSection.data.length - 1;

      if (isAtBottom) {
        setActiveSidebarLetter(lastSection.title);
      } else {
        const targetIndex = Math.floor(viewableItems.length * 0.3);
        const targetItem = viewableItems[targetIndex];
        if (targetItem && (targetItem.section as SectionData)?.title) {
          setActiveSidebarLetter((targetItem.section as SectionData).title);
        }
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 0,
    waitForInteraction: false,
  }).current;

  const renderSectionHeader = ({ section: { title } }: { section: SectionData }) => (
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

  const renderGridRow = ({ item, index }: { item: AnimeItem[]; index: number }) => (
    <View style={[styles.gridRowContainer, { gap: SEARCH.SPACING_GUTTER, marginBottom: SEARCH.SPACING_GUTTER }]}>
      {item.map((anime, colIndex) => {
        const staggerIndex = (index * SEARCH.COLUMNS_COUNT + colIndex) % 15;
        return (
          <AnimatedWaterfallCard key={anime.id} index={staggerIndex}>
            <AnimeCoverCard
              title={anime.title}
              image={anime.image}
              onPress={() => navigation.navigate('AnimeDetails', { animeTitle: anime.title, fromCatalog: true })}
            />
          </AnimatedWaterfallCard>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
      <SearchBar
        searchQuery={searchQuery}
        onChangeText={setSearchQuery}
        t={t}
      />

      <View style={styles.contentWrapper}>
        <SectionList
          ref={sectionListRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          sections={sectionsWithGridRows}
          renderItem={renderGridRow}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item, index) => `row-${index}`}
          contentContainerStyle={[styles.listContentContainer, { paddingLeft: SEARCH.LIST_HORIZONTAL_PADDING, paddingRight: 0, paddingBottom: spacing.xl }]}
          stickySectionHeadersEnabled={false}
          onViewableItemsChanged={onScrollVisibleItemsChanged}
          viewabilityConfig={viewabilityConfig}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          windowSize={10}
        />

        <View
          style={[styles.sidebarContainer, { width: SEARCH.SIDEBAR_WIDTH }]}
          {...sidebarPanResponder.panHandlers}
          onLayout={(e: LayoutChangeEvent) => {
            sidebarHeightRef.current = e.nativeEvent.layout.height;
          }}
        >
          {SEARCH.ALPHABET.map((letter) => {
            const isActive = activeSidebarLetter === letter;
            const isAvailableRender = groupedSections.some(s => s.title === letter);
            return (
              <View key={letter} style={styles.sidebarLetterWrapper}>
                <Text style={[
                  styles.sidebarLetterText,
                  { color: colors.textSecondary, fontSize: typography.size.xxs },
                  isActive && { color: colors.primary, fontWeight: typography.weight.bold as TextStyle['fontWeight'], fontSize: typography.size.sm },
                  !isAvailableRender && styles.inactiveSidebarLetterText
                ]}>
                  {letter}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      <ScrollToTopButton visible={showScrollButton} onPress={scrollToTop} />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
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
    paddingTop: 67,
  },
  listSectionHeader: {
    paddingVertical: 8,
    marginTop: 12,    // Distância da seção anterior
    marginBottom: 12, // Distância para os cards abaixo
    borderBottomWidth: 1,
  },
  gridRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  sidebarContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
    paddingTop: 71,
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

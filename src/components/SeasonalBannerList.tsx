import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { SEASONAL_ANIMES } from '../data/mockData';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width * 0.85;
const BANNER_ASPECT_RATIO = 16 / 9;
const BANNER_HEIGHT = BANNER_WIDTH / BANNER_ASPECT_RATIO;
const HORIZONTAL_PADDING = 16;

interface SeasonalBannerListProps {
  onPressAnime: (title: string) => void;
}

export const SeasonalBannerList: React.FC<SeasonalBannerListProps> = ({ onPressAnime }) => {
  const { colors, spacing, borderRadius, typography } = useTheme();

  return (
    <View style={styles.container}>
      <FlatList
        data={SEASONAL_ANIMES}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={[styles.listContent, { paddingHorizontal: HORIZONTAL_PADDING }]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => onPressAnime(item.title)}
            style={[
              styles.bannerWrapper, 
              { 
                width: BANNER_WIDTH, 
                height: BANNER_HEIGHT,
                marginRight: 16,
                borderRadius: borderRadius.lg,
                backgroundColor: colors.background,
              }
            ]}
          >
            {/* Imagem Principal */}
            <Image 
              source={item.image} 
              style={[styles.bannerImage, { borderRadius: borderRadius.lg }]} 
              resizeMode="cover" 
            />

            {/* 3D Folded Ribbon UI */}
            <View style={styles.ribbonContainer}>
              {/* The "Back Fold" - makes it look like it's wrapping from behind */}
              <View style={[styles.ribbonFold, { backgroundColor: '#5E192A' }]} />
              
              {/* The Main Ribbon Tag */}
              <View style={[styles.ribbonTag, { backgroundColor: '#9F2B48' }]}>
                <View style={styles.ribbonStitch} />
                <Text 
                  numberOfLines={1} 
                  ellipsizeMode="tail"
                  style={[
                    styles.title, 
                    { 
                      color: '#FFFFFF', 
                      fontSize: typography.size.xs,
                      fontFamily: typography.fontFamily.bold,
                    }
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 0,
  },
  bannerWrapper: {
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  ribbonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ribbonFold: {
    width: 8,
    height: 12,
    borderTopLeftRadius: 4,
    marginTop: 4, // Alinha com o "meio" da tag para efeito 3D
  },
  ribbonTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 2,
    // Sombra para profundidade
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ribbonStitch: {
    width: 3,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    marginRight: 10,
  },
  title: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});

import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Share } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme as NavigationTheme, useNavigationContainerRef } from '@react-navigation/native';

import { 
  HomeScreen,
  AnimeCatalogScreen,
  OtamaLibraryScreen,
  PackDetailsScreen,
  AnimeDetailsScreen,
  OtamaProfileScreen,
  SplashScreen 
} from '../screens';
import { HomeIcon, SearchIcon, GlobalHeader, InfoIcon } from '../components';
import { BubbleTabBar } from '../components/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList, TabParamList } from '../types';

// Cria os navegadores tipados
const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * MainTabs - Navegação inferior com abas.
 * 
 * Contém as 3 abas principais:
 * - HomeTab: Feed de pacotes de stickers
 * - SearchTab: Catálogo de animes A-Z
 * - DownloadsTab: Pacotes baixados
 * 
 * Usa BubbleTabBar como componente customizado para a barra de abas.
 */
const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={() => null} // Hide default tab bar, using Global
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen as any} />
      <Tab.Screen name="AnimeCatalogTab" component={AnimeCatalogScreen as any} />
      <Tab.Screen name="OtamaLibraryTab" component={OtamaLibraryScreen as any} />
    </Tab.Navigator>
  );
};

/**
 * AppNavigator - Componente raiz de navegação.
 */
export const AppNavigator: React.FC = () => {
  const { colors, dark: isDark } = useTheme();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const [currentRoute, setCurrentRoute] = useState<{ name: string; params?: any } | undefined>();
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  // Configura o tema do React Navigation baseado no tema do app
  const navigationTheme: NavigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: colors.background, // Cor de fundo das telas
      card: colors.surface,          // Cor de headers e tab bar
      text: colors.text,             // Cor de texto padrão
      border: colors.border,         // Cor de bordas
      primary: colors.primary,       // Cor primária (links, botões)
      notification: colors.notification, // Badges de notificação
    },
  };

  // Rotas que não devem mostrar o botão de voltar
  const noBackRoutes = ['Splash', 'Main', 'HomeTab', 'AnimeCatalogTab', 'OtamaLibraryTab'];
  const shouldShowBack = currentRoute?.name ? !noBackRoutes.includes(currentRoute.name) : false;
  
  // Rotas que não devem ter header (apenas Splash) e previne flicker na inicialização
  const shouldShowHeader = !!currentRoute && currentRoute.name !== 'Splash';

  // Mostrar TabBar apenas se não for Splash
  // User quer Navbar em AnimePack (Details), AnimeDetails e Home/Search/Downloads
  const shouldShowTabBar = !!currentRoute && currentRoute.name !== 'Splash';

  // Lógica para componentes direitos do header (ex: botoes de ação)
  const getHeaderRight = () => {
    if (currentRoute?.name === 'PackDetails') {
      const { packageTitle } = currentRoute.params || {};
      
      const handleShare = async () => {
        try {
          await Share.share({
            message: `Check out this sticker pack: ${packageTitle || 'Unknown Pack'}!`,
          });
        } catch (error) {
          console.log('Error sharing:', error);
        }
      };

      return (
        <TouchableOpacity 
          onPress={handleShare} 
          style={{ padding: 8, marginRight: -8 }}
          activeOpacity={0.7}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
             <Path 
               d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6z" 
               fill={colors.text} 
             />
             <Path 
               d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" 
               stroke={colors.text} 
               strokeWidth={2} 
               strokeLinecap="round" 
             />
          </Svg>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const handleTabNavigate = (route: string) => {
    // "se o usiro selecionar resete o fluxod de voltar telas, nao tem para onmde voltar mais"
    // Reset para a rota Main e navega para a aba específica
    navigationRef.reset({
      index: 0,
      routes: [{ 
        name: 'Main', 
        state: { 
          routes: [{ name: route }] 
        } 
      }],
    });
  };

  return (
    <NavigationContainer 
      theme={navigationTheme}
      ref={navigationRef}
      onReady={() => setCurrentRoute(navigationRef.getCurrentRoute())}
      onStateChange={() => setCurrentRoute(navigationRef.getCurrentRoute())}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {shouldShowHeader && (
          <GlobalHeader 
            showBack={shouldShowBack} 
            rightComponent={getHeaderRight()}
          />
        )}
        
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false, // Desabilita header padrão em favor do GlobalHeader
            // Animação rápida de "montagem/desmontagem" de tela
            animation: 'fade_from_bottom',
            animationDuration: 200,
            contentStyle: { paddingBottom: 60 } // Espaço para a TabBar flutuante
          }}
        >
          {/* Tela de splash (animação inicial) */}
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen}
            options={{ animation: 'none' }}
          />
          
          {/* Telas principais com abas inferiores */}
          <Stack.Screen 
            name="Main" 
            component={MainTabs}
            options={{ animation: 'fade' }}
          />
          
          {/* Tela de detalhes de um pacote */}
          <Stack.Screen
            name="PackDetails"
            component={PackDetailsScreen}
            options={{
              animation: 'fade_from_bottom',
              animationDuration: 200,
            }}
          />
          
          {/* Tela de detalhes de um anime (lista seus pacotes) */}
          <Stack.Screen
            name="AnimeDetails"
            component={AnimeDetailsScreen}
            options={{
              animation: 'fade_from_bottom',
              animationDuration: 200,
            }}
          />

          {/* Tela de Perfil do Criador */}
          <Stack.Screen
            name="OtamaProfile"
            component={OtamaProfileScreen}
            options={{
              animation: 'slide_from_right', 
              animationDuration: 200,
            }}
          />
        </Stack.Navigator>

        {shouldShowTabBar && (
          <BubbleTabBar 
            currentRouteName={currentRoute?.name} 
            onNavigate={handleTabNavigate}
          />
        )}
      </View>
    </NavigationContainer>
  );
};

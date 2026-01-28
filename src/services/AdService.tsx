import React from 'react';
import { Platform, View, Text } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// Detecta Expo Go
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  Constants.executionEnvironment === ExecutionEnvironment.Standalone;

// Variáveis para módulo nativo
let mobileAds: any = null;
let TestIds: any;
let MaxAdContentRating: any;
let BannerAd: any;
let BannerAdSize: any;

// Em Expo Go, usa APENAS mocks (sem tentar carregar módulo nativo)
if (isExpoGo) {
  console.log('[AdService] Expo Go: Usando mocks (sem módulo nativo)');
  
  TestIds = {
    BANNER: 'ca-app-pub-3940256099942544/6300978111',
    INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
    REWARDED: 'ca-app-pub-3940256099942544/5224354917',
    APP_OPEN: 'ca-app-pub-3940256099942544/3419835294',
  };
  
  MaxAdContentRating = { G: 'G' };
  
  mobileAds = () => ({
    setRequestConfiguration: async () => console.log('[AdMock] Config OK'),
    initialize: async () => {
      console.log('[AdMock] Inicializado');
      return [{ status: 1, description: 'Mock', name: 'Mock' }];
    }
  });
} else {
  // Build nativo: carrega módulo real
  console.log('[AdService] Build nativo: Carregando módulo AdMob...');
  
  // ⚠️ IMPORTANTE: Para funcionar no Expo Go, esta seção está COMENTADA
  // ⚠️ DESCOMENTE as linhas abaixo quando fizer o BUILD NATIVO (eas build)
  /*
  try {
    const adsLib = require('react-native-google-mobile-ads');
    mobileAds = adsLib.default;
    TestIds = adsLib.TestIds;
    MaxAdContentRating = adsLib.MaxAdContentRating;
    BannerAd = adsLib.BannerAd;
    BannerAdSize = adsLib.BannerAdSize;
    console.log('[AdService] Módulo AdMob carregado com sucesso');
  } catch (error: any) {
    console.error('[AdService] Erro ao carregar AdMob:', error?.message);
    mobileAds = null;
  }
  */
  
  console.log('[AdService] ⚠️ Módulo nativo comentado. Descomente para build de produção.');
}

// Se ainda não tem BannerAd (falhou), usa mock
if (!BannerAd) {

  // Mock do BannerAd Component com tema do app
  BannerAd = (props: any) => {
    // Hook para acessar o tema (será usado dentro de um Provider)
    const React = require('react');
    const { useTheme } = require('../contexts/ThemeContext');
    
    // Tenta usar o tema, com fallback para valores padrão
    let colors, borderRadius, shadows;
    try {
      const theme = useTheme();
      colors = theme.colors;
      borderRadius = theme.borderRadius;
      shadows = theme.shadows;
    } catch {
      // Fallback se não estiver dentro do ThemeProvider
      colors = {
        surface: '#FFFFFF',
        text: '#000000',
        textSecondary: '#666666',
        primary: '#FF6B6B',
        border: '#E0E0E0'
      };
      borderRadius = { lg: 12 };
      shadows = { card: {} };
    }
    
    const mockBanners = [
      {
        title: 'Baixe o App Grátis',
        description: 'Milhares de stickers esperando por você',
        cta: 'Instalar',
        icon: '🎁'
      },
      {
        title: 'Oferta Especial 50% OFF',
        description: 'Pacotes premium com desconto',
        cta: 'Aproveitar',
        icon: '🔥'
      },
      {
        title: 'Novos Stickers Disponíveis',
        description: 'Confira os lançamentos da semana',
        cta: 'Ver Agora',
        icon: '✨'
      }
    ];
    
    // Rotaciona entre os banners de teste
    const randomBanner = mockBanners[Math.floor(Math.random() * mockBanners.length)];
    
    return (
      <View style={{ 
        width: '100%', 
        minHeight: 90,
        backgroundColor: colors.surface, // Usa cor do tema
        borderRadius: borderRadius.lg, // Usa border radius do tema
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border, // Usa cor de borda do tema
        ...shadows.card // Usa sombra do tema
      }}>
        {/* Ícone/Imagem do Ad */}
        <View style={{
          width: 66,
          height: 66,
          backgroundColor: colors.primary + '20', // Primary com 20% de opacidade
          borderRadius: borderRadius.lg,
          marginRight: 12,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 32 }}>{randomBanner.icon}</Text>
        </View>
        
        {/* Conteúdo */}
        <View style={{ flex: 1 }}>
          <Text style={{ 
            color: colors.text, // Usa cor de texto do tema
            fontSize: 14, 
            fontWeight: 'bold',
            marginBottom: 4
          }}>
            {randomBanner.title}
          </Text>
          <Text style={{ 
            color: colors.textSecondary, // Usa cor secundária do tema
            fontSize: 11,
            marginBottom: 4
          }}>
            {randomBanner.description}
          </Text>
          <Text style={{ 
            color: colors.textSecondary,
            fontSize: 9,
            opacity: 0.6
          }}>
            Anúncio • AdMob Test
          </Text>
        </View>
        
        {/* CTA Button */}
        <View style={{
          backgroundColor: colors.primary, // Usa cor primária (igual ao Telegram no StickerCard)
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 20,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3
        }}>
          <Text style={{ 
            color: '#FFFFFF', 
            fontSize: 12, 
            fontWeight: 'bold' 
          }}>
            {randomBanner.cta}
          </Text>
        </View>
      </View>
    );
  };
  
  BannerAdSize = {
    FULL_BANNER: 'FULL_BANNER',
    LARGE_BANNER: 'LARGE_BANNER',
    MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
    BANNER: 'BANNER',
    ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  };
}

// ============================================================================
// CONFIGURAÇÃO DE ANÚNCIOS (inline para evitar erros no Expo Go)
// ============================================================================

// Test IDs oficiais do Google (sempre usados em DEV)
const TEST_AD_UNITS = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  APP_OPEN: 'ca-app-pub-3940256099942544/3419835294',
};

// IDs de PRODUÇÃO - Substitua pelos seus IDs reais do AdMob
// Formato: ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
const PROD_IOS_BANNER = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
const PROD_IOS_INTERSTITIAL = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
const PROD_ANDROID_BANNER = 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ';
const PROD_ANDROID_INTERSTITIAL = 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ';

// Ad Unit IDs que serão usados (DEV = Test IDs, PROD = IDs reais)
export const AdUnitIds = {
  BANNER: __DEV__ 
    ? TEST_AD_UNITS.BANNER 
    : (Platform.OS === 'ios' ? PROD_IOS_BANNER : PROD_ANDROID_BANNER),
  
  INTERSTITIAL: __DEV__ 
    ? TEST_AD_UNITS.INTERSTITIAL 
    : (Platform.OS === 'ios' ? PROD_IOS_INTERSTITIAL : PROD_ANDROID_INTERSTITIAL),
  
  REWARDED: TEST_AD_UNITS.REWARDED,
  APP_OPEN: TEST_AD_UNITS.APP_OPEN,
};

// Configurações de comportamento
const AD_CONFIG = {
  INTERSTITIAL_FREQUENCY: 3, // Mostra 1 a cada 3 navegações
  ADS_ENABLED: true,
};

// Wrapper com tema para BannerAd
export const ThemedBannerAd: React.FC<any> = (props) => {
  return <BannerAd {...props} />;
};

// Exportar componentes
export { BannerAd, BannerAdSize };

class AdService {
  private static instance: AdService;
  private initialized = false;
  private adsEnabled = true;
  
  // Interstitial Ad Management (Logica por Sessao - Renovada)
  private interstitialAd: any = null;
  private isInterstitialLoaded = false;
  private sessionNavCount = 0; // Inicia em 0 a cada abertura do app
  private lastAdShowTime = 0; // Timestamp do ultimo anuncio
  private sessionAdCount = 0; // Quantos ja mostrou nesta sessao
  
  private readonly MILESTONES = {
    FIRST: 10,       // Primeiro apos 10 interacoes
    SECOND: 25,      // Segundo apos 25 interacoes (10 + 15)
    COOLDOWN: 20000, // 20 segundos de protecao obrigatoria
    TIME_WEIGHT: 60000 // 1 minuto sem ver anuncio aumenta muito a chance
  };

  private constructor() {
    this.sessionNavCount = 0;
    this.sessionAdCount = 0;
    this.lastAdShowTime = Date.now(); // Marca o inicio da sessao como ponto fixo
  }

  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  // Carregamento de contadores (Removido persistence por solicitacao)
  private async loadInterstitialCounter() {
    // Agora o app reseta sempre que abre
    this.sessionNavCount = 0;
    this.sessionAdCount = 0;
  }

  private async saveInterstitialCounter() {
    // Nao precisa salvar em sessao
  }

  private retryCount = 0;
  private maxRetries = 10;
  private isRecovering = false;

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    // Timeout de segurança para não travar a Splash Screen
    const timeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!this.initialized) {
          console.warn('[AdService] Timeout de inicialização. Prosseguindo em modo degradado.');
          resolve();
        }
      }, 5000);
    });

    const initPromise = async () => {
      try {
        console.log(`[AdService] Tentativa de inicialização #${this.retryCount + 1}`);
        
        // Em Expo Go, o mock já está pronto, apenas marcamos como inicializado
        if (isExpoGo) {
          this.initialized = true;
          this.adsEnabled = true;
          console.log('[AdService] Mock Engine pronto.');
          return;
        }

        // @ts-ignore
        if (typeof mobileAds !== 'function') {
          throw new Error('SDK não carregado no binário');
        }

         // @ts-ignore
        await mobileAds().setRequestConfiguration({
          tagForChildDirectedTreatment: true,
          tagForUnderAgeOfConsent: true,
          testDeviceIdentifiers: ['EMULATOR'],
          maxAdContentRating: MaxAdContentRating.G,
        });

         // @ts-ignore
        const adapterStatus = await mobileAds().initialize();
        console.log('[AdService] AdMob Engine Initialized:', adapterStatus);
        this.initialized = true;
        this.adsEnabled = true;
        this.retryCount = 0; // Reset ao sucesso
        
        // Pré-carrega o primeiro interstitial
        this.preloadInterstitial();
      } catch (error: any) {
        console.error('[AdService] Erro crítico no motor de ads:', error?.message);
        this.handleInitializationFailure();
      }
    };

    await Promise.race([initPromise(), timeoutPromise]);
  }

  // Lógica de "Auto-Erguer" (Self-Healing)
  private handleInitializationFailure() {
    if (this.retryCount < this.maxRetries && !this.isRecovering) {
      this.isRecovering = true;
      this.retryCount++;
      
      // Delay exponencial: 5s, 10s, 20s, 40s...
      const delay = Math.pow(2, this.retryCount) * 2500;
      
      console.log(`[AdService] Motor caiu. Tentando se auto-erguer em ${(delay/1000).toFixed(0)}s...`);
      
      setTimeout(async () => {
        this.isRecovering = false;
        await this.initialize();
      }, delay);
    } else if (this.retryCount >= this.maxRetries) {
      console.log('[AdService] Limite de recuperação atingido. Desligando motor nesta sessão.');
      this.adsEnabled = false;
    }
  }

  public isAdsEnabled(): boolean {
    return this.adsEnabled;
  }

  // Pré-carrega anúncios (Intersticiais, Rewarded, etc)
  public async preloadAds(): Promise<void> {
    if (!this.initialized) await this.initialize();
    console.log('[AdService] Preloading high-value ads...');
    this.preloadInterstitial();
    return Promise.resolve();
  }

  // Pré-carrega o próximo Interstitial
  private async preloadInterstitial() {
    if (!this.adsEnabled) return;
    
    try {
      // Se já tem um carregado, não carrega outro
      if (this.isInterstitialLoaded) {
        console.log('[AdService] Interstitial already loaded');
        return;
      }

      // Em Expo Go ou se mobileAds não está disponível, simula o carregamento
      if (!mobileAds || typeof mobileAds !== 'function') {
        console.log('[AdService] Mock: Interstitial preloaded (Expo Go mode)');
        this.isInterstitialLoaded = true;
        return;
      }

      // Build nativo: Carrega o Interstitial real
      // ⚠️ COMENTADO para Expo Go - DESCOMENTE para build nativo
      /*
      try {
        const { InterstitialAd, AdEventType } = require('react-native-google-mobile-ads');
        
        this.interstitialAd = InterstitialAd.createForAdRequest(AdUnitIds.INTERSTITIAL);
        
        this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
          console.log('[AdService] Interstitial loaded');
          this.isInterstitialLoaded = true;
        });

        this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
          console.log('[AdService] Interstitial closed');
          this.isInterstitialLoaded = false;
          // Pré-carrega o próximo
          setTimeout(() => this.preloadInterstitial(), 1000);
        });

        this.interstitialAd.load();
      } catch (nativeError) {
        // Se falhar ao carregar módulo nativo, usa mock
        console.log('[AdService] Native module not available, using mock');
        this.isInterstitialLoaded = true;
      }
      */
      
      console.log('[AdService] ⚠️ Interstitial nativo comentado para Expo Go');
    } catch (error: any) {
      console.log('[AdService] Interstitial preload skipped:', error?.message || 'Unknown error');
    }
  }

  // Decide se deve mostrar o interstitial (Sustentavel e Probabilistico)
  private shouldShowInterstitial(): boolean {
    try {
      this.sessionNavCount++;
      const now = Date.now();
      const timeSinceLast = now - this.lastAdShowTime;
      
      // 1. Protecao de tempo absoluta (20s)
      if (timeSinceLast < this.MILESTONES.COOLDOWN) {
        console.log('[AdService] ⏳ Protecao de 20s ativa.');
        return false;
      }

      // 2. Primeiro Milestone (10 interacoes)
      if (this.sessionAdCount === 0) {
        if (this.sessionNavCount >= this.MILESTONES.FIRST) {
          console.log('[AdService] 🎯 Milestone 1 atingido (10 clicks).');
          return true;
        }
        return false;
      }

      // 3. Segundo Milestone (25 interacoes)
      if (this.sessionAdCount === 1) {
        if (this.sessionNavCount >= this.MILESTONES.SECOND) {
          console.log('[AdService] 🎯 Milestone 2 atingido (25 clicks).');
          return true;
        }
        return false;
      }

      // 4. ALGORITMO DE PROBABILIDADE (Recorrente)
      // Baseado em Tempo + Interacoes
      // Quanto mais tempo ele fica sem ver, maior a chance (Sustainable Logic)
      
      const interactionWeight = Math.min(this.sessionNavCount / 50, 0.4); // Max 40% de chance pelo uso
      const timeWeight = Math.min(timeSinceLast / this.MILESTONES.TIME_WEIGHT, 0.5); // Max 50% pelo tempo
      
      // Chance base de 30% apos o Milestone 2, crescendo ate ~90% se ele demorar a ver
      const totalChance = 0.2 + interactionWeight + timeWeight;
      const passChance = Math.random() < totalChance;

      // So tenta mostrar a cada 5 cliques apos o milestone 2 para nao testar a sorte em todo clique
      if ((this.sessionNavCount - this.MILESTONES.SECOND) % 5 === 0 && passChance) {
        console.log(`[AdService] � Probabilidade aceita (${(totalChance*100).toFixed(0)}%). Exibindo.`);
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  // Mostra o Interstitial (com protecao total contra crash)
  public async showInterstitial(): Promise<boolean> {
    try {
      console.log('[AdService] showInterstitial request...');
      
      // Auto-Recuperação: Se não estiver inicializado, tenta inicializar agora
      if (!this.initialized && !this.isRecovering) {
        console.log('[AdService] Motor desligado. Tentando religar para atender request.');
        this.initialize(); // Inicia em background
      }

      if (!this.adsEnabled && !isExpoGo) return false;

      if (!this.shouldShowInterstitial()) return false;

      // Se chegamos aqui, decidimos mostrar
      this.lastAdShowTime = Date.now();
      this.sessionAdCount++;

      console.log('[AdService] 🚀 Preparando para exibir anuncio...');

      // Em Expo Go, simula com Alert visual (protegido)
      if (isExpoGo) {
        try {
          const { Alert } = require('react-native');
          Alert.alert(
            '📢 Publicidade (Modo Teste)',
            `Esta tela seria um anuncio em tela cheia na versao final.\n\nNavegacao #${this.sessionNavCount}\nAnuncio #${this.sessionAdCount}`,
            [{ text: 'Continuar' }]
          );
          this.isInterstitialLoaded = false;
          setTimeout(() => this.preloadInterstitial(), 1000);
          return true;
        } catch (alertError) {
          console.log('[AdService] Erro ao mostrar Alert de teste');
          return false;
        }
      }

      // Build nativo: Mostra o real (com verificacao de vida do objeto)
      if (this.interstitialAd && this.isInterstitialLoaded) {
        try {
          await this.interstitialAd.show();
          return true;
        } catch (showError) {
          console.error('[AdService] Falha ao exibir objeto real. Motor caiu?', showError);
          this.isInterstitialLoaded = false;
          this.preloadInterstitial(); // Tenta recarregar
          return false;
        }
      }

      console.log('[AdService] Anuncio selecionado porem objeto nao estava pronto.');
      return false;
    } catch (error) {
      console.error('[AdService] Erro fatal no showInterstitial:', error);
      return false;
    }
  }
}

export default AdService.getInstance();

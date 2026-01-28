/**
 * adConfig.ts - Configuração Centralizada de Anúncios
 * 
 * 📋 INSTRUÇÕES PARA PRODUÇÃO:
 * 
 * 1. Acesse o Google AdMob Console: https://apps.admob.google.com
 * 2. Crie seu app e configure os Ad Units
 * 3. Copie os IDs gerados e cole abaixo nas variáveis PRODUCTION_*
 * 4. Pronto! O app usará automaticamente os IDs corretos em produção
 * 
 * ⚠️ IMPORTANTE:
 * - Em DESENVOLVIMENTO (__DEV__ = true): Usa Test IDs do Google (seguro para testes)
 * - Em PRODUÇÃO (__DEV__ = false): Usa seus IDs reais do AdMob
 * - NUNCA clique nos seus próprios anúncios reais (pode banir sua conta)
 */

import { Platform } from 'react-native';

// ============================================================================
// 🔧 CONFIGURAÇÃO - SUBSTITUA ESTES IDs PELOS SEUS IDs REAIS DO ADMOB
// ============================================================================

/**
 * IDs de PRODUÇÃO - Substitua pelos seus IDs reais do AdMob
 * Formato: ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
 */
const PRODUCTION_IOS_BANNER = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
const PRODUCTION_IOS_INTERSTITIAL = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
const PRODUCTION_IOS_REWARDED = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
const PRODUCTION_IOS_APP_OPEN = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';

const PRODUCTION_ANDROID_BANNER = 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ';
const PRODUCTION_ANDROID_INTERSTITIAL = 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ';
const PRODUCTION_ANDROID_REWARDED = 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ';
const PRODUCTION_ANDROID_APP_OPEN = 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ';

// ============================================================================
// 🧪 TEST IDs - NÃO MODIFICAR (IDs oficiais do Google para testes)
// ============================================================================

/**
 * Test IDs oficiais do Google AdMob
 * Fonte: https://developers.google.com/admob/android/test-ads
 */
export const TEST_IDS = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  APP_OPEN: 'ca-app-pub-3940256099942544/3419835294',
};

// ============================================================================
// 📱 AD UNIT IDs - CONFIGURAÇÃO AUTOMÁTICA (DEV vs PROD)
// ============================================================================

/**
 * Ad Unit IDs que serão usados no app
 * - Em DEV: Usa Test IDs (seguro)
 * - Em PROD: Usa seus IDs reais do AdMob
 */
export const AdUnitIds = {
  BANNER: __DEV__ 
    ? TEST_IDS.BANNER 
    : (Platform.OS === 'ios' ? PRODUCTION_IOS_BANNER : PRODUCTION_ANDROID_BANNER),
  
  INTERSTITIAL: __DEV__ 
    ? TEST_IDS.INTERSTITIAL 
    : (Platform.OS === 'ios' ? PRODUCTION_IOS_INTERSTITIAL : PRODUCTION_ANDROID_INTERSTITIAL),
  
  REWARDED: __DEV__ 
    ? TEST_IDS.REWARDED 
    : (Platform.OS === 'ios' ? PRODUCTION_IOS_REWARDED : PRODUCTION_ANDROID_REWARDED),
  
  APP_OPEN: __DEV__ 
    ? TEST_IDS.APP_OPEN 
    : (Platform.OS === 'ios' ? PRODUCTION_IOS_APP_OPEN : PRODUCTION_ANDROID_APP_OPEN),
};

// ============================================================================
// ⚙️ CONFIGURAÇÕES DE COMPORTAMENTO DOS ANÚNCIOS
// ============================================================================

/**
 * Configurações de frequência e comportamento dos anúncios
 */
export const AdConfig = {
  /**
   * Frequência de exibição dos Interstitials
   * Exemplo: 3 = mostra 1 anúncio a cada 3 navegações
   * Ajuste para equilibrar ganhos vs experiência do usuário
   */
  INTERSTITIAL_FREQUENCY: 3,

  /**
   * Tempo mínimo entre Interstitials (em segundos)
   * Previne spam de anúncios
   */
  INTERSTITIAL_MIN_INTERVAL: 60,

  /**
   * Habilitar/desabilitar anúncios globalmente
   * Útil para testes ou versão premium
   */
  ADS_ENABLED: true,

  /**
   * Configurações de conteúdo para crianças (COPPA compliance)
   */
  TAG_FOR_CHILD_DIRECTED_TREATMENT: true,
  TAG_FOR_UNDER_AGE_OF_CONSENT: true,
  MAX_AD_CONTENT_RATING: 'G', // G, PG, T, MA

  /**
   * Timeout para inicialização do AdMob (ms)
   * Previne que ads travem a splash screen
   */
  INITIALIZATION_TIMEOUT: 5000,
};

// ============================================================================
// 📊 LOGS E DEBUG
// ============================================================================

/**
 * Habilitar logs detalhados de anúncios
 * Útil para debug, desabilite em produção
 */
export const AD_DEBUG_LOGS = __DEV__;

/**
 * Função helper para logs de anúncios
 */
export const adLog = (message: string, ...args: any[]) => {
  if (AD_DEBUG_LOGS) {
    console.log(`[AdService] ${message}`, ...args);
  }
};

// ============================================================================
// ✅ VALIDAÇÃO (Opcional - previne erros de configuração)
// ============================================================================

/**
 * Valida se os IDs de produção foram configurados
 * Avisa no console se ainda estiver usando placeholders
 */
export const validateAdConfig = () => {
  if (!__DEV__) {
    const hasPlaceholders = 
      PRODUCTION_IOS_BANNER.includes('XXXXXXXX') ||
      PRODUCTION_ANDROID_BANNER.includes('XXXXXXXX');
    
    if (hasPlaceholders) {
      console.warn(
        '⚠️ [AdMob] ATENÇÃO: Você está em PRODUÇÃO mas ainda usando IDs de placeholder!\n' +
        'Configure seus IDs reais em src/config/adConfig.ts'
      );
    } else {
      console.log('✅ [AdMob] Configuração de produção validada');
    }
  }
};

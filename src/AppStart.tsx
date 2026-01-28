import React from 'react';
import { AppProviders } from './AppProviders';
import { AppNavigator } from './navigation/AppNavigator';
import { SideMenu, PremiumModal } from './components';

// ============================================================================
// MODO DE DESENVOLVIMENTO - TESTE DE TELAS ISOLADAS
// ============================================================================
// Para testar uma tela específica sem passar pelo fluxo completo:
//
// 1. DESCOMENTE a linha da tela que quer testar abaixo
// 2. COMENTE o return com <AppNavigator />
// 3. Rode o app
// 4. Quando terminar, reverta as mudanças
//
// Exemplo: Para testar HomeScreen:
//   - Descomente: import { HomeScreen } from './screens';
//   - Descomente: return <AppProviders><HomeScreen {...mockNav} /></AppProviders>;
//   - Comente: return <AppProviders><AppNavigator /></AppProviders>;
// ============================================================================

// --- DESCOMENTE A TELA QUE QUER TESTAR ---
// import { HomeScreen } from './screens';
// import { SearchScreen } from './screens';
// import { DownloadsScreen } from './screens';
// import { DetailsScreen } from './screens';
// import { InfoScreen } from './screens';
// import { AnimeDetailsScreen } from './screens';
// import { SplashScreen } from './screens';

// --- PROPS MOCK PARA NAVEGAÇÃO (não precisa mudar) ---
const mockNav = {
  navigation: {
    navigate: (screen: string, params?: any) => console.log(`[DEV] Navegar para: ${screen}`, params),
    goBack: () => console.log('[DEV] Voltar'),
    replace: (screen: string) => console.log(`[DEV] Substituir por: ${screen}`),
    setOptions: () => {},
  } as any,
  route: {
    key: 'dev',
    name: 'DevScreen',
    params: {
      // Adicione params mock aqui se necessário:
      // animeTitle: 'Teste Anime',
      // item: { id: '1', title: 'Test' },
    },
  } as any,
};

/**
 * AppStart é o ponto de entrada principal do app.
 * 
 * Fluxo normal: Renderiza AppProviders + AppNavigator
 * Modo dev: Renderiza a tela isolada (descomentando acima)
 */
export const AppStart: React.FC = () => {
  // =========================================================================
  // MODO DE TESTE - Descomente UMA linha abaixo para testar tela isolada:
  // =========================================================================
  // return <AppProviders><HomeScreen {...mockNav} /></AppProviders>;
  // return <AppProviders><SearchScreen {...mockNav} /></AppProviders>;
  // return <AppProviders><DownloadsScreen {...mockNav} /></AppProviders>;
  // return <AppProviders><DetailsScreen {...mockNav} /></AppProviders>;
  // return <AppProviders><AnimeDetailsScreen {...mockNav} /></AppProviders>;
  // return <AppProviders><SplashScreen {...mockNav} /></AppProviders>;
  // =========================================================================

  // Fluxo normal do app
  return (
    <AppProviders>
      <AppNavigator />
      <SideMenu />
      <PremiumModal />
    </AppProviders>
  );
};

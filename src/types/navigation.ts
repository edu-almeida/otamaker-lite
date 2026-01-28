/**
 * Tipos de navegação do app.
 */

/**
 * RootStackParamList - Parâmetros das telas do stack principal.
 */
export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  PackDetails: { 
    packageId: string;
    packageTitle: string;
    animeTitle: string;
    mainIcon: any;
    stickers: any[];
    isLiked?: boolean;
    isFavorited?: boolean;
    hideAnimeName?: boolean;
    isAnimated?: boolean;
  };
  AnimeDetails: { 
    animeTitle: string;
    /** Se veio do catálogo, não mostra botão "Ver Pacotes" */
    fromCatalog?: boolean;
    hidePackagesButton?: boolean;
  };
  OtamaProfile: {
    creatorName: string;
  };
};

/**
 * TabParamList - Parâmetros das abas de navegação.
 */
export type TabParamList = {
  HomeTab: undefined;
  AnimeCatalogTab: undefined;
  OtamaLibraryTab: undefined;
};

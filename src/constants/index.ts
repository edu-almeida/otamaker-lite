/**
 * Constantes de navegação
 * Usadas pela tab bar e cálculos de layout
 */
export const NAVIGATION = {
  TAB_COUNT: 3,          // Número de abas (Home, Search, Downloads)
  TAB_BAR_HEIGHT: 60,    // Altura da barra de abas em pixels
  SLIDER_PADDING: 24,    // Padding do slider dentro de cada aba
} as const;

/**
 * Constantes da tela de busca
 * Usadas pelo SearchScreen para layout do grid
 */
export const SEARCH = {
  ALPHABET: "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split(''), // Letras da sidebar
  COLUMNS_COUNT: 3,           // Colunas no grid de animes
  SIDEBAR_WIDTH: 30,          // Largura da sidebar alfabética
  SPACING_GUTTER: 12,         // Espaçamento entre cards (igual ao padding)
  LIST_HORIZONTAL_PADDING: 12, // Padding horizontal da lista
  SEARCH_BAR_TOP_OFFSET: 67,   // Offset do topo para a barra de busca
  SIDEBAR_TOP_OFFSET: 71,      // Offset do topo para a sidebar
} as const;

/**
 * Durações de animações em milissegundos
 * Manter consistente em todo o app
 */
export const ANIMATIONS = {
  TAB_TRANSITION_DURATION: 300,  // Transição entre abas
  FOCUS_ANIMATION_DURATION: 200, // Animação de foco em inputs
  STAGGER_DELAY: 100,            // Delay entre animações em sequência
  WATERFALL_DURATION: 600,       // Duração da animação "waterfall" dos cards
  DEBOUNCE_DELAY: 300,           // Delay para debounce de busca
} as const;

/**
 * Dimensões de cards
 * Usadas pelo StickerCard
 */
export const CARDS = {
  MAIN_ICON_SIZE: 80,   // Tamanho do ícone principal do pacote
  PREVIEW_SIZE: 36,     // Tamanho dos previews de stickers
  MAX_PREVIEWS: 6,      // Máximo de previews visíveis
} as const;

/**
 * Sombra padronizada minimalista
 * Usar em todos os cards para consistência visual
 */
export const SHADOWS = {
  card: {},
} as const;

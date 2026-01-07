export const palette = {
    // BRAND: O Coral Ottamaker (Extraído do logo)
    coral: {
        50: '#FFF0F0',
        100: '#FFDADA',
        200: '#FF8E8E',  // Tom mais claro para Dark Mode
        500: '#FF6B6B',  // COR BASE (Exata do logo)
        600: '#E55B5B',  // Estado de clique (Pressed)
        900: '#4A1E1E',
    },

    // ACCENT: Amarelo para raridade (Mantido como secundária geek)
    yellow: {
        400: '#FFD54F',
        500: '#FFC107',
    },

    // NEUTRALS: Baseado nos brancos e cinzas do logo
    gray: {
        0: '#FFFFFF',
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        400: '#9CA3AF',
        500: '#6B7280',
        900: '#1A202C',  // Cinza quase preto para textos
    },

    // DARK SYSTEM: Grafite Azulado (Exato do fundo do logo)
    dark: {
        bg: '#24292E',      // Fundo oficial do logo
        surface: '#2F363D', // Cards um pouco mais claros
        border: '#444D56',
    },

    // FEEDBACK
    success: '#48BB78',
    error: '#F56565',
    info: '#4299E1',
    black: '#000000',
};

export const colors = {
    ...palette,
    // Semantic aliases can be added here if needed, but the main theme logic will handle light/dark mapping
};

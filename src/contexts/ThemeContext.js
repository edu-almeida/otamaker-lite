import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { theme } from '../theme';

// 1. Tipagem automática baseada no seu objeto de tema
// type ThemeType = typeof lightTheme; // Using JS, Typescript types commented out but logic kept

// 2. Criamos o contexto 
const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
    const deviceTheme = useColorScheme();

    // Detecta o tema e memoriza para não reprocessar sem necessidade
    const currentTheme = useMemo(() => {
        return deviceTheme === 'dark' ? theme.dark : theme.light;
    }, [deviceTheme]);

    return (
        <ThemeContext.Provider value={currentTheme}>
            {children}
        </ThemeContext.Provider>
    );
}

// 3. Hook para usar o tema nas telas
export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }

    return context;
}

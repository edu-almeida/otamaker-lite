import React, { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './contexts/ThemeContext';
import { SideMenuProvider } from './contexts/SideMenuContext';
import './i18n';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders - Wrapper com todos os providers globais do app.
 * 
 * Este componente encapsula:
 * - ThemeProvider: Gerencia tema claro/escuro
 * - SafeAreaProvider: Gerencia áreas seguras (notch, barra de status)
 * - i18n: Internacionalização (importado no topo)
 * 
 * Separar os providers assim mantém o App.tsx limpo e facilita
 * testes unitários (você pode mockar os providers individualmente).
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <SideMenuProvider>
            {children}
          </SideMenuProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

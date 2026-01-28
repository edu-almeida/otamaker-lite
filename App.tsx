import React from 'react';
import { AppStart } from './src/AppStart';

/**
 * App - Componente raiz do aplicativo.
 * 
 * Mantido mínimo propositalmente. Toda a lógica está em:
 * - src/AppStart.tsx - Decide o que renderizar
 * - src/AppProviders.tsx - Providers globais
 * - src/navigation/AppNavigator.tsx - Navegação
 */
export default function App(): React.JSX.Element {
  return <AppStart />;
}

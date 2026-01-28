/**
 * debounce - Atrasa a execução de uma função até que pare de ser chamada.
 * 
 * Útil para evitar chamadas excessivas em:
 * - Busca enquanto digita (não buscar a cada letra)
 * - Resize de janela
 * - Scroll infinito
 * 
 * @param func - Função a ser atrasada
 * @param wait - Tempo de espera em milissegundos
 * @returns Versão "debounced" da função
 * 
 * @example
 * const debouncedSearch = debounce((query) => api.search(query), 300);
 * input.onChangeText(debouncedSearch); // Só busca 300ms após parar de digitar
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    // Cancela o timer anterior se ainda estiver pendente
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // Agenda nova execução
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * range - Cria um array de números de 0 até n-1.
 * 
 * Útil para loops com índices ou criar arrays de tamanho fixo.
 * 
 * @param n - Quantidade de elementos
 * @returns Array [0, 1, 2, ..., n-1]
 * 
 * @example
 * range(5) // [0, 1, 2, 3, 4]
 * range(3).map(i => <Item key={i} />) // Renderiza 3 Items
 */
export function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

/**
 * clamp - Limita um valor entre mínimo e máximo.
 * 
 * Útil para garantir que valores fiquem dentro de limites válidos.
 * 
 * @param value - Valor a ser limitado
 * @param min - Valor mínimo permitido
 * @param max - Valor máximo permitido
 * @returns Valor dentro dos limites
 * 
 * @example
 * clamp(150, 0, 100) // 100
 * clamp(-10, 0, 100) // 0
 * clamp(50, 0, 100)  // 50
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * chunk - Divide um array em pedaços de tamanho fixo.
 * 
 * Útil para criar grids ou paginar dados.
 * 
 * @param array - Array a ser dividido
 * @param size - Tamanho de cada pedaço
 * @returns Array de arrays
 * 
 * @example
 * chunk([1,2,3,4,5], 2) // [[1,2], [3,4], [5]]
 * chunk(items, 3) // Para grid de 3 colunas
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * injectAds - Insere itens de anúncio em uma lista a cada N itens.
 * 
 * @param items - Lista original de items
 * @param frequency - Frequência de inserção (ex: 5 = a cada 5 itens)
 * @returns Nova lista contendo items originais + anúncios
 */
export function injectAds<T>(items: T[], frequency: number = 5): (T | { type: 'ad'; id: string })[] {
  const result: (T | { type: 'ad'; id: string })[] = [];
  items.forEach((item, index) => {
    result.push(item);
    if ((index + 1) % frequency === 0) {
      result.push({ type: 'ad', id: `ad-${index}` });
    }
  });
  return result;
}

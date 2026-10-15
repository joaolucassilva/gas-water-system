/**
 * Utilitários para manipulação de valores monetários como inteiros (Centavos).
 * Padrão bancário e Stripe: R$ 110,00 = 11000 centavos.
 */

// Converte centavos inteiros para string formatada em Reais (Ex: 11000 -> "R$ 110,00")
export function formatCentsToBRL(cents: number): string {
  const value = (cents || 0) / 100;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Converte centavos inteiros para número decimal para exibição (Ex: 11000 -> 110.00)
export function centsToReais(cents: number): number {
  return (cents || 0) / 100;
}

// Converte reais digitados pelo usuário para centavos inteiros (Ex: 110.50 -> 11050)
export function reaisToCents(reais: number | string): number {
  if (typeof reais === 'string') {
    const cleaned = reais.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Math.round(parsed * 100);
  }
  return Math.round((reais || 0) * 100);
}

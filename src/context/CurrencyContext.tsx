import { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'EUR' | 'CHF' | 'GBP';

interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // Rate relative to EUR
}

export const currencies: Record<Currency, CurrencyConfig> = {
  EUR: { code: 'EUR', symbol: '€', rate: 1 },
  CHF: { code: 'CHF', symbol: 'CHF', rate: 0.94 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.86 },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInEur: number) => string;
  convertPrice: (priceInEur: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('EUR');

  const convertPrice = (priceInEur: number): number => {
    const config = currencies[currency];
    return Math.round(priceInEur * config.rate * 100) / 100;
  };

  const formatPrice = (priceInEur: number): string => {
    const converted = convertPrice(priceInEur);
    const config = currencies[currency];
    
    if (currency === 'CHF') {
      return `${config.symbol} ${converted.toFixed(2)}`;
    }
    return `${converted.toFixed(2)} ${config.symbol}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

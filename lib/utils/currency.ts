export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rateToNgn: number; // 1 unit of currency in NGN
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (NGN)', rateToNgn: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', rateToNgn: 1550 },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', rateToNgn: 1680 },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', rateToNgn: 2000 },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi (GHS)', rateToNgn: 105 },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling (KES)', rateToNgn: 12 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', rateToNgn: 1140 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand (ZAR)', rateToNgn: 85 },
];

export const DEFAULT_CURRENCY = 'NGN';

export function getCurrencyConfig(code: string = DEFAULT_CURRENCY): CurrencyConfig {
  const upper = (code || DEFAULT_CURRENCY).toUpperCase();
  return (
    SUPPORTED_CURRENCIES.find((c) => c.code === upper) || {
      code: upper,
      symbol: upper === 'NGN' ? '₦' : upper === 'USD' ? '$' : upper === 'EUR' ? '€' : upper === 'GBP' ? '£' : '$',
      name: upper,
      rateToNgn: 1,
    }
  );
}

export function getCurrencySymbol(code: string = DEFAULT_CURRENCY): string {
  return getCurrencyConfig(code).symbol;
}

/**
 * Direct currency conversion calculation.
 * Convert an amount from `fromCurrency` to `toCurrency`.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string = DEFAULT_CURRENCY,
  toCurrency: string = DEFAULT_CURRENCY
): number {
  if (isNaN(amount) || amount === 0) return 0;

  const fromConfig = getCurrencyConfig(fromCurrency);
  const toConfig = getCurrencyConfig(toCurrency);

  if (fromConfig.code === toConfig.code) return amount;

  // Convert to NGN base first, then convert from NGN to target currency
  const amountInNgn = amount * fromConfig.rateToNgn;
  const convertedAmount = amountInNgn / toConfig.rateToNgn;

  // Round neatly to 2 decimal places (or integers if target is NGN/KES)
  return Math.round(convertedAmount * 100) / 100;
}

/**
 * Format currency amount with symbol and appropriate precision.
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = DEFAULT_CURRENCY
): string {
  const num = isNaN(amount) ? 0 : amount;
  const config = getCurrencyConfig(currencyCode);

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: config.code === 'NGN' || config.code === 'KES' ? 0 : 2,
      maximumFractionDigits: 2,
    })
      .format(num)
      .replace(config.code, config.symbol)
      .trim();
  } catch (e) {
    return `${config.symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
}

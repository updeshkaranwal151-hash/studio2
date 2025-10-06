'use server';

import { convertCurrency, CurrencyConversionInput } from '@/ai/flows/currency-conversion';

export async function getCurrencyConversion(data: CurrencyConversionInput) {
  try {
    const result = await convertCurrency(data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to convert currency.' };
  }
}

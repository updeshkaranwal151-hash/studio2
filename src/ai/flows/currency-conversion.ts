// CurrencyConversion.ts
'use server';
/**
 * @fileOverview Currency conversion flow that uses GenAI to convert between different currencies.
 *
 * - convertCurrency - A function that handles the currency conversion process.
 * - CurrencyConversionInput - The input type for the convertCurrency function.
 * - CurrencyConversionOutput - The return type for the convertCurrency function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CurrencyConversionInputSchema = z.object({
  fromCurrency: z.string().describe('The currency to convert from (e.g., USD)'),
  toCurrency: z.string().describe('The currency to convert to (e.g., EUR)'),
  amount: z.number().describe('The amount to convert'),
});
export type CurrencyConversionInput = z.infer<typeof CurrencyConversionInputSchema>;

const CurrencyConversionOutputSchema = z.object({
  convertedAmount: z.string().describe('The converted amount in the target currency.'),
});
export type CurrencyConversionOutput = z.infer<typeof CurrencyConversionOutputSchema>;

export async function convertCurrency(input: CurrencyConversionInput): Promise<CurrencyConversionOutput> {
  return currencyConversionFlow(input);
}

const getExchangeRate = ai.defineTool({
  name: 'getExchangeRate',
  description: 'Retrieves the current exchange rate between two currencies.',
  inputSchema: z.object({
    fromCurrency: z.string().describe('The currency to convert from (e.g., USD)'),
    toCurrency: z.string().describe('The currency to convert to (e.g., EUR)'),
  }),
  outputSchema: z.number().describe('The current exchange rate between the two currencies.'),
}, async (input) => {
  // In a real application, this would call an external API to get the exchange rate.
  // For now, we'll just return a dummy value.
  // TODO: Replace with actual API call.
  console.log("calling tool with", input);
  if (input.fromCurrency === 'USD' && input.toCurrency === 'EUR') {
    return 0.9;
  } else if (input.fromCurrency === 'EUR' && input.toCurrency === 'USD') {
    return 1.1;
  } else if (input.fromCurrency === 'USD' && input.toCurrency === 'JPY') {
    return 150;
  } else if (input.fromCurrency === 'JPY' && input.toCurrency === 'USD') {
    return 0.0067;
  } else {
    return 1.0; // Default to 1 if currencies are the same or not supported.
  }
});

const currencyConversionPrompt = ai.definePrompt({
  name: 'currencyConversionPrompt',
  tools: [getExchangeRate],
  input: {schema: CurrencyConversionInputSchema},
  output: {schema: CurrencyConversionOutputSchema},
  prompt: `You are a currency conversion expert. The user will provide an amount, a source currency, and a target currency.

  If you do not know the current exchange rate, use the provided tool to look it up.
  Use the current exchange rate to convert the amount from the source currency to the target currency.

  Return the converted amount in the target currency.

  For example, if the user asks to convert 100 USD to EUR, you should first use the getExchangeRate tool to get the current exchange rate between USD and EUR.
  Then, you should multiply 100 by the exchange rate to get the converted amount.

  If the user inputs are: fromCurrency=\'USD\', toCurrency=\'EUR\', amount=100, then your answer should be:
  \"convertedAmount\": \"90 EUR\"

  Here are the user inputs:
  fromCurrency: {{{fromCurrency}}}
  toCurrency: {{{toCurrency}}}
  amount: {{{amount}}}
  `,
});

const currencyConversionFlow = ai.defineFlow(
  {
    name: 'currencyConversionFlow',
    inputSchema: CurrencyConversionInputSchema,
    outputSchema: CurrencyConversionOutputSchema,
  },
  async input => {
    const {output} = await currencyConversionPrompt(input);
    return output!;
  }
);

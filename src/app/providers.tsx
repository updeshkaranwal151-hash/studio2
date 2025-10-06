'use client';

import { CalculatorProvider } from '@/context/calculator-context';
import type { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  return <CalculatorProvider>{children}</CalculatorProvider>;
}

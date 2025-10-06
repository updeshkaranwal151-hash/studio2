'use client';

import { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';

interface Calculation {
  expression: string;
  result: string;
  timestamp: string;
}

interface CalculatorContextType {
  history: Calculation[];
  addToHistory: (calculation: Omit<Calculation, 'timestamp'>) => void;
  clearHistory: () => void;
  memory: number;
  setMemory: (value: number) => void;
  addToMemory: (value: number) => void;
  subtractFromMemory: (value: number) => void;
  clearMemory: () => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useLocalStorage<Calculation[]>('calc-history', []);
  const [memory, setMemory] = useLocalStorage<number>('calc-memory', 0);

  const addToHistory = (calculation: Omit<Calculation, 'timestamp'>) => {
    const newCalculation: Calculation = {
      ...calculation,
      timestamp: new Date().toISOString(),
    };
    setHistory([newCalculation, ...history].slice(0, 50)); // Keep last 50
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const addToMemory = (value: number) => {
    setMemory(memory + value);
  };

  const subtractFromMemory = (value: number) => {
    setMemory(memory - value);
  };

  const clearMemory = () => {
    setMemory(0);
  };

  const value = {
    history,
    addToHistory,
    clearHistory,
    memory,
    setMemory,
    addToMemory,
    subtractFromMemory,
    clearMemory,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}

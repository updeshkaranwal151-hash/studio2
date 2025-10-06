'use client';

import { Calculator, History, LineChart, Scale, Coins } from 'lucide-react';

import {
  SidebarInset,
} from '@/components/ui/sidebar';
import CalculatorPage from '@/components/pages/calculator-page';

export default function Home() {
  return (
    <SidebarInset>
      <main className="flex flex-1 flex-col items-center justify-center p-4 lg:p-8 bg-background">
        <div className="w-full max-w-md mx-auto">
          <CalculatorPage />
        </div>
      </main>
    </SidebarInset>
  );
}

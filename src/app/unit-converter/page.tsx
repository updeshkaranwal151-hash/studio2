'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SidebarInset } from '@/components/ui/sidebar';
import { unitCategories, convertUnit, Category } from '@/lib/conversions';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState<string>('meters');
  const [toUnit, setToUnit] = useState<string>('feet');
  const [inputValue, setInputValue] = useState<string>('1');

  const currentUnits = useMemo(() => Object.keys(unitCategories[category].units), [category]);

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    const newUnits = Object.keys(unitCategories[newCategory].units);
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1] || newUnits[0]);
  };
  
  const swapUnits = () => {
    const oldFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(oldFrom);
  }

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '...';
    try {
      const converted = convertUnit(value, fromUnit, toUnit, category);
      return converted.toLocaleString(undefined, { maximumFractionDigits: 5 });
    } catch {
      return 'Error';
    }
  }, [inputValue, fromUnit, toUnit, category]);

  return (
    <SidebarInset>
      <main className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center mb-4">
          <h1 className="font-semibold text-lg md:text-2xl">Unit Converter</h1>
        </div>
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Convert Units</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={(v) => handleCategoryChange(v as Category)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(unitCategories).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_2fr] items-center gap-4">
              {/* From */}
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <Input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="text-lg"
                />
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUnits.map((unitKey) => (
                      <SelectItem key={unitKey} value={unitKey}>
                        {unitCategories[category].units[unitKey as keyof typeof unitCategories[typeof category]['units']].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap */}
              <div className="flex justify-center md:mt-6">
                <Button variant="ghost" size="icon" onClick={swapUnits}>
                  <ArrowRightLeft className="h-6 w-6 text-primary" />
                </Button>
              </div>

              {/* To */}
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <div className="w-full h-10 flex items-center justify-end rounded-md border border-input bg-secondary px-3 py-2 text-lg text-secondary-foreground font-semibold">
                  {result}
                </div>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                     {currentUnits.map((unitKey) => (
                      <SelectItem key={unitKey} value={unitKey}>
                        {unitCategories[category].units[unitKey as keyof typeof unitCategories[typeof category]['units']].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  );
}

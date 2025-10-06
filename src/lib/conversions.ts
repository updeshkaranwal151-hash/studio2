// Base units: meter, kilogram, celsius

export const unitCategories = {
  length: {
    name: 'Length',
    units: {
      meters: { name: 'Meters', toBase: (v: number) => v, fromBase: (v: number) => v },
      kilometers: { name: 'Kilometers', toBase: (v: number) => v * 1000, fromBase: (v: number) => v / 1000 },
      centimeters: { name: 'Centimeters', toBase: (v: number) => v / 100, fromBase: (v: number) => v * 100 },
      miles: { name: 'Miles', toBase: (v: number) => v * 1609.34, fromBase: (v: number) => v / 1609.34 },
      feet: { name: 'Feet', toBase: (v: number) => v * 0.3048, fromBase: (v: number) => v / 0.3048 },
      inches: { name: 'Inches', toBase: (v: number) => v * 0.0254, fromBase: (v: number) => v / 0.0254 },
    },
  },
  mass: {
    name: 'Mass',
    units: {
      kilograms: { name: 'Kilograms', toBase: (v: number) => v, fromBase: (v: number) => v },
      grams: { name: 'Grams', toBase: (v: number) => v / 1000, fromBase: (v: number) => v * 1000 },
      pounds: { name: 'Pounds', toBase: (v: number) => v * 0.453592, fromBase: (v: number) => v / 0.453592 },
      ounces: { name: 'Ounces', toBase: (v: number) => v * 0.0283495, fromBase: (v: number) => v / 0.0283495 },
    },
  },
  temperature: {
    name: 'Temperature',
    units: {
      celsius: { name: 'Celsius', toBase: (v: number) => v, fromBase: (v: number) => v },
      fahrenheit: { name: 'Fahrenheit', toBase: (v: number) => (v - 32) * 5 / 9, fromBase: (v: number) => (v * 9 / 5) + 32 },
      kelvin: { name: 'Kelvin', toBase: (v: number) => v - 273.15, fromBase: (v: number) => v + 273.15 },
    },
  },
};

export type Category = keyof typeof unitCategories;

export function convertUnit(value: number, fromUnit: string, toUnit: string, category: Category): number {
  const cat = unitCategories[category];
  if (!cat) throw new Error('Invalid category');

  const from = cat.units[fromUnit as keyof typeof cat.units];
  const to = cat.units[toUnit as keyof typeof cat.units];
  if (!from || !to) throw new Error('Invalid unit');

  const baseValue = from.toBase(value);
  const result = to.fromBase(baseValue);
  
  return result;
}

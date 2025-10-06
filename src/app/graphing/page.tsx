'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SidebarInset } from '@/components/ui/sidebar';
import { evaluateGraphingEquation } from '@/lib/math-eval';
import { toast } from '@/hooks/use-toast';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

type ChartData = { x: number; y: number | null };

export default function GraphingPage() {
  const [equation, setEquation] = useState('x^2');
  const [plottedEquation, setPlottedEquation] = useState('x^2');

  const chartData = useMemo((): ChartData[] => {
    try {
      const fn = evaluateGraphingEquation(plottedEquation);
      const data: ChartData[] = [];
      for (let i = -10; i <= 10; i += 0.5) {
        const y = fn(i);
        data.push({ x: i, y: isFinite(y) ? y : null });
      }
      return data;
    } catch (e) {
      return [];
    }
  }, [plottedEquation]);

  const handlePlot = () => {
    try {
      // Test evaluation
      evaluateGraphingEquation(equation)(1);
      setPlottedEquation(equation);
    } catch (e) {
        toast({
            variant: 'destructive',
            title: 'Invalid Equation',
            description: 'Please enter a valid equation in terms of x.',
        })
    }
  };

  return (
    <SidebarInset>
      <main className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center mb-4">
          <h1 className="font-semibold text-lg md:text-2xl">Graphing Calculator</h1>
        </div>
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Visualize Equations</CardTitle>
            <CardDescription>
              Enter an equation with 'x' as the variable to see it plotted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center space-x-2 mb-6">
              <span className="text-lg font-semibold">y =</span>
              <Input
                type="text"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                placeholder="e.g., x^3 - 2*x"
                className="flex-1"
              />
              <Button onClick={handlePlot}>Plot</Button>
            </div>
            <div className="w-full h-[400px] bg-background/50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 20,
                            left: -10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="x" stroke="hsl(var(--foreground))" />
                        <YAxis stroke="hsl(var(--foreground))" />
                        <Tooltip
                         contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))'
                         }}
                        />
                        <Legend />
                         <Line 
                            type="monotone" 
                            dataKey="y" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={false}
                            connectNulls
                            name={`y = ${plottedEquation}`}
                        />
                         <Line type="monotone" dataKey="x" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} connectNulls name={`y = ${plottedEquation}`} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  );
}

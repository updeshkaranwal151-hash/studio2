'use client';

import { useCalculator } from '@/context/calculator-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarInset } from '@/components/ui/sidebar';
import { toast } from '@/hooks/use-toast';
import { Copy, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function HistoryPage() {
  const { history, clearHistory } = useCalculator();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: text,
    });
  };

  return (
    <SidebarInset>
      <main className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center mb-4">
          <h1 className="font-semibold text-lg md:text-2xl">Calculation History</h1>
        </div>
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Calculations</CardTitle>
            {history.length > 0 && (
              <Button variant="destructive" size="sm" onClick={clearHistory}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {history.length === 0 ? (
                <div className="text-center text-muted-foreground py-16">
                  <p>No history yet.</p>
                  <p>Your calculations will appear here.</p>
                </div>
              ) : (
                <ul className="divide-y">
                  {history.map((calc, index) => (
                    <li key={index} className="px-6 py-4 flex justify-between items-center hover:bg-secondary/50">
                      <div>
                        <p className="text-muted-foreground">{calc.expression}</p>
                        <p className="text-xl font-bold text-primary">{`= ${calc.result}`}</p>
                         <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(calc.timestamp), { addSuffix: true })}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(calc.result)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SidebarInset } from '@/components/ui/sidebar';
import { getCurrencyConversion } from './actions';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { CurrencyConversionOutput } from '@/ai/flows/currency-conversion';

const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

const formSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  fromCurrency: z.string().min(1, 'Please select a currency'),
  toCurrency: z.string().min(1, 'Please select a currency'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CurrencyConverterPage() {
  const [result, setResult] = useState<CurrencyConversionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    const response = await getCurrencyConversion(values);
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: response.error,
      });
    }
  }

  return (
    <SidebarInset>
      <main className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center mb-4">
          <h1 className="font-semibold text-lg md:text-2xl">Currency Converter</h1>
        </div>
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Convert Currency</CardTitle>
            <CardDescription>
              Get real-time currency conversions powered by AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fromCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="From currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="To currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Convert'}
                </Button>
              </form>
            </Form>

            {(isLoading || result) && (
              <div className="mt-8 text-center">
                {isLoading && <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />}
                {result && (
                  <div>
                    <p className="text-muted-foreground">{`${form.getValues('amount')} ${form.getValues('fromCurrency')} is`}</p>
                    <p className="text-4xl font-bold text-primary my-2">{result.convertedAmount}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  );
}

'use client';

import React, { useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/context/calculator-context';
import { evaluate } from '@/lib/math-eval';
import { toast } from '@/hooks/use-toast';
import { SquareRadical, Percent, Divide, X, Minus, Plus, Equal, Delete, Superscript } from 'lucide-react';

const initialState = {
  currentOperand: '0',
  previousOperand: null,
  operation: null,
  overwrite: true,
};

type State = {
  currentOperand: string;
  previousOperand: string | null;
  operation: string | null;
  overwrite: boolean;
};

type Action =
  | { type: 'ADD_DIGIT'; payload: string }
  | { type: 'CHOOSE_OPERATION'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'DELETE_DIGIT' }
  | { type: 'EVALUATE' }
  | { type: 'APPLY_UNARY'; payload: (num: number) => number }
  | { type: 'APPLY_FUNCTION'; payload: string };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'ADD_DIGIT':
            if (state.overwrite) return { ...state, currentOperand: action.payload, overwrite: false };
            if (action.payload === '0' && state.currentOperand === '0') return state;
            if (action.payload === '.' && state.currentOperand.includes('.')) return state;
            return { ...state, currentOperand: `${state.currentOperand || ''}${action.payload}` };

        case 'CHOOSE_OPERATION':
            if (state.currentOperand == null && state.previousOperand == null) return state;

            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: action.payload,
                    previousOperand: state.currentOperand,
                    currentOperand: '0',
                    overwrite: true,
                };
            }
            
            // Allow changing operation
            if (state.currentOperand === '0' || state.overwrite) {
                 return {
                    ...state,
                    operation: action.payload,
                 }
            }
            
            try {
                const result = evaluate(`${state.previousOperand} ${state.operation} ${state.currentOperand}`);
                return {
                    ...state,
                    previousOperand: String(result),
                    operation: action.payload,
                    currentOperand: '0',
overwrite: true,
                };
            } catch {
                return { ...initialState };
            }

        case 'EVALUATE':
            if (state.operation == null || state.previousOperand == null || state.currentOperand == null) return state;
            try {
                const expression = `${state.previousOperand} ${state.operation} ${state.currentOperand}`;
                const result = evaluate(expression);
                return { ...initialState, currentOperand: String(result), overwrite: true };
            } catch {
                return { ...initialState };
            }

        case 'CLEAR':
            return { ...initialState };

        case 'DELETE_DIGIT':
            if (state.overwrite) return { ...state, currentOperand: '0', overwrite: false };
            if (state.currentOperand === '0') return state;
            if (state.currentOperand.length === 1) return { ...state, currentOperand: '0' };
            return { ...state, currentOperand: state.currentOperand.slice(0, -1) };

        case 'APPLY_UNARY': {
            const num = parseFloat(state.currentOperand);
            if (isNaN(num)) return state;
            return { ...state, currentOperand: String(action.payload(num)), overwrite: true };
        }
        
        case 'APPLY_FUNCTION': {
            const func = action.payload;
            if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(func)) {
                return {
                    ...state,
                    currentOperand: `${func}(${state.currentOperand})`,
                    overwrite: true,
                }
            }
            if (func === 'PI' || func === 'E') {
                 return {
                    ...state,
                    currentOperand: func,
                    overwrite: true,
                 }
            }
            if(func === 'x^y') {
                return {
                    ...state,
                    operation: '^',
                    previousOperand: state.currentOperand,
                    currentOperand: '0',
                    overwrite: true,
                }
            }
            return state;
        }

        default:
            return state;
    }
}

const CalculatorPage = () => {
    const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, initialState);
    const { memory, addToMemory, subtractFromMemory, setMemory, clearMemory, addToHistory } = useCalculator();

    const handleEvaluate = () => {
        if (!previousOperand || !operation) return;
        const expression = `${previousOperand} ${operation} ${currentOperand}`;
        try {
            const result = evaluate(expression);
            addToHistory({ expression, result: String(result) });
            dispatch({ type: 'EVALUATE' });
        } catch (e) {
            toast({
                variant: 'destructive',
                title: 'Invalid Expression',
                description: 'Please check your calculation.',
            });
        }
    };
    
    const handleOperation = (op: string) => dispatch({ type: 'CHOOSE_OPERATION', payload: op });
    const handleDigit = (digit: string) => dispatch({ type: 'ADD_DIGIT', payload: digit });
    const handleFunction = (func: string) => dispatch({ type: 'APPLY_FUNCTION', payload: func });
    const handleUnary = (unaryFunc: (num: number) => number) => dispatch({ type: 'APPLY_UNARY', payload: unaryFunc });

    return (
        <div className="bg-card rounded-xl shadow-2xl p-4 space-y-4">
            {/* Display */}
            <div className="bg-background/50 rounded-lg text-right p-4 break-words">
                <div className="text-muted-foreground text-2xl h-8">
                    {previousOperand} {operation}
                </div>
                <div className="text-foreground text-5xl font-bold">{currentOperand}</div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-5 gap-2">
                {/* Scientific */}
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => handleFunction('sin')}>sin</Button>
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => handleFunction('cos')}>cos</Button>
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => handleFunction('tan')}>tan</Button>
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => handleFunction('log')}>log</Button>
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => handleFunction('ln')}>ln</Button>
                
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => handleFunction('x^y')}><Superscript/></Button>
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => handleFunction('sqrt')}><SquareRadical/></Button>
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => handleFunction('PI')}>π</Button>
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => handleFunction('E')}>e</Button>
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => handleUnary(n => n/100)}><Percent/></Button>

                {/* Memory */}
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => addToMemory(parseFloat(currentOperand))}>M+</Button>
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => subtractFromMemory(parseFloat(currentOperand))}>M-</Button>
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => setMemory(parseFloat(currentOperand))}>MS</Button>
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={() => { dispatch({ type: 'ADD_DIGIT', payload: String(memory) }); }}>MR</Button>
                <Button variant="secondary" className="aspect-square h-auto text-lg" onClick={clearMemory}>MC</Button>

            </div>
             <div className="grid grid-cols-4 gap-2">
                <Button variant="destructive" className="aspect-square h-auto text-2xl" onClick={() => dispatch({ type: 'CLEAR' })}>C</Button>
                <Button variant="secondary" className="aspect-square h-auto text-2xl" onClick={() => handleUnary(n => -n)}>+/-</Button>
                <Button variant="secondary" className="aspect-square h-auto text-2xl" onClick={() => dispatch({ type: 'DELETE_DIGIT' })}><Delete/></Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground aspect-square h-auto text-2xl" onClick={() => handleOperation('/')}><Divide/></Button>
                
                <Button variant="secondary" className="aspect-square h-auto text-2xl" onClick={() => handleDigit('7')}>7</Button>
                <Button variant="secondary" className="aspect-square h-auto text-2xl" onClick={() => handleDigit('8')}>8</Button>
                <Button variant="secondary" className="aspect-square h-auto text-2xl" onClick={() => handleDigit('9')}>9</Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground aspect-square h-auto text-2xl" onClick={() => handleOperation('*')}><X/></Button>

                <Button variant="secondary" className="aspect-square h-auto text-2xl" onClick={() => handleDigit('4')}>4</Button>
                <Button variant="secondary" className="aspect-square h-auto text-2xl" onClick={() => handleDigit('5')}>5</Button>
                <Button variant="secondary" className="aspect-square h-auto text-2xl" onClick={() => handleDigit('6')}>6</Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground aspect-square h-auto text-2xl" onClick={() => handleOperation('-')}><Minus/></Button>
                
                <Button variant="secondary" className="aspect-square h-auto text-2xl" onClick={() => handleDigit('1')}>1</Button>
                <Button variant="secondary" className="aspect-square h-auto text-2xl" onClick={() => handleDigit('2')}>2</Button>
                <Button variant="secondary" className="aspect-square h-auto text-2xl" onClick={() => handleDigit('3')}>3</Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground aspect-square h-auto text-2xl" onClick={() => handleOperation('+')}><Plus/></Button>
                
                <Button variant="secondary" className="col-span-2 aspect-auto h-auto text-2xl" onClick={() => handleDigit('0')}>0</Button>
                <Button variant="secondary" className="aspect-square h-auto text-2xl" onClick={() => handleDigit('.')}>.</Button>
                <Button variant="primary" className="aspect-square h-auto text-2xl" onClick={handleEvaluate}><Equal/></Button>
            </div>
        </div>
    );
};

export default CalculatorPage;

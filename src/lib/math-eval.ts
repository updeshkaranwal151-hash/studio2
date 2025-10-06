const ALLOWED_CHARS = '0123456789.+-*/()^% Ee';
const MATH_CONSTANTS = {
  'PI': 'Math.PI',
  'E': 'Math.E',
};

const MATH_FUNCTIONS = {
  'sin': 'Math.sin',
  'cos': 'Math.cos',
  'tan': 'Math.tan',
  'asin': 'Math.asin',
  'acos': 'Math.acos',
  'atan': 'Math.atan',
  'log': 'Math.log10',
  'ln': 'Math.log',
  'sqrt': 'Math.sqrt',
  'abs': 'Math.abs',
};

function sanitizeExpression(expr: string): string {
  let sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/');

  // Replace constants
  sanitized = sanitized.replace(/\bPI\b/g, MATH_CONSTANTS['PI']);
  sanitized = sanitized.replace(/\bE\b/g, MATH_CONSTANTS['E']);

  // Replace functions
  Object.keys(MATH_FUNCTIONS).forEach(func => {
    const regex = new RegExp(`\\b${func}\\(`, 'g');
    sanitized = sanitized.replace(regex, `${MATH_FUNCTIONS[func as keyof typeof MATH_FUNCTIONS]}(`);
  });

  // Replace exponentiation
  sanitized = sanitized.replace(/\^/g, '**');

  // Validate characters
  for (const char of sanitized) {
    if (!ALLOWED_CHARS.includes(char) && !/[a-zA-Z]/.test(char)) {
      throw new Error(`Invalid character in expression: ${char}`);
    }
  }

  return sanitized;
}

export function evaluate(expression: string): number {
  if (!expression) return 0;

  try {
    const sanitized = sanitizeExpression(expression);
    // Using Function constructor for safer evaluation than eval()
    const result = new Function(`return ${sanitized}`)();
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid calculation');
    }
    return result;
  } catch (error) {
    console.error('Evaluation error:', error);
    throw new Error('Invalid expression');
  }
}

export function evaluateGraphingEquation(expression: string): (x: number) => number {
    try {
        const sanitized = sanitizeExpression(expression);
        return new Function('x', `return ${sanitized}`) as (x: number) => number;
    } catch (error) {
        console.error('Graphing evaluation error:', error);
        throw new Error('Invalid equation');
    }
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatResponse(response: string): string {
  // Split the response at the first code block
  const parts = response.split(/```python/);
  // Take only the explanation part (before any code blocks)
  const explanation = parts[0].trim();
  
  // Remove numbered headers and their content
  const cleanedExplanation = explanation.replace(/^\d+\.\s+\*\*.*?\*\*:/gm, '');
  
  // Remove any remaining bold markers
  const finalExplanation = cleanedExplanation.replace(/\*\*/g, '');
  
  return finalExplanation.trim();
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Local shadcn-compatible helper: conditional classes, then Tailwind conflicts.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

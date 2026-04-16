import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { siteConfig } from '@/template/config'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number | string) {
  if (typeof amount === 'string') {
    const clean = amount.replace(/[^\d.]/g, '');
    const num = +clean;
    if (num !== num) return amount;
    return `${siteConfig.ui.currencySymbol}${num.toLocaleString()}`;
  }
  
  if (amount === null || amount === undefined) return '';
  
  return `${siteConfig.ui.currencySymbol}${amount.toLocaleString()}`;
}




import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyINR',
  standalone: true
})
export class CurrencyINRPipe implements PipeTransform {
  transform(value: number | null | undefined, showSymbol: boolean = true): string {
    if (value === null || value === undefined) {
      return '₹0.00';
    }

    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

    return formatted;
  }
}
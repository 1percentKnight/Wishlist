import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrency',
  standalone: true
})
export class IndianCurrencyPipe implements PipeTransform {
  transform(value: number | string): string {
    if (!value) return '';
    let num = value.toString();
    let lastThree = num.substring(num.length - 3);
    let otherNumbers = num.substring(0, num.length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  }
}

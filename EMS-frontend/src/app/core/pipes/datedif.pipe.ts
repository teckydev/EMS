import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datedif'
})
export class DatedifPipe implements PipeTransform {

   transform(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
  }

}

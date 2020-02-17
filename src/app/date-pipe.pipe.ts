import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe'
})
export class DatePipePipe implements PipeTransform {

  transform(ep:number): String {
    return new Date(ep*1000).toString();
  }

}

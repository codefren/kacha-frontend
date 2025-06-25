import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'
@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: Array<any>, args?: any): any {
    console.log(_.sortBy(array, [args]), '_.sortBy(array, [args])');
      return _.sortBy(array, [args]);
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'distance' })
export class DistancePipe implements PipeTransform {
    transform(value: number): string {
        return Math.floor(100 * (value / 1000)) / 100 + ' km';
    }
}

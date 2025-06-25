import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
    transform(seconds: number): string {
        seconds = seconds === null || seconds === undefined ? 0 : seconds
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.round((seconds % 3600) / 60);

        const hoursString = hours > 0 ? hours + 'h ' : '';
        return hoursString + minutes + 'm';
    }
}

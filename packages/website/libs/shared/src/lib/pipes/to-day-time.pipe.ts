import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dayTime',
})
export class ToDayTimePipe implements PipeTransform {
    public transform(value: number, shortTime: boolean, showSeconds: boolean): string {
        // TODO add for more days than 1
        let hours: number = Math.floor(value / 3600);
        let anotherDay = false;
        const minutes: number = Math.floor((value - hours * 3600) / 60);
        const seconds: number = value - hours * 3600 - minutes * 60;

        if (hours >= 24) {
            hours = hours - 24;
            anotherDay = true;
        }

        let ret: string = shortTime
            ? (hours % 12).toString().padStart(2, '0')
            : hours.toString().padStart(2, '0');

        ret += ':' + minutes.toString().padStart(2, '0');
        ret += showSeconds ? ':' + seconds.toString().padStart(2, '0') : '';
        // if (anotherDay) ret += '+1';
        if (shortTime) ret += hours < 12 ? ' AM' : ' PM';
        return ret;
    }
}

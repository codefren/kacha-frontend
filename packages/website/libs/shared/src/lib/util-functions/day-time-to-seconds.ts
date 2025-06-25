import { IsNotEmpty } from 'class-validator';
import { Time } from '@angular/common';
import { Timestamp } from 'rxjs';

export function dayTimeAsStringToSeconds(dayTime: string): number {
    if (dayTime) {
        let parts = dayTime.split(':');
        if (parts.length !== 2) return -1;
        if (
            parts[0].length === 2 &&
            parts[1].length === 2 &&
            !isNaN(+parts[0]) &&
            !isNaN(+parts[1]) &&
            (+parts[0] >= 0 && +parts[0] <= 23) &&
            (+parts[1] >= 0 && +parts[1] <= 59)
        ) {
            return +parts[0] * 3600 + +parts[1] * 60;
        }
    }
    return -1;
}

export function dayTimeAsTimeToSeconds(dayTime: Time): number {
    return dayTime ? (dayTime.hours * 60 + dayTime.minutes) * 60 : -1;
}

export function secondsToDayTimeAsString(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const response =
        String(hours < 10 ? '0' + hours : hours) +
        ':' +
        String(minutes < 10 ? '0' + minutes : minutes);
    return response;
}

export function secondsToTimeAsTime(seconds: number): Time {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const response = {
        hours: hours,
        minutes: minutes,
    };
    return response;
}
export function secondsToAbsoluteTime(seconds: number, showSeconds?: boolean): string {
    if (seconds === 0) { return '0h'; }
    if (showSeconds == null) { showSeconds = false; }
    if (seconds == null) { return null; }
    // tslint:disable-next-line:no-bitwise
    const days = Math.floor(seconds / 86400) | 0;
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const daysStr = days > 0 ? (days > 1 ? days + ' d' : days + ' día') : null;
    const hoursStr = hours > 0 ? (hours > 1 ? hours + 'h' : hours + 'h') : null;
    const minutesStr =
        minutes > 0 ? (minutes > 1 ? minutes + 'm' : minutes + 'm') : null;
    seconds = seconds % 60;
    return (
        (daysStr
            ? hoursStr || minutesStr || (seconds !== 0 && showSeconds)
                ? daysStr + ', '
                : daysStr
            : '') +
        (hoursStr
            ? minutesStr || (seconds !== 0 && showSeconds)
                ? hoursStr + ', '
                : hoursStr
            : '') +
        (minutesStr
            ? seconds !== 0 && showSeconds
                ? minutesStr + ', '
                : minutesStr
            : '') +
        (showSeconds ? (seconds === 1 ? seconds + 's' : seconds + 's') : '')
    );
}


export function secondsToAbsoluteTime(seconds: number, showSeconds?: boolean): string {
    if (seconds === 0) return '0 segundos';
    if (showSeconds == null) showSeconds = false;
    if (seconds == null) return null;
    const days = Math.floor(seconds / 86400) | 0;
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const daysStr = days > 0 ? (days > 1 ? days + ' días' : days + ' día') : null;
    const hoursStr = hours > 0 ? (hours > 1 ? hours + ' horas' : hours + ' hora') : null;
    const minutesStr =
        minutes > 0 ? (minutes > 1 ? minutes + ' minutos' : minutes + ' minuto') : null;
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
        (showSeconds ? (seconds === 1 ? seconds + ' segundo' : seconds + ' segundos') : '')
    );
}

export function secondsToAbsoluteTimeAlterne(seconds: number, showSeconds?: boolean): string {
    if (seconds === 0) return '0min';
    if (showSeconds == null) showSeconds = false;
    if (seconds == null) return '-';
    const days = Math.floor(seconds / 86400) | 0;
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const daysStr = days > 0 ? (days > 1 ? days + 'd' : days + 'd') : null;
    const hoursStr = hours > 0 ? (hours > 1 ? hours + 'h' : hours + 'h') : null;
    const minutesStr =
        minutes > 0 ? (minutes > 1 ? minutes + 'm' : minutes + 'm') : null;
    seconds = seconds % 60;

    return (
        (daysStr
            ? hoursStr || minutesStr || (seconds !== 0 && showSeconds)
                ? daysStr + ' '
                : daysStr
            : '') +
        (hoursStr
            ? minutesStr || (seconds !== 0 && showSeconds)
                ? hoursStr + ' '
                : hoursStr
            : '') +
        (minutesStr
            ? seconds !== 0 && showSeconds
                ? minutesStr + ' '
                : minutesStr
            : '') +
        (showSeconds ? (seconds === 1 ? seconds + 's' : seconds + 's') : '')

    );
}
export function secondsToAbsoluteTimeAlterne2Element(seconds: number, showSeconds?: boolean): string {
    if (seconds === 0) return '0min';
    if (showSeconds == null) showSeconds = false;
    if (seconds == null) return '-';
    const days = Math.floor(seconds / 86400) | 0;
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const daysStr = days > 0 ? (days > 1 ? days + 'd' : days + 'd') : null;
    const hoursStr = hours > 0 ? (hours > 1 ? hours + 'h' : hours + 'h') : null;
    const minutesStr =
        minutes > 0 ? (minutes > 1 ? minutes + 'm' : minutes + 'm') : null;
    seconds = seconds % 60;

    if (daysStr && daysStr.length > 0) {

         return (daysStr ? hoursStr || (seconds !== 0 && showSeconds) ? daysStr + ' ': daysStr: '') +

         (hoursStr? minutesStr || (seconds !== 0 && showSeconds)? hoursStr + ' ': hoursStr: '');

    } else if (hoursStr && hoursStr.length > 0){

         return(

            (hoursStr? minutesStr || (seconds !== 0 && showSeconds)? hoursStr + ' ': hoursStr: '') +

            (minutesStr ? seconds !== 0 && showSeconds? minutesStr + ' ': minutesStr: '')

         );
         
    }
   return (
        (daysStr ? hoursStr || (seconds !== 0 && showSeconds) ? daysStr + ' ': daysStr: '') +
        (hoursStr? minutesStr || (seconds !== 0 && showSeconds)? hoursStr + ' ': hoursStr: '') +
        (minutesStr ? seconds !== 0 && showSeconds? minutesStr + ' ': minutesStr: '')

    );
}

export function secondsToAbsoluteTimeAlterneWithoutDay(seconds: number, showSeconds?: boolean): string {
    if (seconds === 0) return '0min';
    if (showSeconds == null) showSeconds = false;
    if (seconds == null) return '-';
    /* const days = Math.floor(seconds / 86400) | 0; */
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const hoursStr = hours > 0 ? (hours > 1 ? hours + 'h' : hours + 'h') : null;
    const minutesStr =
        minutes > 0 ? (minutes > 1 ? minutes + 'm' : minutes + 'm') : null;
    seconds = seconds % 60;
    return (
       /*  (daysStr
            ? hoursStr || minutesStr || (seconds !== 0 && showSeconds)
                ? daysStr + ' '
                : daysStr
            : '') + */
        (hoursStr
            ? minutesStr || (seconds !== 0 && showSeconds)
                ? hoursStr + ' '
                : hoursStr
            : '') +
        (minutesStr
            ? seconds !== 0 && showSeconds
                ? minutesStr + ' '
                : minutesStr
            : '') +
        (showSeconds ? (seconds === 1 ? seconds + 's' : seconds + 's') : '')
    );
}

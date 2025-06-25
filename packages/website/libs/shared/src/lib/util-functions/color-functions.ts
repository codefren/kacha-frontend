declare var require: any;
var Color = require('color');
import { Generator as ContrastGenerator } from 'contrast-color-generator';

export function highlightColor(color: string, brightness?: number): string {
    return new Color(color).lighten(brightness ? brightness : 0.5).string();
}

export function lowlightColor(color: string, darkness?: number): string {
    return new Color(color).darken(darkness ? darkness : 0.5).string();
}

export function contrastColor(color: string, hue?: number): string {
    return new ContrastGenerator(hue ? hue : 0).generate(color).hexStr;
}

export function isColorLight(color: string): boolean {
    return new Color(color).isLight();
}

export function isColorDark(color: string): boolean {
    return new Color(color).isDark();
}

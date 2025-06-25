import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material';
import { isColorLight, highlightColor } from '../../util-functions/color-functions';

/**
 * s: Small size /
 * m: Medium size
 */
type InfoChipSize = 'm' | 's';

/**
 * The InfoChip Component is an adhoc variant of Material Chip, made in order
 * to show information about a topic, mainly the one represented by its icon
 * @example
 *  <app-info-chip
 *      size="s" icon="inbox" text="100" color="primary" shadow="true">
 *  </app-info-chip>
 */
@Component({
    selector: 'app-info-chip',
    templateUrl: './info-chip.component.html',
    styleUrls: ['./info-chip.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InfoChipComponent implements OnInit {
    /**
     * Name of the Material icon which goes inside the infochip
     */
    @Input() icon: string;

    /**
     * Name of the adhoc custom icon registered to material registry
     */
    @Input() svgIcon: string;

    /**
     * String that goes as the infochip text
     */
    @Input() text: string;

    /**
     * String that goes as the html title
     */
    @Input() help: string;

    /**
     * Size of the infochip component, scales all of its elements accordingly
     */
    @Input() size: InfoChipSize;

    /**
     * Application defined color palette to be applied or a string representing a css valid color
     */
    @Input() color: ThemePalette | string;

    /**
     * Applies predefined shadow at the bottom of the chip
     */
    @Input() shadow: boolean;

    /**
     * Applies predefined border around the chip
     */
    @Input() bordered: boolean;

    @Input() editable: boolean;

    @Input() isHovered: boolean;

    @Input() isColorDot: boolean = true;

    @Input() padding: boolean = false;

    @Input() colorFont: string;

    @Input() borderNoRight: boolean = false;

    @Input() minWidth: number;

    @Input() showProgess: boolean = false;

    @Input() progressValue: number = 0;

    isLight(color: string) {
        return color &&
            color != 'primary' &&
            color != 'primary-200' &&
            color != 'warn' &&
            color != 'accent' &&
            color != 'dark' &&
            color != 'primary-900' &&
            color != 'primary-300'
            ? isColorLight(color)
            : true;
    }

    getContrastColor(color: string) {
        if (
            !color ||
            color == 'primary' ||
            color == 'primary-200' ||
            color == 'warn' ||
            color == 'accent' ||
            color == 'dark' ||
            color == 'primary-900' ||
            color == 'primary-300'
        )
            return 'auto';
        return isColorLight(color) ? 'black' : 'white';
    }

    highlighted(color: string) {
        if (
            !color ||
            color == 'primary' ||
            color == 'primary-200' ||
            color == 'warn' ||
            color == 'accent' ||
            color == 'dark' ||
            color == 'primary-900' ||
            color == 'primary-300'
        )
            return color;
        return highlightColor(color);
    }

    /*
    isDark(color: string) {
        return Color(color).isDark();
    }*/

    /**
     * @ignore
     */
    constructor() { }

    /**
     * @ignore
     */
    ngOnInit() {
        this.isHovered = false;
    }
}

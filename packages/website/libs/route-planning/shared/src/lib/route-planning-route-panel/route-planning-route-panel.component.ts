import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Input,
    ViewEncapsulation,
    ChangeDetectionStrategy,
} from '@angular/core';
import { ThemePalette } from '@angular/material';

@Component({
    selector: 'easyroute-route-planning-route-panel',
    templateUrl: './route-planning-route-panel.component.html',
    styleUrls: ['./route-planning-route-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoutePlanningRoutePanelComponent implements OnInit {
    /**
     *  Input value to set the panel's header background color.
     *
     *  If no value is provided, panel header color will be set to the theme's background color.
     */
    @Input()
    color: ThemePalette;

    @Input()
    routeColor: string;

    /**
     *  Input value for the panel title.
     */
    @Input()
    title: string;

    @Output()
    titleChangedEvent: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    colorChangedEvent: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Input value to have an expandable or not expandable panel.
     *
     * + If the value is true, the panel's header content will be placed in the following order:
     *
     *  1 **Icon**: this icon wil expand and collapse the panel.
     *
     *  2 **Title**: input value.
     *
     *  3 **Left header**.
     *
     *  4 **Right header**.
     *
     * + If the value is false, the panel's header content will be placed in the following order:
     *
     *   1 **Left header**.
     *
     *   2 **Title**: input value.
     *
     *   3 **Right header**.
     */
    @Input()
    isExpandable: boolean = true;

    @Input()
    disabled: boolean = false;

    @Input()
    showRouteColor: boolean = false;

    /**
     *  Input value to set the initial panel status.
     *
     *  True to have the panel initially expanded. False otherwise.
     */
    @Input()
    isExpanded: boolean = false;

    /**
     * Output event to emit a new expansion state.
     */
    @Output()
    expandEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    isBigger: boolean = false;

    newRouteColor: string;

    isExpandedLocal: boolean = false;
    

    toggleExpansion() {
        this.isExpandedLocal = !this.isExpandedLocal;
        this.expandEvent.emit(this.isExpandedLocal);
    }

    /**
     * @ignore
     */
    constructor() {}

    ngOnInit() {
        this.isExpandedLocal = this.isExpanded;
        this.newRouteColor = this.routeColor;
    }

    /**
     * Sets the proper icon based on the panel status when isExpandable is set to true.
     * @param {boolean} expanded
     * @returns keyboard arrow down icon if the panel is expanded.
     * Otherwise, returns keyboard arrow right icon.
     */
    headerExpandIcon(expanded: boolean) {
        if (expanded !== this.isExpanded) this.isExpanded = expanded;
        return expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right';
    }
}

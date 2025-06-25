import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material';

/**
 *  > Panel component has 2 sections:
 *
 *  > * Header. The header has a title and optionally a left header
 *  and/or a right header.
 *
 *  > * Content.
 *  This part will contain the rest of the content that does not contain
 *  the attributes explained below.
 *
 * > You can specify, inside the host component, which content is displayed in each part of the header with the
 *  following selector attributes:
 *    - **app-panel-header-left :** this content will be displayed inside the left header.
 *    - **app-panel-header-right :** this content will be displayed inside the right header.
 *    - If no attribute is provided, the content will be displayed inside the panel's content.
 */
@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PanelComponent implements OnInit {
    /**
     *  Input value to set the panel's header background color.
     *
     *  If no value is provided, panel header color will be set to the theme's background color.
     */
    @Input()
    color: ThemePalette;

    /**
     *  Input value for the panel title.
     */
    @Input()
    title: string;

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

    /**
     *  Input value to set the initial panel status.
     *
     *  True to have the panel initially expanded. False otherwise.
     */
    @Input()
    isExpanded: boolean = false;

    isExpandedLocal: boolean = false;
    /**
     * Output event to emit a new expansion state.
     */
    @Output()
    expandEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    toggleExpansion() {
        this.isExpandedLocal = !this.isExpandedLocal;
        this.expandEvent.emit(this.isExpandedLocal);
    }

    /**
     * @ignore
     */
    constructor() {}
    ngOnInit(){
        this.isExpandedLocal = this.isExpanded;
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

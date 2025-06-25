import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Repesents a single menu tab element. The interface has 3 fields:
 * > * name: Represents the name shown in the menu.
 * > * iconName: Represents the material-icon displayed next to the tab name.
 * > * route: Represents the router link correspondint to the menu tab.
 */
export interface AppMenuTab {
    name: string;
    iconName?: string;
    route: string;
    show: boolean;
}

/**
 * > Menu component can be used in different ways:
 * > * As the main menu:
 * > In this case, the input called menuLogoUrl will be defined and the corresponding image
 * will be added to the left of the menu, all the other items of the menu will be aligned to
 * the right.
 * > * As a generic menu:
 * > In this case, the input called manuLogoUrl will not be defined, as a result the menu
 * will not have an image or logo and the items will all be distributed along the available
 * space.
 *
 * > In both cases the elements shown in the menu will be the ones recieved in the input
 * called menuItems.
 */
@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MenuComponent {
    /**
     *  Input parameter for the menulogo/image, if any.
     */
    @Input() menuLogoUrl: string;

    /**
     *  Input parameter for the menu items as an array of AppMenuTabs.
     */
    @Input() menuItems: AppMenuTab[];

    /**
     *  Input parameter that defines whether or not the tab name will appear in the url.
     *  By default the value is false.
     */
    @Input() skipLocationChange = false;

    constructor(private readonly router: Router) {}

    public getMenuItems() {

        return this.menuItems.filter(item => item.show);
    }
}

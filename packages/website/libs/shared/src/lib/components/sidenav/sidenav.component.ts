import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RoutePlanningFacade } from '@optimroute/state-route-planning';

/**
 * > The sidenav component has 2 sections:
 *
 * > + Sidenav drawer.
 *  This section is not visible when the sidenav is closed.
 *  If any part of the component's content has de **app-sidenav-drawer-content** attribute
 *  then it will be displayed inside the sidenav drawer.
 *
 * > + Sidenav content.
 *  This section is always visible regardless of the sidenav status.
 *  If any part of the component's content has de **app-sidenav-main-content** attribute
 * then it will be displayed inside the sidenav drawer.
 *
 * > You can specify, inside the host component, which content is displayed
 * in each part of the header with the following selector attributes:
 *   - **app-sidenav-drawer-content**: this content will be displayed
 *    inside the side nav drawer.
 *   - **app-sidenav-main-content**: this content will be displayed
 *    inside the side nav content.
 *   - If no attribute is provided, the content will be ignored.
 */
@Component({
    selector: 'easyroute-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SidenavComponent {
    /**
     * Input value that specifies whether the sidenav is minimizable
     * or fixed.
     * If the variable is set to true, the sidenav will have a button used
     * to expand or collapse the sidenav drawer.
     */
    @Input()
    foldable: boolean;

    @Input() hasElevation = false;

    /**
     * Sidenav status. Used to check whether the sidenav is opened or not.
     */
    @Input()
    opened = true;

    closeComplete = false;

    /**
     * @ignore
     */
    constructor(private facade: RoutePlanningFacade) {}

    /**
     * Changes the open state of the sidenav.
     */
    changeState(): void {

        if(this.closeComplete){
            this.opened = true;
            this.closeComplete = false;
            this.facade.closeComplete(this.closeComplete);
        } else {
            this.opened = !this.opened;
            this.closeComplete = false;
            this.facade.closeComplete(this.closeComplete);
        }
    }

    changeStateComplete() : void {
        
        if(this.opened && !this.closeComplete){
            this.closeComplete = true;
            this.opened = true;
            this.facade.closeComplete(this.closeComplete);
        } else {
            this.closeComplete = !this.closeComplete;
            this.opened = true;
            this.facade.closeComplete(this.closeComplete);
        }
       
    }

    /**
     * Sets the proper icon based on the sidenav status.
     * @returns `keyboard_arrow_right` if the sidenav is closed.
     * Otherwise, returns `keyboard_arrow_left`.
     */
    sidenavExpansionIcon(): string {
        return this.opened ? 'keyboard_arrow_left' : 'keyboard_arrow_right';
    }

    sidenavExpansionIconComplete(): string {
        return this.closeComplete ? 'keyboard_arrow_left' : 'keyboard_arrow_right';
    }
}

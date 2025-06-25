import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material';

/**
 * The Toolbar Component is our adhoc container for toolbars,
 * each toolbar content has to be injected between its tags
 * @example Example usage of the Toolbar Component containing a tiny menu and login bar
 *
 *         <app-toolbar color="primary" >
 *             <div class="toolbar-inner-container" fxLayout="row" fxLayoutAlign="space-between">
 *                 <ul class="top-menu">
 *                     <li>Home</li>
 *                     <li>Settings</li>
 *                 </ul>
 *                 <div class="login-container" />
 *             </div>
 *         </app-toolbar>
 */
@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
    /**
     * Application defined color palette to be applied.
     * Sets background and foreground colors accordingly
     */
    @Input() color: ThemePalette;

    @Input() hasElevation = false;
}

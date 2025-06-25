import { Component, OnInit } from '@angular/core';
import { AppMenuTab } from '@optimroute/shared';
import { Observable } from 'rxjs';
// import { ProfileFacade } from './+state/profile.facade';

@Component({
    selector: 'easyroute-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

    menuItems: AppMenuTab[] = [
        {
            name: 'PROFILE.NAME',
            route: 'settings',
            show: true,
        },
        {
            name: 'INVOICING.SUSCRIPTION',
            route: 'invoicing',
            show: true,
        }
    ];

    constructor(/*private facade: ProfileFacade*/) { }

    ngOnInit() {
        //this.facade.loadAll();
    }
}

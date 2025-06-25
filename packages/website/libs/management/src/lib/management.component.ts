import { Component, OnInit } from '@angular/core';
import { AppMenuTab } from '@optimroute/shared';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
@Component({
    selector: 'easyroute-management',
    templateUrl: './management.component.html',
    styleUrls: ['./management.component.scss'],
})
export class ManagementComponent implements OnInit {
    menuItems: AppMenuTab[] = [
        {
            name: 'DELIVERY_ZONES.NAME',
            route: 'delivery-zones',
            show: true
        },
        {
            name: 'VEHICLES.NAME',
            route: 'vehicles',
            show: true,
        },
        {
            name: 'DELIVERY_POINTS.NAME',
            route: 'clients',
            show: true
        },
        {
            name: 'USERS.NAME',
            route: 'users',
            show: this.canUser(),
        }
        
    ];

    constructor(private authLocal: AuthLocalService) {}

    ngOnInit() {}

    canUser() {
        return this.authLocal.getRoles()
            ? this.authLocal
                  .getRoles()
                  .find((role) => role === 3 || role === 2 || role === 1) !== undefined
            : false;
    }
    canCompanies() {
        return this.authLocal.getRoles()
            ? this.authLocal
                  .getRoles()
                  .find((role) => role === 3 ) !== undefined
            : false;
    }
}

import { Component, OnInit } from '@angular/core';
import { AppMenuTab } from '@optimroute/shared';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';

@Component({
    selector: 'easyroute-users-management',
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.scss'],
})
export class UsersManagementComponent implements OnInit {
    menuItems: AppMenuTab[] = [
        {
            name: 'COMPANIES.NAME',
            route: 'companies',
            show: true,
        },
        {
            name: 'USERS.NAME',
            route: 'users',
            show: this.isSalesman() ? false : true,
        },
        {
            name: 'COMPANIES.ME',
            route: 'companiesMe',
            show: this.isSalesman() ? true : false,
        }
    ];
    constructor(public authLocal: AuthLocalService) {}

    ngOnInit() {}

    isSalesman() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 3 || role === 8) !== undefined
            : false;
    }
}

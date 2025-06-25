import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthLocalService } from '../auth-local.service';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { Profile } from '@optimroute/backend';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
// Servicsa

// Config

@Injectable()
export class DemoGuard implements CanActivate {
    log: boolean = false;
    profile: Profile;
    // url: string = URL_SERVICIOS;

    timeRefresh: number = 1000;

    constructor(
        public facadeProfile: ProfileSettingsFacade,
        private Router: Router,
        public authLocal: AuthLocalService,
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Promise<boolean> | boolean {
        return new Promise((resolve, reject) => {
            this.facadeProfile.loaded$.subscribe((loaded) => {
                if (loaded) {
                    this.facadeProfile.profile$.subscribe((data) => {
                        this.profile = data;
                        if (this.inDemo() || this.inTrial() || this.isActive() || this.isFranquicia()) {
                            resolve(true);
                        } else {
                            this.Router.navigateByUrl('profile/invoicing');
                            resolve(false);
                        }
                    });
                }
            });
        });
    }

    isFranquicia() {
        console.log(this.profile);
        if (this.profile &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.companyParentId != null) {
            return true;
        }
    }

    inDemo() {
        if (
            this.profile &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.subscriptions &&
            this.profile.company.subscriptions.length === 0
        ) {
            let value =
                moment(this.profile.company.endDemoDate).diff(moment()) > 0 ||
                this.isAdmin();
            return value;
        } else {
            false;
        }
    }
    inTrial() {
        if (
            this.profile &&
            this.profile.company &&
            this.profile.company.subscriptions &&
            this.profile.company.subscriptions.length > 0
        ) {
            let value =
                this.profile.company.subscriptions[0].stripe_status === 'trialing' ||
                this.isAdmin();
            return value;
        } else {
            false;
        }
    }

    isActive() {
        if (
            this.profile &&
            this.profile.company &&
            this.profile.company.subscriptions &&
            this.profile.company.subscriptions.length > 0
        ) {
            let value =
                this.profile.company.subscriptions[0].stripe_status === 'active' ||
                this.isAdmin();
            return value;
        } else {
            false;
        }
    }

    isAdmin() {
        return this.authLocal.getRoles()
            ? this.authLocal
                .getRoles()
                .find((role) => role === 1 || role === 3 || role === 8) !== undefined
            : false;
    }
}

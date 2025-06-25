import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthLocalService } from '../auth-local.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { Profile } from '@optimroute/backend';
// Servicsa

// Config

@Injectable()
export class InvoiceGuard implements CanActivate {
    log: boolean = false;
    profile: Profile;
    // url: string = URL_SERVICIOS;

    timeRefresh: number = 1000;

    constructor(public facadeProfile: ProfileSettingsFacade,
        private Router: Router,
        public authLocal: AuthLocalService,) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Promise<boolean> | boolean {
        return new Promise((resolve, reject) => {
            this.facadeProfile.loaded$.subscribe((loaded) => {
                if (loaded) {
                    this.facadeProfile.profile$.subscribe((data) => {
                        this.profile = data;
                        if (!this.isFranquicia()) {
                            resolve(true);
                        } else {
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
        } else {
            return false;
        }
    }
}

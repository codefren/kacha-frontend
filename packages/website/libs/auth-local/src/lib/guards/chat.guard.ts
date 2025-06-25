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
export class ChatGuard implements CanActivate {
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
                        if (this.haveChat()) {
                            resolve(true);
                        } else {
                            this.Router.navigateByUrl('home');
                            resolve(false);
                        }
                    });
                }
            });
        });
    }


    haveChat() {
        return this.authLocal.getRoles()
            ? this.authLocal
                .getRoles()
                .find((role) => role === 1 || role === 2 || role === 14 || role === 16 || role === 18) !== undefined
            : false;
    }
}

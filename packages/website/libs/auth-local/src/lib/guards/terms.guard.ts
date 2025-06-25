import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthLocalService } from '../auth-local.service';
import { BackendService } from '@optimroute/backend'
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
// Servicsa


// Config


@Injectable()
export class TermsGuard implements CanActivate {

  log: boolean = false;

  // url: string = URL_SERVICIOS;

   timeRefresh: number = 1000;

  constructor(
    public facadeProfile: ProfileSettingsFacade,
    private Router: Router
  ) {}

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> | boolean {
        return new Promise((resolve, reject) => { 
            this.facadeProfile.loaded$.subscribe((loaded) => {
                if (loaded) {
                    this.facadeProfile.profile$.subscribe((data) => {
                        if (data.company.termsAccepted) {
                            resolve(data.company.termsAccepted);    
                        } else {
                            resolve(data.company.termsAccepted);
                            this.Router.navigateByUrl('login/terms');
                        }
                        
                    });
                }
            });
        });

    }

  expirado( fechaExp: number ) {

    let ahora = new Date().getTime() / 1000;

    if ( fechaExp < ahora ) {

      return true;

    } else {

      return false;

    }

  }

}

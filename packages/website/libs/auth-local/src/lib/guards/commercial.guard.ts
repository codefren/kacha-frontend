
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthLocalService } from '../auth-local.service';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
// Servicsa

// Config

@Injectable()
export class CommercialGuard implements CanActivate {
    log: boolean = false;
    unsubscribe$ = new Subject<void>();
    // url: string = URL_SERVICIOS;

    timeRefresh: number = 1000;

    constructor(public facade: ProfileSettingsFacade, 
        private Router: Router) {}

    async canActivate() {
        let value;
        await this.facade.loaded$.pipe(takeUntil(this.unsubscribe$)).subscribe((loaded)=>{
            if(loaded){
                this.facade.profile$.pipe(take(1)).subscribe((data)=>{
                    value = data.company.companyProfileTypeId;
                });
            }
        })
        return value == 1 || value === 2 || value >= 3 || value === undefined ? true : false;
    }
}

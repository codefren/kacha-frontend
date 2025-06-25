import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthLocalService } from '../auth-local.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// Servicsa

// Config

@Injectable()
export class AdminGuard implements CanActivate {
    log: boolean = false;

    // url: string = URL_SERVICIOS;

    timeRefresh: number = 1000;

    constructor(public _authLocalService: AuthLocalService, private Router: Router) {}

    canActivate(): Promise<boolean> | boolean {
        let value = this._authLocalService.getRoles
            ? this._authLocalService.getRoles().find((role) => role === 1 || role === 2 || role === 3 || role === 7 || role === 8 || role === 9 || role === 10 || role === 14 || role === 16 || role === 17 || role === 18) !==
              undefined
            : false;
        if (!value) {

            this.Router.navigateByUrl('/login');
            return false;
            
        }

        return value;
    }
}

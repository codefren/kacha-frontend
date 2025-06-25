import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthLocalService } from '../auth-local.service';

@Injectable({
  providedIn: 'root'
})
export class PartnersAdminGuard implements CanActivate {
  log: boolean = false;

  // url: string = URL_SERVICIOS;

  timeRefresh: number = 1000;

  constructor(public _authLocalService: AuthLocalService, private Router: Router) {}

  canActivate(): Promise<boolean> | boolean {
      let value = this._authLocalService.getRoles
          ? this._authLocalService.getRoles().find((role) =>  role === 17) !==
            undefined
          : false;
      if (!value) {

          this.Router.navigateByUrl('/login');
          return false;
          
      }

      return value;
  }
  
}

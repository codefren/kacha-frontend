import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthLocalService } from '../auth-local.service';
import { BackendService } from '@optimroute/backend'
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
// Servicsa


// Config


@Injectable()
export class VerificaTokenGuard implements CanActivate {

  log: boolean = false;

  // url: string = URL_SERVICIOS;

   timeRefresh: number = 1000;

  constructor(
    public _authLocalService: AuthLocalService,
    public _backend: BackendService,
    private Router: Router
  ) {

    this.log = this._authLocalService.isLogged()

  }

  canActivate(): Promise<boolean> | boolean {

    if ( this._authLocalService.isLogged() ) {
      return true;

    } else {
      this._authLocalService.logout();
      this.Router.navigateByUrl('/login');
      return false;

    }

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

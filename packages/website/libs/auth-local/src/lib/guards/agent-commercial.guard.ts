import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileSettingsFacade } from '../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { AuthLocalService } from '../auth-local.service';
import { Profile } from '../../../../backend/src/lib/types/profile.type';

@Injectable({
  providedIn: 'root'
})
export class AgentCommercialGuard implements CanActivate {

  log: boolean = false;
  profile: Profile;
  // url: string = URL_SERVICIOS;

  timeRefresh: number = 1000;
  constructor(
    public facadeProfile: ProfileSettingsFacade,
    private Router: Router,
    public authLocal: AuthLocalService,
) { }

canActivate(): Promise<boolean> | boolean {
  let value = this.authLocal.getRoles
      ? this.authLocal.getRoles().find((role) => role === 1 || role === 2 || role === 3 || role === 8 || role === 9  || role === 14 || role === 16 || role === 17) !==
        undefined
      : false;

  if (!value && this.validateAgentCommercial()) {
      
      this.Router.navigateByUrl('dashboard/TotalSale');
      
      return false;
      
  }
  
  return value
}

  /* canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  } */

  validateAgentCommercial() {
    return this.authLocal.getRoles()
    ? this.authLocal.getRoles().find((role) => role === 10 ) !== undefined
    : false;
}
  
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';


import { Observable } from 'rxjs';
import { AuthLocalService } from '../auth-local.service';
import { Profile } from '../../../../backend/src/lib/types/profile.type';
import { ProfileSettingsFacade } from '../../../../state-profile-settings/src/lib/+state/profile-settings.facade';

/* import { Profile } from '../../../../backend/src/lib/types/profile.type'; */

@Injectable({
  providedIn: 'root'
})
export class PartnersGuard implements CanActivate {

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
  ? this.authLocal.getRoles().find((role) => role === 1 || role === 2 || role === 3 || role === 8 || role === 9  || role === 14 || role === 16) !==
    undefined
  : false;

  if (!value && this.validatePartners() && this.validateIsPartners()) {

      this.Router.navigateByUrl('partners-super-admin');
      
      return false;
      
  } else {

    value = true;

  }
  
  return value

  }

    validatePartners() {
  
      return this.authLocal.getRoles()
      ? this.authLocal.getRoles().find((role) => role === 17) !== undefined
      : false;
  }

  validateIsPartners(){
  
    const prefereces = JSON.parse(localStorage.getItem('company'));
    
    return prefereces.isPartnerType;
  
  }
  
}

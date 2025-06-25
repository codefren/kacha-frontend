import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthLocalService } from '../auth-local.service';
import { ProfileSettingsFacade } from '../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { Profile } from '../../../../backend/src/lib/types/profile.type';

@Injectable({
  providedIn: 'root'
})
export class SacGuard implements CanActivate {
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
      ? this.authLocal.getRoles().find((role) => role === 1 || role === 2 || role === 3 || role === 8 || role === 9|| role === 10 || role === 16 || role === 17) !==
        undefined
      : false;

 
  if (!value && this.validateSAC()) {
      
      this.Router.navigateByUrl('travel-tracking');
      
      return false;
      
  }

  if(!value && this.validateOnlyChat()){
    this.Router.navigateByUrl('chat');
      
      return false;
  }
  
  return value
}


validateSAC() {
    return this.authLocal.getRoles()
    ? this.authLocal.getRoles().find((role) =>  [14,7].includes(role)) !== undefined
    : false;
}


validateOnlyChat(){
  return this.authLocal.getRoles()
  ? this.authLocal.getRoles().length === 1 && this.authLocal.getRoles().find((role) =>  [18].includes(role)) !== undefined
  : false;
}

admin(){
  return this.authLocal.getRoles
  ? this.authLocal.getRoles().find((role) => role === 1 || role === 2 || role === 3 || role === 7 || role === 8 || role === 9 || role === 10) !==
    undefined
  : false;
}
  
}

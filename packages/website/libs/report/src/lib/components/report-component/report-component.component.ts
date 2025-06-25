import { ProfileSettingsFacade } from './../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';

import { Profile } from '../../../../../backend/src/lib/types/profile.type';
import { Subject, Observable } from 'rxjs';
import { AppPreferences } from '../../../../../backend/src/lib/types/preferences.type';
import { PreferencesFacade } from '../../../../../state-preferences/src/lib/+state/preferences.facade';
import { AuthLocalService } from '@optimroute/auth-local';

@Component({
  selector: 'easyroute-report-component',
  templateUrl: './report-component.component.html',
  styleUrls: ['./report-component.component.scss']
})
export class ReportComponentComponent implements OnInit {

  profile: Profile;

  appPreferences$: Observable<AppPreferences>;

  unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private facade: PreferencesFacade,
    private facadeProfile: ProfileSettingsFacade,
    public authLocal: AuthLocalService,
  ) { }

  ngOnInit() {

    this.appPreferences$ = this.facade.appPreferences$;

    this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
      if (loaded) {
          this.facadeProfile.profile$
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((data) => {
                  this.profile = data;
              });
      }
    });


  }

  redirectPages(ruta: any){
   
    this.router.navigateByUrl(`report/${ruta}`);
    
  }

  rediresPagesCostEffectiveness(ruta: any){

    console.log(this.moduleCost() , 'this.moduleCost()');

    if (!this.moduleCost()) return

    this.router.navigateByUrl(`report/${ruta}`);

  }

  rediresAccessLog(ruta: any){

    if (!this.isAdminCompany()) return

    this.router.navigateByUrl(`report/${ruta}`);

  }

  moduleCost(){
    if (this.profile &&
        this.profile.email !== '' &&
        this.profile.company &&
        this.profile.company &&
        this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 14)) {
  
        return true;
        
    } else {
  
        return false;
  
    }
  }

  isAdminCompany() {

    return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role) =>role === 1 || role === 2) !== undefined
        : false;
  }
  
  openSetting() {

    this.router.navigateByUrl('/preferences?option=report');

  }
  
}

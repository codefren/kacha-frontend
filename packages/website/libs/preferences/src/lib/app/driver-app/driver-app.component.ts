import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { Profile } from '@optimroute/backend';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { BackendService } from 'libs/backend/src/lib/backend.service';
import { APP, AppPreferences, MN, ManagementPreferences } from 'libs/backend/src/lib/types/preferences.type';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';
import { PreferencesFacade } from 'libs/state-preferences/src/lib/+state/preferences.facade';
declare function init_plugins();
declare var $;
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import * as moment from 'moment';

@Component({
  selector: 'easyroute-driver-app',
  templateUrl: './driver-app.component.html',
  styleUrls: ['./driver-app.component.scss']
})
export class DriverAppComponent implements OnInit {

  appPreferences$: Observable<AppPreferences>;

  managementPreferences$: Observable<ManagementPreferences>;

  unsubscribe$ = new Subject<void>();

  stateAlbaran: any = [];

  isActiveState: boolean = false;

  nameAddState: string = '';

  activeValoration: boolean = false;

  profile: Profile;


  constructor(
    private facade: PreferencesFacade,
    private toastService: ToastService,
    private backendService: BackendService,
    private detectChanges: ChangeDetectorRef,
    private translate: TranslateService,
    public authLocal: AuthLocalService,
    private facadeProfile: ProfileSettingsFacade,
  ) { }

  ngOnInit() {

    this.facade.loadCompanyPreparationPreferences();

    this.appPreferences$ = this.facade.appPreferences$;

    this.managementPreferences$ = this.facade.managementPreferences$;

    this.loadStateAlbaran();


    this.backendService.get('user/me').subscribe(
      (resp) => {
          if (resp.company.active_modules && resp.company.active_modules.length > 0) {
             
              this.activeValoration = resp.company.active_modules.find(
                  (x: any) => x.id === 9,
              )
                  ? true
                  : false;
          }
      },
      (error) =>
          this.toastService.displayHTTPErrorToast(error.status, error.error.error),
    );

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

  toggleAppPreference(key: APP, value: AppPreferences[APP]){

    let validation = this.validateSignature(key, value);

    if (!validation) {

        this.facade.toggleAppPreference(key, value);

    } else {

        $('#app-' + key).prop('checked', true);

        this.toastService.displayWebsiteRelatedToast(
            this.translate.instant(
                'PREFERENCES.NOTIFICATIONS.MESSAGE_SIGNATURE',
            ),
            this.translate.instant('GENERAL.ACCEPT'),
        );

    }

}


validateSignature(key: any, value: any) {

  let valueReturn = false;

  this.appPreferences$.pipe(takeUntil(this.unsubscribe$)).subscribe((app) => {

      if (key == 'digitalSignature') {

          if (!value && !app.photographyStamp) {
              valueReturn = true;
          }
      }

      if (key == 'photographyStamp') {

          if (!value && !app.digitalSignature) {
              valueReturn = true;
          }
      }

  });

  return valueReturn;

}

loadStateAlbaran(){
  this.isActiveState = false;
  this.nameAddState = '';
  this.backendService.get('delivery_note_status_preference_list').pipe(take(1)).subscribe(({data})=>{
    this.stateAlbaran = data;
    this.detectChanges.detectChanges();
  })
}

addStateAlbaran(){
  this.backendService.post('company_delivery_note_status_use', {
      name: this.nameAddState,
      isActive: this.isActiveState
  }).pipe(take(1)).subscribe(({data})=>{
      this.loadStateAlbaran();
  })
}



updateStatePreference(state: any, value: any){

  this.backendService.put('company_delivery_note_status_use/' + state.id, {
      isActive: value
  }).pipe(take(1)).subscribe((data)=>{
      this.toastService.displayWebsiteRelatedToast(

          this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),

          this.translate.instant('GENERAL.ACCEPT')

      );
  })
}

toggleManagementPreference(key: MN, value: ManagementPreferences[MN]) {
  this.facade.toggleManagementPreferences(key, value);
}

isControlPanel() {
  return this.authLocal.getRoles()
      ? this.authLocal.getRoles().find((role) => role === 7) !== undefined
      : false;
}

isAdmin() {
  return this.authLocal.getRoles()
      ? this.authLocal
          .getRoles()
          .find((role) => role === 1 || role === 3 || role === 8) !== undefined
      : false;
}

isAdminCompany() {
  return this.authLocal.getRoles()
      ? this.authLocal.getRoles().find((role) => role === 2 || role === 16) !== undefined
      : false;
}

isControlPartners() {
        
  const prefereces = JSON.parse(localStorage.getItem('company'));

  return this.authLocal.getRoles()
      ? this.authLocal.getRoles().find((role) => role === 17 && !prefereces.isPartnerType) !== undefined
      : false;
}

isActive() {
  if (
      this.profile &&
      this.profile.email !== '' &&
      this.profile.company &&
      this.profile.company.subscriptions &&
      this.profile.company.subscriptions.length > 0
  ) {
      let value =
          this.profile.company.subscriptions[0].stripe_status == 'trialing' || this.profile.company.subscriptions[0].stripe_status == 'active' ||
          this.isAdmin();
      return value;
  } else {
      false;
  }
}

defeatedDemo() {
  if (
      this.profile &&
      this.profile.email !== '' &&
      this.profile.company &&
      this.profile.company.subscriptions.length === 0
  ) {
      let value = moment(this.profile.company.endDemoDate).diff(moment()) > 0;
      return value;
  } else {
      false;
  }
}

inTrial() {
  if (
      this.profile &&
      this.profile.email !== '' &&
      this.profile.company &&
      this.profile.company.subscriptions &&
      this.profile.company.subscriptions.length > 0
  ) {
      let value =
          this.profile.company.subscriptions[0].stripe_status == 'trialing' ||
          this.isAdmin();
      return value;
  } else {
      false;
  }
}

}

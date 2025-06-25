import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, Profile } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-summary-boxes',
  templateUrl: './summary-boxes.component.html',
  styleUrls: ['./summary-boxes.component.scss']
})
export class SummaryBoxesComponent implements OnInit {

  preferenceTravelCash: any = {
    summaryLoads: false,
    deliveryStatus: false,
    summaryCosts: false

  };

  showImg: boolean = true;

  profile$: Observable<Profile>;
  profileSnapShot: {
      profile: Profile['profile'];
      address: Profile['address'];
      company: Profile['company'];
  };

  profile: any;


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private translate: TranslateService,
    private toastService: ToastService,
    private facade: ProfileSettingsFacade
  ) { }

  ngOnInit() {

    this.profile$ = this.facade.profile$;
    this.profile$.pipe(
        take(1),
    ).subscribe((profile) => {
        if (profile) {

            this.profileSnapShot = {
                profile: profile.profile,
                address: profile.address,
                company: profile.company,
            };

            this.profile =  this.profileSnapShot;
         
            this.changeDetectorRef.detectChanges();
        }
    });

    this.load();
  }

  load() {

    this.showImg = false;

    this.loadingService.showLoading();

    this.backendService.get('company_preference_box_route').pipe(take(1)).subscribe(({ data }) => {

      this.loadingService.hideLoading();

      this.preferenceTravelCash = data;

      this.showImg = true;

      this.changeDetectorRef.detectChanges();

    }, (error) => {

      this.showImg = true;

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(
        error.error.code,
        error.error,
      );

    });

  }

  changeUpdateCash(etiqueta: string, value: any) {

    let data = {

      [etiqueta]: value

    };

    this.loadingService.showLoading();

    this.backendService.post('company_preference_box_route', data).pipe(take(1))

    .subscribe((data)=>{

      this.toastService.displayWebsiteRelatedToast(

        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),

        this.translate.instant('GENERAL.ACCEPT'),

      );

      this.load();

    }, error => {

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });

  }

  ModuleCost(){
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

}

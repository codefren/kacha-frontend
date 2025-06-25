import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OptimizationPreferences, OPA } from '../../../../../../backend/src/lib/types/preferences.type';
import { PreferencesFacade } from '../../../../../../state-preferences/src/lib/+state/preferences.facade';
import { BackendService } from '@optimroute/backend';
import { take } from 'rxjs/operators';
import { LoadingService, ToastService } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'easyroute-data-update',
  templateUrl: './data-update.component.html',
  styleUrls: ['./data-update.component.scss']
})
export class DataUpdateComponent implements OnInit {

  optimizationPreferences$: Observable<OptimizationPreferences>;

  unsubscribe$ = new Subject<void>();

  allowCompanyPreferenceDuplicate: any = '';

  constructor(
    private facade: PreferencesFacade,
    private backendService: BackendService,
    private detectChanges: ChangeDetectorRef,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    
    this.optimizationPreferences$ = this.facade.optimizationPreferences$;

    this.getCompanyPreferenceDuplicate();

  }

  toggleOptimizationAction(
    key: OPA,
    value: OptimizationPreferences[OPA],
  ) {
      this.facade.toggleOptimization(key, value);
  }

  getCompanyPreferenceDuplicate() {

    setTimeout(() => {
        this.backendService
            .get('company_preference_duplicates')
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.allowCompanyPreferenceDuplicate = data;

                    console.log(this.allowCompanyPreferenceDuplicate, 'this.allowCompanyPreferenceDuplicate');
                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
    }, 500); 
  }

  updateCompanyPreferenceDuplicate(Event: any, id: any){

    this.loadingService.showLoading();
 
      let data ={
        [id]: Event
      };

     this.backendService.post('company_preference_duplicates', data)
     .pipe(take(1))
     .subscribe(
        ({ data }) => {
            this.allowCompanyPreferenceDuplicate = data;

            this.loadingService.hideLoading();

            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
              this.translate.instant('GENERAL.ACCEPT'),
          );

          this.detectChanges.detectChanges();

        },
        (error) => {
            this.toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, MN, ManagementPreferences, OptimizationPreferences } from '@optimroute/backend';
import { LoadingService, ModalConfirmNewComponent, ToastService } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'easyroute-download-times',
  templateUrl: './download-times.component.html',
  styleUrls: ['./download-times.component.scss']
})
export class DownloadTimesComponent implements OnInit {

  optimizationPreferences$: Observable<OptimizationPreferences>;

  managementPreferences$: Observable<ManagementPreferences>;

  unsubscribe$ = new Subject<void>();

  dischargingMinutes: number;

  dischargingMinutesChanged = false;

  dischargingSeconds: number;

  dischargingSecondsChanged = false;

  minAvgServiceTimeMinutes: number;

  maxAvgServiceTimeMinutes: number;

  minAvgServiceTimeSeconds: number;

  maxAvgServiceTimeSeconds: number;

  constructor(
    private loading: LoadingService,
    private facade: PreferencesFacade,
    private modal: NgbModal,
    private _translate: TranslateService,
    private backendService: BackendService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.optimizationPreferences$ = this.facade.optimizationPreferences$;

    this.managementPreferences$ = this.facade.managementPreferences$;

    this.managementPreferences$.pipe(takeUntil(this.unsubscribe$)).subscribe((or) => {
      (this.minAvgServiceTimeSeconds = or.minAvgServiceTime % 60);
      (this.minAvgServiceTimeMinutes = Math.floor(or.minAvgServiceTime / 60));


      (this.maxAvgServiceTimeSeconds = or.maxAvgServiceTime % 60);
      (this.maxAvgServiceTimeMinutes = Math.floor(or.maxAvgServiceTime / 60));

  });


    this.optimizationPreferences$.pipe(takeUntil(this.unsubscribe$)).subscribe((op) => {
  
      this.dischargingMinutes = op.dischargingMinutes;
      this.dischargingSeconds = op.dischargingSeconds;

   
  });
  }

  updateDefaultDischargingTime() {
    if (this.dischargingMinutesChanged || this.dischargingSecondsChanged) {
        this.dischargingMinutesChanged = false;
        this.dischargingMinutesChanged = false;
        this.facade.updateDefaultDischargingTime(
            this.dischargingMinutes * 60 + this.dischargingSeconds,
        );
    }
  }
  
  asignDischageTimeDefault() {
    const modal = this.modal.open(ModalConfirmNewComponent, {
      backdrop: 'static',
      backdropClass: 'modal-backdrop-ticket',
      centered: true,
      size: 'sm',
      windowClass: 'modal-infor'
    });
    modal.componentInstance.title = this._translate.instant('GENERAL.CONFIRM_REQUEST');
    modal.componentInstance.subTitle = '';
    modal.componentInstance.titleBotton = this._translate.instant('GENERAL.ACCEPT');
    modal.componentInstance.message =
        '¿Está segur(a) de cambiar el tiempo de descarga por defecto a los clientes a: <b>' +
        this.dischargingMinutes.toString().padStart(2, '0') +
        'm ' +
        this.dischargingSeconds.toString().padStart(2, '0') +
        's</b>?';
    modal.result.then(
        (result) => {
            if (result) {
                this.loading.showLoading();
                this.backendService
                    .post('delivery_point_servicetime_multiple')
                    .pipe(take(1))
                    .subscribe(
                        (data) => {
                            this.loading.hideLoading();
                        },
                        (error) => {
                            this.loading.hideLoading();
                            this.toastService.displayWebsiteRelatedToast(
                                error.status,
                                error.error.error,
                            );
                        },
                    );
            }
        },
        (reason) => {
            /* this.toast.displayHTTPErrorToast(reason.status, reason.error.error); */
        },
    );
  }
  
  activateAvgCalcServiceTime(key: MN, value: ManagementPreferences[MN]) {
  
    this.facade.toggleManagementPreferences(key, value);  
  
  }
  
  useAvgServiceTime(key: MN, value: ManagementPreferences[MN]) {
  
    this.facade.toggleManagementPreferences(key, value);
    
  }
  
  updateMinAvgServiceTime() {
    this.facade.updateMinAvgServiceTime(
        this.minAvgServiceTimeMinutes * 60 + this.minAvgServiceTimeSeconds,
    );
  }
  
  updateMaxAvgServiceTime() {
    this.facade.updateMaxAvgServiceTime(
        this.maxAvgServiceTimeMinutes * 60 + this.maxAvgServiceTimeSeconds,
    );
  }
  
  
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}

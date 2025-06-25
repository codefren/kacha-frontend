import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDefaultCardComponent } from '../pay-method/confirm-default-card/confirm-default-card.component';
import { take, takeUntil } from 'rxjs/operators';
import { LoadingService, ToastService, ConfirmModalComponent } from '@optimroute/shared';
import { StateCompaniesService } from '@optimroute/state-companies';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { environment } from '@optimroute/env/environment';
import { BackendService, Profile } from '@optimroute/backend';
import { TranslateService } from '@ngx-translate/core';
import { ModalContactUsComponent } from '@optimroute/shared';
import { ModalInfoPlanComponent } from './modal-info-plan/modal-info-plan.component';
@Component({
    selector: 'easyroute-subscription-status',
    templateUrl: './subscription-status.component.html',
    styleUrls: ['./subscription-status.component.scss'],
})
export class SubscriptionStatusComponent implements OnInit, OnDestroy {
    inDemo: boolean = true;
    isSubscribed: boolean = false;
    unsubscribe$ = new Subject<void>();
    cards: any = [];
    subscriptionData: any;
    modulos: any = [];
    money_sign: string = '€';
    profile: Profile;
    dayDemo: number = 0;
    plans: any = [];
    loaded: boolean = false;
    canSuscribe: boolean = false;
    constructor(
        private facadeProfile: ProfileSettingsFacade,
        private dialog: NgbModal,
        private loading: LoadingService,
        private toast: ToastService,
        private companyService: StateCompaniesService,
        private backend: BackendService,
        private detectChange: ChangeDetectorRef,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.facadeProfile.profile$.pipe(takeUntil(this.unsubscribe$)).subscribe(async (data) => {
            if (data.email !== '') {
                this.profile = data;
                this.dayDemo = moment(data.company.endDemoDate).diff(moment(), 'days') + 1;
                this.inDemo =
                    moment(data.company.endDemoDate).diff(moment()) > 0 ? true : false;

                this.companyService.susbcriptionStatus().pipe(take(1)).subscribe(async status => {


                    this.isSubscribed = status.subscribed;
                    this.canSuscribe = status.canSubscribe;

                    this.subscriptionData = status;

                    if (status.canSubscribe) {
                        this.loadCards();
                    }
                    if (!this.isSubscribed) {
                        this.loaded = false;
                        await this.loading.showLoading();
                        this.backend.get('company_profile_type_detail_list').subscribe(({ data }) => {
                            this.loaded = true;
                            console.log(data);
                            this.plans = data;
                            this.loading.hideLoading();
                            this.detectChange.detectChanges();
                        })
                    }
                })

                /*   this.companyService
                      .readModules()
                      .pipe(take(1))
                      .subscribe((modulos) => {
                          this.modulos = modulos;
                      }); */


            }


        });
    }

    contactModal(type) {
        const dialogRef = this.dialog.open(ModalContactUsComponent, {
            size: 'xs',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.componentInstance.typeForm = type;
        dialogRef.componentInstance.data = this.plans.find(x => x.id === this.profile.company.companyProfileTypeId);
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    cancelModule() {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            size: 'xs',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.componentInstance.titleTranslate = 'INVOICING.MODULE.SURE_CANCEL';
        dialogRef.result.then((add) => {
            if (add) {
                console.log('cancelar modulo', add);
            }
        });
    }

    viewMorePlan(plan) {
        const dialogRef = this.dialog.open(ModalInfoPlanComponent, {
            windowClass: 'modal-plan-info',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: true

        });
        dialogRef.componentInstance.plan = plan;


    }

    subscribe() {
        this.loading.showLoading();
        this.loading.hideLoading();
        const dialogRef = this.dialog.open(ConfirmDefaultCardComponent, {
            size: 'xs',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });

        dialogRef.componentInstance.price = this.subscriptionData.priceWithoutIva;
        dialogRef.componentInstance.planName = this.subscriptionData.name;
        /* old  ->selected.nickname */
        dialogRef.result.then((add) => {
            if (add) {
                this.loading.showLoading();
                this.companyService
                    .agreeSubscribe()
                    .pipe(take(1))
                    .subscribe(
                        (data) => {
                            this.loading.hideLoading();
                            this.facadeProfile.loadAll();
                            this.isSubscribed = true;
                            this.companyService
                                .susbcriptionStatus()
                                .pipe(take(1))
                                .subscribe((subsData: any) => {
                                    this.subscriptionData = subsData;
                                });
                        },
                        (error) => {
                            this.loading.hideLoading();
                            this.toast.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );
                        },
                    );
            }
        });
    }
    /*   subscribe() {
          const dialogRef = this.dialog.open(ConfirmDefaultCardComponent, {
              size: 'xs',
              backdropClass: 'customBackdrop',
              centered: true,
              backdrop: 'static',
          });
  
          dialogRef.componentInstance.titleTranslate =
              'INVOICING.SUBSCRIPTION_STATUS.SURE_SUBSCRIBE';
          dialogRef.componentInstance.delete = false;
          dialogRef.componentInstance.profile = this.profile;
  
          dialogRef.result.then((add) => {
              if (add) {
                  this.loading.showLoading();
                  this.companyService
                      .agreeSubscribe()
                      .pipe(take(1))
                      .subscribe(
                          (data) => {
                              this.loading.hideLoading();
                              this.facadeProfile.loadAll();
                              this.isSubscribed = true;
                              this.companyService
                                  .subscriptionData()
                                  .pipe(take(1))
                                  .subscribe((subsData: any) => {
                                      this.subscriptionData = subsData;
                                  });
                          },
                          (error) => {
                              this.loading.hideLoading();
                              this.toast.displayHTTPErrorToast(
                                  error.status,
                                  error.error.error,
                              );
                          },
                      );
              }
          });
      } */

    /* cancel() {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            size: 'xs',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.componentInstance.message = this.translate.instant('INVOICING.SUBSCRIPTION_STATUS.SURE_CANCEL');
        dialogRef.result.then((add) => {
            if (add) {
                this.loading.showLoading();
                this.companyService
                    .cancelSubscribe()
                    .pipe(take(1))
                    .subscribe(
                        (data) => {
                            this.loading.hideLoading();
                            this.facadeProfile.loadAll();
                            this.isSubscribed = true;
                        },
                        (error) => {
                            this.loading.hideLoading();
                            this.toast.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );
                        },
                    );
            }
        });
    } */

    loadCards() {
        this.companyService
            .loadCards()
            .pipe(take(1))
            .subscribe(({ data }) => {
                this.cards = data;
            });
    }

    changePlan(companyProfileTypeId: number, nickname: string) {
        const modal = this.dialog.open(ConfirmModalComponent, {
            size: 'xs',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });

        modal.componentInstance.message = '<div><b>¿Deseas cambiar de plan a: ' + nickname + '?</b></div>' +
            ' <br>' +
            '<div class="mt-2">Recuerda que los días de prueba no se reiniciarán</div>'


        modal.result.then((data) => {
            if (data) {
                this.facadeProfile.changePlanAction(+companyProfileTypeId);
            }
        });
    }
}

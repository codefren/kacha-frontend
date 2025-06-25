import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormCardComponent } from './form-card/form-card.component';
import { StateCompaniesService } from '@optimroute/state-companies';
import { take, takeUntil } from 'rxjs/operators';
import { ToastService, LoadingService, ConfirmModalComponent } from '@optimroute/shared';
import { ConfirmDefaultCardComponent } from './confirm-default-card/confirm-default-card.component';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { BackendService, Profile } from '@optimroute/backend';
declare var $: any;
@Component({
    selector: 'easyroute-pay-method',
    templateUrl: './pay-method.component.html',
    styleUrls: ['./pay-method.component.scss'],
})
export class PayMethodComponent implements OnInit, OnDestroy {

    cards: any = [];
    isSubscribed: boolean = false;
    loadingCard: boolean = false;
    stripe: any;
    table: any;
    profile: Profile;
    unsubscribe$ = new Subject<void>();
    canSuscribe: boolean = false;
    constructor(
        private dialog: NgbModal,
        private companyService: StateCompaniesService,
        private loading: LoadingService,
        private facadeProfile: ProfileSettingsFacade,
        private toast: ToastService,
        private authLocal: AuthLocalService,
        private translate: TranslateService,
        private detectChanges: ChangeDetectorRef,
        private backend: BackendService
    ) { }

    ngOnInit() {
        this.facadeProfile.profile$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
            if (data.email !== '') {

                this.companyService.susbcriptionStatus().pipe(take(1)).subscribe(async status => {
                    this.isSubscribed = status.subscribed;
                    this.canSuscribe = status.canSubscribe;

                    if (this.canSuscribe) {
                        this.loadCards();
                    }
                })
                this.profile = data;
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    addPayMethod() {
        const dialogRef = this.dialog.open(FormCardComponent, {
            size: 'md',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.result.then(({ value, setupIntent }) => {

            // console.log( value, setupIntent );
            if (value && setupIntent) {

                this.loading.hideLoading();  // cierra el loading del modal
                this.loading.showLoading();
                this.companyService.createCard(setupIntent).pipe(take(1)).subscribe((data) => {
                    if (this.cards && this.cards.length === 0) {
                        this.subscribe();
                        this.loadCards();
                    } else {
                        this.loadCards();
                    }
                    this.loading.hideLoading();
                    this.facadeProfile.loadAll();

                    setTimeout(() => {
                        this.loading.hideLoading();
                        this.toast.displayWebsiteRelatedToast(
                            this.translate.instant('INVOICING.PAY_METHOD.CREATE_METHOD'),
                            this.translate.instant('GENERAL.ACCEPT')
                        );
                    }, 3000);
                }, (error) => {
                    this.loading.hideLoading();
                    this.toast.displayHTTPErrorToast(error.status, error.error.error);
                });
            }
        });
    }

    cancel() {
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
    }

    change(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.change', function () {
            let data = table.row($(this).parents('tr')).data();
            that.changeCard(data);
        });
    }

    changeCard(data: any) {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            size: 'md',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });

        dialogRef.componentInstance.message = this.translate.instant('INVOICING.PAY_METHOD.CHANGE_DEFAULT')
            + ' ' + data.card.last4 + '?';
        /* dialogRef.componentInstance.default = data.default;
        dialogRef.componentInstance.delete = false;
        dialogRef.componentInstance.last4 = data.card.last4; */

        dialogRef.result.then((add) => {
            console.log(add);
            if (add) {
                this.loading.showLoading();

                this.companyService
                    .changeCardDefault(data.id)
                    .pipe(take(1))
                    .subscribe(
                        (data) => {
                            this.loadCards();

                            setTimeout(() => {
                                this.loading.hideLoading();
                                this.toast.displayWebsiteRelatedToast(
                                    this.translate.instant(
                                        'INVOICING.PAY_METHOD.UPDATE_METHOD',
                                    ),
                                    this.translate.instant('GENERAL.ACCEPT'),
                                );
                            }, 2500);
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

    delete(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'img.delete', function () {
            let data = table.row($(this).parents('tr')).data();
            that.deleteCard(data);
        });
    }

    deleteCard(data: any) {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            size: 'md',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });

        let title = '';

        if (data.default) {
            title = this.translate.instant('INVOICING.PAY_METHOD.NOT_DELETE_CARD');
        } else {
            title = this.translate.instant('INVOICING.PAY_METHOD.DELETE_CARD') + ' ' + data.card.last4 + '?';
        }

        dialogRef.componentInstance.message = title;
        if (data.default) {
            dialogRef.componentInstance.card = true;
            dialogRef.componentInstance.noDelete = true;
        }
        /*  dialogRef.componentInstance.default = data.default;
         dialogRef.componentInstance.delete = true;
         dialogRef.componentInstance.last4 = data.card.last4; */

        dialogRef.result.then((add) => {
            if (add) {
                this.loading.showLoading();
                this.companyService
                    .deleteCard(data.id)
                    .pipe(take(1))
                    .subscribe(
                        (data) => {
                            this.loadCards();

                            setTimeout(() => {
                                this.loading.hideLoading();
                                this.toast.displayWebsiteRelatedToast(
                                    this.translate.instant(
                                        'INVOICING.PAY_METHOD.UPDATE_METHOD',
                                    ),
                                    this.translate.instant('GENERAL.ACCEPT'),
                                );
                            }, 3000);
                        },
                        (error) => {
                            console.log('error:', error);
                            this.loading.hideLoading();
                            this.toast.displayHTTPErrorToast(
                                error.error.status,
                                error.error.error,
                            );
                        },
                    );
            }
        });
    }

    loadCards() {
        this.companyService.loadCards().subscribe((data) => {
            this.cards = data.data;
        }, (error) => {
            this.loading.hideLoading();
            this.toast.displayHTTPErrorToast(error.status, error.error.error);
        });
    }

    loadTable() {
        let url = `${environment.apiUrl}stripe_card_list`;
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

        this.table = $('#cards').DataTable({
            destroy: true,
            processing: false,
            orderable: false,
            order: [[3, 'asc']],
            lengthMenu: [5, 10, 20, 30, 50],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            dom: `<r<'table-responsive't>ip>`,
            language: environment.DataTableEspaniol,
            ajax: {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: tok,
                },
                url,
                method: 'GET',
                dataSrc: (resp) => {
                    resp.data = resp.data.map((element) => {
                        return {
                            ...element,
                            dateExp: `${element.card.exp_month}/${element.card.exp_year}`,
                            default: element.default,
                        };
                    });

                    // console.log( data );

                    return resp.data;
                },
            },
            columns: [
                {
                    data: 'card.brand',
                    title: this.translate.instant('INVOICING.PAY_METHOD.BRAND'),
                },
                {
                    data: 'card.last4',
                    title: this.translate.instant('INVOICING.PAY_METHOD.CARD_NUMBER'),
                    orderable: false,
                    render: (data, type, row) => `<span>**** ${data}</span>`,
                },
                {
                    className: 'text-center',
                    data: 'dateExp',
                    orderable: false,
                    title: this.translate.instant('INVOICING.PAY_METHOD.DATE_EXPIRED'),
                },
                {
                    data: 'default',
                    orderable: true,
                    title: this.translate.instant('INVOICING.PAY_METHOD.DEFAULT'),
                    render: (data, type, row) => {
                        if (data === '1' || data === 1 || data === true) {
                            return (`
                                <div class="row justify-content-center">
                                    <div class="round">
                                        <input type="checkbox" class="isActive" id="row_${row.id}" checked="true" disabled=true/>
                                        <label for="row_${row.id}"></label>
                                    </div>
                                </div>
                            `);

                        } else {
                            return (`
                                <div class="row justify-content-center">
                                    <div class="round change">
                                        <input type="checkbox" class="isActive" id="row_${row.id}" disabled=true/>
                                        <label for="row_${row.id}"></label>
                                    </div>
                                </div>
                            `);
                        }
                    },
                },
                {
                    data: null,
                    orderable: false,
                    title: this.translate.instant('INVOICING.PAY_METHOD.DELETE'),
                    render: (data, type, row) => {
                        return `
                            <img class="icons-datatable point delete" src="assets/icons/optimmanage/trash-bin.svg">
                        `;
                    },
                },
            ],
        });
    }


    subscribe() {
        this.backend.get('subscription_status').subscribe((data) => {
            console.log(data);
            this.loading.hideLoading();
            const dialogRef = this.dialog.open(ConfirmDefaultCardComponent, {
                size: 'xs',
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static',
            });
            dialogRef.componentInstance.price = data && data.priceWithoutIva ? data.priceWithoutIva : 0 / 100;
            dialogRef.componentInstance.planName = data && data.pack && data.pack.name ? data.pack.name : '';
            /* selected.nickname */
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
        });
    }
}

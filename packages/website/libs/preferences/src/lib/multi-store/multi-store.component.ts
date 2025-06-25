import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { APP, Addresses, AppPreferences, BackendService, Delivery, Payment, Profile } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { ToastService, dayTimeAsStringToSeconds } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

declare function init_plugins();

declare var $;
import * as _ from 'lodash';
import { DeliveryModalConfirmationComponent } from 'libs/shared/src/lib/components/delivery-modal-confirmation/delivery-modal-confirmation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';


@Component({
  selector: 'easyroute-multi-store',
  templateUrl: './multi-store.component.html',
  styleUrls: ['./multi-store.component.scss']
})
export class MultiStoreComponent implements OnInit {

  haveMultiStore: boolean = false;
  
  profile: Profile;

  PreferenceDelivery: any[] = [];

  appPreferences$: Observable<AppPreferences>;
  payment$: Observable<Payment>;
  addresses$: Observable<Addresses>;
  delivery$: Observable<Delivery[]>;

  unsubscribe$ = new Subject<void>();

  minPayment: number;
  minPaymentChange = false;
  showErrorPatterMinPaymentChange: string = '';
  
  prepaidPayment: number;
  prepaidPaymentChange = false;
  showErrorPatterPrepaidPaymentChange: string = '';

  allowBuyWithoutMinimun: boolean = false;
  returnToMailBoxOrder: boolean = false;
  quantityBuyWithoutMinimun: number = 0;
  allowBuyWithoutMinimumChange: boolean = false;
  showErrorPatterquantityBuyWithoutMinimumChange: string = '';
  moneySymbol = environment.MONEY_SYMBOL;

  directionCalculations: string;
  directionCalculationChanged = false;

  rangeDistances: number;
  rangeDistanceChange = false;

  showErrorPatterPrice: string = '';
  pricePatter = false;
   
  data: any;
  
  constructor(
      public authLocal: AuthLocalService,
      private backendService: BackendService,
      private toastService: ToastService,
      private facade: PreferencesFacade,
      private translate: TranslateService,
      private modal: NgbModal,
      private facadeProfile: ProfileSettingsFacade,

  ) { }

  ngOnInit() {

    this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
        if (loaded) {
            this.facadeProfile.profile$
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((data) => {
                    this.profile = data;
                });
        }
    });

    this.appPreferences$ = this.facade.appPreferences$;
    this.payment$ = this.facade.payment$;
    this.addresses$ = this.facade.addresses$;
    this.delivery$ = this.facade.delivery$;

    //this.facade.loadFranchisesPreferences();

    this.facade.loadCompanyPreparationPreferences();
  
    /* payment */
    this.payment$.pipe(takeUntil(this.unsubscribe$)).subscribe((p) => {
      if (p) {
          this.minPayment = p.minPayment;

          this.prepaidPayment = p.prepaidPayment;

          this.showErrorPatterMinPaymentChange = p.minPayment.toString();

          this.showErrorPatterPrepaidPaymentChange = p.prepaidPayment.toString();

          this.allowBuyWithoutMinimun = p.allowBuyWithoutMinimun;

          this.quantityBuyWithoutMinimun = p.quantityBuyWithoutMinimun;

          this.showErrorPatterquantityBuyWithoutMinimumChange = p.quantityBuyWithoutMinimun.toString();
      } else {
          this.minPayment = 0;

          this.prepaidPayment = 0;

          this.showErrorPatterMinPaymentChange = '0';

          this.showErrorPatterPrepaidPaymentChange = '0';

          this.allowBuyWithoutMinimun = false;

          this.quantityBuyWithoutMinimun = 0;

          this.showErrorPatterquantityBuyWithoutMinimumChange = '0';
      }
    });

    // address
    this.addresses$.pipe(takeUntil(this.unsubscribe$)).subscribe((op) => {
      if (op) {
          this.directionCalculations = op.orderRange.address;
          this.rangeDistances = this.calculateDistanceKilometers(
              op.orderRange.allowedRadius,
          );
      } else {
          this.directionCalculations = '';
          this.rangeDistances = 0;
      }
    });

    this.backendService.get('user/me').subscribe(
      (resp) => {
        if (resp.company.active_modules && resp.company.active_modules.length > 0) {
            this.haveMultiStoreFunc(resp.company.active_modules);
        }
      },
      (error) =>
          this.toastService.displayHTTPErrorToast(error.status, error.error.error),
    );

  }

  hideMultidelegation() {
    
    if (!this.isAdminGlobal() && this.haveMultiStore &&
        this.profile.company &&
        this.profile.company.hideMultidelegation) {

        return false;

    }

    return true;

  }

  haveMultiStoreFunc(modules_active: any[]) {
    this.haveMultiStore = modules_active.find((x) => x.id === 2) ? true : false;
  }

  isAdminGlobal() {
    return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role) => role === 1) !== undefined
        : false;
  }

  showStoreManagent() {
    if (
        this.haveMultiStore ||
        (this.profile &&
            this.profile.company &&
            this.profile.company.companyParentId > 0)
    ) {
        return true;
    } else {
        return false;
    }
  }
  
  calculateDistanceKilometers(value: number): number {
    return value / 1000;
  }

  RangeMinPayment() {
    if (typeof this.minPayment !== 'number') {

        this.minPaymentChange = false;

        return;
    }
    if (this.patter() && this.minPaymentChange && this.minPayment >= 0) {
        let value: number = Number(this.minPayment.toFixed(2));

        this.minPayment = value;

        this.facade.updateMinPayment(this.minPayment); //enviar el state
    } else if (this.minPaymentChange && this.minPayment < 0) {
        this.minPayment = 0;
    }

    this.minPaymentChange = false;
  }

  patter() {
    let rexp = /^[0-9]{1,8}(\.[0-9]{1,2})?$/;

    if (rexp.test(this.showErrorPatterMinPaymentChange)) {
        return true;
    } else {
        return false;
    }
  }

  RangePrepaidPayment() {
    if (typeof this.prepaidPayment !== 'number') {
        this.prepaidPaymentChange = false;

        return;
    }
    if (
        this.patterMinPayment() &&
        this.prepaidPaymentChange &&
        this.prepaidPayment >= 0
    ) {
        let value: number = Number(this.prepaidPayment.toFixed(2));

        this.prepaidPayment = value;

        this.facade.updatePrepaidPayment(this.prepaidPayment); // enviar al state
    } else if (this.prepaidPaymentChange && this.prepaidPayment < 0) {
        this.prepaidPayment = 0;
    }

    this.prepaidPaymentChange = false;
  }

  patterMinPayment() {
    let rexp = /^[0-9]{1,8}(\.[0-9]{1,2})?$/;

    if (rexp.test(this.showErrorPatterPrepaidPaymentChange)) {
        return true;
    } else {
        return false;
    }
  }

  changeaReturnToMailBoxOrder(event: any) {
    this.facade.updateReturnToMailBoxOrder(event);
  }

  changeaTimeReturnToMailBoxOrder(event: any) {
    this.facade.updateTimeReturnToMailBoxOrder(event);
}

  changeSumDeliveryPriceToTicket(event: any) {
    this.facade.UpdateSumDeliveryPriceToTicket(event);
  }

  changeSumQuantityBuyWithoutMinimunToTicket(event: any) {
    this.facade.UpdatesSmQuantityBuyWithoutMinimunToTicket(event);
  }
  
  changeAllowChangeOrderPaymentStatus(event:any){
      this.facade.UpdatesAllowChangeOrderPaymentStatus(event);
  }

  changeallowBuyWithoutMinimun(event: any) {
    console.log(event);

    this.allowBuyWithoutMinimun = event;
    setTimeout(() => {
        init_plugins();
    }, 1000);
    this.facade.updateAllowBuyWithoutMinimum(this.allowBuyWithoutMinimun);
  }

  ChangequantityBuyWithoutMinimumt() {
    if (typeof this.quantityBuyWithoutMinimun !== 'number') {
        this.allowBuyWithoutMinimumChange = false;
        return;
    }
    if (
        this.patterQuantityBuyWithoutMinimum() &&
        this.allowBuyWithoutMinimumChange &&
        this.quantityBuyWithoutMinimun >= 0
    ) {
        let value: number = Number(this.quantityBuyWithoutMinimun.toFixed(2));

        this.quantityBuyWithoutMinimun = value;

        this.facade.updateQuantityBuyWithoutMinimum(this.quantityBuyWithoutMinimun); // enviar al state
    } else if (
        this.allowBuyWithoutMinimumChange &&
        this.quantityBuyWithoutMinimun < 0
    ) {
        this.quantityBuyWithoutMinimun = 0;
    }

    this.allowBuyWithoutMinimumChange = false;
  }

  patterQuantityBuyWithoutMinimum() {
    let rexp = /^[0-9]{1,8}(\.[0-9]{1,2})?$/;

    if (rexp.test(this.showErrorPatterquantityBuyWithoutMinimumChange)) {
        return true;
    } else {
        return false;
    }
  }

  onchangeEvent(event: any, name: string) {
    switch (name) {
        case 'minPayment':
            this.showErrorPatterMinPaymentChange = event;

            this.minPayment = event;

            break;

        case 'prepaidPayment':
            this.showErrorPatterPrepaidPaymentChange = event;

            this.prepaidPayment = event;

            break;

        case 'price':
            this.showErrorPatterPrice = event;

            this.pricePatter = event;

            break;
        case 'quantityBuyWithoutMinimum':
            this.showErrorPatterquantityBuyWithoutMinimumChange = event;

            this.quantityBuyWithoutMinimun = event;

            break;

        default:
            break;
    }
  }

  rangeAppOrderLimitDay(value) {
    if (value >= 0) {
        this.toggleAppPreference('orderLimitDay', value);
    }
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

  directionCalculation() {
    if (this.directionCalculationChanged && this.directionCalculations.length > 0) {
        this.directionCalculationChanged = false;
        this.facade.updateAddresesOrderRange(this.directionCalculations); // se envia al selector (facade)
    }
  }

  rangeDistance() {
    if (typeof this.rangeDistances !== 'number') {
        this.rangeDistanceChange = false;
        this.rangeDistances = 0;

        return;
    }

    if (
        this.rangeDistanceChange &&
        this.rangeDistances >= 0 &&
        this.rangeDistances < 9999999
    ) {
        let value: number = this.calculateDistanceMeters(
            Number(this.rangeDistances.toFixed(2)),
        );

        // devuelve la actualizacion local a la vista
        this.rangeDistances = this.calculateDistanceKilometers(value);

        this.facade.updateRangeDistance(value);
    } else if (this.rangeDistanceChange && this.rangeDistances < 0) {
        this.rangeDistances = 0;
    }

    this.rangeDistanceChange = false;
  }

  calculateDistanceMeters(value: number): number {
    return value * 1000;
  }

  addDeliveryRate() {
    this.data = {
        name: 'Entrega',
        order: null,
        minTime: '1',
        maxTime: '1',
        isActive: true,
        express: true,
    };

    this.facade.createPreferenceDelivery(this.data);
  }

  orderby(delivery: Delivery[]) {

    let table = _.cloneDeep(delivery);

    return table.sort((a, b) => b.price - a.price);
  }

  changePrice(event: any, deliveryPrice: Delivery, name: string) {
    switch (name) {
        case 'order':
            deliveryPrice = {
                ...deliveryPrice,
                order: Number(event),
            };
            this.facade.updatePreferenceDelivery(deliveryPrice);
            break;

        case 'minTime':
            deliveryPrice = {
                ...deliveryPrice,
                minTime: dayTimeAsStringToSeconds(event),
            };
            this.facade.updatePreferenceDelivery(deliveryPrice);
            break;

        case 'maxTime':
            deliveryPrice = {
                ...deliveryPrice,
                maxTime: dayTimeAsStringToSeconds(event),
            };
            this.facade.updatePreferenceDelivery(deliveryPrice);
            break;

        case 'price':
            deliveryPrice = {
                ...deliveryPrice,
                price: event,
            };
            if (this.patterPrice(deliveryPrice.price) && deliveryPrice.price <= 99999) {
                this.facade.updatePreferenceDelivery(deliveryPrice);
            } else {
                return false;
            }

            break;

        case 'name':
            deliveryPrice = {
                ...deliveryPrice,
                name: event,
            };
            this.facade.updatePreferenceDelivery(deliveryPrice);
            break;

        default:
            break;
    }

  }

  patterPrice(price: number) {
    let rexp = /^[0-9]{1,8}(\.[0-9]{1,2})?$/;

    if (rexp.test(price.toString())) {
        return true;
    } else {
        return false;
    }
  }

  activeDeliveryRates(event: any, deliveryRates: any) {
    const modal = this.modal.open(DeliveryModalConfirmationComponent, {
        centered: true,
        backdrop: 'static',
    });
    if (deliveryRates.isActive) {
        modal.componentInstance.title = this.translate.instant(
            'GENERAL.CONFIRM_REQUEST',
        );
        modal.componentInstance.message = this.translate.instant('GENERAL.INACTIVE?');
    } else {
        modal.componentInstance.title = this.translate.instant(
            'GENERAL.CONFIRM_REQUEST',
        );
        modal.componentInstance.message = this.translate.instant('GENERAL.ACTIVE?');
    }

    modal.result.then((result) => {
        if (result) {
            if (deliveryRates.isActive) {
                deliveryRates = {
                    ...deliveryRates,
                    isActive: event,
                };
                this.facade.updatePreferenceDelivery(deliveryRates);
            } else {
                deliveryRates = {
                    ...deliveryRates,
                    isActive: event,
                };
                this.facade.updatePreferenceDelivery(deliveryRates);
            }
        } else {
            $('#isActiveitem' + deliveryRates.id).prop(
                'checked',
                deliveryRates.isActive,
            );
        }
    });
}

activeExpressDeliveryRates(event: any, deliveryRates: any) {
    const modal = this.modal.open(DeliveryModalConfirmationComponent, {
        centered: true,
        backdrop: 'static',
    });
    if (deliveryRates.express) {
        modal.componentInstance.title = this.translate.instant(
            'GENERAL.CONFIRM_REQUEST',
        );
        modal.componentInstance.message = this.translate.instant(
            'GENERAL.INACTIVE_EXPRESS?',
        );
    } else {
        modal.componentInstance.title = this.translate.instant(
            'GENERAL.CONFIRM_REQUEST',
        );
        modal.componentInstance.message = this.translate.instant(
            'GENERAL.ACTIVE_EXPRESS?',
        );
    }

    modal.result.then((result) => {
        if (result) {
            if (deliveryRates.express) {
                deliveryRates = {
                    ...deliveryRates,
                    express: event,
                };
                this.facade.updatePreferenceDelivery(deliveryRates);
            } else {
                deliveryRates = {
                    ...deliveryRates,
                    express: event,
                };
                this.facade.updatePreferenceDelivery(deliveryRates);
            }
        } else {
            $('#expresstem' + deliveryRates.id).prop('checked', deliveryRates.express);
        }
    });
  }

}

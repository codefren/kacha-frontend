import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { APP, AppPreferences, OR, OrdersPreferences } from '@optimroute/backend';
import { ToastService, dayTimeAsStringToSeconds } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare var $;

@Component({
  selector: 'easyroute-order-setting',
  templateUrl: './order-setting.component.html',
  styleUrls: ['./order-setting.component.scss']
})
export class OrderSettingComponent implements OnInit {
  
  timeOrderMax: number = -1;
  orderSyncTime: number = -1;

  ordersPreferences$: Observable<OrdersPreferences>;
  appPreferences$: Observable<AppPreferences>;


  unsubscribe$ = new Subject<void>();

  orderSyncEachTime: number;

  changeMaxTime: number;

  constructor(
    private facade: PreferencesFacade,
    private detectChange: ChangeDetectorRef,
    private toastService: ToastService,
    private translate: TranslateService,

  ) { }

  ngOnInit() {

    this.ordersPreferences$ = this.facade.ordersPreferences$;

    this.ordersPreferences$.pipe(takeUntil(this.unsubscribe$)).subscribe((or) => {
      if (or.orderMaxTime > 0) {
          this.timeOrderMax = or.orderMaxTime;
      }
      if (or.orderSyncTime > 0) {
          this.orderSyncTime = or.orderSyncTime;
      }

      this.orderSyncEachTime =
          or.orderSyncEachTime >= 0 ? Math.floor(or.orderSyncEachTime / 60) : 0;

          this.changeMaxTime =or.changeMaxTime ? or.changeMaxTime:null;
    });

    this.appPreferences$ = this.facade.appPreferences$;

  }

  clearOrderMaxTime() {
    this.timeOrderMax = undefined;
    this.facade.updateOrderMaxTime(-1);
    this.detectChange.detectChanges();
  }

  clearOrderSyncTime() {
    this.orderSyncTime = undefined;
    this.facade.updateOrderSyncTime(-1);
    this.detectChange.detectChanges();
  }

  toggleOrdersPreferences(key: OR, value: OrdersPreferences[OR]) {
    this.facade.toggleOrdersPreference(key, value);
  }

  updateChangeMaxTime() {

    if(this.changeMaxTime > 0 && this.changeMaxTime < 9999){
      this.toggleOrdersPreferences('changeMaxTime', this.changeMaxTime)
    }

  }

  updateOrderMaxTime(value) {
    this.facade.updateOrderMaxTime(dayTimeAsStringToSeconds(value));
  }

  updateOrderSyncTime(value) {
    this.facade.updateOrderSyncTime(dayTimeAsStringToSeconds(value));
  }

  updateOrderSyncEachTime() {
    this.facade.updateOrderSyncEachTime(this.orderSyncEachTime * 60);
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


}

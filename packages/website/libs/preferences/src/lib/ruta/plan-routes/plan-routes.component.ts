import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { BackendService, CP, ControlPanelPreferences, MN, ManagementPreferences, OP, OPA, OptimizationPreferences } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StatePreferencesService } from 'libs/state-preferences/src/lib/state-preferences.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { dayTimeAsStringToSeconds } from '../../../../../shared/src/lib/util-functions/day-time-to-seconds';
declare var $: any;
@Component({
  selector: 'easyroute-plan-routes',
  templateUrl: './plan-routes.component.html',
  styleUrls: ['./plan-routes.component.scss']
})
export class PlanRoutesComponent implements OnInit {
  
  DIRECTIONS: string;

  address: string;
  addressChanged = false;

  optimizationPreferences$: Observable<OptimizationPreferences>;
  controlPanelPreferences$: Observable<ControlPanelPreferences>;
  managementPreferences$: Observable<ManagementPreferences>;

  unsubscribe$ = new Subject<void>();

  daySelecter: any[]=[];
  
  constructor(
        private fb: FormBuilder,
        private facade: PreferencesFacade,
        private toastService: ToastService,
        private detectChange: ChangeDetectorRef,
        private _translate: TranslateService,
        private translate: TranslateService,
        private backendService: BackendService,
        private detectChanges: ChangeDetectorRef,
        private statePreferencesService: StatePreferencesService,
        private facadeProfile: ProfileSettingsFacade,
        private loading: LoadingService,
        config: NgbTimepickerConfig,
        private activatedRoute: ActivatedRoute,
        private modal: NgbModal,
        public authLocal: AuthLocalService,
  ) { }

  ngOnInit() {

    this.DIRECTIONS = this.translate.instant('PREFERENCES.MESSAGE.DIRECTIONS_STORE');

    this.optimizationPreferences$ = this.facade.optimizationPreferences$;

    this.optimizationPreferences$.pipe(takeUntil(this.unsubscribe$)).subscribe((op) => {

      this.address = op.warehouse.address;

      if (op.scheduledDay) {

        let split =  op.scheduledDay.replace(/[\. , ,]+/g, " ");

        let array2 = split.split(' ');
  
        this.daySelecter = array2;

      }

    

      /* this.minServiceTimeStatMinutes = Math.floor(op.minServiceTimeStat / 60);
      this.minServiceTimeStatSeconds = op.minServiceTimeStat % 60;

      this.maxServiceTimeStatMinutes = Math.floor(op.maxServiceTimeStat / 60);
      this.maxServiceTimeStatSeconds = op.maxServiceTimeStat % 60;


      if (op.defaultSettings.deliverySchedule.start !== undefined) {
          this.initialTime = secondsToDayTimeAsString(
              op.defaultSettings.deliverySchedule.start,
          );
      } else {
          this.initialTime = '00:00';
      }
      if (op.defaultSettings.deliverySchedule.end !== undefined) {
          this.finalTime = secondsToDayTimeAsString(
              op.defaultSettings.deliverySchedule.end,
          );
      } else {
          this.finalTime = '23:59';
      }
      this._initialTime = this.initialTime;
      this._finalTime = this.finalTime;
      this.createDeliveryPoints = op.createSession.createDeliveryPoints;
      this.updateDeliveryPoints = op.createSession.updateDeliveryPoints;
      this.createDeliveryZones = op.createSession.createDeliveryZones;
      this.createUnassignedZone = op.createSession.createUnassignedZone;
      this.setUnassignedZone = op.createSession.setUnassignedZone;
      this.traffic = JSON.parse(JSON.stringify(op.defaultSettings.traffic));

      this.quantityDelayModifySchedule = op.quantityDelayModifySchedule;
      this.delayWhenPassingTime = Math.floor(op.delayWhenPassingTime / 60);

      this.retrieveTimeValues();
      if (op.allowDelayTime ) {
          this.LoadAllowDelayTime();
      } */
    });

    this.controlPanelPreferences$ = this.facade.panelControlPreferencs$;

    this.managementPreferences$ = this.facade.managementPreferences$;

    this.facade.loadDashboardPreferences();

  }

  updateWarehouse() {
    if (this.addressChanged && this.address.length > 5) {
        this.addressChanged = false;
        this.facade.updateWarehouse(this.address);
    }
  }

  toggleOptimizationPreference(
    key: OP,
    value: OptimizationPreferences['createSession'][OP],
  ) {
      this.facade.toggleOptimizationPreference(key, value);
  }

  toggleControlPanelPreference(key: CP, value: ControlPanelPreferences[CP]) {
    this.facade.toggleControlPanelPreference(key, value);
  }

  toggleOptimizationAction(
    key: OPA,
    value: OptimizationPreferences[OPA],
  ) {
   
      this.facade.toggleOptimization(key, value);
  }

  toggleManagementPreference(key: MN, value: ManagementPreferences[MN]) {
    this.facade.toggleManagementPreferences(key, value);
  }

  updateChange(key: any , value: any){

    let senHourse = dayTimeAsStringToSeconds(value);

    if (senHourse != -1) {

      this.toggleOptimizationAction(key, senHourse);

    }

  }

  changeDaySelecter(event: any, numberDay: any , day: any){


    if (event) {

      switch (numberDay) {

          case '1':

              this.daySelecter.push(numberDay);

            break;

            case '2':

                this.daySelecter.push(numberDay);

              break;

              case '3':

                this.daySelecter.push(numberDay);

              break;

              case '4':

                this.daySelecter.push(numberDay);

              break;

              case '5':

                  this.daySelecter.push(numberDay);

              break;

              case '6':

                  this.daySelecter.push(numberDay);

                break;

              case '7':

                  this.daySelecter.push(numberDay);

                break;

        default:
          break;
      }
    } else {

      this.daySelecter = this.daySelecter.filter((x: any) => x != numberDay);

      this.detectChanges.detectChanges();

    }

    if (this.daySelecter.length > 0) {

      this.updateWeek(this.daySelecter);

    } else {

      $('#'+ day).prop('checked', true);

      this.daySelecter.push(numberDay);

      this.toastService.displayWebsiteRelatedToast(

        this.translate.instant('El campo día es requerido.'),

        this.translate.instant('GENERAL.ACCEPT'),

    );
    }

  }

  updateWeek( item:any,){

      let SendWeek = this.checkArray(item);

      this.toggleOptimizationAction('scheduledDay', SendWeek);

  }

  checkArray(data: any){
  
    let clearArray: any ='';

    if (data) {

      data.forEach((element: any, index: any) => {

        if (index === 0) {

          clearArray = clearArray.concat(element);

        } else {

          clearArray = clearArray.concat(',',element);

        }

      });

    }

    return clearArray;


  }

  showCheckWeek(item: any, selectWeek: any){

    let selectedWeek: any;

    if (item && item.length > 0) {

      selectedWeek = item.find((x :any) => Number(x) === selectWeek) ? true: false;

      return selectedWeek;

    } else {

      return false;

    }


  }

  validateEmil(enteredEmail:any){

    let mail_format = /\S+@\S+\.\S+/;

    if (enteredEmail && enteredEmail.value === '') {
      return null;
    }

    return mail_format.test(enteredEmail);

  }

  updateEmail(value: any){

    if(value && value != '' && value.length > 0){

      if (this.validateEmil(value)) {

        this.toggleOptimizationAction('emailNotLoadRoute', value);
        
      }

    }

  }


}

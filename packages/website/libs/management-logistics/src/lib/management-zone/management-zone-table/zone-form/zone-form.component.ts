import { take } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { DeliveryZoneMessages } from '../../../../../../shared/src/lib/messages/delivery-zone/delivery-zone.message';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { StateEasyrouteService } from '../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { DeliveryZone } from '@optimroute/backend';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { sliceMediaString } from '@optimroute/shared';
import * as _ from 'lodash';
import { StateDeliveryZonesFacade } from '../../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { Zone } from '../../../../../../backend/src/lib/types/delivery-zones.type';
declare function init_plugins();
@Component({
  selector: 'easyroute-zone-form',
  templateUrl: './zone-form.component.html',
  styleUrls: ['./zone-form.component.scss']
})
export class ZoneFormComponent implements OnInit {

  FormGroup: FormGroup;

  end: string;

  start: string;

  data: DeliveryZone;

  deliveryZone_messages: any;

  costDistance: string = 'costDistance';

  costDuration: string = 'costDuration';

  CostVehicleWaitTime: string = 'CostVehicleWaitTime';

  explorationLevel: string = 'explorationLevel';

  titleTranslate: string;

  deliveryZoneSpecificationType: any;

  showServiceType: boolean = true;

  AssociatePathList : any [] = [];

  idDelivery: any;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private fb: FormBuilder,
    private _translate: TranslateService,
    private loading: LoadingService,
    private _activatedRoute: ActivatedRoute,
    private stateEasyrouteService: StateEasyrouteService,
    private detectChanges: ChangeDetectorRef,
    private backendService: BackendService,
    private facade: StateDeliveryZonesFacade,
  ) { }

  ngOnInit() {

    this.load();

    setTimeout(() => {
      init_plugins();
  }, 1000); 
  }

  load() {

    this._activatedRoute.params.subscribe(params => {

      this.loading.showLoading();

      this.idDelivery =params['id'];

      if (params['id'] !== 'new') {


        this.stateEasyrouteService.getDeliveryZone(params['id']).pipe(take(1)).subscribe(

          (data: any) => {

            this.loading.hideLoading();

            this.data = data.data;

            this.getAssociatePath();

            this.initForm( this.data);

          },
          (error) => {

            this.loading.hideLoading();

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          },
        );



      } else {

        this.loading.hideLoading();

        this.data = new DeliveryZone();

        this.getAssociatePath();


        this.initForm(this.data);
      }

    });
  }

  getAssociatePath(){
    this.backendService.get(`delivery_zone/${this.idDelivery}`).pipe(take(1)).subscribe(
      ({ data }) => {
          this.AssociatePathList = data;
          console.log(this.AssociatePathList, 'varaible que tendra el valor del formulario')
      },
      (error) => {
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
  }

  async initForm(data: any) {
    
    let totalSeconds = data.settingsOptimizationParametersMaxDelayTime
        ? data.settingsOptimizationParametersMaxDelayTime
        : 0;

    let hours = Math.floor(totalSeconds / 3600);

    totalSeconds %= 3600;

    let minutes = Math.floor(totalSeconds / 60);

    let seconds = totalSeconds % 60;

    this.FormGroup = this.fb.group(
        {
            id: [data.id || ''],
            name: [
                data.name,
                [
                    Validators.required,
                    Validators.maxLength(50),
                ],
            ],
            color: [data.color, [Validators.required]],
            /* settingsDeliveryScheduleStart: [ data.zone.settingsDeliveryScheduleStart?
      secondsToDayTimeAsString(data.zone.settingsDeliveryScheduleStart):'00:00' ],
      
    settingsDeliveryScheduleEnd: [ data.zone.settingsDeliveryScheduleEnd?
      secondsToDayTimeAsString(data.zone.settingsDeliveryScheduleEnd):'00:00' ], */
            settingsForcedeparturetime: [data.settingsForcedeparturetime],
            settingsIgnorecapacitylimit: [data.settingsIgnorecapacitylimit],
            settingsUseallvehicles: [data.settingsUseallvehicles],
            settingsOptimizationParametersCostDistance: [
                data.settingsOptimizationParametersCostDistance
                    ? data.settingsOptimizationParametersCostDistance
                    : 0,
            ],
            settingsOptimizationParametersCostDuration: [
                data.settingsOptimizationParametersCostDuration
                    ? data.settingsOptimizationParametersCostDuration
                    : 0,
            ],
            settingsOptimizationParametersCostVehicleWaitTime: [
                data.settingsOptimizationParametersCostVehicleWaitTime
                    ? data.settingsOptimizationParametersCostVehicleWaitTime
                    : 0,
            ],
            settingsExplorationlevel: [
                data.settingsExplorationlevel
                    ? data.settingsExplorationlevel
                    : 1,
            ],

            order: [data.order, [Validators.required, Validators.min(1)]],
            showInWeb:[''],
            deliveryZoneSpecificationType: this.fb.array([]),
            free:[],
            associatedRoute:[data && data.associatedRoute ? data.associatedRoute : ''],
            isActive: [data.isActive]
            /*  hours: [hours],
    minutes:[minutes],
    seconds:[seconds] */
        },
        // { validator: this.checkStartAndEndTime }
    );

    let deliveryZone_messages = new DeliveryZoneMessages();

    this.deliveryZone_messages = deliveryZone_messages.getDeliveryZoneMessages();

    this.getSDeliveryZonepecificationtype();
    
    this.detectChanges.detectChanges();
  }

  openDeliveryZoneSpecificationType() {

    this.router.navigateByUrl('management-logistics/delivery-zones/specification');

  }

 /* delivery specification zone */

   

   getSDeliveryZonepecificationtype() {

    this.showServiceType = false;
  
    this.backendService.get('delivery_zone_specification_type').pipe(take(1)).subscribe((data ) => {
  
        this.deliveryZoneSpecificationType = data.data;
  
      
        this.showServiceType = true;

       
        this.getDeliveryZonepecificationVAlue();

        this.detectChanges.detectChanges();

    },(error) => {
  
        this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
        );
    });
  }

  getDeliveryZonepecificationVAlue() {

    this.deliveryZoneSpecificationType.map((o, i) => {

        let control: FormControl;

        if (this.data.deliveryZoneSpecificationType && this.data.deliveryZoneSpecificationType.length > 0) {

            control = new FormControl(

                this.data.deliveryZoneSpecificationType.find((x) => x.id === o.id) != undefined,

            );

        } else {

            control = new FormControl(false);
        }

        (this.FormGroup.controls.deliveryZoneSpecificationType as FormArray).push(control);
    });
    
  }

  getSpecificationVAlue() {

    let selectedFilterIds: any;
  
    if (this.deliveryZoneSpecificationType && this.deliveryZoneSpecificationType.length > 0) {

        selectedFilterIds = this.FormGroup.value.deliveryZoneSpecificationType

            .map((v, i) => v? this.deliveryZoneSpecificationType[i].id: null,
            )
            .filter((v) => v !== null);
    }
  
    return selectedFilterIds;
  }

  checkedSpecificationType(value, index){
    if(!value){
      if(+this.FormGroup.controls['associatedRoute'].value == this.deliveryZoneSpecificationType[index].name){
        this.FormGroup.controls['associatedRoute'].setValue('');
        this.FormGroup.controls['associatedRoute'].updateValueAndValidity();
      }
    }
  }


  returnSpecificationValues(){
    let specifcation = [];
    this.FormGroup.controls['deliveryZoneSpecificationType'].value.forEach((element, index) => {
      if(element){
        specifcation.push(this.deliveryZoneSpecificationType[index]);
      }
    });

    return specifcation;
  }

  changeCleanLibre(){

    let control: FormControl;
  
  
    let data = this.FormGroup.value.deliveryZoneSpecificationType.map((dato) =>{
  
        if(dato == true){
  
          dato = false;
        }
        
        return dato;
      });
  
    
    control = new FormControl(data);
  
    (this.FormGroup.controls.deliveryZoneSpecificationType as FormArray).setValue(data);
   
    this.FormGroup.get('deliveryZoneSpecificationType').updateValueAndValidity();
  
    this.detectChanges.detectChanges();
   
    
  }

  freeDisabled(){
   
    let disabledBtn = false;
  
    disabledBtn = this.FormGroup.value.deliveryZoneSpecificationType.find((x) => x === true) ? false :true;
    
    this.FormGroup.get('deliveryZoneSpecificationType').updateValueAndValidity();
   
   return disabledBtn;
  }

  sliceString(text: string) {

    return sliceMediaString(text, 24, '(min-width: 960px)');

  }

  isFormInvalid(): boolean {

    return !this.FormGroup.valid;

  }

  submit() {
    /* this.FormGroup.value.settingsDeliveryScheduleEnd;
  this.FormGroup.value.settingsDeliveryScheduleStart; */
    let time: number =
        this.FormGroup.value.hours * 3600 +
        this.FormGroup.value.minutes * 60 +
        this.FormGroup.value.seconds;
    let dataform = _.cloneDeep(this.FormGroup.value);
  
    delete dataform.hours;

    delete dataform.minutes;

    delete dataform.seconds;

    delete dataform.free;

    dataform.settingsOptimizationParametersMaxDelayTime = time;

    dataform.showInWeb = true;
    
    dataform.deliveryZoneSpecificationType =this.getSpecificationVAlue();
   // dataform.deliveryzone = dataform;
    /* dataform.settingsDeliveryScheduleStart = dayTimeAsStringToSeconds(this.FormGroup.value.settingsDeliveryScheduleStart);
  dataform.settingsDeliveryScheduleEnd = dayTimeAsStringToSeconds(this.FormGroup.value.settingsDeliveryScheduleEnd); */
    if (this.isFormInvalid()) {
        this.toastService.displayWebsiteRelatedToast('The zone is not valid'),
            this._translate.instant('GENERAL.ACCEPT');
    } else {
        if (!this.data.id || this.data.id === null) {

            this.addZone(dataform);

            this.facade.added$.subscribe((data) => {

                if (data) {

                  this.loading.hideLoading();

                  this.toastService.displayWebsiteRelatedToast(
                      this._translate.instant(
                          'DELIVERY_ZONES.CREATED_ROUTE',
                      ),

                      this._translate.instant('GENERAL.ACCEPT'),
                  );

                  this.router.navigateByUrl('management-logistics/delivery-zones');
                }
            });
        } else {

            this.updateZone([this.data.id, dataform]);

            this.facade.updated$.subscribe((data) => {

                if (data) {

                  this.loading.hideLoading();

                  this.toastService.displayWebsiteRelatedToast(

                      this._translate.instant(

                          'DELIVERY_ZONES.UPDATE_ROUTE',

                      ),

                      this._translate.instant('GENERAL.ACCEPT'),
                  );

                  this.router.navigateByUrl('management-logistics/delivery-zones');
                }
            });
        }
    }
  }

  addZone(zone: Zone) {
    
    this.facade.addDeliveryZone(zone);
  
  }

  updateZone(obj: [string, Partial<Zone>]) {
    
    this.facade.editDeliveryZone(obj[0], obj[1]);
  
  }

}

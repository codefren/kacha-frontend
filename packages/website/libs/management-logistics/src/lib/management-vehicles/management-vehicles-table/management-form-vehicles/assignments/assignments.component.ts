import { VehiclesFacade } from '@optimroute/state-vehicles';
import { TranslateService } from '@ngx-translate/core';
import { sliceMediaString, dayTimeAsStringToSeconds } from '@optimroute/shared';
import { Router } from '@angular/router';
import { Component, Input, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { StateEasyrouteService } from '../../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { LoadingService } from '../../../../../../../shared/src/lib/services/loading.service';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
import { Vehicle } from '../../../../../../../backend/src/lib/types/vehicles.type';
import { dateToObject } from '../../../../../../../shared/src/lib/util-functions/date-format';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { Observable, Subject } from 'rxjs';
import { DeliveryZones } from '../../../../../../../state-delivery-zones/src/lib/+state/delivery-zones.reducer';
import { Zone } from '../../../../../../../backend/src/lib/types/delivery-zones.type';
import { StateDeliveryZonesFacade } from '../../../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { take,takeUntil } from 'rxjs/operators';
import { secondsToDayTimeAsString } from '../../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { VehiclesMessages } from '../../../../../../../shared/src/lib/messages/vehicles/vehicles.message';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';

@Component({
  selector: 'easyroute-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})
export class AssignmentsComponent implements OnInit, OnChanges {

  @Input() idParan: any;

  assignmentsFormGroup: FormGroup;



  vehicles: any;

  zones: Observable<Zone[]>;

  zones$: Observable<DeliveryZones>;

  unsubscribe$ = new Subject<void>();

  vehicles_messages: any;

  BreakTime: any;

  vehicleServiceType: any;

  showServiceType: boolean = true;

  vehicleStopTypes: any = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService,
    private loading: LoadingService,
    private vehiclesFacade: VehiclesFacade,
    private toastService: ToastService,
    private backendService: BackendService,
    private service: StateUsersService,
    private detectChange: ChangeDetectorRef,
    private stateEasyrouteService: StateEasyrouteService,
    private zoneFacade: StateDeliveryZonesFacade,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
   this.validateRoute();
  // this.getUsers();
   this.zones$ = this.zoneFacade.state$;

   this.zones$.pipe(takeUntil(this.unsubscribe$)).subscribe((zoneState) => {
       if (zoneState.loaded) {
           this.zones = this.zoneFacade.allDeliveryZones$;
       }
   });
  }

    validateRoute() {
      if (this.idParan === 'new') {

        this.vehicles = new Vehicle();

    
       this.initForm(new Vehicle());

    } else {
       
        this.backendService.get(`vehicle/${this.idParan}`).subscribe(

            ({ data }) => {

                this.vehicles = data;
  
                this.vehicles.vehicleStopType = data.vehicleStopType;
  
                if (this.vehicles) {
                    if (this.vehicles.nextVehicleInspection !== null) {
                        this.vehicles.nextVehicleInspection = dateToObject(
                            this.vehicles.nextVehicleInspection,
                        );
                    }
  
                    this.initForm(this.vehicles);

                   
                }
            },
            (error) => {
                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }
      
  }
  initForm(data: Vehicle) {

    if (data.id > 0 && data.vehicleStopType.length > 0) {

        if (data.vehicleStopType[0].stopTypeId == 1) {

            data.vehicleStopType[0].amount = data.vehicleStopType[0].amount / 1000;

            data.vehicleStopType[0].restAmount = secondsToDayTimeAsString(

                data.vehicleStopType[0].restAmount.toString(),

            );

        } else {

            data.vehicleStopType[0].amount = secondsToDayTimeAsString(

                data.vehicleStopType[0].amount.toString(),

            );

            data.vehicleStopType[0].restAmount = secondsToDayTimeAsString(

                data.vehicleStopType[0].restAmount.toString(),

            );
            
        }
    }
  

    this.assignmentsFormGroup = this.fb.group({

        id: [data.id],
       
        vehicleType: [data.vehicleType ? data.vehicleType.id : 0],

        deliveryZoneId: [data.deliveryZoneId == null ? '' : data.deliveryZoneId],

        capacity: [data.capacity, [Validators.minLength(0), Validators.maxLength(50)]],
        
        weightLimit: [
            data.weightLimit,
            [Validators.minLength(0), Validators.maxLength(50)],
        ],
        
        userId: [data.userId ? data.userId : '', [Validators.required]],
       
        vehicleServiceType: this.fb.array([]),
       
        deliveryLimit: [data.deliveryLimit],

        stopRequired: [data.stopRequired],

        vehicleStopType: this.fb.group({
            
            stopTypeId: [
                data.vehicleStopType &&
                data.vehicleStopType[0] &&
                data.vehicleStopType[0].stopTypeId
                    ? data.vehicleStopType &&
                      data.vehicleStopType[0] &&
                      data.vehicleStopType[0].stopTypeId
                    : '',
                [Validators.required],
            ],

            amount: [
                data.vehicleStopType &&
                    data.vehicleStopType[0] &&
                    data.vehicleStopType[0].amount,
            ],

            restAmount: [
                data.vehicleStopType &&
                    data.vehicleStopType[0] &&
                    data.vehicleStopType[0].restAmount,
            ],
        }),
        
        free: [],

        isActive: [data.isActive],

    });
  
    this.assignmentsFormGroup.get('id').disable();
  
    if(!data.stopRequired) {
        (<FormGroup>(this.assignmentsFormGroup.get('vehicleStopType'))).get('stopTypeId').setValidators([]);
        (<FormGroup>(this.assignmentsFormGroup.get('vehicleStopType'))).get('stopTypeId').updateValueAndValidity();
    }
   
  
    if (data.id > 0 && data.vehicleStopType.length > 0) {
        if (data.vehicleStopType[0].stopTypeId == 1) {
            this.assignmentsFormGroup
                .get('vehicleStopType.amount')
                .setValidators([Validators.min(1), Validators.max(99999)]);
        }
    }
    /* if (this.createVehicleFormGroup.value.activateDeliverySchedule) {
  
        this.getScheduleSpecification();
    }  */
  
   
  
    let vehicles_messages = new VehiclesMessages();

    this.vehicles_messages = vehicles_messages.getVehiclesMessages();
   
   this.getServiceTypeVehicle();

   this.getBreakTime();
   
  }

  getBreakTime() {

    this.service.getBreakTime().subscribe(({ data }) => {

        this.BreakTime = data;

        
    });

  }
  

  changeStopRequired(value) {

    if (!value) {
        (<FormGroup>this.assignmentsFormGroup.get('vehicleStopType'))
            .get('stopTypeId')
            .setValidators([]);
        (<FormGroup>this.assignmentsFormGroup.get('vehicleStopType'))
            .get('stopTypeId')
            .updateValueAndValidity();
    } else {
        (<FormGroup>this.assignmentsFormGroup.get('vehicleStopType'))
            .get('stopTypeId')
            .setValidators([Validators.required]);
        (<FormGroup>this.assignmentsFormGroup.get('vehicleStopType'))
            .get('stopTypeId')
            .updateValueAndValidity();
    }
  }

  changeValidation(event: any) {
    if (event == 1) {
        
        this.assignmentsFormGroup.get('vehicleStopType.amount').reset();
        this.assignmentsFormGroup.get('vehicleStopType.restAmount').reset();

        this.assignmentsFormGroup
            .get('vehicleStopType.amount')
            .setValidators([Validators.min(1), Validators.max(99999)]);
    } else {
        this.assignmentsFormGroup.get('vehicleStopType.amount').reset();
        this.assignmentsFormGroup.get('vehicleStopType.restAmount').reset();
    }

    this.assignmentsFormGroup.get('vehicleStopType.amount').updateValueAndValidity();

    this.assignmentsFormGroup
        .get('vehicleStopType.restAmount')
        .updateValueAndValidity();
  }

   openServiceType(value: any) {
        //this.router.navigateByUrl('management-logistics/vehicles/servies-type');
        //this.router.navigate([`/management-logistics/vehicles/settings/${this.idParan}/${value}`]);
        this.router.navigateByUrl('/preferences?option=vehicleSpecification');
   }

   getServiceTypeVehicle() {

        this.showServiceType = false;
    
        this.service.loadVehiclesServiceType().subscribe(({ data }) => {

            this.showServiceType = true;
    
            this.vehicleServiceType = data;
    
    
            this.addFilter();
        });
    }
     /* funcion de agregar filtros */
     addFilter() {

        this.vehicleServiceType.map((o, i) => {

            let control: FormControl;

            if (this.vehicles.vehicleServiceType.length > 0) {

                control = new FormControl(

                    this.vehicles.vehicleServiceType.find((x) => x.id === o.id) !=

                        undefined,
                );

            } else {

                control = new FormControl(false);

            }

            (this.assignmentsFormGroup.controls.vehicleServiceType as FormArray).push(
                control,
            );
        });
    }

    freeDisabled() {

        let disabledBtn = false;

        disabledBtn = this.assignmentsFormGroup.value.vehicleServiceType.find(
            (x) => x === true,
        )
            ? false
            : true;
        this.assignmentsFormGroup.get('vehicleServiceType').updateValueAndValidity();

        return disabledBtn;
    }

    sliceString(text: string) {

        return sliceMediaString(text, 24, '(min-width: 960px)');

    }

    changeCleanLibre() {

        let control: FormControl;

        let data = this.assignmentsFormGroup.value.vehicleServiceType.map((dato) => {
            if (dato == true) {
                dato = false;
            }

            return dato;
        });

        control = new FormControl(data);

        (this.assignmentsFormGroup.controls.vehicleServiceType as FormArray).setValue(
            data,
        );

        this.assignmentsFormGroup.get('vehicleServiceType').updateValueAndValidity();

        this.detectChange.detectChanges();

    }

    getFilterVAlue() {

        let selectedFilterIds: any;

        if (this.vehicleServiceType && this.vehicleServiceType.length > 0) {

            selectedFilterIds = this.assignmentsFormGroup.value.vehicleServiceType

                .map((v, i) => (v ? this.vehicleServiceType[i].id : null))

                .filter((v) => v !== null);
        }

        return selectedFilterIds;
    }

    submit() {

        const formValues = this.assignmentsFormGroup.value;

        if (this.assignmentsFormGroup.value.vehicleStopType.stopTypeId == 1) {
            formValues.vehicleStopType.amount =
                this.assignmentsFormGroup.value.vehicleStopType.amount * 1000;
            formValues.vehicleStopType.restAmount = dayTimeAsStringToSeconds(
                this.assignmentsFormGroup.value.vehicleStopType.restAmount,
            );
            this.vehicleStopTypes.push({
                stopTypeId: +this.assignmentsFormGroup.value.vehicleStopType.stopTypeId,
                amount: this.assignmentsFormGroup.value.vehicleStopType.amount
                    ? this.assignmentsFormGroup.value.vehicleStopType.amount
                    : 0,
                restAmount: this.assignmentsFormGroup.value.vehicleStopType.restAmount
                    ? this.assignmentsFormGroup.value.vehicleStopType.restAmount
                    : 0,
            });
        } else if (this.assignmentsFormGroup.value.vehicleStopType.stopTypeId == 2) {
            formValues.vehicleStopType.amount = dayTimeAsStringToSeconds(
                this.assignmentsFormGroup.value.vehicleStopType.amount,
            );
            formValues.vehicleStopType.restAmount = dayTimeAsStringToSeconds(
                this.assignmentsFormGroup.value.vehicleStopType.restAmount,
            );
            this.vehicleStopTypes.push({
                stopTypeId: +this.assignmentsFormGroup.value.vehicleStopType.stopTypeId,
                amount: this.assignmentsFormGroup.value.vehicleStopType.amount
                    ? this.assignmentsFormGroup.value.vehicleStopType.amount
                    : 0,
                restAmount: this.assignmentsFormGroup.value.vehicleStopType.restAmount
                    ? this.assignmentsFormGroup.value.vehicleStopType.restAmount
                    : 0,
            });
        } else {
            this.vehicleStopTypes = [];
        }

    
        if (!this.vehicles || !this.vehicles.id || this.vehicles.id === null) {
            let vehicle = this.confirmAddition(this.assignmentsFormGroup);

            vehicle['schedule'] = formValues.schedule ? formValues.schedule : null;
            vehicle['scheduleSpecification'] = formValues.scheduleSpecification
                ? formValues.scheduleSpecification
                : null;
            if (!this.assignmentsFormGroup.value.activateDeliverySchedule) {
                formValues.schedule = [];
                formValues.scheduleSpecification = [];
                vehicle['deliveryPointScheduleTypeId'] = formValues.activateDeliverySchedule
                    ? formValues.deliveryPointScheduleTypeId
                    : null;
            }

           
            this.addVehicle(vehicle);

            this.vehiclesFacade.added$.pipe(take(2)).subscribe((data) => {

                if (data) {

                    this.toastService.displayWebsiteRelatedToast(

                        this.translate.instant('GENERAL.REGISTRATION'),

                        this.translate.instant('GENERAL.ACCEPT'),

                    );

                    this.router.navigate(['management-logistics/vehicles']);
                }
            });

        } else {

            delete formValues.schedule;

            delete formValues.scheduleSpecification;

            let vehicle = this.confirmAddition(this.assignmentsFormGroup);

            if (!this.assignmentsFormGroup.value.activateDeliverySchedule) {

                vehicle['deliveryPointScheduleTypeId'] = formValues.activateDeliverySchedule

                    ? formValues.deliveryPointScheduleTypeId

                    : null;
            }
            
            this.vehiclesFacade.editVehicle(this.vehicles.id, vehicle);

            this.vehiclesFacade.updated$.pipe(take(2)).subscribe((data) => {

                if (data) {

                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );

                    this.router.navigate(['management-logistics/vehicles']);
                }
            });
        }
    }
    
    confirmAddition(form): Vehicle {

        let deliveryZoneId = form.get('deliveryZoneId').value;

        let datos: Vehicle = {
           
            deliveryZoneId: deliveryZoneId.length === 0 ? null : deliveryZoneId,
           
            capacity: +form.get('capacity').value,

            weightLimit: form.get('weightLimit').value
                ? +form.get('weightLimit').value
                : null,

            userId:
                form.get('userId').value == 'null' || form.get('userId').value === 0
                    ? null
                    : form.get('userId').value,
            vehicleTypeId:
                form.get('vehicleType').value == 0 ? null : form.get('vehicleType').value,
            
            vehicleServiceType: this.getFilterVAlue(),
           
            deliveryLimit: form.get('deliveryLimit').value
                ? form.get('deliveryLimit').value
                : null,
            stopRequired: form.get('stopRequired').value
                ? form.get('stopRequired').value
                : false,
            vehicleStopType: this.vehicleStopTypes,
           
            isActive: form.get('isActive').value ? form.get('isActive').value : false,
        };

        return datos;
    }

    addVehicle(vehicle: Vehicle) {
        this.vehiclesFacade.addVehicle(vehicle);
    }
}

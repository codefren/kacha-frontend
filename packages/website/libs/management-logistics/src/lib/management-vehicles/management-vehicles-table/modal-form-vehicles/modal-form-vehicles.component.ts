import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { dateToObject, getToday, objectToString } from '../../../../../../shared/src/lib/util-functions/date-format';
import { OptimizationPreferences } from '../../../../../../backend/src/lib/types/preferences.type';
import { PreferencesFacade } from '../../../../../../state-preferences/src/lib/+state/preferences.facade';
import { secondsToDayTimeAsString, dayTimeAsStringToSeconds } from '../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { Vehicle } from '../../../../../../backend/src/lib/types/vehicles.type';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import { VehiclesMessages } from '@optimroute/shared';

import * as _ from 'lodash';

@Component({
  selector: 'easyroute-modal-form-vehicles',
  templateUrl: './modal-form-vehicles.component.html',
  styleUrls: ['./modal-form-vehicles.component.scss']
})
export class ModalFormVehiclesComponent implements OnInit,OnDestroy {

    // Observables
    optimizationPreferences$: Observable<OptimizationPreferences>;
    unsubscribe$ = new Subject<void>();

    createVehicleFormGroup: FormGroup;
    data:any;
    dateFormate: any;
    dateNow: NgbDateStruct = dateToObject(getToday());
    deliveryWIndowsEnd: string ='deliveryWIndowsEnd';
    deliveryWIndowsStart:string ='deliveryWIndowsStart';
    dischargingMinutes: number;
    dischargingMinutesChanged = false;
    dischargingSeconds: number;
    dischargingSecondsChanged = false;
    initialTime: string;
    finalTime: string;
    startDateSeleccionado: NgbDate;
    vehicles: Vehicle;
    vehiclesType: any[];
    vehicles_messages: any;
    _initialTime: string;
    _finalTime: string;

    constructor(
        public activeModal: NgbActiveModal,
        private facade: PreferencesFacade,
        private vehiclesFacade: VehiclesFacade,
        private fb: FormBuilder,
        private service: StateUsersService,
    ) { }

    ngOnInit() {
        this.getVehicleType();
      
        if (this.data.edit) {
            if(this.data.Vehicle.nextVehicleInspection !== null){
                this.data.Vehicle.nextVehicleInspection = dateToObject( this.data.Vehicle.nextVehicleInspection);
            }
      
            this.initForm(this.data.Vehicle);
        } else {
            this.initForm(new Vehicle());
        }
    }

    initForm(data: Vehicle) {
        let starttotalSeconds = +data.deliveryWindowStart ? data.deliveryWindowStart:0;
        starttotalSeconds %= 3600;
        let startminutes = Math.floor(starttotalSeconds / 60);
        let startseconds = starttotalSeconds % 60;
        let endtotalSeconds = +data.deliveryWindowEnd? data.deliveryWindowEnd:0;
        let endhours = Math.floor(endtotalSeconds / 3600);
        endtotalSeconds %= 3600;
        let endminutes = Math.floor(endtotalSeconds / 60);
        let endseconds = endtotalSeconds % 60;

        this.createVehicleFormGroup = this.fb.group({
            name: [
                data.name, 
                [Validators.required,Validators.minLength(2), Validators.maxLength(50)]
            ],
            vehicleType: [
                data.vehicleType ? data.vehicleType.id :0
            ],
            deliveryZoneId:[
                data.deliveryZoneId == null ? '' : data.deliveryZoneId,
            ],
            capacity: [
                data.capacity,
                [Validators.minLength(0), Validators.maxLength(50)],
            ],
            registration: [ 
                data.registration,
                [Validators.minLength(2), Validators.maxLength(10)]
            ],
            weightLimit: [
                data.weightLimit,
                [Validators.minLength(0), Validators.maxLength(50)],
            ],
            nextVehicleInspection: [
                data.nextVehicleInspection,
            ],
            userId:[
                data.userId == null ? '' : data.userId,
                [Validators.required]
            ],
            deliveryWindowEnd: [
                data.deliveryWindowEnd ? secondsToDayTimeAsString(data.deliveryWindowEnd) : secondsToDayTimeAsString(86399),
            ],
            deliveryWindowStart: [
                data.deliveryWindowStart ? secondsToDayTimeAsString(data.deliveryWindowStart) : secondsToDayTimeAsString(0),
            ]
        }); 
    
        this.createVehicleFormGroup.controls['deliveryWindowStart'].setValidators([
            this.ValidatorWindowsStart.bind( this.createVehicleFormGroup )
        ]);

        this.createVehicleFormGroup.controls['deliveryWindowEnd'].setValidators([
            this.ValidatorWindowsEnd.bind( this.createVehicleFormGroup )
        ]);

        let vehicles_messages = new VehiclesMessages();
        this.vehicles_messages = vehicles_messages.getVehiclesMessages();
    }

    startDateSelect(event: any){
        let dateformat = objectToString(event);
    
        this.dateFormate = dateformat;
    }

    ValidatorWindowsStart ( control: FormControl ): {  [s: string ]: boolean } {
        let formulario: any = this;
    
        if ( control.value === formulario.controls['deliveryWindowEnd'].value ) {
            return {
                confirmar: true
            };
        } else if ( control.value > formulario.controls['deliveryWindowEnd'].value ) {
            return {
                sutrast: true
            };
        }
    
        return null;
    }

    ValidatorWindowsEnd ( control: FormControl ): {  [s: string ]: boolean } {
        let formulario: any = this;
    
        if ( control.value < formulario.controls['deliveryWindowStart'].value ) {
            return {
                sutrast: true
            };
        } else if (control.value === formulario.controls['deliveryWindowStart'].value ) {
            return {
                confirmar: true
            };
        }
    
        return null;
    }
  
    changetime(event: any ,name :string){
        if ( event.target.value === '' ) {
            switch (name) {
                case "deliveryWIndowsStart":
                    this.createVehicleFormGroup.get('deliveryWindowStart').setValue(secondsToDayTimeAsString(0));
                    this.createVehicleFormGroup.get('deliveryWindowStart').updateValueAndValidity();
                    break;
          
                case "deliveryWIndowsEnd":
                    this.createVehicleFormGroup.get('deliveryWindowEnd').setValue(secondsToDayTimeAsString(86399));
                    this.createVehicleFormGroup.get('deliveryWindowEnd').updateValueAndValidity();
                    break;
          
                default:
                    break;
            }
        } else {
            this.createVehicleFormGroup.get('deliveryWindowStart').updateValueAndValidity();
      
            this.createVehicleFormGroup.get('deliveryWindowEnd').updateValueAndValidity();
        }
    }
  
    submit(){
        this.createVehicleFormGroup.controls['nextVehicleInspection'].setValue(objectToString(this.createVehicleFormGroup.controls['nextVehicleInspection'].value));
    
        this.createVehicleFormGroup.get('deliveryWindowStart').setValue(dayTimeAsStringToSeconds(
            this.createVehicleFormGroup.value.deliveryWindowStart,
        ));
    
        this.createVehicleFormGroup.get('deliveryWindowEnd').setValue(dayTimeAsStringToSeconds(
            this.createVehicleFormGroup.value.deliveryWindowEnd,
        ));
    
        if ( !this.data.Vehicle ||  !this.data.Vehicle.id || this.data.Vehicle.id === null) {
            let vehicle = this.confirmAddition(this.createVehicleFormGroup);
      
            this.addVehicle( vehicle );
      
            this.vehiclesFacade.added$.subscribe((data) => {
                if (data) {
                    this.activeModal.close([true,[]]);
                }
            });
        } else {
            let vehicle = this.confirmAddition(this.createVehicleFormGroup);
      
            this.vehiclesFacade.editVehicle(this.data.Vehicle.id, vehicle );
      
            this.vehiclesFacade.updated$.subscribe((data) => {
                if (data) {
                    this.activeModal.close([true,[]]);
                }
            });
        }
    }
  
    confirmAddition(form): Vehicle {
        let deliveryZoneId = form.get('deliveryZoneId').value;
    
        let datos: Vehicle = {
            name: form.get('name').value,
            deliveryZoneId: deliveryZoneId.length === 0 ? null : deliveryZoneId,
            capacity: +form.get('capacity').value,
            weightLimit: form.get('weightLimit').value ? +form.get('weightLimit').value : null,
            registration: form.get('registration').value ? form.get('registration').value : null,
            nextVehicleInspection: form.get('nextVehicleInspection').value ? form.get('nextVehicleInspection').value : null,
            userId:form.get('userId').value == "null" || form.get('userId').value === 0 ? null : form.get('userId').value,
            vehicleTypeId: form.get('vehicleType').value == 0 ? null : form.get('vehicleType').value,
            deliveryWindowEnd: form.get('deliveryWindowEnd').value >0 ?form.get('deliveryWindowEnd').value:86399,
            deliveryWindowStart: form.get('deliveryWindowStart').value >0 ?form.get('deliveryWindowStart').value:0
        };
    
        return datos;
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
    
        this.unsubscribe$.complete();
    }
    
    addVehicle(vehicle: Vehicle) {
        this.vehiclesFacade.addVehicle(vehicle);
    }
  
    editVehicle(obj: [number, Partial<Vehicle>]) {
        this.vehiclesFacade.editVehicle(obj[0], obj[1]);
    }

    getVehicleType() {
        this.service
            .loadVehiclesType()
            .pipe(take(1))
            .subscribe((data) => {
                this.vehiclesType = data.data;
            });
    }
}

import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import {
    NgForm,
    FormControl,
    FormGroupDirective,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    ToastService,
    secondsToDayTimeAsString,
    dayTimeAsStringToSeconds,
    ValidateCompanyId,
    UtilData,
    DeliveryZoneNameMessages,
} from '@optimroute/shared';
import { StatePointsFacade } from '@easyroute/state-points';
import { Point, Zone, BackendService, AssociatedCompany } from '@optimroute/backend';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { StateDeliveryZonesFacade, DeliveryZones } from '@optimroute/state-delivery-zones';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { TranslateService } from '@ngx-translate/core';

class Matcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null,
    ): boolean {
        const isSubmitted = form && form.submitted;
        return !!(
            control &&
            control.invalid &&
            (control.dirty || control.touched || isSubmitted)
        );
    }
}

@Component({
    selector: 'easyroute-management-clients-form',
    templateUrl: './management-clients-form.component.html',
    styleUrls: ['./management-clients-form.component.scss'],
})

export class ManagementClientsFormComponent implements OnInit, OnDestroy {
    FormGroup: FormGroup;
    matcher = new ErrorStateMatcher();
    unsubscribe$ = new Subject<void>();
    zones$: Observable<DeliveryZones>;
    zones: Observable<Zone[]>;
    loadedZones: boolean = false;
    data: any;
    deliveryZoneName_messages: any;
    showSelect: boolean = false;
    showcompanys: boolean = false;
    showAddress: boolean = true;
    focus: boolean;
    deliveryWIndowsStart:string ='deliveryWIndowsStart';
    deliveryWIndowsEnd: string ='deliveryWIndowsEnd';
    sutrast: boolean = false;
    confirmar: boolean = false;
    associatedCompany: AssociatedCompany[] = [];
    countrys: any = [];
    countrysWithCode: any = [];
    countrysWithPhone: any = [];
    prefix: any = '';

    constructor(
        private toastService: ToastService,
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private zoneFacade: StateDeliveryZonesFacade,
        private easyRouteFacade: StateEasyrouteFacade,
        private facade: StatePointsFacade,
        private detectChange: ChangeDetectorRef,
        private backendService: BackendService,
        private profileFacade: ProfileSettingsFacade,
        private _translate: TranslateService
    ) {}
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    ngOnInit() {

        this.countrys = UtilData.getCountry();
        this.countrysWithPhone = UtilData.getCountryPhoneCode();
        this.countrysWithCode = UtilData.getCountryWithCode();
        this.profileFacade.profile$.subscribe((data) => {
            if (data) {
                this.prefix = this.countrysWithPhone
                    .find(x => x.country === data.company.countryCode) ? '+' + this.countrysWithPhone
                        .find(x => x.country === data.company.countryCode).code : '+34';
                this.initForm(this.data);
            }
        });
        this.easyRouteFacade.isAuthenticated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((isAuthenticated) => {
                if (isAuthenticated) {
                    this.zoneFacade.loadAll();
                }
            });
        this.zones$ = this.zoneFacade.state$;
        this.zones$.pipe(takeUntil(this.unsubscribe$)).subscribe((zoneState) => {
            if (zoneState.loaded) {
                this.showSelect = true;
                this.zones = this.zoneFacade.allDeliveryZones$;
                this.loadedZones = true;
            }
        });
    }
    async initForm(data: any) {
        console.log(data.point.companyAssociatedId,'datos de llegada');
        let totalSeconds = +data.point.leadTime;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        // delayTime
        let totalSeconds_delay = +data.point.allowedDelayTime;
        let hours_delay = Math.floor(totalSeconds_delay / 3600);
        totalSeconds_delay %= 3600;
        let minutes_delay = Math.floor(totalSeconds_delay / 60);
        let seconds_delay = totalSeconds_delay % 60;

        let disabledId = data.point.id ? true : false;
        this.FormGroup = this.fb.group(
            {
                id: [ data.point.id, [Validators.required]],
                name: [data.point.name, [Validators.required]],
                address: [data.point.address, [Validators.required]],
                demand: [data.point.demand, [Validators.required]],
                serviceTimeMinute: [
                    parseInt('' + data.point.serviceTime / 60),
                    [Validators.required, Validators.min(0), Validators.max(59)],
                ],
                serviceTimeSeconds: [
                    Math.round(((data.point.serviceTime / 60) % 1) * 60),
                    [Validators.required, Validators.min(0), Validators.max(24 * 60 - 1)],
                ],
                keyOpen: [data.point.keyOpen, [Validators.required]],
                deliveryWindowStart: [
                    data.point.deliveryWindowStart
                        ? secondsToDayTimeAsString(data.point.deliveryWindowStart)
                        : secondsToDayTimeAsString(0),
                ],
                deliveryWindowEnd: [
                    data.point.deliveryWindowEnd
                        ? secondsToDayTimeAsString(data.point.deliveryWindowEnd)
                        : secondsToDayTimeAsString(86399),
                ],
                postalCode: [data.point.postalCode],
                province: [data.point.province],
                phoneNumber: [
                    data.point.phoneNumber ? data.point.phoneNumber : this.prefix,
                ],
                email: [data.point.email, [Validators.email]],
                deliveryZoneId: [data.point.deliveryZoneId, [Validators.required]],
                coordinatesLatitude: [data.point.coordinatesLatitude, [Validators.required, Validators.pattern('^-?[0-9]{1,3}(?:\.[0-9]{0,14})?$')]],
                coordinatesLongitude: [data.point.coordinatesLongitude, [Validators.required, Validators.pattern('^-?[0-9]{1,3}(?:\.[0-9]{0,14})?$')]],
                nif: [data.point.nif],
                hours: [hours ? hours : 0],
                minutes: [minutes ? minutes : 0],
                seconds: [seconds ? seconds : 0],
                hours_delay: [hours_delay ? hours_delay : 0],
                minutes_delay: [minutes_delay ? minutes_delay : 0],
                seconds_delay: [seconds_delay ? seconds_delay : 0],
                sendDeliveryNoteMail: [data.point.sendDeliveryNoteMail],
                companyAssociatedId: [data.point.companyAssociatedId ? data.point.companyAssociatedId: null],
            },
            { validator: this.checkStartAndEndTime },
        );

        this.changeSendDeliveryNoteMail(this.FormGroup.get('sendDeliveryNoteMail').value)

        this.FormGroup.controls['deliveryWindowStart'].setValidators([
            this.ValidatorWindowsStart.bind( this.FormGroup )
        ]);
      
        this.FormGroup.controls['deliveryWindowEnd'].setValidators([
            this.ValidatorWindowsEnd.bind( this.FormGroup )
        ]);

        this.backendService.get('company_associated_list').subscribe(
        ( response ) => {
            this.associatedCompany = response.data;
            this.showcompanys = true;      
        });

        let deliveryZoneName_messages = new DeliveryZoneNameMessages();
        this.deliveryZoneName_messages = deliveryZoneName_messages.getDeliveryZoneNameMessages();
    }

    addPoint(point: Point) {
        this.facade.addPoint(point);
    }

    updatePoint(obj: [string, Partial<Point>]) {
        this.facade.editPoint(obj[0], obj[1]);
    }

    closeDialog(value: any) {
        this.activeModal.close(value);
    }

    isFormInvalid(): boolean {
        return !this.FormGroup.valid;
    }

    submit() {
        this.FormGroup.value.deliveryWindowStart;
        this.FormGroup.value.deliveryWindowEnd;
        let time: number =
            this.FormGroup.value.hours * 3600 +
            this.FormGroup.value.minutes * 60 +
            this.FormGroup.value.seconds;
        
        let timeDelay: number = this.FormGroup.value.hours_delay * 3600 +
        this.FormGroup.value.minutes_delay * 60 +
        this.FormGroup.value.seconds_delay;
        
        let dataform = _.cloneDeep(this.FormGroup.value);
        console.log(dataform.companyAssociatedId,'consola de company');
        delete dataform.serviceTimeMinute;
        delete dataform.serviceTimeSeconds;
        delete dataform.hours;
        delete dataform.minutes;
        delete dataform.seconds;
        delete dataform.hours_delay;
        delete dataform.minutes_delay;
        delete dataform.seconds_delay;
        if (dataform.companyAssociatedId == '' || dataform.companyAssociatedId == 'null') {
            dataform.companyAssociatedId = null;
        }
        
        dataform.deliveryWindowStart = dayTimeAsStringToSeconds(
            this.FormGroup.value.deliveryWindowStart,
        );
        dataform.deliveryWindowEnd = dayTimeAsStringToSeconds(
            this.FormGroup.value.deliveryWindowEnd,
        );
        dataform.serviceTime =
            this.FormGroup.value.serviceTimeMinute * 60 +
            this.FormGroup.value.serviceTimeSeconds;
        dataform.leadTime = time;
        dataform.allowedDelayTime = timeDelay;
    
        this.zones.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
            dataform.deliveryZoneCompanyId = data.find((x:any) => x.id == dataform.deliveryZoneId).Company.id;
        });

        if (this.isFormInvalid()) {
            this.toastService.displayWebsiteRelatedToast('The point is not valid'),this._translate.instant('GENERAL.ACCEPT');
        } else {
            if (!this.data.point.id || this.data.point.id === null) {
                this.addPoint(dataform);
                this.facade.added$.subscribe((data) => {
                    if (data) {
                        this.closeDialog([true, this.FormGroup.value]);
                    } else {
                        console.log('cuando es error');
                    }
                },(error)=>{
                    console.log(error, 'error cuando es cerrar crear');
                        //this._toastService.errors(error.error);
                    
                      });
            } else {
                this.updatePoint([this.data.point.id, dataform]);
                this.facade.updated$.subscribe((data) => {
                    if (data) {
                        this.closeDialog([true, this.FormGroup.value]);
                    } else {
                        console.log('cuadn es error');
                    }
                },(error)=>{
                console.log(error, 'error cuando es cerrar actualizar');
                    //this._toastService.errors(error.error);
                
                  });
            }
        }
    }

    checkStartAndEndTime(group: FormGroup) {
        // here we have the 'passwords' group
        let start = dayTimeAsStringToSeconds(group.controls.deliveryWindowStart.value);
        let end = dayTimeAsStringToSeconds(group.controls.deliveryWindowEnd.value);
        let valueEnd = end == -1 ? true : false;
        let valueStart = start == -1 ? true : false;
        return end >= start || valueEnd || valueStart ? null : { same: true };
    }

    changeSendDeliveryNoteMail(value: any) {
        this.focus = false;

        if (value) {
            this.FormGroup.get('email').setValidators([
                Validators.required,
                Validators.email
            ]);

            this.FormGroup.get('email').updateValueAndValidity();
            
           if(!this.FormGroup.get('email').value){
                this.focus = true;
           };

        } else {

            this.FormGroup.get('email').setValidators(null);
            this.FormGroup.get('email').updateValueAndValidity();

            this.FormGroup.controls['email'].setValidators([
                Validators.email
            ]);
        }

        this.detectChange.detectChanges();

    }

    changeEmailFocus()
    {
        this.focus = false;
    }
    
    ValidatorWindowsStart ( control: FormControl ): {  [s: string ]: boolean } {

        let formulario: any = this;
        if ( control.value === formulario.controls['deliveryWindowEnd'].value ) {
          return {
            confirmar: true
          };
        } else if(  control.value > formulario.controls['deliveryWindowEnd'].value){
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
        } else if(control.value === formulario.controls['deliveryWindowStart'].value){
          return {
            confirmar: true
          };
        }
        return null;
       
    }

    changetime(event: any, name :string){

        if(event.target.value === ''){
          switch (name) {
            case "deliveryWIndowsStart":
              this.FormGroup.get('deliveryWindowStart').setValue(secondsToDayTimeAsString(0));
              this.FormGroup.get('deliveryWindowStart').updateValueAndValidity();
              break;
              case "deliveryWIndowsEnd":
                this.FormGroup.get('deliveryWindowEnd').setValue(secondsToDayTimeAsString(86399));
                this.FormGroup.get('deliveryWindowEnd').updateValueAndValidity();
              break;
              default:
            break;
          }
        } else {
            this.FormGroup.get('deliveryWindowStart').updateValueAndValidity();
            this.FormGroup.get('deliveryWindowEnd').updateValueAndValidity();
        }

    }

    searchAddress() {

        let addressData = this.FormGroup.get('address').value;
        this.showAddress = false;
            
        if( addressData ) {

            this.backendService.get('delivery_point_search_address?address='+ addressData).subscribe(
            ( response ) => {
                this.FormGroup.controls['address'].setValue(response[0].address);
                this.FormGroup.controls['coordinatesLatitude'].setValue((+response[0].coordinates.latitude).toPrecision(15));
                this.FormGroup.controls['coordinatesLongitude'].setValue((+response[0].coordinates.longitude).toPrecision(15));
                this.showAddress = true;
            },
                (error) => {
                    console.log(error);
                this.toastService.displayHTTPErrorToast(error.error.code, error.error);
                this.showAddress = true;
            });

        } else {
            this.toastService.displayWebsiteRelatedToast('Debe indicar la dirección.'),this._translate.instant('GENERAL.ACCEPT');
            this.showAddress = true;
        }

            

    }

}

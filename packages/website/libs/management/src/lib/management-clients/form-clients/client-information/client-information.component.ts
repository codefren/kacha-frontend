import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatePointsFacade } from '@easyroute/state-points';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AllowDelayTime, BackendService, OptimizationPreferences, Point} from '@optimroute/backend';
import { dayTimeAsStringToSeconds, DeliveryZoneNameMessages, DurationPipe, LoadingService, secondsToDayTimeAsString, sliceMediaString, ToastService, UtilData, ValidatePhone } from '@optimroute/shared';
import { StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import { ModalDirectionsComponent } from '../modal-directions/modal-directions.component';
import { ModalObservationsComponent } from '../modal-observations/modal-observations.component';
import { environment } from '@optimroute/env/environment';
import { ModalConfirmPhoneComponent } from '../modal-confirm-phone/modal-confirm-phone.component';
import { ModalActivityRegisterComponent } from '../modal-activity-register/modal-activity-register.component';

declare function init_plugins();
declare var $: any;

@Component({
  selector: 'easyroute-client-information',
  templateUrl: './client-information.component.html',
  styleUrls: ['./client-information.component.scss']
})
export class ClientInformationComponent implements OnInit {
  
  @Input() idParam: any;
  @Input() isActiveClient: boolean;
  @Input() franchiseImages: any;
  
  @Input('point') point: Point;    
  @Output('clients') clients: EventEmitter<any> = new EventEmitter();


  pointInformationForm: FormGroup;
  deliveryZoneName_messages: any;

  unsubscribe$ = new Subject<void>();
  optimizationPreferences$: Observable<OptimizationPreferences>;

  allowDelayTime: AllowDelayTime[] = [];
  showDelaySeccion: boolean = false;

  countrys: any[] = [];
  countrysWithCode: any[] = [];
  countrysWithPhone: any[] = [];

  //associatedCompany: AssociatedCompany[] = [];
  showcompanys: boolean = false;

  listSecundaryPhone: any = [];
  //userAgent: any[];
  
  companyProfileTypeId: number;

  dateCreatedAt: any;
  dateDisabledAt: any;

  focus: boolean;
  prefix: any = '';

  paymentTypeId: any[];
  paymentShow: boolean = false;

  showStatusDeliveryPoint: boolean = true;
  statusDeliveryPoint: any;

  addresses: any = [];
  phone: any = [];

  companyTimeZone: any[] = [];

  listDirecctions: any = [];
  showAddress: boolean = true;

  listObservation: any = []; // En editar
  observation: any = []; // En agregar
  table: any;


  constructor(
    private _activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private fb: FormBuilder,
    private profileFacade: ProfileSettingsFacade,
    private backendService: BackendService,
    private easyRouteFacade: StateEasyrouteFacade,
    private zoneFacade: StateDeliveryZonesFacade,
    private detectChanges: ChangeDetectorRef,
    private loadingService: LoadingService,
    private facade: StatePointsFacade,
    private preferencesFacade: PreferencesFacade,
    private translate: TranslateService,
    private router: Router,
    public durationPipe: DurationPipe,
    private _modalService: NgbModal,
    public authLocal: AuthLocalService,
    private stateEasyrouteService: StateEasyrouteService,
  ) {}

  ngOnInit() { 
    this.loadingService.showLoading();
  
    this.setUtilData();
    this.setPrefix();
    this.optimizationPreferences$ = this.preferencesFacade.optimizationPreferences$;
    this.easyRouteFacade.isAuthenticated$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((isAuthenticated: boolean) => {
            if (isAuthenticated) {
                this.zoneFacade.loadAll();
            }
        });

    // validar si esta activado el tiempo de retraso en clientes
    this.optimizationPreferences$.pipe(takeUntil(this.unsubscribe$)).subscribe((op) => {
        this.showDelaySeccion = op.allowDelayTime;
    });

    //this.setCompaniesAsociated();
    this.setAllowDelayTime();
    this.validateRoute();
    this.getDeliveryPointPaymentTypeId();
  }



  setPrefix() {
    this.profileFacade.profile$.subscribe(
        (data) => {
            if (data) {
                const { countryCode, companyProfileTypeId } = data.company;
                this.prefix = this.countrysWithPhone.find(
                    (x) => x.country === countryCode,
                )
                    ? '+' +
                      this.countrysWithPhone.find((x) => x.country === countryCode).code
                    : '+34';

                this.companyProfileTypeId = companyProfileTypeId;
            }
        },
        (error) => console.log(error),
    );
  }

  setUtilData() {
      this.countrys = UtilData.getCountry();
      this.countrysWithPhone = UtilData.getCountryPhoneCode();
      this.countrysWithCode = UtilData.getCountryWithCode();
  }

  /* setCompaniesAsociated() {
    setTimeout(() => {
        this.backendService
            .get('company_associated_list')
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.associatedCompany = data;
                    this.showcompanys = true;
                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
    }, 500);
  } */

  setAllowDelayTime() {
    this.backendService
    .get('company_preference_delay_time_type')
    .pipe(take(1))
    .subscribe(
        ({ data }) => {
            this.allowDelayTime = data;
            this.detectChanges.detectChanges();
        },
        (error) => {
            this.toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );
  }

  validateRoute() {
    if (this.idParam === 'new') {

        if (this.point.name.length > 0) {
            console.log('aqui');
            this.initForm();
        } else {
            console.log('aqui else');
            this.point = new Point();
            this.initForm();
        }
       
        this.loadingService.hideLoading();
    } else {
        this.backendService
            .get(`delivery_point/${this.idParam}`)
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.point = data;
                    this.initForm();
                    this.loadingService.hideLoading();
                },
                (error) => {
                    this.loadingService.hideLoading();
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        
        this.backendService
            .get('delivery_point_address_list/' + this.idParam)
            .pipe(take(1))
            .subscribe(({ data }) => {
                this.listDirecctions = data;
                this.detectChanges.detectChanges();
            });

    }
  }

  getDeliveryPointPaymentTypeId() {
    this.stateEasyrouteService.getDeliveryPointPaymentId().subscribe(
        (data: any) => {
            this.paymentTypeId = data.data;

            this.paymentShow = true;
        },
        (error) => {
            this.paymentShow = true;

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        },
    );
  }

    initForm() {
        let totalSeconds = +this.point.leadTime;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
    
        // delayTime
        let totalSeconds_delay = +this.point.allowedDelayTime;
        let hours_delay = Math.floor(totalSeconds_delay / 3600);
        totalSeconds_delay %= 3600;
        let minutes_delay = Math.floor(totalSeconds_delay / 60);
        let seconds_delay = totalSeconds_delay % 60;
    
        if (this.point.created_at) {
            this.dateCreatedAt = moment(this.point.created_at).format('YYYY-MM-DD');
        }
    
        if (this.point.disabled_at) {
            this.dateDisabledAt =  moment(this.point.disabled_at).format('YYYY-MM-DD');
        }
    
        // formulario
        this.pointInformationForm = this.fb.group(
            {
                id: [this.point.id || ''],
                name: [this.point.name, [Validators.required]],
                address: [this.point.address, [Validators.required]],
                billingAddress: [this.point.billingAddress],
                demand: [this.point.demand, [Validators.required]],
                serviceTimeMinute: [
                    parseInt('' + this.point.serviceTime / 60),
                    [Validators.required, Validators.min(0), Validators.max(59)],
                ],
                serviceTimeSeconds: [
                    Math.round(((this.point.serviceTime / 60) % 1) * 60),
                    [Validators.required, Validators.min(0), Validators.max(59)],
                ],
                keyOpen: [this.point.keyOpen, [Validators.required]],
                deliveryWindowStart: [
                    this.point.deliveryWindowStart
                        ? secondsToDayTimeAsString(+this.point.deliveryWindowStart)
                        : secondsToDayTimeAsString(0),
                ],
                deliveryWindowEnd: [
                    this.point.deliveryWindowEnd
                        ? secondsToDayTimeAsString(+this.point.deliveryWindowEnd)
                        : secondsToDayTimeAsString(86399),
                ],
                postalCode: [this.point.postalCode],
                population: [this.point.population],
                province: [this.point.province],
                phoneNumber: [
                    this.point.phoneNumber ? this.point.phoneNumber : this.prefix,
                ],
                email: [this.point.email],
                deliveryPointPaymentTypeId: [
                    this.point.deliveryPointPaymentTypeId
                        ? this.point.deliveryPointPaymentTypeId
                        : '',
                ],
                fiscalName: [
                    this.point.fiscalName,
                    [Validators.minLength(1), Validators.maxLength(30)],
                ],
                created_at: [this.dateCreatedAt],
                disabled_at: [this.dateDisabledAt],
                contactName: [this.point.contactName],
                deliveryZoneId: [this.point.deliveryZoneId],
                coordinatesLatitude: [
                    this.point.coordinatesLatitude,
                    [
                        Validators.required,
                        Validators.pattern('^-?[0-9]{1,3}(?:.[0-9]{0,14})?$'),
                    ],
                ],
                coordinatesLongitude: [
                    this.point.coordinatesLongitude,
                    [
                        Validators.required,
                        Validators.pattern('^-?[0-9]{1,3}(?:.[0-9]{0,14})?$'),
                    ],
                ],
                nif: [this.point.nif],
                hours: [hours ? hours : 0],
                minutes: [minutes ? minutes : 0],
                seconds: [seconds ? seconds : 0],
                hours_delay: [hours_delay ? hours_delay : 0],
                minutes_delay: [minutes_delay ? minutes_delay : 0],
                seconds_delay: [seconds_delay ? seconds_delay : 0],
                sendDeliveryNoteMail: [this.point.sendDeliveryNoteMail],
                companyAssociatedId: [
                    this.point.companyAssociatedId !== null
                        ? this.point.companyAssociatedId
                        : '',
                ],
                agentUserId: [this.point.agent_user ? this.point.agent_user.id : ''],
                equivalence: [this.point.equivalence || false],
                verifiedByDriver: [this.point.verifiedByDriver || false],
                isActive: [this.point.isActive || false],
                deliveryPointServiceType: [
                    this.point.deliveryPointServiceType &&
                    this.point.deliveryPointServiceType.id
                        ? this.point.deliveryPointServiceType &&
                          this.point.deliveryPointServiceType.id
                        : null,
                ],
    
                phones: [''],
                showDeliveryNotePrice: [this.point.showDeliveryNotePrice],
                activateDeliverySchedule: [this.point.activateDeliverySchedule],
    
    
                observations: [],
                companyPreferenceDelayTimeId: [
                    this.point.companyPreferenceDelayTimeId
                        ? this.point.companyPreferenceDelayTimeId
                        : '',
                ],
                allowDelayTime: [this.point.allowDelayTime],
                statusDeliveryPointId: [
                    this.point.statusDeliveryPointId
                        ? this.point.statusDeliveryPointId
                        : '',
                ],
                free: [],
                conceptSecundaryPhone: new FormArray([]),
            },
            { validator: this.checkStartAndEndTime },
        );
    
        this.changeSendDeliveryNoteMail(this.pointInformationForm.get('sendDeliveryNoteMail').value);
    
        this.pointInformationForm.controls['created_at'].setValidators([
            this.endDisabledAtConfirmar.bind(this.pointInformationForm),
        ]);
    
        this.pointInformationForm.controls['disabled_at'].setValidators([
            this.startCreatedAtConfirmar.bind(this.pointInformationForm),
        ]);
    
        this.pointInformationForm.get('created_at').updateValueAndValidity();
        this.pointInformationForm.get('disabled_at').updateValueAndValidity();
    
        this.deliveryZoneName_messages = new DeliveryZoneNameMessages().getDeliveryZoneNameMessages();
    
        this.getStatusDeliveryPoint();

        this.getCompanyTimeZone();
    
        //this.setUserAgent();
    
        this.setSecundaryPhone();
    
        this.detectChanges.detectChanges();
    }

    getCompanyTimeZone() {
        this.backendService
            .get('company_time_zone')
            .pipe(take(1))
            .subscribe(
                (response) => {
                    this.companyTimeZone = response.data;
                    this.cargarObservation();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(error.error.code, error.error);
                    this.detectChanges.detectChanges();
    
                    this.setTimeoutFuntion();
                },
            );
    }

    /* setUserAgent() {
        setTimeout(() => {
            this.backendService
                .get('users_salesman?userSalesmanId=' + this.point.agentUserId)
                .pipe(take(1))
                .subscribe(
                    ({ data }) => {
                        this.userAgent = data;
                        this.detectChanges.detectChanges();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.error,
                            error.error.error,
                        );
                    },
                );
        }, 500);
    } */

    setSecundaryPhone(){
        setTimeout(() => {
            this.backendService
                .get('delivery_point_phone_list/' + this.idParam)
                .pipe(take(1))
                .subscribe(({ data }) => {
                    this.listSecundaryPhone = data;
        
                    if (data && data.length > 0) {

                        data.forEach((element, index) => {
                            const concept = new FormGroup({
                                id: new FormControl(element.id),
                                deliveryPointId: new FormControl(element.deliveryPointId),
                                name: new FormControl(element.name),
                                phone: new FormControl(element.phone),
                            });
                
                            this.conceptSecundaryPhone.push(concept);

                            console.log('setSecundaryPhone', this.conceptSecundaryPhone)

                
                            this.detectChanges.detectChanges();
                        })
                        }
        
                    this.detectChanges.detectChanges();
                });
            }, 500);
    }

    
    startCreatedAtConfirmar(group: AbstractControl) {
        let created_at = group.root.value.created_at; //objectToString(group.root.value.created_at);
        let disabled_at = group.value; //objectToString(group.value);
    
        if (moment(created_at).diff(moment(disabled_at), 'days', true) > 0) {
            return {
                confirmar: true,
            };
        }
    
        return null;
    }
    
    endDisabledAtConfirmar(group: AbstractControl) {
    
          let disabled_at = group.root.value.disabled_at; //objectToString(group.root.value.disabled_at);
      
          let created_at = group.value; //objectToString(group.value);
      
          if (moment(created_at).diff(moment(disabled_at), 'days', true) > 0) {
              return {
                  confirmar: true,
              };
          }
      
          return null;
    }
    
    changeSendDeliveryNoteMail(value: any) {
        this.focus = false;
    
        if (value) {
            this.pointInformationForm
                .get('email')
                .setValidators([Validators.required, Validators.email]);
    
            this.pointInformationForm.get('email').updateValueAndValidity();
    
            if (!this.pointInformationForm.get('email').value) {
                this.focus = true;
            }
        } else {
            this.pointInformationForm.get('email').setValidators(null);
            this.pointInformationForm.get('email').updateValueAndValidity();
    
            this.pointInformationForm.controls['email'].setValidators([Validators.email]);
        }
    
        this.detectChanges.detectChanges();
    }
    
    checkStartAndEndTime(group: FormGroup) {
        // here we have the 'passwords' group
        let start = dayTimeAsStringToSeconds(group.controls.deliveryWindowStart.value);
        let end = dayTimeAsStringToSeconds(group.controls.deliveryWindowEnd.value);
        let valueEnd = end == -1 ? true : false;
        let valueStart = start == -1 ? true : false;
        return end >= start || valueEnd || valueStart ? null : { same: true };
    }
    
    getStatusDeliveryPoint() {
        this.showStatusDeliveryPoint = false;
    
        this.backendService
            .get('status_delivery_point')
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.statusDeliveryPoint = data;
    
                    this.showStatusDeliveryPoint = true;
    
                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.showStatusDeliveryPoint = true;
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
    }

    changeSelectName(name:any) {
        return name.replace('Cliente','Frecuente');
    }

    modalActivityRegister() {

        const dialogRef = this._modalService.open(ModalActivityRegisterComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            size: 'md',
            backdrop: 'static',
            windowClass:'modal-client',
        });
        dialogRef.componentInstance.pointId = this.point.id;

        dialogRef.result.then((result) => {

            if (result) {

            }
        }, (reason) => {

        });
    
    }

    // Direcciones
    searchAddress() {
        let addressData = this.pointInformationForm.get('address').value;
        this.showAddress = false;
    
        $('#tooltip').tooltip('hide');
    
        setTimeout(() => {
            if (addressData) {
                this.backendService
                    .get('delivery_point_search_address?address=' + addressData)
                    .subscribe(
                        (response) => {
                            this.pointInformationForm.controls['address'].setValue(
                                response[0].address,
                            );
                            this.pointInformationForm.controls['coordinatesLatitude'].setValue(
                                (+response[0].coordinates.latitude).toPrecision(13),
                            );
                            this.pointInformationForm.controls['coordinatesLongitude'].setValue(
                                (+response[0].coordinates.longitude).toPrecision(13),
                            );
                            this.pointInformationForm.updateValueAndValidity();
                            this.showAddress = true;
                            this.detectChanges.detectChanges();
    
                            this.setTimeoutFuntion();
                        },
                        (error) => {
                            this.showAddress = true;
                            this.toastService.displayHTTPErrorToast(
                                error.error.code,
                                error.error,
                            );
                            this.detectChanges.detectChanges();
    
                            this.setTimeoutFuntion();
                        },
                    );
            } else {
                this.showAddress = true;
                this.detectChanges.detectChanges();
                this.toastService.displayWebsiteRelatedToast('Debe indicar la dirección.'),
                    this.translate.instant('GENERAL.ACCEPT');
    
                this.setTimeoutFuntion();
            }
        }, 500);
    }

    setTimeoutFuntion() {
        setTimeout(() => {
            init_plugins();
        }, 500);
    }

    addDirections() {
        let direction = {
            id: '',
            deliveryPointId: this.point.id,
            address: '',
            coordinatesLatitude: '',
            coordinatesLongitude: '',
            postalCode: '',
            province: '',
        };
        const dialogRef = this._modalService.open(ModalDirectionsComponent, {
            backdrop: 'static',
            backdropClass: 'modal-backdrop-ticket',
            centered: true,
            windowClass:'modal-client',
            size:'md'
        });
        dialogRef.componentInstance.direction = direction;
        
        dialogRef.result.then((data) => {
            if (data && this.point.id != '') {
                this.backendService
                    .post('delivery_point_address', data.data)
                    .pipe(take(1))
                    .subscribe((response) => {
                        if (this.showAddress) {
                            this.backendService
                                .get('delivery_point_address_list/' + this.point.id)
                                .pipe(take(1))
                                .subscribe(({ data }) => {
                                    this.listDirecctions = data;
                                    this.detectChanges.detectChanges();
                                });
                        }
                    });
            } else if (data && this.point.id === '') {
                this.addresses.push({
                    address: data.data.address,
                    postalCode: data.data.postalCode,
                    province: data.data.province,
                    coordinatesLongitude: data.data.coordinatesLongitude,
                    coordinatesLatitude: data.data.coordinatesLatitude,
                    isActive: true,
                });
        
                if (this.showAddress) {
                    this.listDirecctions = this.addresses;
                    this.detectChanges.detectChanges();
                }
            }
        });
    }
    
    editDirections(item: any) {
        const dialogRef = this._modalService.open(ModalDirectionsComponent, {
            backdrop: 'static',
            backdropClass: 'modal-backdrop-ticket',
            centered: true,
            windowClass:'modal-client',
            size:'md'
        });
        dialogRef.componentInstance.direction = item;
    
        dialogRef.result.then((data) => {
            if (data && this.point.id != '') {
                this.backendService
                    .put('delivery_point_address/' + item.id, data.data)
                    .pipe(take(1))
                    .subscribe((response) => {
                        if (this.showAddress) {
                            this.backendService
                                .get('delivery_point_address_list/' + this.point.id)
                                .pipe(take(1))
                                .subscribe(({ data }) => {
                                    this.listDirecctions = data;
                                    this.detectChanges.detectChanges();
                                });
                        }
                    });
            } else if (data && this.point.id === '') {
                this.addresses = this.addresses.filter((x) => x !== item);
                this.addresses.push({
                    address: data.data.address,
                    postalCode: data.data.postalCode,
                    province: data.data.province,
                    coordinatesLongitude: data.data.coordinatesLongitude,
                    coordinatesLatitude: data.data.coordinatesLatitude,
                    isActive: true,
                });
    
                if (this.showAddress) {
                    this.listDirecctions = this.addresses;
                    this.detectChanges.detectChanges();
                }
            }
        });
    }

    deleteDirections(item: any) {
        
    }

    /* Tabla observaciones */
    addObservation() {
        let observation = {};
        const dialogRef = this._modalService.open(ModalObservationsComponent, {
            backdrop: 'static',
            backdropClass: 'modal-backdrop-ticket',
            centered: true,
            windowClass:'modal-client',
            size:'md'
        });
        dialogRef.componentInstance.title = this.translate.instant('GENERAL.ADD_REMARK');
        dialogRef.componentInstance.observation = observation;

        dialogRef.result.then((data) => {

            if (data && this.point.id != '') {

                let send = {
                    deliveryPointId: this.point.id,
                    observation: data.observation,
                };
                this.backendService
                    .post('delivery_point_observation', send)
                    .pipe(take(1))
                    .subscribe((response) => {
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        );

                        this.table.ajax.reload();
                        this.detectChanges.detectChanges();
                    });
            } else if (data && this.point.id === '') {

                this.listObservation.push({
                    observation: data.observation,
                    date: moment().format('DD/MM/YYYY'),
                });

                this.detectChanges.detectChanges();

            }
        });
    }

    editObservations(item: any) {

        const dialogRef = this._modalService.open(ModalObservationsComponent, {
            backdrop: 'static',
            backdropClass: 'modal-backdrop-ticket',
            centered: true,
            windowClass:'modal-client',
            size:'md'
        });
        dialogRef.componentInstance.title = this.translate.instant('GENERAL.EDIT_REMARK');
        dialogRef.componentInstance.observation = item;

        dialogRef.result.then((data) => {

            if (data && this.point.id != '') {
                this.backendService
                    .put('delivery_point_observation/' + item.id, data)
                    .pipe(take(1))
                    .subscribe((response) => {
                        if (this.showAddress) {
                            this.backendService
                                .get('delivery_point_address_list/' + this.point.id)
                                .pipe(take(1))
                                .subscribe(({ data }) => {
                                    this.table.ajax.reload();
                                    this.detectChanges.detectChanges();
                                });
                        }
                    });
            } else if (data && this.point.id === '') {

                this.listObservation = this.listObservation.filter((x: any) => x !== item);

                this.listObservation.push({
                    observation: data.observation,
                    date: moment().format('DD/MM/YYYY'),
                });

                this.detectChanges.detectChanges();
                
            }
        });
    }

    deleteObservaciones(echedule: any, id: any) {
        let data = this.listObservation.indexOf(echedule);

        if (data !== -1) {
            console.log('data !=-1');
            this.listObservation.splice(data, 1);
        }

        this.detectChanges.detectChanges();
    }

    sliceStringObservation(text: string) {
        return sliceMediaString(text, 60, '(min-width: 960px)');
    }

    //datatables observaciones solo editar
    cargarObservation() {
        let url =
            environment.apiUrl +
            'delivery_point_observation_datatable?deliveryPointId=' +
            this.point.id;

        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#observations';

        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            order: [0, 'desc'],
            lengthMenu: [10],

            stateSaveParams: function(settings, data) {
                data.search.search = '';
            },
            dom: `
                <"top-button-hide"><'vehicles table-responsive-md't>
                <'row reset'
                    <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
                >
            `,
            buttons: [
                {
                    extend: 'colvis',
                    text: this.translate.instant('GENERAL.SHOW/HIDE'),
                    columnText: function(dt, idx, title) {
                        return idx + 1 + ': ' + title;
                    },
                },
            ],
            language: environment.DataTableEspaniol,
            ajax: {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: tok,
                },
                error: (xhr, error, thrown) => {
                    let html = '<div class="container" style="padding: 10px;">';
                    html +=
                        '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                    html +=
                        '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                    html += '</div>';

                    $('#companies_processing').html(html);
                },
            },
            columns: [
                {
                    data: 'observation',
                    title: this.translate.instant('DELIVERY_POINTS.OBSERVATION'),
                    render: (data, type, row) => {
                        let name = data;

                        if (name.length > 50) {
                            name = name.substr(0, 49) + '...';
                        }

                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' +
                            name +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'created_by_user',
                    title: this.translate.instant('DELIVERY_POINTS.CREATED_BY'),
                    render: (data, type, row) => {
                        let name = data.name;
                        let surname = data.surname;
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true"> No disponible</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                data.name +
                                '  ' +
                                data.surname +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'created_at',
                    title: this.translate.instant('DELIVERY_POINTS.CREATION_DATE'),
                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY');
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                      render: ( data, type, row ) => {
                        let botones = '<div class="text-center">';
      
                        botones += `
                            <span class="edit m-1">
                                <img class="icons-datatable point" title="Editar" src="assets/icons/editSettings.svg">
                            </span>
                        `;
      
                        botones += '</div>';
      
                        return botones;
                      }
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    render: (data, type, row) => {
                        let botones1 = '<div class="text-center">';
    
                        botones1 += `
                            <span class="delete m-1">
                                <img class="icons-datatable point" title="Eliminar" src="assets/icons/trashSetting.svg">
                            </span>
                        `;
    
                        botones1 += '</div>';
    
                        return botones1;
                    },
                },
            ],
        });

        this.initEvents('#observations tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        this.delete(tbody, table);
        this.edit(tbody, table);

    }

    delete(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'span.delete', function() {
            let data = table.row($(this).parents('tr')).data();
            that.deleteObservations(data.id);
        });
    }

    deleteObservations(id: number) {
        const dialogRef = this._modalService.open(ModalConfirmPhoneComponent, {
            backdropClass: 'modal-backdrop-ticket',
            centered: true,
            windowClass:'modal-cost',
            backdrop: 'static',
            size:'md'
        });
        dialogRef.componentInstance.title = this.translate.instant(
            'GENERAL.CONFIRM_REQUEST',
        );
        dialogRef.componentInstance.message = this.translate.instant(
            'GENERAL.ARE_YOU_SURE_WANT_TO_DELETE_THIS_SELECTED_OBSERVATION',
        );

        dialogRef.result.then(
            (data) => {
                if (data) {
                    this.backendService
                        .delete('delivery_point_observation/' + id)
                        .subscribe(
                            (data: any) => {
                                this.toastService.displayWebsiteRelatedToast(
                                    this.translate.instant(
                                        'CONFIGURATIONS.UPDATE_NOTIFICATIONS',
                                    ),
                                );
                                this.table.ajax.reload();
                            },
                            (error) => {
                                this.toastService.displayHTTPErrorToast(
                                    error.status,
                                    error.error.error,
                                );
                            },
                        );
                }
            },
            (error) => {
                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    edit(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'span.edit', function() {
            let data = table.row($(this).parents('tr')).data();
            that.editObservations(data);
        });
    }



    /* Telefonos */
    addConceptSecundaryPhone() {

        const concept = new FormGroup({
            id: new FormControl(0),
            deliveryPointId: new FormControl(this.point.id),
            name: new FormControl('', [Validators.maxLength(30)]),
            phone: new FormControl('', [ValidatePhone(this.prefix ==='+34' ? this.prefix ='España' : '')]),
        });

        this.conceptSecundaryPhone.push(concept);

        console.log('addConceptSecundaryPhone', this.conceptSecundaryPhone)


        this.detectChanges.detectChanges();
        
    }

    get conceptSecundaryPhone() {

        if (this.pointInformationForm)
          return this.pointInformationForm.get('conceptSecundaryPhone') as FormArray;
    
    }

    changeSecundaryPhone(value: any, data: any, index: any) {

        if (this.point.id != '') {
    
            if (data.value.id > 0) {
    
                this.editSecundaryPhone(data.value, index);
    
            } else {
    
                this.addSecundaryPhone(data.value, index);
    
            }

        }

    }

    changeSecundaryName(value: any, data: any, index: any) {
    
        if (this.point.id != '') {

            if (data.value.id > 0) {
    
                this.editSecundaryPhone(data.value, index);
    
            } else {
    
                this.addSecundaryPhone(data.value, index);
            }
        }
    }

    editSecundaryPhone(data: any, index: any) {

        if (data.phone.length > 0 && data.name.length > 0) {
            
            const value = this.conceptSecundaryPhone.controls[index].value;

            this.backendService.put('delivery_point_phone/' + value.id, value).pipe(take(1)).subscribe((data) => {
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('GENERAL.REGISTRATION'),
                    this.translate.instant('GENERAL.ACCEPT'),
                );
            }, error => {
              this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            });

        }

    }

    addSecundaryPhone(data: any, index: any) {

        if (data.phone.length > 0 && data.name.length > 0) {
            const value = this.conceptSecundaryPhone.controls[index].value;
            this.backendService.post('delivery_point_phone', value).pipe(take(1)).subscribe(({ data }) => {
              this.conceptSecundaryPhone.controls[index].get('id').setValue(data.id)
              this.toastService.displayWebsiteRelatedToast(
                this.translate.instant('CONFIGURATIONS.REGISTRATION'),
                this.translate.instant('GENERAL.ACCEPT')
              );
            }, error => {
              this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            });
        }

    }

    deleteSecundaryPhone(data: any, index: number = null) {
        if (data.value.id > 0) {

            const dialogRef = this._modalService.open(ModalConfirmPhoneComponent, {
                backdropClass: 'modal-backdrop-ticket',
                centered: true,
                windowClass:'modal-cost',
                backdrop: 'static',
                size:'md'
            });
            dialogRef.componentInstance.title = this.translate.instant(
                'GENERAL.CONFIRM_REQUEST',
            );
            dialogRef.componentInstance.message = this.translate.instant(
                'GENERAL.YOU_SURE_WANT_TO_DELETE_THIS_SELECTD_PHONE',
            );
    
            dialogRef.result.then((resul) => {
                if (resul && this.point.id != '') {
                    this.backendService
                        .delete('delivery_point_phone/' + data.value.id)
                        .pipe(take(1))
                        .subscribe((response) => {
                            this.toastService.displayWebsiteRelatedToast(
                                this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                                this.translate.instant('GENERAL.ACCEPT'),
                            );

                            this.conceptSecundaryPhone.controls.splice(index, 1);
                            this.detectChanges.detectChanges();
                        });
                }
            });
        } else {
            this.conceptSecundaryPhone.controls.splice(index, 1);

            this.detectChanges.detectChanges();
        }
    }









  submit() {
    this.loadingService.showLoading();

    let dataForm = _.cloneDeep(this.pointInformationForm.value);

    let time: number =
        this.pointInformationForm.value.hours * 3600 +
        this.pointInformationForm.value.minutes * 60 +
        this.pointInformationForm.value.seconds;

    let timeDelay: number =
        this.pointInformationForm.value.hours_delay * 3600 +
        this.pointInformationForm.value.minutes_delay * 60 +
        this.pointInformationForm.value.seconds_delay;

    delete dataForm.serviceTimeMinute;
    delete dataForm.serviceTimeSeconds;
    delete dataForm.hours;
    delete dataForm.minutes;
    delete dataForm.seconds;
    delete dataForm.hours_delay;
    delete dataForm.minutes_delay;
    delete dataForm.seconds_delay;

    //eliminar input chebox temporales
    delete dataForm.activeScheduleMonday;
    delete dataForm.activeScheduleTuesday;
    delete dataForm.activeScheduleWednesday;
    delete dataForm.activeScheduleThursday;
    delete dataForm.activeScheduleFriday;
    delete dataForm.activeScheduleSaturday;
    delete dataForm.activeScheduleSunday;

    delete dataForm.fixedDeliveryScheduleMonday;
    delete dataForm.fixedDeliveryScheduleTuesday;
    delete dataForm.fixedDeliveryScheduleWednesday;
    delete dataForm.fixedDeliveryScheduleThursday;
    delete dataForm.fixedDeliveryScheduleFriday;
    delete dataForm.fixedDeliveryScheduleSaturday;
    delete dataForm.fixedDeliveryScheduleSunday;

    /// eliminar campos temporales visit
    delete dataForm.activeScheduleMondayVisit;
    delete dataForm.activeScheduleTuesdayVisit;
    delete dataForm.activeScheduleWednesdayVisit;
    delete dataForm.activeScheduleThursdayVisit;
    delete dataForm.activeScheduleFridayVisit;
    delete dataForm.activeScheduleSaturdayVisit;
    delete dataForm.activeScheduleSundayVisit;

    delete dataForm.fixedDeliveryScheduleMondayVisit;
    delete dataForm.fixedDeliveryScheduleTuesdayVisit;
    delete dataForm.fixedDeliveryScheduleWednesdayVisit;
    delete dataForm.fixedDeliveryScheduleThursdayVisit;
    delete dataForm.fixedDeliveryScheduleFridayVisit;
    delete dataForm.fixedDeliveryScheduleSaturdayVisit;
    delete dataForm.fixedDeliveryScheduleSundayVisit;
    delete dataForm.free;
    delete dataForm.conceptSecundaryPhone;

    dataForm.companyAssociatedId =
        dataForm.companyAssociatedId === '' || dataForm.companyAssociatedId === null
            ? null
            : dataForm.companyAssociatedId;

    dataForm.deliveryWindowStart = dayTimeAsStringToSeconds(
        this.pointInformationForm.value.deliveryWindowStart,
    );

    dataForm.deliveryWindowEnd = dayTimeAsStringToSeconds(
        this.pointInformationForm.value.deliveryWindowEnd,
    );

    dataForm.serviceTime =
        this.pointInformationForm.value.serviceTimeMinute * 60 +
        this.pointInformationForm.value.serviceTimeSeconds;

    dataForm.agentUserId =
        dataForm.agentUserId === null || dataForm.agentUserId === ''
            ? null
            : dataForm.agentUserId;

    dataForm.leadTime = time;
    dataForm.allowedDelayTime = timeDelay;
    dataForm.deliveryPointServiceType = this.pointInformationForm.value.deliveryPointServiceType;
    dataForm.observations = this.listObservation;
    dataForm.isActive = this.isActiveClient;
    dataForm.images = this.franchiseImages;
    /* dataForm.deliveryZoneSpecificationType = this.pointInformationForm.value.deliveryZoneSpecificationType; */

    if (this.pointInformationForm.invalid) {
        this.toastService.displayWebsiteRelatedToast('The point is not valid'),
            this.translate.instant('GENERAL.ACCEPT');
        this.loadingService.hideLoading();
    } else {
        if (!this.point.id || this.point.id === null || this.point.id === '') {
            dataForm = {
                ...dataForm,
                addresses: this.addresses,
                phones: this.listSecundaryPhone,
            };

            this.addPoint(dataForm);

            this.facade.added$.pipe(take(2)).subscribe(
                (data) => {
                    if (data) {
                        this.loadingService.hideLoading();
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CLIENTS.CREATE_CLIENT'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
                        this.router.navigateByUrl('management/clients');
                    }
                },
                (error) => {
                    console.log('aqui');
                    this.loadingService.hideLoading();
                    this.toastService.displayHTTPErrorToast(error, 'error al crear');
                },
            );
        } else {
            delete dataForm.phones;
            delete dataForm.schedule;
            delete dataForm.scheduleVisit;
            delete dataForm.scheduleSpecification;
            delete dataForm.observations;
            delete dataForm.images;
            this.updatePoint([this.point.id, dataForm]);
            this.facade.updated$.pipe(take(2)).subscribe(
                (data) => {
                    if (data) {
                        this.loadingService.hideLoading();
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CLIENTS.UPDATE_CLIENT'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
                        this.router.navigateByUrl('management/clients');
                    }
                },
                (error) => {
                    this.loadingService.hideLoading();
                    this.toastService.displayHTTPErrorToast(
                        error,
                        'error al actualizar',
                    );
                },
            );
        }
    }
    
  }

  addPoint(point: Point) {
    this.facade.addPoint(point);
  }
  
  updatePoint(obj: [string, Partial<Point>]) {
      this.facade.editPoint(obj[0], obj[1]);
  }

  isFormInvalid(): boolean {
    if ((this.point.id.length > 0 && this.idParam !='new')) {
       // this.clients.emit( this.pointInformationForm.value );
    }
    
    return !this.pointInformationForm.valid;
  }

}

import { ProductsModalMeasureComponent } from './../../../../../products/src/lib/component/products-form/products-modal-measure/products-modal-measure.component';
import { ProductsModalConfirmComponent } from './../../../../../products/src/lib/component/products-form/products-modal-confirm/products-modal-confirm.component';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { dateToObject, ZoneFranchiseMessages, secondsToDayTimeAsString } from '@optimroute/shared';
import { getToday, objectToString } from '../../../../../shared/src/lib/util-functions/date-format';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsPrices } from '../../../../../backend/src/lib/types/products-price.type';
import { Profile } from '../../../../../backend/src/lib/types/profile.type';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { ProductModalImgInfoComponent } from '../../../../../shared/src/lib/components/product-modal-img-info/product-modal-img-info.component';
import { take, map, findIndex } from 'rxjs/operators';
import * as moment from 'moment';
import { ProductsInterface } from '../../../../../backend/src/lib/types/products.type';
import { ProductsMessages } from '../../../../../shared/src/lib/messages/products/products.message';
declare var $: any;
declare function init_plugins();
import * as _ from 'lodash';
import { ZoneFranchise } from 'libs/backend/src/lib/types/zone-franchise.type';
import { ModalAddCompanyFranchiseComponent } from './modal-add-company-franchise/modal-add-company-franchise.component';
import { ModalZoneCompanyFranchiseDeleteComponent } from './modal-zone-company-franchise-delete/modal-zone-company-franchise-delete.component';
import { dayTimeAsStringToSeconds } from '../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { ValidatePhone } from '../../../../../shared/src/lib/validators/phone.validator';
import { DeliverySchedule } from '@optimroute/backend';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { Zone } from '../../../../../backend/src/lib/types/delivery-zones.type';
import { Delivery } from '../../../../../backend/src/lib/types/delivery.type';
import { DeliveryModalConfirmationComponent } from '../../../../../shared/src/lib/components/delivery-modal-confirmation/delivery-modal-confirmation.component';
import { environment } from '@optimroute/env/environment';
import { ModalAddRidersComponent } from './modal-add-riders/modal-add-riders.component';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';

@Component({
  selector: 'easyroute-manage-zone-form',
  templateUrl: './manage-zone-form.component.html',
  styleUrls: ['./manage-zone-form.component.scss']
})
export class ManageZoneFormComponent implements OnInit {

  cardImageBase64: string;
  companyParentId: number;
  data: any;
  date: any = new Date();
  dateEnd: any;
  dateStart: any;
  imageError: string = '';
  loadingCompanyList: string = 'success';
  loadingCompanyProductUniquelist: string = 'success';
  loadingFilter: string = 'success';
  loadingProfiles: string = 'success';
  loadingSubcategories: string = 'success';
  overFlowImg: boolean = false;
  positionId: number;
  zoneTable: any[] = [];
  zoneFranchiseTable: any = [];
  zoneFranchise: any  = [];
  profile: Profile;
  promotion_messages: any;
  zoneData: ZoneFranchise;
  ZoneFranchiseForm: FormGroup;
  zonesImages: any = [];
  delete: boolean = false;
  deliverySchedule: DeliverySchedule[] = [];
  deliveryTable: any = [];

  showCode: boolean = true;
  showZoneList: boolean = true;
  ShowSheduleLIst: boolean = true;

  delivery: Delivery[] =[];
  deliveryTableRates: any = [];
  showDeliveryRates : boolean = true;
  moneySymbol = environment.MONEY_SYMBOL;
  ridersTable: any[] = [];
  ridersTables: any =[];
  table: any;


    constructor(
        private _activatedRoute: ActivatedRoute,
        private stateEasyrouteService: StateEasyrouteService,
        private _toastService: ToastService,
        private loading: LoadingService,
        private _translate: TranslateService,
        private _router: Router,
        private fb: FormBuilder,
        private _modalService: NgbModal,
        private changeDetect: ChangeDetectorRef,
        private facadeProfile: ProfileSettingsFacade,
        public authLocal: AuthLocalService
    ) { }
    
    ngOnInit() {
        setTimeout(() => {
            init_plugins();
        }, 1000);
    
        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {
                this.facadeProfile.profile$.pipe(take(1)).subscribe((data) => {
                    this.profile = data;
    
                    this.companyParentId = this.profile.company.companyParentId;
    
                    this.changeDetect.detectChanges();
    
                    this.load();
                });
            }
        });
    }
    
    load() {
        this._activatedRoute.params.subscribe((params) => {
            if (params['id'] !== 'new') {
                this.stateEasyrouteService
                    .getZoneManage(params['id'])
                    .pipe(
                        take(1),
                        map(({ data }) => {
                            return {
                                ...data,
                                images: data.images.map((image) => ({
                                    id: image.id,
                                    image: image.urlimage,
                                    zoneId: image.zoneId,
                                })),
                            };
                        }),
                    )
                    .subscribe(
                        (resp: any) => {
                            this.zoneData = resp;
                           
                            this.zonesImages = resp.images;
    
                            this.validaciones(this.zoneData);
                            
    
                            this.changeDetect.detectChanges();
                        },
                        (error) => {
                            this._toastService.displayHTTPErrorToast(
                                error.status,
                                error.error,
                            );
                        },
                    );
            } else {
                this.zoneData = new ZoneFranchise();
    
                this.validaciones(this.zoneData);
            }
        });
    }
    
    validaciones(zone: ZoneFranchise) {
        let starttotalSeconds = +zone.scheduleStart ? zone.scheduleStart : 0;
    
        starttotalSeconds %= 3600;
    
        let startminutes = Math.floor(starttotalSeconds / 60);
    
        let startseconds = starttotalSeconds % 60;
    
        let endtotalSeconds = +zone.scheduleEnd ? zone.scheduleEnd : 0;
    
        let endhours = Math.floor(endtotalSeconds / 3600);
    
        endtotalSeconds %= 3600;
    
        let endminutes = Math.floor(endtotalSeconds / 60);
    
        let endseconds = endtotalSeconds % 60;
    
        this.ZoneFranchiseForm = this.fb.group({
            name: [
                zone.name,
                [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
            ],
            code: [zone.code ? zone.code : '', [Validators.minLength(2),Validators.maxLength(40)]],
            showInApp: [zone.showInApp || false],
            allowedRadius:[zone.allowedRadius ? zone.allowedRadius / 1000 : '', 
                [Validators.required,  Validators.min(0),
                Validators.max(99999), 
              ]],
            address:[ zone.address, [Validators.required,Validators.minLength(4), Validators.maxLength(1000)]],
            email:[zone.email, [Validators.required, Validators.email]],
            phone: [
                zone.phone,
                [ValidatePhone(
                  '' ? '' : 'España'
                ),
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30)
                ],
              ],
            addressOrderRange:[zone.addressOrderRange, [Validators.required, Validators.minLength(4), Validators.maxLength(1000)]],
            minPayment:[ zone.minPayment, 
                [
                Validators.min(0),
                Validators.max(9999999), 
               ]], 
            prepaidPayment:[ zone.prepaidPayment,
                [
                Validators.min(0),
                Validators.max(9999999), 
                ]],
            allowWithoutMinimun:[ zone.allowWithoutMinimun],
            quantityBuyWithoutMinimun:[ zone.quantityBuyWithoutMinimun,
            [
                Validators.min(0),
                Validators.max(9999999), 
                ] 
            ],
            orderLimitDay:[zone.orderLimitDay, [ 
                Validators.max(9999999),]],
            orderMaxTime: [zone.orderMaxTime ?  secondsToDayTimeAsString(zone.orderMaxTime)
                : secondsToDayTimeAsString(0)
                
            ],
            assignedNextDay: [zone.assignedNextDay],
            acceptSameDay: [zone.acceptSameDay],
            activeMonday: [zone.activeMonday],
            activeTuesday: [zone.activeTuesday],
            activeWednesday: [zone.activeWednesday],
            activeThursday : [zone.activeThursday],
            activeFriday: [zone.activeFriday],
            activeSaturday : [zone.activeSaturday],
            activeSunday: [zone.activeSunday],
            sumDeliveryPriceToTicket : [zone.sumDeliveryPriceToTicket],
            sumQuantityBuyWithoutMinimunToTicket: [zone.sumQuantityBuyWithoutMinimunToTicket],
            scheduleStart:
            [zone.scheduleStart ? secondsToDayTimeAsString(zone.scheduleStart)
              : secondsToDayTimeAsString(0)],
            scheduleEnd:
            [zone.scheduleEnd ? secondsToDayTimeAsString(zone.scheduleEnd)
              : secondsToDayTimeAsString(86399)],
            coordinatesLatitude:[zone.coordinatesLatitude],
            coordinatesLongitude:[zone.coordinatesLongitude],
            isActive: [zone.isActive, [Validators.required]],
        });
    
        this.ZoneFranchiseForm.controls['scheduleStart'].setValidators([
            this.ValidatorWindowsStart.bind(this.ZoneFranchiseForm)
          ]);
      
          this.ZoneFranchiseForm.controls['scheduleEnd'].setValidators([
            this.ValidatorWindowsEnd.bind(this.ZoneFranchiseForm)
          ]);
        let promotion_messages = new ZoneFranchiseMessages();
        this.promotion_messages = promotion_messages.getZoneFranchiseMessages();
        if (this.zoneData.id >0) {
            this.getZoneDeliveryScheduleList();
            this.getCompanyZoneList();
            this.getZoneDeliveryList();
           
        }
        setTimeout(init_plugins, 1000);
      
       
    }
    
    /* listado de horarios */
    getZoneDeliveryScheduleList(){
        this.ShowSheduleLIst = false;
        this.stateEasyrouteService.getZoneDeliveryScheduleList(this.zoneData.id).subscribe(
            (data: any) => {
    
            this.deliverySchedule =data.data;
            this.ShowSheduleLIst = true;
            this.changeDetect.detectChanges();
            },
    
            (error) => {
                this.ShowSheduleLIst = true;
                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }
    
    /* listado de tienda creada con la zona */
    getCompanyZoneList(){
        this.showZoneList = false;
        this.stateEasyrouteService.getCompanyZoneList(this.zoneData.id).subscribe(
            (data: any) => {
                this.zoneTable = data;
                this.showZoneList = true;
                this.changeDetect.detectChanges();
            },
    
            (error) => {
                this.showZoneList = true;
                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }
    
    /* listado tarifas de entregas */
    getZoneDeliveryList(){
        this.showDeliveryRates = false;
        this.stateEasyrouteService.getZoneDeliveryList(this.zoneData.id).subscribe(
            (data: any) => {
               
                this.delivery = data.data.sort((a, b) =>  b.price - a.price );
                this.showDeliveryRates = true;
                this.cargarRiders();
                /* try{
                    console.log('entro en el try')
                    this.changeDetect.detectChanges();
                   
                
                } catch(e){
        
                } */
                this.changeDetect.detectChanges();
            },
    
            (error) => {
                this.showDeliveryRates = true;
                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }
    
    
    /* crear zona */
    createProduct(): void {
    
        console.log(this.ZoneFranchiseForm,'this.ZoneFranchiseForm.');
    
     
        let dataform = _.cloneDeep(this.ZoneFranchiseForm.value);
    
    
        dataform.scheduleStart = dayTimeAsStringToSeconds(
            this.ZoneFranchiseForm.get('scheduleStart').value,
          );
         
    
        dataform.scheduleEnd = dayTimeAsStringToSeconds(
        this.ZoneFranchiseForm.get('scheduleEnd').value,
        );
    
        dataform.orderMaxTime = dayTimeAsStringToSeconds(
            this.ZoneFranchiseForm.get('orderMaxTime').value,
            );
    
        dataform.allowedRadius = dataform.allowedRadius *  1000;
    
        if (dataform.estimatedWeightPerUnit == null) {
            dataform.estimatedWeightPerUnit = 0;
        }
        
        if (this.zoneData.id && this.zoneData.id > 0) {
            this.stateEasyrouteService.editZoneManage(this.zoneData.id, dataform).subscribe(
                (data: any) => {
                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                        this._translate.instant('GENERAL.ACCEPT'),
                    );
    
                    this._router.navigate(['franchise/zone']);
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        } else {
    
            let createFranchiseZone: any = [];
            let createRiders: any = [];
    
            this.zoneTable.map((element => {
                createFranchiseZone.push(element.id)
            }));

            this.ridersTable.map((send => {
                createRiders.push(send.id)
            }));
            
            dataform.franchises = createFranchiseZone;
            dataform.deliverySchedule = this.deliverySchedule;
            dataform.zoneDelivery = this.delivery;
            dataform.images = [];
            dataform.riders = createRiders;
    
            this.zoneData.images.forEach((dataImage64) => {
                dataform.images.push(dataImage64);
            });
    
            this.stateEasyrouteService.addZoneManage(dataform).subscribe(
                (data: any) => {
                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.REGISTRATION'),
                        this._translate.instant('GENERAL.ACCEPT'),
                    );
    
                    this._router.navigate(['franchise/zone']);
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        }
    }
    
    
    loadImage64(e: any) {
        this.imageError = '';
    
        const allowedTypes = ['image/jpeg', 'image/png'];
        const reader = new FileReader();
        const maxSize = 1000000;
    
        let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    
        if (file.size > maxSize) {
            this.imageError = 'Tamaño máximo permitido ' + maxSize / 1000 / 1000 + 'Mb';
            return;
        }
    
        if (!allowedTypes.includes(file.type)) {
            this.imageError = 'Formatos permitidos ( JPG | PNG )';
            return;
        }
    
        reader.onload = this._handleReaderLoaded.bind(this);
    
        reader.readAsDataURL(file);
    }
    
    validateSizeImg($event: any) {
        const reader = $event.target.result;
    
        // validacion de dimensiones retirar la linea completa return superior y
        // el comentario si desea validar las mismas
    
        const image = new Image();
    
        image.src = reader;
    
        return this._handleReaderLoaded(reader);
    }
    
    _handleReaderLoaded(e: any) {
        let reader = e.target.result;
    
        this.cardImageBase64 = reader;
    
        this.delete = true;
    
        let data = {
            // new image
            zoneId: this.zoneData.id,
            image: reader,
            urlimage: reader,
        };
    
        if (this.zoneData.id > 0 && this.zoneData.id !== null) {
            this.stateEasyrouteService.addZoneImagen(data, this.zoneData.id).subscribe(
                (data: any) => {
                    
                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    );
                    this.refreshFormato();
                  
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        } else {
            //cuando es nuevo con el formulario
            this.zonesImages = [];
    
            this.zoneData.images = [];
    
            this.zonesImages.push(data);
    
            this.zoneData.images = this.zonesImages;
    
            this.changeDetect.detectChanges();
        }
    }
    
    
    searchCompanyFranchise() {
        const modal = this._modalService.open(ModalAddCompanyFranchiseComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
        });
        this.zoneFranchise =[];
        modal.result.then(
            (data) => {
                let datos = [];
                
                if (data) {
                
                    data.forEach((element) => {
    
                        if (this.zoneData.id > 0) {
                            datos = this.zoneTable.find((x) => x.companyId == element.id);
    
                        if (!datos) {
                          
                            if (this.zoneData.id > 0) {
                              
                                let franchises : any =[];
            
                                    franchises.push(element.id)
                            
                                this.stateEasyrouteService.addCompanyZone(this.zoneData.id ,franchises).subscribe(
                                    (data: any) => {
                                     
                                        this._toastService.displayWebsiteRelatedToast(
                                            this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                                        );
                                        this.refreshFormato();
                                    },
                                    (error) => {
                                        this._toastService.displayHTTPErrorToast(
                                            error.status,
                                            error.error.error,
                                        );
                                    },
                                );
                                return
                               
                            } else {
                                return this.zoneTable;
                            }
                        }
                        } else {
                            
                            const data = this.zoneTable.find((x) => x.id == element.id)
    
                            if (!data) {
                                console.log('!data');
                                this.zoneTable.push({
                                    id: element.id,
                                    nif:element.nif,
                                    name: element.name,
                                    streetAddress: element.streetAddress,
                                });
                            } else {
                                return this.zoneTable;
                            }
                           
                            this.changeDetect.detectChanges();
                           
                        }
                       
                    
                        
                    });
                   
                    return
                }
            },
            (reason) => {
                this._toastService.displayWebsiteRelatedToast(
                    this._translate.instant('GENERAL.YOU_HAVE_NOT_MADE_SELECTION'),
                );
            },
        );
    }
    
    deleteZoneTable(franchiseId: number) {
        this.zoneTable = this.zoneTable.filter(
            (x: any) => x.id !== franchiseId,
        );
        this.zoneTable = this.zoneTable;
        this.changeDetect.detectChanges();
    }
    
    
    deleteZone(zoneId: number) {
      
        if (this.zoneData.id > 0) {
            const modal = this._modalService.open(ModalZoneCompanyFranchiseDeleteComponent, {
                backdrop: 'static',
                backdropClass: 'customBackdrop',
                centered: true
            });
    
            modal.componentInstance.title = this._translate.instant(
                'GENERAL.CONFIRM_REQUEST',
            );
            modal.componentInstance.message = this._translate.instant(
                'GENERAL.BE_SURE_YOU_WANT_TO_DELTE_THIS_STORE?',
            );
    
            modal.result.then(
                (data) => {
                    if (data) {
                        this.stateEasyrouteService
                            .destroyCompanyZone(zoneId)
                            .subscribe(
                                (data: any) => {
                                    
                                    this._toastService.displayWebsiteRelatedToast(
                                        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                                    );
                                    this.refreshFormato();
                                },
                                (error) => {
                                    this._toastService.displayHTTPErrorToast(
                                        error.status,
                                        error.error.error,
                                    );
                                },
                            );
                    }
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        }
    }
    
    refreshFormato() {
        this._activatedRoute.params.subscribe((params) => {
            if (params['id'] !== 'new') {
                this.stateEasyrouteService
                    .getZoneManage(params['id'])
                    .pipe(
                        take(1),
                        map(({ data }) => {
                            return {
                                ...data,
                                images: data.images.map((image) => ({
                                    id: image.id,
                                    image: image.urlimage
                                })),
                            };
                        }),
                    )
                    .subscribe(
                        (resp: any) => {
                            
                            // precios de productos
                            this.zoneData = resp;
                            this.zonesImages = resp.images;
                            this.cardImageBase64 =resp.images.image;
        
                           this.getZoneDeliveryScheduleList();
                           this.getCompanyZoneList();
                            this.changeDetect.detectChanges();
                        },
                        (error) => {
                            this._toastService.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );
                        },
                    );
            }
        });
    }
    
    dateToObject() {
        return dateToObject();
    }
    
    fileChangeEvent($event: any) {
        return this.loadImage64($event);
    }
    
    showModalImgInfo() {
    
        const modal = this._modalService.open( ProductModalImgInfoComponent, {
            centered: true,
            backdrop: 'static',        
        });
    
        modal.componentInstance.type = 'promotion';
        modal.componentInstance.message = true;
    }
    
    addCompanyZoneUpdate (zone :any){
      
        
        let franchises : any =[];
    
        zone.forEach(element => {
            franchises.push(element.id)
        });
    
        this.stateEasyrouteService.addCompanyZone(this.zoneData.id ,franchises).subscribe(
            (data: any) => {
                this.refreshFormato();
            },
            (error) => {
                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
        
    }
    
    ValidatorWindowsStart(control: FormControl): { [s: string]: boolean } {
    
        let formulario: any = this;
    
        if (control.value === formulario.controls['scheduleEnd'].value) {
    
          return {
            confirmar: true
          };
    
        } else if (control.value > formulario.controls['scheduleEnd'].value) {
    
          return {
            sutrast: true
          };
        }
        return null;
    }
    
    ValidatorWindowsEnd(control: FormControl): { [s: string]: boolean } {
    let formulario: any = this;
    
    if (control.value < formulario.controls['scheduleStart'].value) {
    
        return {
    
        sutrast: true
    
        };
    } else if (control.value === formulario.controls['scheduleStart'].value) {
    
        return {
    
        confirmar: true
    
        };
    }
    return null;
    
    }
    
    changetime(event: any, name: string) {
    
        if (event.target.value === '') {
          switch (name) {
            case "scheduleStart":
              this.ZoneFranchiseForm.get('scheduleStart').setValue(secondsToDayTimeAsString(0));
              this.ZoneFranchiseForm.get('scheduleStart').updateValueAndValidity();
              break;
            case "scheduleEnd":
              this.ZoneFranchiseForm.get('scheduleEnd').setValue(secondsToDayTimeAsString(86399));
              this.ZoneFranchiseForm.get('scheduleEnd').updateValueAndValidity();
              break;
            default:
              break;
          }
        } else {
          this.ZoneFranchiseForm.get('scheduleStart').updateValueAndValidity();
          this.ZoneFranchiseForm.get('scheduleEnd').updateValueAndValidity();
        }
    
    }
    
    deleteImage(event:any, image:any){
    
    if (this.zoneData && this.zoneData.id > 0) {
        
        this.stateEasyrouteService.destroyImagenZone(image.id).subscribe(
            (data: any) => {
                this._toastService.displayWebsiteRelatedToast(
                    this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                );
                this.refreshFormato();
            },
            (error) => {
                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
        
    } else {
    
        this.cardImageBase64 = '';
    
        this.zonesImages = [];
    
        this.zoneData.images = [];
    }
    
    }
    
    addDeliveryTime() {
    
        let data = {
    
          name: 'Horario',
    
          scheduleStart: 25200,
    
          scheduleEnd: 79200,
    
          isActive: true
    
        }
    
    
        if (this.zoneData.id > 0) {
    
          this.createDeliveryschedule();
    
        } else {
    
          this.zoneData.zoneSchedule.push(data);
    
          this.deliveryTable.push(data);
    
          this.deliverySchedule = this.deliveryTable;
    
          this.changeDetect.detectChanges();
    
        }
    
    }
    
    createDeliveryschedule() {
    
        let create = {
    
          zoneId: this.zoneData.id,
    
          name: 'Horario',
    
          scheduleStart: 25200,
    
          scheduleEnd: 79200,
    
          isActive: true
        }
    
        this.loading.showLoading();
    
        this.stateEasyrouteService.addZoneDeliverySchedule(create)
          .pipe(take(1))
          .subscribe(
            ({ data }) => {
    
              this.deliverySchedule.push(data);
              this.changeDetect.detectChanges();
              this.loading.hideLoading();
    
            },
            (error) => {
              this._toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
              );
              this.loading.hideLoading();
            }
          );
    
    }
    
    updateDeliverySchedule(deliverySchedule: DeliverySchedule) {
    
        let send = {
          zoneId: this.zoneData.id,
          id: deliverySchedule.id,
          isActive: deliverySchedule.isActive,
          name: deliverySchedule.name,
          scheduleStart: deliverySchedule.scheduleStart,
          scheduleEnd: deliverySchedule.scheduleEnd,
    
        }
        this.loading.showLoading();
    
        this.stateEasyrouteService.editZoneDeliverySchedule(deliverySchedule.id, send)
          .pipe(take(1)).subscribe(
            ({ data }) => {
    
              let index = _.cloneDeep(this.deliverySchedule.findIndex(x => x.id == data.id));
    
              let deliveriesShe = _.cloneDeep(this.deliverySchedule);
    
              deliveriesShe[index] = {
                ...data
              }
              this.deliverySchedule = [];
    
              this.deliverySchedule = deliveriesShe;
    
              this.changeDetect.detectChanges();
    
              this._toastService.displayWebsiteRelatedToast(
                this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                this._translate.instant('GENERAL.ACCEPT')
              );
    
              this.loading.hideLoading();
    
            },
            (error) => {
              this._toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
              );
              this.loading.hideLoading();
            },
          );
    
    }
    
    deliveryScheduleId(index, item) {
    return item.id;
    }
    
    //cuando es crear multitienda editar tabla
    changeDeliveryShedule(event: any, deliverySchedule: DeliverySchedule, name: string) {
    
        switch (name) {
    
            case "name":
    
            if (this.validateInput(event)) {
                deliverySchedule.name = event;
            }
    
            break;
    
            case "scheduleStart":
    
    
            deliverySchedule.
                scheduleStart = dayTimeAsStringToSeconds(event);
    
    
            break;
    
            case "scheduleEnd":
    
    
            deliverySchedule.
                scheduleEnd = dayTimeAsStringToSeconds(event);
    
            break;
    
    
            case "isActive":
    
            deliverySchedule.isActive = event
    
            break;
    
            default:
    
            break;
        }
    
    }
    
    validateInput(value: any) {
    
        if (value != '' || value.length > 0) {
            return true;
        } else {
            return false;
        }
    
    }
    activeDeliverySchedule(event: any, deliveryRates: any) {
    
        const modal = this._modalService.open(DeliveryModalConfirmationComponent, {
    
          centered: true,
          backdrop: 'static'
        });
        if (deliveryRates.isActive) {
    
    
    
          modal.componentInstance.title = this._translate.instant('GENERAL.CONFIRM_REQUEST');
          modal.componentInstance.message = this._translate.instant('GENERAL.INACTIVE?');
    
        } else {
          modal.componentInstance.title = this._translate.instant('GENERAL.CONFIRM_REQUEST');
          modal.componentInstance.message = this._translate.instant('GENERAL.ACTIVE?');
        }
    
    
        modal.result.then((result) => {
          if (result) {
            if (deliveryRates.isActive) {
              deliveryRates = {
                ...deliveryRates,
                isActive: event
              }
              this.updateDeliverySchedule(deliveryRates);
            } else {
              deliveryRates = {
                ...deliveryRates,
                isActive: event
              }
              this.updateDeliverySchedule(deliveryRates);
            }
    
          } else {
            $('#isActiveitem' + deliveryRates.id).prop('checked', deliveryRates.isActive);
          }
        })
    
    
    
      }
    
    //cuando es editar multitienda editar 1 a 1
    changeDeliverySheduleUpdate(event: any, deliverySchedule: DeliverySchedule, name: string) {
    
    switch (name) {
    
        case "name":
    
        deliverySchedule.name = event
    
        if (this.validateInput(deliverySchedule.name)) {
            this.updateDeliverySchedule(deliverySchedule);
        }
    
        break;
    
        case "scheduleStart":
        deliverySchedule.scheduleStart = dayTimeAsStringToSeconds(event);
        if (!this.validtimeStart(deliverySchedule)) {
            this.updateDeliverySchedule(deliverySchedule);
        }
    
        break;
    
        case "scheduleEnd":
    
        deliverySchedule.
            scheduleEnd = dayTimeAsStringToSeconds(event);
        if (!this.validtimeEnd(deliverySchedule)) {
            this.updateDeliverySchedule(deliverySchedule);
        }
    
    
        break;
    
        default:
        break;
    }
    
    }
    
    validtimeStart(hours: any) {
    
    if (hours.scheduleStart > hours.scheduleEnd) {
    
        return true;
    
    } else if (hours.scheduleStart === hours.scheduleEnd) {
    
        return true;
    
    } else {
    
        return false;
    }
    
    }
    
    validtimeEnd(hours: any) {
    
    
    if (hours.scheduleEnd < hours.scheduleStart) {
    
        return true;
    
    } else if (hours.scheduleEnd === hours.scheduleStart) {
    
        return true;
    
    } else {
    
        return false;
    }
    }
    
    validIntervalHours() {
    
        let exist = false;
        this.deliverySchedule.forEach((element, i) => {
    
            if (element.scheduleStart > element.scheduleEnd) {
            exist = true;
            } else if (element.scheduleStart === element.scheduleEnd) {
            exist = true;
            } else if (element.scheduleEnd < element.scheduleStart) {
            exist = true;
            } else if (element.scheduleEnd === element.scheduleStart) {
            exist = true;
            } else {
            exist = false;
            }
        });
        return exist;
    }
    secondToTime(value) {
    return secondsToDayTimeAsString(value);
    }
    
    /* eliminar horarios cuando es creando */
    deleteSheduleZone(echedule: any, id:any){
    
        let data = this.deliverySchedule.indexOf( echedule );
    
        if ( data !== -1 ) {
            console.log('data !=-1');
            this.deliverySchedule.splice( data, 1 );
        }
    
        this.changeDetect.detectChanges();
            
    
    }

    /* eliminar cuando es editar */
    deleteScheduleZoneEdit(deliverySchedule: DeliverySchedule){
    
       
        if (this.zoneData.id > 0) {
            const modal = this._modalService.open(ModalZoneCompanyFranchiseDeleteComponent, {
                backdrop: 'static',
                backdropClass: 'customBackdrop',
                centered: true,
            });
    
            modal.componentInstance.title = this._translate.instant(
                'GENERAL.CONFIRM_REQUEST',
            );
            modal.componentInstance.message = this._translate.instant(
                'GENERAL.ARE_YOU_TO_DELETE_SELECTED_SCHEDULES',
            );
    
            modal.result.then(
                (data) => {
                    if (data) {
       
                        this.stateEasyrouteService
                            .destroyZoneDeliveryScheduleLogict(deliverySchedule.id)
                            .subscribe(
                                (data: any) => {
                                    this._toastService.displayWebsiteRelatedToast(
                                        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                                    );
                                    this.refreshFormato();
                                },
                                (error) => {
                                    this._toastService.displayHTTPErrorToast(
                                        error.status,
                                        error.error.error,
                                    );
                                },
                            );
                    }
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        }
    }

    searchCode(){
    
        this.showCode = false;
    
        $("#tooltip").tooltip('hide');
    
    
    
        setTimeout(() => {
            this.stateEasyrouteService
            .getZoneAutocompleteCode()
            .subscribe(
                (data: any) => {
                   this.ZoneFranchiseForm
                   .get('code')
                   .setValue(data.code);
                   this.ZoneFranchiseForm.get('code').updateValueAndValidity();
    
                   this.showCode = true;
    
                   this.changeDetect.detectChanges();
    
                   this.setTimeoutFuntion();
                },
                (error) => {
                    this.showCode = true;
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        }, 500);
    
    }

    sliceMediaString( text: string, length: number, mediaQuery: string  ): string {
    
        if ( window.matchMedia( mediaQuery ).matches && text.length > length ) {
          return text.slice( 0, length ) + '...';
        }
    
        if ( window.matchMedia( mediaQuery ).matches && text.length <= length ) {
          return text;
        }
    
        if ( text.length < 8 ) {
          return text;
        }
    
        return text.slice( 0, 8 ) + '...';
    }


  setTimeoutFuntion() {
    setTimeout(() => {
        init_plugins();
    }, 500);
  }

/* cuendo es crear desde 0 */
  addDeliveryRate() {

    //console.log('crear directo');
    let data = {

        name: 'Entrega',

        order: null,

        price: 0.0,

        minTime: 1,

        maxTime: 1,

        isActive: true,

        express: true
    };

    if (this.zoneData.id > 0) {

        this.createDeliveryRate();
  
      } else {
  
        this.deliveryTableRates.push(data);

        this.delivery = this.deliveryTableRates;
    
  
        this.changeDetect.detectChanges();
  
      }

}

/* Cuando es crear editando */
  createDeliveryRate() {

    let data = {

      zoneId: this.zoneData.id,

      name: 'Entrega',

      order: null,

      price: 0.0,

      minTime: 1,

      maxTime: 1,

      isActive: true,

      express: true
    }

    
    this.loading.showLoading();

    this.stateEasyrouteService.addZoneDelivery(data)
      .pipe(take(1))
      .subscribe(
        ({ data }) => {

            this.getZoneDeliveryList();

            /* this.deliveryTableRates.push(data);

            this.delivery = this.deliveryTableRates; */
        
          this.changeDetect.detectChanges();
          this.loading.hideLoading();

        },
        (error) => {
          this._toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
          this.loading.hideLoading();
        }
      );

}

/* cuando es editar table rates 1 a 1 */
  changePrice(event: any, deliveryPrice: Delivery , name: string) {

    switch (name) {
        case "order":
            deliveryPrice.order =  Number(event);
            
            break;

        case "minTime":
            deliveryPrice.minTime = dayTimeAsStringToSeconds(event);
            
            break;

        case "maxTime":
            deliveryPrice.maxTime = dayTimeAsStringToSeconds(event);
            break;

        case "price":
            deliveryPrice.price =  Number(event);
            this.delivery.sort((a, b) =>  b.price - a.price );
            break;

        case "name":
            deliveryPrice.name = event;
            break;

        default:
            break;
        case "isActive":
            deliveryPrice.isActive = event;
            break;
        case "express":
            deliveryPrice.express = event;
            
            break;
    }

}
  changePriceUpdate(event: any, deliveryPrice: Delivery, name: string) {

    switch (name) {
        case "order":
            deliveryPrice = {
                ...deliveryPrice,
                order: Number(event)
            }
            this.updatePreferenceDelivery(deliveryPrice);
            break;

        case "minTime":
            deliveryPrice = {
                ...deliveryPrice,
                minTime: dayTimeAsStringToSeconds(event)
            }
            this.updatePreferenceDelivery(deliveryPrice);
            
           
            break;

        case "maxTime":
            deliveryPrice = {
                ...deliveryPrice,
                maxTime: dayTimeAsStringToSeconds(event)
            }
            this.updatePreferenceDelivery(deliveryPrice);
          
            
            break;

        case "price":
            deliveryPrice = {
                ...deliveryPrice,
                price:  Number(event)
            }
            if (this.patterPrice(deliveryPrice.price) && deliveryPrice.price <= 99999) {
                this.updatePreferenceDelivery(deliveryPrice);
            } else {
                return false;
            }
            
            break;

        case "name":
            deliveryPrice = {
                ...deliveryPrice,
                name: event
            }
            this.updatePreferenceDelivery(deliveryPrice);
            break;

        default:
            break;
    }

}

  patterPrice(price: number)  {
    let rexp = /^[0-9]{1,8}(\.[0-9]{1,2})?$/;

        if (rexp.test(price.toString())) {
            return true;
        } else {
            return false;
        }

}

  activeDeliveryRates(event: any, deliveryRates: any) {

    const modal = this._modalService.open(DeliveryModalConfirmationComponent, {
        
        centered: true,
        backdrop: 'static'
    });
    if (deliveryRates.isActive) {

        modal.componentInstance.title = this._translate.instant('GENERAL.CONFIRM_REQUEST');
        modal.componentInstance.message = this._translate.instant('GENERAL.INACTIVE?');

    } else {
        modal.componentInstance.title = this._translate.instant('GENERAL.CONFIRM_REQUEST');
        modal.componentInstance.message = this._translate.instant('GENERAL.ACTIVE?');
    }


    modal.result.then((result) => {
        if (result) {
            if (deliveryRates.isActive) {
                deliveryRates = {
                    ...deliveryRates,
                    isActive: event
                }
                this.updatePreferenceDelivery(deliveryRates)
            } else {
                deliveryRates = {
                    ...deliveryRates,
                    isActive: event
                }
                this.updatePreferenceDelivery(deliveryRates)
            }

        } else {
            $('#isActiveitemRates' + deliveryRates.id).prop('checked', deliveryRates.isActive);
        }
    })


}

  activeExpressDeliveryRates(event: any, deliveryRates: any) {

    const modal = this._modalService.open(DeliveryModalConfirmationComponent, {
        
        centered: true,
        backdrop: 'static'
    });
    if (deliveryRates.express) {

        

        modal.componentInstance.title = this._translate.instant('GENERAL.CONFIRM_REQUEST');
        modal.componentInstance.message = this._translate.instant('GENERAL.INACTIVE_EXPRESS?');

    } else {
        modal.componentInstance.title = this._translate.instant('GENERAL.CONFIRM_REQUEST');
        modal.componentInstance.message = this._translate.instant('GENERAL.ACTIVE_EXPRESS?');
    }


    modal.result.then((result) => {
        if (result) {
            if (deliveryRates.express) {
                deliveryRates = {
                    ...deliveryRates,
                    express: event
                }
                this.updatePreferenceDelivery(deliveryRates)
            } else {
                deliveryRates = {
                    ...deliveryRates,
                    express: event
                }
                this.updatePreferenceDelivery(deliveryRates)
            }

        } else {
            $('#expresstem' + deliveryRates.id).prop('checked', deliveryRates.express);
        }
    })


}

  deliveryId(index, item){
    return item.id;
}

 updatePreferenceDelivery(zoneDelivery: Delivery){
    

    let sendDelivery = {
        zoneId: this.zoneData.id,
        name: zoneDelivery.name,
        order: zoneDelivery.order,
        minTime: zoneDelivery.minTime,
	    maxTime: zoneDelivery.maxTime,
        price: zoneDelivery.price,
	    isActive: zoneDelivery.isActive,
	    express: zoneDelivery.express
  
      }
      this.loading.showLoading();
  
      this.stateEasyrouteService.editZoneDeliveryList(zoneDelivery.id, sendDelivery)
        .pipe(take(1)).subscribe(
          ({ data }) => {
            this.getZoneDeliveryList();
            /* let index = _.cloneDeep(this.delivery.findIndex(x => x.id == data.id));
  
            let deliveriesShe = _.cloneDeep(this.delivery);
  
            deliveriesShe[index] = {
              ...data
            }
           
            this.deliveryTableRates =[];

            this.delivery = deliveriesShe; */
  
            this.changeDetect.detectChanges();
  
            this._toastService.displayWebsiteRelatedToast(
              this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
              this._translate.instant('GENERAL.ACCEPT')
            );
  
            this.loading.hideLoading();
  
          },
          (error) => {
            this._toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
            );
            this.loading.hideLoading();
          },
        );

}

 validMinTime(hours: any) {

    if (hours.minTime > hours.maxTime) {
    
        return true;
    
    } else if (hours.maxTime === hours.minTime) {
    
        return true;
    
    } else {
    
        return false;
    }
    
}
    
 validMaxTime(hours: any) {
    
    if (hours.maxTime < hours.minTime) {
    
        return true;
    
    } else if (hours.maxTime === hours.minTime) {
    
        return true;
    
    } else {
    
        return false;
    }
}
    
 validIntervalHoursDelivery() {

    let exist = false;
    this.delivery.forEach((element, i) => {

        if (element.minTime > element.maxTime) {
        exist = true;
        } else if (element.minTime === element.maxTime) {
        exist = true;
        } else if (element.maxTime < element.minTime) {
        exist = true;
        } else if (element.maxTime === element.minTime) {
        exist = true;
        } else {
        exist = false;
        }
    });
    return exist;
}

//riders
/* agregar riders */
  searchRiders() {
    const modal = this._modalService.open(ModalAddRidersComponent, {
        size: 'lg',
        centered: true,
        backdrop: 'static',
    });
    modal.result.then(
        (data) => {
            console.log(data, 'cierre de modal');
            let datos = [];
            
            if (data) {
            
                data.forEach((element) => {

                    if (this.zoneData.id > 0) {
                        datos = this.ridersTable.find((x) => x.userId == element.id);
                    if (!datos) {
                        
                        if (this.zoneData.id > 0) {
                            
                            let ridersSend : any =[];
        
                              ridersSend.push(element.id)
                        
                            this.stateEasyrouteService.addRidersZone(this.zoneData.id ,ridersSend).subscribe(
                                (data: any) => {
                                    
                                    this._toastService.displayWebsiteRelatedToast(
                                        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                                    );
                                    this.table.ajax.reload();
                                },
                                (error) => {
                                    this._toastService.displayHTTPErrorToast(
                                        error.status,
                                        error.error.error,
                                    );
                                },
                            );
                            return
                            
                        } else {
                            return this.ridersTable;
                        }
                    }
                    } else {
                        
                        const data = this.ridersTable.find((x) => x.id == element.id)

                        if (!data) {
                            console.log('!data');
                            this.ridersTable.push({
                                id: element.id,
                                name: element.name,
                                surname:element.surname,
                                nationalId:element.nationalId,
                                phone: element.phone,
                            });
                        } else {
                            return this.ridersTable;
                        }
                        
                        this.changeDetect.detectChanges();
                        
                    }
                    
                
                    
                });
                
                return
            }
        },
        (reason) => {
            this._toastService.displayWebsiteRelatedToast(
                this._translate.instant('GENERAL.YOU_HAVE_NOT_MADE_SELECTION'),
            );
        },
    );
}
/* cuando es crear */
  deleteRidersTable(franchiseId: number) {
    this.ridersTable = this.ridersTable.filter(
        (x: any) => x.id !== franchiseId,
    );
    this.ridersTable = this.ridersTable;
    this.changeDetect.detectChanges();
}



//datatables riders
  cargarRiders() {
    let url = environment.apiUrl + 'zone_rider_datatable/' + this.zoneData.id;

    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#ridersZonetable';
    
    this.table = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        order: [0, 'desc'],
        lengthMenu: [10],
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        dom: `
            <"top-button-hide"><'point no-scroll-x table-responsive-md't>
            <'row reset'
                <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
            >
        `,
        buttons: [
            {
                extend: 'colvis',
                text: this._translate.instant('GENERAL.SHOW/HIDE'),
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
        rowCallback: (row, data) => {
           this.ridersTable.push(data);
            this.table.rows()
        },
        columns: [
            
            
            {
                data: 'user.nationalId',
                title: this._translate.instant('FRANCHISE.IDENTIFICATION_DOCUMENT'),
                className: 'withdTo',
                render: (data, type, row) => {
                    if (data == null || data == 0) {
                        return '<span class="text center" aria-hidden="true"> No disponible</span>';
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            '">' +
                            data +
                            '</span>'
                        );
                    }
                },
            },
            {
                data: 'user.name',
                title: this._translate.instant('GENERAL.NAME'),
                render: (data, type, row) => {
                    if (data == null || data == 0) {
                        return '<span class="text center" aria-hidden="true"> No disponible</span>';
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            '">' +
                            data +
                            '</span>'
                        );
                    }
                },
            },
            {
                data: 'user.surname',
                title: this._translate.instant('GENERAL.SURNAME'),
                render: (data, type, row) => {
                    let id = data;
                    if (id.length > 30) {
                        id = id.substr(0, 29) + '...';
                    }
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        id +
                        '</span>'
                    );
                },
            },
            {
                data: 'user.phone',
                title: this._translate.instant('GENERAL.PHONE'),
                render: (data, type, row) => {
                    let id = data;
                    if (id.length > 30) {
                        id = id.substr(0, 29) + '...';
                    }
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        id +
                        '</span>'
                    );
                },
            },
            {
                data: null,
                sortable: false,
                searchable: false,
                title: this._translate.instant('GENERAL.ACTIONS'),
                className: 'dt-body-center',
                render: (data, type, row) => {
                    let botones = '';
                    
                    botones += `<div class="row backgroundColorRow pr-4 pl-4">`;

                    botones += `
                        <div class="text-center deleteriders col p-0 pt-1">
                            <img title="Eliminar" class="icons-datatable point" src="assets/icons/optimmanage/delete-blue.svg">
                        </div>
                    `;

                    botones += `</div>`;
                    return botones;
                },
            },
        ],
    });

    this.initEvents('#ridersZonetable tbody', this.table);
}

  initEvents(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    this.deleteriders(tbody, table);
}

  deleteriders(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'div.deleteriders', function() {
        let data = table.row($(this).parents('tr')).data();
        that.deleteRiders(data.id);
    });
}
/* cuando es eliminar editando zona*/
  deleteRiders(zoneId: number) {

    const modal = this._modalService.open(ModalZoneCompanyFranchiseDeleteComponent, {
        backdrop: 'static',
        backdropClass: 'customBackdrop',
        centered: true
    });

    modal.componentInstance.title = this._translate.instant(
        'GENERAL.CONFIRM_REQUEST',
    );
    modal.componentInstance.message = this._translate.instant(
        'GENERAL.ARE_YOU_SURE_DELETE_THIS_RIDERS',
    );

        modal.result.then(
            (data) => {
                if (data) {
                    this.stateEasyrouteService
                        .destroyRidersTable(zoneId)
                        .subscribe(
                            (data: any) => {
                                
                                this._toastService.displayWebsiteRelatedToast(
                                    this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                                );
                                this.ridersTable=[];
                                this.table.ajax.reload();
                            },
                            (error) => {
                                this._toastService.displayHTTPErrorToast(
                                    error.status,
                                    error.error.error,
                                );
                            },
                        );
                }
            },
            (error) => {
                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
        
    }
    
    loadDataRidersTable(data: any){
        this.ridersTable = data;
        console.log(this.ridersTable, 'this.ridersTable loadDataRidersTable');
    }
    
    hideMultidelegation() {

        if (!this.isAdminGlobal() && this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company.active_modules && 
            this.profile.company.active_modules.find(x => x.id === 2) &&
            this.profile.company.hideMultidelegation) {
    
            return false;

        } 

        return true;
        
    }

    isAdminGlobal() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1) !== undefined
            : false;
    }

}

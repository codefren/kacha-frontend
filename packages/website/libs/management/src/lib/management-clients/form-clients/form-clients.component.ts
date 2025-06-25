import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    ToastService,
    LoadingService,
    DurationPipe,
} from '@optimroute/shared';
import { Observable, Subject } from 'rxjs';
import {
    Zone,
    AssociatedCompany,
    Point,
    BackendService,
    AllowDelayTime,
} from '@optimroute/backend';
import { DeliveryZones } from '@optimroute/state-delivery-zones';
import {
    FormGroup,
} from '@angular/forms';

import {  take } from 'rxjs/operators';
import * as _ from 'lodash';
import { StatePointsFacade } from '@easyroute/state-points';
import { TranslateService } from '@ngx-translate/core';
import { ManagementPreferences } from '@optimroute/backend';
import {
    NgbDateParserFormatter,
    NgbDatepickerI18n,
    NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment-timezone';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { OptimizationPreferences } from '../../../../../backend/src/lib/types/preferences.type';
import {
    Language,
    MomentDateFormatter,
    CustomDatepickerI18n,
    dateToObject,
    getToday,
} from '../../../../../shared/src/lib/util-functions/date-format';


declare var $: any;

@Component({
    selector: 'easyroute-form-clients',
    templateUrl: './form-clients.component.html',
    styleUrls: ['./form-clients.component.scss'],
    providers: [
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    ],
})

export class FormClientsComponent implements OnInit {

    select: string = 'client_information';
    changeTaps = {
        client_information: 'client_information',
        hours: 'hours',
        your_route_data: 'your_route_data',
        packaging_balance:'packaging_balance',
        balance_boxes: 'balance_boxes',
        settings: 'settings',
        group: 'group',
    };

    isActiveClient: boolean = true;
    idParam: string;
    point: Point;
    clients:Point;



    pointForm: FormGroup;
    unsubscribe$ = new Subject<void>();
    zones: Observable<Zone[]>;
    zones$: Observable<DeliveryZones>;
    loadedZones: boolean = false;
    
    deliveryZoneName_messages: any;
    showSelect: boolean = false;
    showcompanys: boolean = false;
    showAddress: boolean = true;
    focus: boolean;
    deliveryWIndowsStart: string = 'deliveryWIndowsStart';
    deliveryWIndowsEnd: string = 'deliveryWIndowsEnd';
    sutrast: boolean = false;
    confirmar: boolean = false;
    associatedCompany: AssociatedCompany[] = [];
    countrys: any[] = [];
    countrysWithCode: any[] = [];
    countrysWithPhone: any[] = [];
    prefix: any = '';
    userAgent: any[];
    deliveryPointId: string;
    showUseBillingAddress: boolean = false;
    managementPreferences$: Observable<ManagementPreferences>;
    optimizationPreferences$: Observable<OptimizationPreferences>;
    toggleDirections: boolean = true;
    toggleObservations: boolean = true;
    listDirecctions: any = [];
    listSecundaryPhone: any = [];
    listObservation: any = [];
    observation: any = [];
    phone: any = [];
    addresses: any = [];
    companyProfileTypeId: number;
    deliveryPointServiceType: any;
    deliveryZoneSpecificationType: any;
    showServiceType: boolean = true;
    toggleSecundaryPhone: boolean = true;
    toggleSchedule: boolean = true;
    loadingSchedule: boolean = false;
    type: any[] = [];
    companyTimeZone: any[] = [];
    error: boolean = false;
    copyScheduleDay: any;
    table: any;
    tableDeliveryPointMove: any;
    imageError: string = '';
    franchiseImages: {
        id: number;
        urlImage: string;
        image?: string;
    }[] = [];
    state: 'local' | 'server';

    allowDelayTime: AllowDelayTime[] = [];
    showDelaySeccion: boolean = false;

    change = {
        client: 'client',
        route: 'route',
        schedule: 'schedule',
    };

    default = 'client';

    statusDeliveryPoint: any;

    showStatusDeliveryPoint: boolean = true;

    typeViset: any[] = [];

    loadingVisit: boolean = false;

    paymentTypeId: any[];

    paymentShow: boolean = false;

    dateNow: NgbDateStruct = dateToObject(getToday());

    promotionReadOnly: boolean = false;

    dateCreatedAt: any;

    dateDisabledAt: any;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private toastService: ToastService,
        private backendService: BackendService,
        private detectChanges: ChangeDetectorRef,
        private loadingService: LoadingService,
        private facade: StatePointsFacade,
        private translate: TranslateService,
        public durationPipe: DurationPipe,
        public authLocal: AuthLocalService,
        private stateEasyrouteService: StateEasyrouteService,
    ) {}

  


    ngOnInit() {
        this.loadingService.showLoading();

        this.validateRoute();
        //this.getDeliveryPointPaymentTypeId();
    }

  

    validateRoute() {

        this._activatedRoute.params.pipe(take(1)).subscribe(({ id }) => {

            this.idParam = id;
            
            if (id === 'new') {

                this.point = new Point();

                this.clients = new Point();
                
                this.loadingService.hideLoading();

            } else {

                this.deliveryPointId = id;

                this.backendService
                    .get(`delivery_point/${id}`)
                    .pipe(take(1))
                    .subscribe(
                        ({ data }) => {

                            this.point = data;

                            this.clients = data;

                            this.getImage();
                        

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
               
            }
        });
    }

    /* Cargar imagenes */
    getImage() {
        if (this.point.id.length > 0 && this.point.id != null) {
            this.stateEasyrouteService
                .getCompanyImagenClient(this.point.id)
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.franchiseImages = this.franchiseImages.concat(data.data);

                        this.point.images = this.franchiseImages;

                        this.detectChanges.detectChanges();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(error.error);
                    },
                );
        }
    }

    /* no tocar */
    fileChangeEvent($event: any) {

        return this.loadImage64($event);

    }

    loadImage64(e: any) {
        
        this.imageError = '';
        
        const allowedTypes = ['image/jpeg', 'image/png'];
    
        const reader = new FileReader();
    
        const maxSize = 1000000;
    
        
        let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        
        if (file.size > maxSize) {
            this.imageError = 'Tamaño máximo permitido ' + '('+maxSize / 1000 / 1000 + 'Mb' +')';
            return;
        }
        
        if (!allowedTypes.includes(file.type)) {
            this.imageError = 'Formatos permitidos ( JPG | PNG )';
            return;
        }
        
    
        reader.onload = this.validateSizeImg.bind( this );
    
        reader.readAsDataURL( file );
    
        $("input[type='file']").val('');
        
    }

    validateSizeImg( $event) {
        const reader = $event.target.result;
        
        let data = {
            id: null,
            image: reader,
            urlImage: reader,    
            main: false 
            
        };
        
        this._handleUpdateImage(data);
        
        return reader;
    }

    _handleUpdateImage(image: any) {
    
        delete image.urlImage;
    
        if ( this.point.id.length > 0 &&  this.idParam !='new') {

            this.loadingService.showLoading();
    
            this.stateEasyrouteService
                .createCompanyImageClient({ ...image, deliveryPointId: this.point.id })
                .pipe(take(1))
                .subscribe(
                    (dataImage: any) => {
                        
                        image = {
                            id: dataImage.data.id,
                            urlimage: dataImage.data.image,
                            image: dataImage.data.image,
                        };
    
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
    
                        this.franchiseImages = this.franchiseImages.concat([image]);
                        this.point.images = this.franchiseImages;
    
                        this.loadingService.hideLoading();
    
                        this.detectChanges.detectChanges();
                    },
    
                    (error) => {
                        this.toastService.displayHTTPErrorToast(error.error);
                        this.loadingService.hideLoading();
                    },
                );
        }
        else {
            // cuando es nuevo se le asigna un id temporal a la imagen para poder filtrarlo

            image.id = Date.now();

            this.franchiseImages = this.franchiseImages.concat([image]);
            this.point.images = this.franchiseImages;
            this.detectChanges.detectChanges();
        }
    }

    _handleDeleteImage(franchiseImageId: number, franchiseImage?: string) {
    
        if (this.point.id.length > 0 && this.idParam !='new') {
    
            this.stateEasyrouteService
                .deleteCompanyImageClient(franchiseImageId)
                .pipe(take(1))
                .subscribe(
                    (resp) => {
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
    
                        this.franchiseImages = this.franchiseImages.filter(
                            (image) => image.id !== franchiseImageId,
                        );
                        
                        //this.point.images = this.franchiseImages;
                        this.detectChanges.detectChanges();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(error.error);
                    },
                );
        } 
        else {

            this.franchiseImages = this.franchiseImages.filter(
                (image) => image.id !== franchiseImageId,
            );

            this.point.images = this.franchiseImages;
            this.detectChanges.detectChanges();
        }
    }

    /*  */


    // Activar o desactivar no tocar
    changeActive(event: any){

        this.isActiveClient = event;

        this.point.isActive = event;

        if (this.point && this.point.id.length > 0 && this.idParam !='new') {

            const clonePoint: any = _.cloneDeep(this.point);

            delete clonePoint.company;
            delete clonePoint.images;
            delete clonePoint.phoneNumberTransformedApp;
            delete clonePoint.created_by_user;
            delete clonePoint.agent_user;
            delete clonePoint.delivery_zone;
            delete clonePoint.company_associated;
            delete clonePoint.delivery_point_schedule_type;
            delete clonePoint.delivery_point_payment_type;
            delete clonePoint.schedule;
            delete clonePoint.scheduleVisit;
            delete clonePoint.deliveryWindowStart;
            delete clonePoint.deliveryWindowEnd;
            delete clonePoint.conceptSecundaryPhone;
           
            this.updatePoint([this.point.id, clonePoint]);
           
            this.facade.updated$.pipe(take(2)).subscribe(
                (resp) => {
                    if (resp) {
                        if (resp) {
                            this.loadingService.hideLoading();
                            this.toastService.displayWebsiteRelatedToast(
                                this.translate.instant('CLIENTS.UPDATE_CLIENT'),
                                this.translate.instant('GENERAL.ACCEPT'),
                            );

                            this.detectChanges.detectChanges();
                        }
                    }
                    (error) => {
                        this.loadingService.hideLoading();
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CLIENTS.UPDATE_CLIENT'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );

                        this.detectChanges.detectChanges();
                    };
                },
                (error) => {
                    console.log(error);
                    this.loadingService.hideLoading();
                    this.toastService.displayHTTPErrorToast(
                        error,
                        'error al actualizar',
                    );
                },
            );
        }
    }

   
    
    updatePoint(obj: [string, Partial<Point>]) {
        this.facade.editPoint(obj[0], obj[1]);
    }

    returnsDate(date:any){

        if (date) {
            return moment(date).format('DD/MM/YYYY')
        } else {
            return '00/00/0000'
        }
    }

    /* NO TOCAR */

    changePage(name: string) { // Eliminar
        this.default = this.change[name];

        this.detectChanges.detectChanges();
    }

    changePageTaps(name: string) {
        
        this.select = this.changeTaps[name];
    
        this.detectChanges.detectChanges();
    }

    getData(data: any){
    
        this.point = data;

        console.log(this.point, 'llegado ouput')
    
      }
    


}

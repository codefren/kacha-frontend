import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatePointService } from '../../../../../state-points/src/lib/state-point.service';
import { IntegrationMessages } from '@optimroute/shared';
import { BackendService, Integration } from '@optimroute/backend';
import {
    NgbDateStruct,
    NgbDateParserFormatter,
    NgbDatepickerI18n,
    NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $;
import {
    dateToObject,
    getToday,
    objectToString,
    Language,
    MomentDateFormatter,
    CustomDatepickerI18n,
    dateToDDMMYYY,
    dateNbToDDMMYYY,
    parseDate,
} from '../../../../../shared/src/lib/util-functions/date-format';
import { Zone } from '../../../../../backend/src/lib/types/delivery-zones.type';
import { Observable, Subject } from 'rxjs';
import { DeliveryZones } from '../../../../../state-delivery-zones/src/lib/+state/delivery-zones.reducer';
import { StateDeliveryZonesFacade } from '../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { StateEasyrouteFacade } from '../../../../../state-easyroute/src/lib/+state/state-easyroute.facade';
import { takeUntil, take } from 'rxjs/operators';
import { ModalIntegrationRoutesComponent } from './modal-integration-routes/modal-integration-routes.component';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { DurationPipe } from '../../../../../shared/src/lib/pipes/duration.pipe';
import { integrationDeliveryZone } from '../../../../../backend/src/lib/types/integration-delivery-zone.type';
import { ModalIntegrationAddPointsComponent } from './modal-integration-add-points/modal-integration-add-points.component';
import { Point } from '../../../../../backend/src/lib/types/point.type';
import { ModalIntegrationConfirmDeleteZonesComponent } from './modal-integration-confirm-delete-zones/modal-integration-confirm-delete-zones.component';
import { ModalIntegrationConfirmDeleteDeliveryPointsComponent } from './modal-integration-confirm-delete-delivery-points/modal-integration-confirm-delete-delivery-points.component';
import { ModalIntegrationUpdateDeliveryPointComponent } from './modal-integration-update-delivery-point/modal-integration-update-delivery-point.component';
import { downloadFile } from '../../../../../shared/src/lib/util-functions/download-file';

@Component({
    selector: 'easyroute-form-integration',
    templateUrl: './form-integration.component.html',
    styleUrls: ['./form-integration.component.scss'],
    providers: [
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    ],
})
export class FormIntegrationComponent implements OnInit {
    Form: FormGroup;
    integration: any;
    integration_messages: any;
    dateNow: NgbDateStruct = dateToObject(getToday());
    dateFormate: any;
    orderDate: any = null;
    zones$: Observable<DeliveryZones>;
    zones: Zone[];
    zonestables: Zone;
    unsubscribe$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private Router: Router,
        private loading: LoadingService,
        private _translate: TranslateService,
        private durationPipe: DurationPipe,
        private dialog: NgbModal,
        private toast: ToastService,
        public authLocal: AuthLocalService,
        private changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private statePointService: StatePointService,
        private zoneFacade: StateDeliveryZonesFacade,
        private easyRouteFacade: StateEasyrouteFacade,
        private backend: BackendService,
    ) {}

    ngOnInit() {
        let _now = moment(new Date()).toObject();
        this.orderDate = {
            year: _now.years,
            month: _now.months + 1,
            day: _now.date,
        };
        this.loadRoute();
    }
    /* state que trae las rutas cargadas de zonas */
    loadRoute() {
        this.load();
    }

    /* hace peticion y trae los 3 campos del formulario por los momentos */
    load() {
        this._activatedRoute.params.subscribe((params) => {
            if (params['id'] !== 'new') {
                this.loading.showLoading();
                this.statePointService.getIntegrationSession(params['id']).subscribe(
                    (resp: any) => {
                        this.integration = resp.data;

                        console.log(this.integration);

                        if (this.integration.dateSession !== null) {
                            let _orderDate = moment(
                                this.integration.dateSession,
                            ).toObject();

                            this.orderDate = {
                                year: _orderDate.years,

                                month: _orderDate.months + 1,

                                day: _orderDate.date,
                            };
                        }
                        if (!this.integration.integration_delivery_zones || this.integration.integration_delivery_zones.length === 0) {
                            this.addRoutes();
                        }

                        this.validaciones();
                        this.loading.hideLoading();
                    },
                    (error) => {
                        this.loading.hideLoading();
                        this.toast.displayHTTPErrorToast(error.status, error.error);
                    },
                );
            } else {
                this.integration = new Integration();
                this.validaciones();
            }
        });
    }
    /* Validaciónes del formulario */
    validaciones() {
        this.Form = this.fb.group({
            name: [this.integration.name, [Validators.required, Validators.minLength(2)]],
            description: [this.integration.description, [Validators.maxLength(300)]],
            integrationSessionTypeId: [this.integration.integrationSessionTypeId],
            dateSession: [this.orderDate],
        });

        let integration_messages = new IntegrationMessages();
        this.integration_messages = integration_messages.getIntegrationMessages();
    }

    /* Modal de agregar rutas se envia los datos via imput al modal de las zonas que obtuvo anterior mente */
    addRoutes() {
        const dialogRef = this.dialog.open(ModalIntegrationRoutesComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
            size: 'lg',
        });
        dialogRef.result.then((data) => {
            if (data && data.length > 0) {
                this.integrationSesion(data);
                this.changeDetectorRef.detectChanges();
            }
        });
    }
    /* funcion para enviar al api la integración de rutas */
    integrationSesion(dataInit: any) {
        let deliveyZones = [];

        dataInit.forEach((element) => {
            deliveyZones.push({
                id: element.id,
            });
        });

        let datos = deliveyZones;

        this.statePointService
            .createIntegrationSessionDeliveryPoint(this.integration._id, datos)
            .subscribe(
                (data: any) => {
                    dataInit.forEach((element) => {
                        if(this.integration.integration_delivery_zones){
                            this.integration.integration_delivery_zones.push(
                                data.data.integration_delivery_zones.find(
                                    (x) => x.deliveryZoneId === element.id,
                                ),
                            );
                        } else {
                            this.integration.integration_delivery_zones = [];
                            this.integration.integration_delivery_zones.push(
                                data.data.integration_delivery_zones.find(
                                    (x) => x.deliveryZoneId === element.id,
                                ),
                            );
                        }

                    });

                    //  this.integration =data.data;
                    this.loading.hideLoading();

                    this.toast.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                    );
                    if (this.integration.integration_delivery_zones.length === 1) {
                        this.modalAddPonits(
                            this.integration.integration_delivery_zones[0].deliveryZoneId,
                        );
                    }
                },
                (error) => {
                    this.loading.hideLoading();
                    this.toast.displayHTTPErrorToast(error.status, error.error);
                },
            );
    }

    startDateSelect(event: any) {
        let dateformat = objectToString(event);
        this.dateFormate = dateformat;
    }
    /* funcion para actualizar  formulario*/
    submit() {
        let dataform = _.cloneDeep(this.Form.value);

        dataform.dateSession = dateNbToDDMMYYY(this.Form.value.dateSession);

        dataform.dateSession = moment(this.dateFormate).format('YYYY-MM-DD');

        dataform.id = this.integration._id;
        if (this.integration._id && this.integration._id != null) {
            this.loading.showLoading();
            this.statePointService
                .updateIntegrationSession(this.integration._id, dataform)
                .subscribe(
                    (data: any) => {
                        this.loading.hideLoading();
                        this.toast.displayWebsiteRelatedToast(
                            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                            this._translate.instant('GENERAL.ACCEPT'),
                        );
                        this.Router.navigate(['integration']);
                    },
                    (error) => {
                        this.loading.hideLoading();
                        this.toast.displayHTTPErrorToast(error.status, error.error);
                    },
                );
        } else {
            this.loading.showLoading();

            this.statePointService.createIntegrationSession(dataform).subscribe(
                (data: any) => {
                    this.loading.hideLoading();

                    this.toast.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.REGISTRATION'),
                        this._translate.instant('GENERAL.ACCEPT'),
                    );

                    this.Router.navigate(['integration', data.data._id]);
                },
                (error) => {
                    this.loading.hideLoading();

                    this.toast.displayHTTPErrorToast(error.status, error.error);
                },
            );
        }
    }
    /* modal para agrear nuevo puntos */
    modalAddPonits(deliveryZoneId: string) {
        const dialogRef = this.dialog.open(ModalIntegrationAddPointsComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
            size: 'lg',
        });

        dialogRef.result.then((data) => {
            if (data && data.length > 0) {
                this.addNewDeliveryPoints(deliveryZoneId, data);
                this.changeDetectorRef.detectChanges();
            }
        });
    }
    /* peticion al api para agrear nuevo punto */
    addNewDeliveryPoints(deliveryZoneId: string, point: any) {
        let data: any;

        let deliveyPoints = [];

        point.forEach((element) => {
            deliveyPoints.push({
                id: element.id,
            });
        });

        data = {
            id: this.integration._id,
            deliveryZoneId: deliveryZoneId,
            deliveryPoints: deliveyPoints,
        };
        this.loading.showLoading();
        this.statePointService.addIntegrationSessionDeliveryPoints(data).subscribe(
            (data: any) => {
                point.forEach((element) => {
                    this.integration.integration_delivery_zones
                        .find((x) => x.deliveryZoneId === deliveryZoneId)
                        .integration_delivery_points.push(
                            data.data.integration_delivery_zones
                                .find((x) => x.deliveryZoneId === deliveryZoneId)
                                .integration_delivery_points.find(
                                    (x) => x.deliveryPointId === element.id,
                                ),
                        );
                });
                this.loading.hideLoading();

                this.toast.displayWebsiteRelatedToast(
                    this._translate.instant('GENERAL.REGISTRATION'),
                );
            },
            (error) => {
                this.loading.hideLoading();

                this.toast.displayHTTPErrorToast(error.status, error.error);
            },
        );
    }
    /* funcion para eliminar punto */
    openModalDeleteDeliveryPoints(DeliveryPointsId: number, data: any, deliveryZoneId:string) {
        const dialogRef = this.dialog.open(
            ModalIntegrationConfirmDeleteDeliveryPointsComponent,
            {
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static',
                // size:'lg'
            },
        );
        dialogRef.result.then((data) => {
            if (data) {
                this.deleteDeliveryPoints(DeliveryPointsId, deliveryZoneId);
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /* peticion al api para eliminar punto */
    deleteDeliveryPoints(DeliveryPointsId: number, deliveryZoneId) {
        let data: any;
        data = {
            id: this.integration._id,
            integrationDeliveryPoints: [
                {
                    id: DeliveryPointsId,
                },
            ],
            deliveryZoneId
        };

        const points = this.integration.integration_delivery_zones
            .find((x) => x.deliveryZoneId === deliveryZoneId)
            .integration_delivery_points.filter((x) => +x.id !== +DeliveryPointsId);

        this.statePointService.deleteIntegrationSessionDeliveryPoints(data).subscribe(
            (data: any) => {
                this.integration.integration_delivery_zones.find(
                    (x) => x.deliveryZoneId === deliveryZoneId,
                ).integration_delivery_points = points;

                this.loading.hideLoading();

                this.toast.displayWebsiteRelatedToast(
                    this._translate.instant('GENERAL.REGISTRATION'),
                );
            },
            (error) => {
                this.loading.hideLoading();

                this.toast.displayHTTPErrorToast(error.status, error.error);
            },
        );
    }
    /* modal para eliminar zona */
    openModalDeleteDeliveryZones(deliveryZoneId: any) {
        const dialogRef = this.dialog.open(ModalIntegrationConfirmDeleteZonesComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.result.then((data) => {
            if (data) {
                console.log(data, 'cierre del modal datos llenos');
                this.deleteDeliveryZones(deliveryZoneId);
                this.changeDetectorRef.detectChanges();
            }
        });
    }
    /* petición para eliminar zona */
    deleteDeliveryZones(deliveryZoneId: any) {
        let data: any;
        data = {
            id: this.integration.id,
            integrationDeliveryZones: [
                {
                    id: deliveryZoneId,
                },
            ],
        };
        this.loading.showLoading();

        this.statePointService.deleteIntegrationSessionDeliveryZones(data).subscribe(
            (data: any) => {
                this.integration.integration_delivery_zones = this.integration.integration_delivery_zones.filter(
                    (x) => x.id !== deliveryZoneId,
                );
                this.changeDetectorRef.detectChanges();
                this.loading.hideLoading();

                this.toast.displayWebsiteRelatedToast(
                    this._translate.instant('GENERAL.REGISTRATION'),
                );
            },
            (error) => {
                this.loading.hideLoading();

                this.toast.displayHTTPErrorToast(error.status, error.error);
            },
        );
    }

    openModalEditDeliveryPoints(DeliveryPointsId: number, dataPoint: any, deliveryZoneId: string) {
        const dialogRef = this.dialog.open(ModalIntegrationUpdateDeliveryPointComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            size: 'md',
            backdrop: 'static',
            windowClass: 'modal-document',
        });

        dialogRef.componentInstance.dataPoint = dataPoint;

        dialogRef.result.then((data) => {
            console.log(data);
            if (data) {
                this.editDeliveryPoints(DeliveryPointsId, {
                    ...data,
                    deliveryZoneId: deliveryZoneId,
                    integrationSessionId: this.integration._id
                });
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    editDeliveryPoints(DeliveryPointsId: number, data: any) {
        this.loading.showLoading();
        this.statePointService
            .updateIntegrationDeliveryPoint(DeliveryPointsId, data)
            .subscribe(
                (data: any) => {
                    this.toast.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                        this._translate.instant('GENERAL.ACCEPT'),
                    );
                    console.log(data);
                    this.load();
                },
                (error) => {
                    this.loading.hideLoading();
                    this.toast.displayHTTPErrorToast(error.status, error.error);
                },
            );
    }

    parseDate(date: string) {
        return parseDate(date);
    }

    DeleteWhiteSpaces(text) {
        return text.replace(/\s/g, '');
    }

    downloadFileCsv() {

        let url = 'integration_session_csv/' + this.integration._id;

        return this.backend.getCsvIntegrationDeliveryPoint(url).then((data: string) => {});
    }
}

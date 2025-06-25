import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnDestroy,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { BackendService, OptimizationPreferences, Vehicle, Zone } from '@optimroute/backend';
import {
    ErrorDialogComponent,
    ImportedDeliveryPointArrayDto,
    removeNulls,
    dayTimeAsStringToSeconds,
    ImportedDeliveryPointDtoErrors,
    objectToString,
    LoadingService,
    ConfirmModalComponent,
    ToastService
} from '@optimroute/shared';
import {
    PlanningDeliveryZone,
    RoutePlanningFacade,
    RoutePlanningViewingMode,
    RoutePlanningState,
    DeliveryZoneStatus,
    Route,
    RoutePlanningMapStage,
    DeliveryPoint
} from '@optimroute/state-route-planning';
import { plainToClass } from 'class-transformer';
import { validate, Validator } from 'class-validator';
import * as csv from 'csvtojson';
import { RoutePlanningService } from '../route-planning.service';
import { preloadedSession } from './harcoded-preloaded-session';
import { ExportDialogComponent } from 'libs/route-planning/shared/src/lib/export-dialog/export-dialog.component';
import { PrintDialogComponent } from 'libs/route-planning/shared/src/lib/print-dialog/print-dialog.component';
var CoordinatesParser = require('coordinate-parser');

import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { take, takeUntil } from 'rxjs/operators';
import { SelectDateComponent } from 'libs/route-planning/shared/src/lib/select-date/select-date.component';
import { ModalIntegrationComponent } from './modal-integration/modal-integration.component';
import { ModalRecoverOptimizationComponent } from './modal-recover-optimization/modal-recover-optimization.component';
import { Observable, Subject } from 'rxjs';
import { SaveRouteComponent } from './save-route/save-route.component';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryZones } from '@optimroute/state-delivery-zones';
import { ModalIntegrationRoutesComponent } from './modal-integration-routes/modal-integration-routes.component';
import { ModalDeliveryPointPendingComponent } from './modal-delivery-point-pending/modal-delivery-point-pending.component';
import { ModalAutomaticOptimizationComponent } from './modal-automatic-optimization/modal-automatic-optimization.component';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import { ModalPointPendingComponent } from './modal-point-pending/modal-point-pending.component';
import { KeyValuePipe } from '@angular/common';
import * as moment from 'moment';
import { VisitsPlanningComponent } from './visits-planning/visits-planning.component';
import { ModalMultiIntegrationComponent } from './modal-multi-integration/modal-multi-integration.component';
import { FinishAssignateComponent } from './finish-assignate/finish-assignate.component';
import { exportEvaluateds, ExportFormat, exportOptimizations } from '@optimroute/export-integration';
import { ModalLoadTemplateComponent } from './modal-load-template/modal-load-template.component';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
declare var init_plugins;
@Component({
    selector: 'easyroute-route-planning-toolbar',
    templateUrl: './route-planning-toolbar.component.html',
    styleUrls: ['./route-planning-toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RoutePlanningToolbarComponent implements OnInit, OnDestroy {

    @ViewChild('click_all_zones', { static: false }) checkAll: ElementRef<HTMLElement>;

    @Input()
    optimizationPreferences: OptimizationPreferences;

    @Input()
    routePlanning: RoutePlanningState;

    isOptimizedRoutesActive: boolean = false;

    areOptimizedRoutesModified: boolean;

    unsubscribe$ = new Subject<void>();
    mapStage: RoutePlanningMapStage = RoutePlanningMapStage.empty;

    mapStageSubscription: Subscription;

    autoSaveSession: boolean = false;

    searchFilter: string = '';

    deliveryPoints: DeliveryPoint[];

    inputFilter: string;
    viewingMode: number = 0;
    showIntegrationTxt: boolean = false;

    deliveryPointPendingCount$: Observable<number>;

    showIntegrationRoute: boolean = false;
    showIntegrationDeliveryPoint: boolean = false;
    profileSettings: any;

    constructor(
        private facade: RoutePlanningFacade,
        private service: RoutePlanningService,
        private dialog2: MatDialog,
        private dialog: NgbModal,
        private authService: AuthLocalService,
        private preferencesFacade: PreferencesFacade,
        private profileSettingsFacade: ProfileSettingsFacade,
        private loadingService: LoadingService,
        private backend: BackendService,
        private vehicleFacade: VehiclesFacade,
        private toast: ToastService,
        private pipeKeyValue: KeyValuePipe
    ) { }

    ngOnInit() {
        console.log(this.routePlanning, 'routePlanning');
        this.autoSaveSession = false;
        this.mapStageSubscription = this.facade.mapStage$.subscribe(
            (mapStage) => (this.mapStage = mapStage),
        );
        this.preferencesFacade.optimizationPreferences$.pipe((takeUntil(this.unsubscribe$))).subscribe((data) => {
            this.autoSaveSession = data.createSession.autoSaveSession;
            this.showIntegrationRoute = data.activateRouteIntegration;
        });


        this.profileSettingsFacade.profile$.pipe((takeUntil(this.unsubscribe$))).subscribe((data) => {
            this.showIntegrationTxt = data.company.integrationTxt;
        });

        this.facade.viewingMode$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
            if (data !== this.viewingMode) {
                this.inputFilter = '';
                this.viewingMode = data;
                this.deliveryPoints = [];
            }
        });

        this.deliveryPointPendingCount$ = this.facade.deliveryPointPending$;
    }

    haveOptimized(zonesStatus: { [key: number]: DeliveryZoneStatus }) {
        for (let zoneId in zonesStatus) {
            if (zonesStatus[zoneId].optimized) return true;
        }
        return false;
    }

    haveEvaluate(zonesStatus: { [key: number]: DeliveryZoneStatus }) {
        for (let zoneId in zonesStatus) {
            if (zonesStatus[zoneId].evaluated) return true;
        }
        return false;
    }


    importTxt(files: File[]) {
        let textArray = [];
        const length = files.length;
        let indexFile = 0
        Object.keys(files).forEach(index => {

            let file = files[index];
            let fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = (e) => {
                indexFile += 1;
                const text = fileReader.result.toString();
                textArray = textArray.concat(text.split('\n'));
                if (length === +(indexFile)) {
                    this.loadingService.showLoading();
                    this.backend.post('integration/route_planning/process_txt', { data: textArray }).pipe(take(1))
                        .subscribe((response) => {

                            const deliveryPoints = response.data
                            this.validateJSON(JSON.stringify({ deliveryPoints }));
                            this.loadingService.hideLoading();
                        }, (error) => {
                            console.log(error);
                            this.toast.displayHTTPErrorToast(error.error.code, error.error.error);
                            this.loadingService.hideLoading();
                        })
                }
            };
        });
    }


    addRoute() {
        const dialogRef = this.dialog.open(ModalIntegrationRoutesComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
            size: 'lg'
        });
        dialogRef.result.then((datos) => {
            if (datos && datos.length > 0) {
                this.facade.createRouteWithZones({
                    deliveryZones: datos.map(x => x.id),
                    warehouse: this.optimizationPreferences.warehouse
                });
            }
        })
    }
    importPlanSession(file: File) {
        if (
            !this.optimizationPreferences.warehouse.coordinates ||
            !this.optimizationPreferences.warehouse.coordinates.latitude ||
            !this.optimizationPreferences.warehouse.coordinates.longitude
        ) {
            const dialogHTML = `<div style="width: auto; height:auto; display: flex; flex-direction: column; align-items: center; justify-content: center">
                                    <h3>La dirección del almacén no está definida.</h3>
                                    <h4><p style="color: #2f2e2e !important;">Dirigase a preferencias de optimización para añadir una dirección e intentelo de nuevo</p></h4>

                                </div>`;
            this.openImportedFileErrorDialog(dialogHTML);
            return;
        }

        let fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = (e) => {
            if (file.type === 'application/json') {
                this.validateJSON(fileReader.result.toString());
            } else {
                this.validateCSV(fileReader.result.toString());
            }
        };
    }

    preLoadMockPlanningSession() {
        this.validateJSON(JSON.stringify(preloadedSession));
    }

    private async validateCSV(fileContent: string) {
        let header = {
            id: {},
            address: {},
            'coordinates.latitude': {},
            'coordinates.longitude': {},
            name: {},
            deliveryZoneId: {},
            'deliveryWindow.start': {},
            'deliveryWindow.end': {},
            demand: {},
            volumetric: {},
            serviceTime: {},
            priority: {},
            deliveryNotes: {},
            sendDeliveryNoteMail: {},
            agentUserMail: {},
            requiredSignature: {},
            email: {},
            phoneNumber: {},
            population: {},
            deliveryType: {},
            orderNumber: {},
            nif: {},
            postalCode: {}
        };
        let json: any;
        await csv({
            trim: true,
            noheader: false,
            checkType: true,
            ignoreEmpty: true,
            colParser: {
                id: 'string',
                name: 'string',
                deliveryZoneId: 'string',
                deliveryNotes: 'string',
                'coordinates.latitude': 'number',
                'coordinates.longitude': 'number',
                'deliveryWindow.start': 'number',
                'deliveryWindow.end': 'number',
                demand: 'number',
                volumetric: 'number',
                serviceTime: 'number',
                priority: 'number',
                sendDeliveryNoteMail: 'boolean',
                agentUserMail: 'string',
                requiredSignature: 'boolean',
                email: 'string',
                phoneNumber: 'string',
                population: 'string',
                deliveryType: 'string',
                orderNumber: 'string',
                nif: 'string',
                postalCode: 'string'
            },
        })
            .fromString(fileContent)
            .then((jsonObj) => {
                json = { deliveryPoints: jsonObj };
            });

        if (json && this.checkHeader(json, header)) this.JSONValidation(json);
    }

    private checkHeader(json, header, position?: number) {
        if (json.deliveryPoints.length > 0) {
            for (let key in json.deliveryPoints[0]) {
                if (!this.checkProperty(json.deliveryPoints[0][key], header, key))
                    return false;
            }
            return true;
        } else {
            const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El archivo debe contener al menos un punto de entrega.</h3>
                                        </div>
                                </div>`;
            this.openImportedFileErrorDialog(dialogHTML);
            return false;
        }
    }

    private checkProperty(object, header, keys) {
        if (typeof object === 'object') {
            for (let key in object) {
                if (!this.checkProperty(object[key], header, keys + '.' + key))
                    return false;
            }
            return true;
        } else {
            if (!header[keys]) {
                const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El archivo contiene un campo en la cabecera (${keys}) que no cumple el formato especificado.</h3>
                                            <h3>Pongase en contacto con su gestor del CRM ya que el documento importado es incorrecto.</h3>
                                        </div>
                                </div>`;
                this.openImportedFileErrorDialog(dialogHTML);
                return false;
            } else return true;
        }
    }

    private validateJSON(fileContent: string): void {
        this.facade.logout();
        let validator = new Validator();
        if (validator.isJSON(fileContent)) {
            let parsedJSON = JSON.parse(fileContent);

            this.JSONValidation(parsedJSON);
        } else {
            const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                    <h3>El JSON importado tiene un mal formato</h3>
                                </div>`;
            this.openImportedFileErrorDialog(dialogHTML);
        }
    }

    private async JSONValidation(parsedJSON: any, type?: string) {

        const deliveryPointsMap: { [key: string]: any } = {};
        const addressDeliveryPointInfo: { id: number; name: string }[] = [];
        const addresses: string[] = [];
        const geocodingDeliveryPointsIds: {
            id: number;
            name: string;
            address: string;
        }[] = [];

        if (parsedJSON.deliveryPoints) {
            if (parsedJSON.deliveryPoints.length === 0) {
                const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El archivo debe contener al menos un punto de entrega.</h3>
                                        </div>
                                </div>`;
                this.openImportedFileErrorDialog(dialogHTML);
                return;
            }
            for (let i = 0; i < parsedJSON.deliveryPoints.length; ++i) {
                if (
                    !this.checkUniqueId(
                        parsedJSON.deliveryPoints[i],
                        deliveryPointsMap,
                        i,
                    ) ||
                    // !this.checkDeliveryWindow(parsedJSON.deliveryPoints[i], i) ||
                    !this.checkGeoCoding(
                        parsedJSON.deliveryPoints[i],
                        addresses,
                        addressDeliveryPointInfo,
                        geocodingDeliveryPointsIds,
                        i,
                    ) ||
                    !this.requiredEmail(
                        parsedJSON.deliveryPoints[i],
                        i
                    )
                )
                    return;
            }
            if (geocodingDeliveryPointsIds.length !== 0) {
                const splitFrom = '<div errors style="text-align: center">';
                const html: string[] = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>Las siguientes direcciones de entrega no cumplen el formato permitido para poder obtener las coordenadas.</h3>
                                            <br>
                                            <h3>La dirección de entrega debe de tener un mínimo de  5 caracteres y un máximo de 200 caracteres.</h3>
                                            <h4><b>ID -- Nombre -- Dirección de entrega</b></h4>
                                            ${splitFrom}
                                            </div>
                                        </div>
                                </div>`.split(splitFrom);
                const errorsArray: string[] = [];
                for (let i = 0; i < geocodingDeliveryPointsIds.length; ++i) {
                    let e = `${geocodingDeliveryPointsIds[i].id} -- ${geocodingDeliveryPointsIds[i].name
                        } -- ${geocodingDeliveryPointsIds[i].address}<br>`;
                    errorsArray.push(e);
                }
                const dialogHTML = html[0].concat(splitFrom, ...errorsArray, html[1]);
                this.openImportedFileErrorDialog(dialogHTML);
                return;
            } else if (addresses.length !== 0) {
                let results;
                try {
                    this.loadingService.showLoading();
                    results = await this.service.geoCode(addresses).toPromise();
                    this.loadingService.hideLoading();
                } catch (e) {
                    this.loadingService.hideLoading();
                    return;
                }
                const nonResolvedCoordinates = [];
                for (let i = 0; i < results.length; ++i) {
                    if (results[i].coordinates) {
                        deliveryPointsMap[addressDeliveryPointInfo[i].id].coordinates =
                            results[i].coordinates;
                    } else {
                        nonResolvedCoordinates.push({
                            id: addressDeliveryPointInfo[i].id,
                            name: addressDeliveryPointInfo[i].name,
                            address: addresses[i],
                        });
                    }
                }
                if (nonResolvedCoordinates.length !== 0) {
                    const splitFrom = '<div errors style="text-align: center">';
                    const html: string[] = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>No se han podido obtener las cordenadas de las siguientes direcciones. Prueba a introducirlas manualmente en el archivo</h3>
                                            <h4><b>ID -- Nombre -- Dirección de entrega</b></h4>
                                            ${splitFrom}
                                            </div>
                                        </div>
                                </div>`.split(splitFrom);
                    const errorsArray: string[] = [];
                    for (let i = 0; i < nonResolvedCoordinates.length; ++i) {
                        let e = `${nonResolvedCoordinates[i].id} -- ${nonResolvedCoordinates[i].name
                            } -- ${nonResolvedCoordinates[i].address}<br>`;
                        errorsArray.push(e);
                    }
                    const dialogHTML = html[0].concat(splitFrom, ...errorsArray, html[1]);
                    this.openImportedFileErrorDialog(dialogHTML);
                    return;
                }
            }
            let deliveryPoints = removeNulls(
                plainToClass(ImportedDeliveryPointArrayDto, parsedJSON),
            ) as ImportedDeliveryPointArrayDto;
            validate(deliveryPoints, { whitelist: true }).then(async (errors) => {
                if (errors.length > 0) {
                    if (
                        errors[0].children.length === 0 &&
                        errors[0].constraints.arrayMinSize
                    ) {
                        const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El archivo debe contener al menos un punto de entrega</h3>
                                        </div>
                                </div>`;
                        this.openImportedFileErrorDialog(dialogHTML);
                    } else {
                        const splitFrom = '<div errors style="text-align: center">';
                        const html: string[] = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El archivo contiene puntos de entrega con un formato incorrecto</h3>
                                            ${splitFrom}
                                            </div>
                                        </div>
                                </div>`.split(splitFrom);
                        let result = '';
                        for (let i = 0; i < errors[0].children.length; ++i) {
                            //errors de un cert punt dentrega
                            const error = errors[0].children[i];
                            for (let field of error.children) {
                                //cert error de un cert punt dentrega
                                result +=
                                    ImportedDeliveryPointDtoErrors[field.property](
                                        field.constraints,
                                        field.children.length > 0 ? field : field.value,
                                        {
                                            position: +error.property + 1,
                                            id: error.value['id'] ? error.value['id'] : '',
                                            name: error.value['name']
                                                ? error.value['name']
                                                : '',
                                        },
                                    ) + '<br>';
                            }
                        }
                        const dialogHTML = html[0].concat(splitFrom, result, html[1]);
                        this.openImportedFileErrorDialog(dialogHTML);
                    }
                    return;
                }


                const optimizationPreferences = await this.preferencesFacade.optimizationPreferences$.pipe(take(1)).toPromise();

                console.log('optimizationPreferences', optimizationPreferences);

                const loadedSession = await this.facade.isPlanningSessionLoaded$.pipe(take(1)).toPromise();
                if (optimizationPreferences.loadSessionIntoRoutePlanning && loadedSession) {

                    const dialogRef = this.dialog.open(ConfirmModalComponent, {
                        size: 'md',
                        backdropClass: 'customBackdrop',
                        centered: true,
                        backdrop: 'static'
                    });
                    dialogRef.componentInstance.message = '¿Desea agregar los puntos a la sesión cargada?';
                    dialogRef.result.then(async (data) => {
                        if (data) {
                            const routePlanning = await this.facade.planningSession$.pipe(take(1)).toPromise();
                            this.loadingService.showLoading();
                            this.facade.loadSessionIntoPlanningRoute(deliveryPoints.deliveryPoints, routePlanning.id);
                            this.facade.moved$.pipe(take(2)).subscribe((loaded) => {
                                if (loaded) {
                                    this.service.recoverSessionById(routePlanning.id).pipe(take(1)).subscribe((data) => {
                                        data.saved = routePlanning;
                                        this.facade.recoverSession(data)

                                        this.facade.isPlanningSessionLoaded$.pipe(take(1)).subscribe((data) => {
                                            if (data) {
                                                this.service.recoverRoutePlanningSession(routePlanning.id).pipe(take(1)).subscribe((data) => {
                                                    if (data.length === 0) {
                                                        this.loadingService.hideLoading();
                                                        return;

                                                    }
                                                    data.zones.forEach((zone: any, index) => {
                                                        this.facade.optimizationSuccess(zone.zoneId, zone);
                                                        if (index + 1 === data.zones.length) {
                                                            this.loadingService.hideLoading();
                                                        }
                                                    });
                                                });

                                                this.facade.getDeliveryPointPending();
                                            }

                                        });
                                    });
                                }
                            })
                            return;
                        } else {
                            console.log('deliveryPoints pruebaa', parsedJSON);
                            this.facade.importPlanSession({
                                deliveryPoints: deliveryPoints.deliveryPoints,
                                warehouse: this.optimizationPreferences.warehouse,
                                options: {
                                    createDeliveryPoints: this.optimizationPreferences.createSession
                                        .createDeliveryPoints,
                                    updateDeliveryPoints: this.optimizationPreferences.createSession
                                        .updateDeliveryPoints,
                                    createDeliveryZones: this.optimizationPreferences.createSession
                                        .createDeliveryZones,
                                    createUnassignedZone: this.optimizationPreferences.createSession
                                        .createUnassignedZone,
                                    setUnassignedZone: this.optimizationPreferences.createSession
                                        .setUnassignedZone,
                                },
                                sessionType: type,
                                vehicle: parsedJSON.vehicle
                            });
                            this.loadingService.showLoading();
                            this.facade.isPlanningSessionLoaded$.pipe((take(2))).subscribe((loaded) => {
                                if (loaded) {
                                    this.facade.getDeliveryPointPending();
                                    this.loadingService.hideLoading();
                                }

                            })
                            return;
                        }
                    });


                }
                else {
                    console.log('deliveryPoints', parsedJSON);
                    if (optimizationPreferences.selectAsignationDateBeforePlanning && type != 'visit') {
                        const dialogRef = this.dialog.open(SelectDateComponent, {
                            size: 'md',
                            backdropClass: 'customBackdrop',
                            centered: true,
                            backdrop: 'static'
                        });

                        dialogRef.componentInstance.data = { title: 'Fecha de asignación' };

                        dialogRef.result.then(([add, object]) => {
                            if (add) {
                                this.facade.importPlanSession({
                                    deliveryPoints: deliveryPoints.deliveryPoints,
                                    warehouse: this.optimizationPreferences.warehouse,
                                    assignationDate: objectToString(object.start),
                                    options: {
                                        createDeliveryPoints: this.optimizationPreferences.createSession
                                            .createDeliveryPoints,
                                        updateDeliveryPoints: this.optimizationPreferences.createSession
                                            .updateDeliveryPoints,
                                        createDeliveryZones: this.optimizationPreferences.createSession
                                            .createDeliveryZones,
                                        createUnassignedZone: this.optimizationPreferences.createSession
                                            .createUnassignedZone,
                                        setUnassignedZone: this.optimizationPreferences.createSession
                                            .setUnassignedZone,
                                    },
                                    sessionType: type,
                                    vehicle: parsedJSON.vehicle
                                });
                                this.loadingService.showLoading();
                                this.facade.isPlanningSessionLoaded$.pipe((take(2))).subscribe((loaded) => {
                                    if (loaded) {
                                        this.facade.getDeliveryPointPending();
                                        this.loadingService.hideLoading();
                                    }

                                })
                                return;
                            } else {
                                return;
                            }
                        });

                    } else {
                        this.facade.importPlanSession({
                            deliveryPoints: deliveryPoints.deliveryPoints,
                            warehouse: this.optimizationPreferences.warehouse,
                            options: {
                                createDeliveryPoints: this.optimizationPreferences.createSession
                                    .createDeliveryPoints,
                                updateDeliveryPoints: this.optimizationPreferences.createSession
                                    .updateDeliveryPoints,
                                createDeliveryZones: this.optimizationPreferences.createSession
                                    .createDeliveryZones,
                                createUnassignedZone: this.optimizationPreferences.createSession
                                    .createUnassignedZone,
                                setUnassignedZone: this.optimizationPreferences.createSession
                                    .setUnassignedZone,
                            },
                            sessionType: type,
                            vehicle: parsedJSON.vehicle
                        });
                        this.loadingService.showLoading();
                        this.facade.isPlanningSessionLoaded$.pipe((take(2))).subscribe((loaded) => {
                            if (loaded) {
                                this.facade.getDeliveryPointPending();
                                this.loadingService.hideLoading();
                            }

                        })
                        return;
                    }
                }


            });
        } else {
            const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El JSON debe contener el campo "deliveryPoints" el cual contiene todos los puntos de entrega</h3>
                                            <div style="display:flex; justify-content: center; text-align: start; flex-direction: column; margin: auto">
                                            Por ejemplo:
                                                <div style="display:flex; flex-direction: column; justify-content: center; text-align: start">
                                                <span>{</span>
                                                <span>&emsp;"<h3 style="color: red; margin: 0; display: inline-block">deliveryPoints</h3>": [</span>
                                                <span>&emsp;&emsp;{</span>
                                                <span>&emsp;&emsp;&emsp;"id": "DP1"</span>
                                                <span>&emsp;&emsp;}</span>
                                                <span>&emsp;]</span>
                                                <span>}</span>
                                                </div>
                                            </div>
                                        </div>
                                </div>`;
            this.openImportedFileErrorDialog(dialogHTML);
        }
    }

    private checkUniqueId(
        deliveryPoint: any,
        deliveryPointsIds: { [key: string]: {} },
        index: number,
    ) {
        if (deliveryPoint.id && typeof deliveryPoint.id === 'string') {
            /* if (deliveryPoint.id in deliveryPointsIds) {
                const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El archivo contiene al menos 2 puntos de entrega con el mismo ID</h3>
                                            <h4>Error en el punto de entrega n. ${index +
                                                1}, ID duplicado = ${deliveryPoint.id}</h4>
                                        </div>
                                </div>`;
                this.openImportedFileErrorDialog(dialogHTML);
                return false;
            } else { */
            deliveryPointsIds[deliveryPoint.id] = deliveryPoint;
            return true;
            /*  } */
        } else if (typeof deliveryPoint.id !== 'string') {
            const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El archivo contiene un punto de entrega con un formato incorrecto en el ID</h3>
                                            <h4>Error en el punto de entrega n. ${index +
                1}</h4>
                                        </div>
                                </div>`;
            this.openImportedFileErrorDialog(dialogHTML);
        } else {
            const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>El archivo contiene un punto de entrega sin el campo ID</h3>
                                            <h4>Error en el punto de entrega n. ${index +
                1}</h4>
                                        </div>
                                </div>`;
            this.openImportedFileErrorDialog(dialogHTML);
            return false;
        }
    }

    integrationOptimizations(zones, routes) {
        this.facade.allZones$
            .pipe(take(1))
            .subscribe((deliveryZones: { [zoneId: number]: PlanningDeliveryZone }) => {
                for (const zoneId in deliveryZones) {
                    if (zones.includes(+zoneId)) {
                        deliveryZones = {
                            ...deliveryZones,
                            [zoneId]: {
                                ...deliveryZones[zoneId],
                                optimization: {
                                    ...deliveryZones[zoneId].optimization,
                                    solution: {
                                        ...deliveryZones[zoneId].optimization.solution,
                                        routes: deliveryZones[
                                            zoneId
                                        ].optimization.solution.routes.filter(
                                            route => routes.includes(route.id),
                                        ),
                                    },
                                },
                            },
                        };
                        if (deliveryZones[zoneId].optimization.solution.routes.length === 0) {
                            deliveryZones = { ...deliveryZones, [zoneId]: null };
                            delete deliveryZones[zoneId];
                        }
                    } else {
                        deliveryZones = { ...deliveryZones, [zoneId]: null };
                        delete deliveryZones[zoneId];
                    }

                }
                let json = exportOptimizations(deliveryZones, ExportFormat.JSON);

                this.backend.post('integration/route/optimization', JSON.parse(json)).toPromise();

            });

    }
    private checkGeoCoding(
        deliveryPoint: any,
        addresses: string[],
        addressDeliveryPointInfo: { id: number; name: string }[],
        geocodingDeliveryPointsIds: { id: number; name: string; address: string }[],
        index: number,
    ) {
        if (deliveryPoint.address && !deliveryPoint.coordinates) {
            if (deliveryPoint.address.length > 200 || deliveryPoint.address.length < 5) {
                const dp = {
                    id: deliveryPoint.id,
                    name: deliveryPoint.name,
                    address: deliveryPoint.address,
                };
                geocodingDeliveryPointsIds.push(dp);
            } else {
                const dp = { id: deliveryPoint.id, name: deliveryPoint.name };
                addressDeliveryPointInfo.push(dp);
                addresses.push(deliveryPoint.address);
            }
            return true;
        } else if (deliveryPoint.coordinates) {
            let areCoordinatesValid: boolean;
            try {
                const coordinates = new CoordinatesParser(
                    `${deliveryPoint.coordinates.latitude} ${deliveryPoint.coordinates.longitude
                    }`,
                );
                deliveryPoint.coordinates = coordinates;
                areCoordinatesValid = true;
            } catch (e) {
                const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>Las cordenadas introducidas tienen un formato incorrecto, latitude: ${deliveryPoint.coordinates.latitude}  y longitude: ${deliveryPoint.coordinates.longitude}</h3>
                                            <h4>Error en el punto de entrega n. ${index +
                    1}, con ID = ${deliveryPoint.id}</h4>
                                        </div>
                                </div>`;
                this.openImportedFileErrorDialog(dialogHTML);
                areCoordinatesValid = false;
            }
            return areCoordinatesValid;
        }
        return true;
    }

    private checkDeliveryWindow(deliveryPoint: any, index: number) {
        let deliveryWindow = deliveryPoint.deliveryWindow;
        if (typeof deliveryWindow === 'string' || typeof deliveryWindow === 'undefined') {
            if (deliveryWindow) {
                let parts = deliveryWindow.split('-');
                if (parts.length !== 2) {
                    this.invalidDeliveryWindowFormat(
                        deliveryPoint.id,
                        deliveryWindow,
                        index,
                    );

                    return false;
                } else {
                    deliveryPoint.deliveryWindow = {};
                    if (parts[0].length !== 0) {
                        let dayTimeToSecondsStart = dayTimeAsStringToSeconds(parts[0]);
                        if (dayTimeToSecondsStart === -1) {
                            this.invalidDeliveryWindowFormat(
                                deliveryPoint.id,
                                deliveryWindow,
                                index,
                            );
                            return false;
                        }
                        deliveryPoint.deliveryWindow.start = dayTimeToSecondsStart;
                    }
                    if (parts[1].length !== 0) {
                        let dayTimeToSecondsEnd = dayTimeAsStringToSeconds(parts[1]);
                        if (dayTimeToSecondsEnd === -1) {
                            this.invalidDeliveryWindowFormat(
                                deliveryPoint.id,
                                deliveryWindow,
                                index,
                            );
                            return false;
                        }
                        deliveryPoint.deliveryWindow.end = dayTimeToSecondsEnd;
                    }
                }
            } else {
                deliveryPoint.deliveryWindow = null;
            }
        } else {
            this.invalidDeliveryWindowFormat(deliveryPoint.id, deliveryWindow, index);
            return false;
        }
        return true;
    }

    private invalidDeliveryWindowFormat(
        deliveryPointId: string,
        deliveryWindow: string,
        index: number,
    ) {
        const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>Delivery Window field must be a sequence of characters  with "hh:mm-hh:mm" format or empty. Introduced delivery window:  ${deliveryWindow}</h3>
                                            <h4>Error on delivery points n. ${index +
            1}, with ID = ${deliveryPointId}</h4>
                                        </div>
                                </div>`;
        this.openImportedFileErrorDialog(dialogHTML);
    }

    private openImportedFileErrorDialog(html: string) {
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static'
        });
        dialogRef.componentInstance.data = {
            errorDescription: html,
            errorTitle: 'Fallo en la importación del fichero',
        }
    }

    private requiredEmail(deliveryPoint: any, index: number) {
        if (deliveryPoint.sendDeliveryNoteMail === true) {
            if (!deliveryPoint.email) {
                const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                        <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                            <h3>EL correo electrónico es requerido</h3>
                                            <h4>Error en el punto de entrega n. ${index +
                    1}</h4>
                                        </div>
                                </div>`;
                this.openImportedFileErrorDialog(dialogHTML);
                return false;

            } else {

                return true;
            }
        }

        return true;

    }

    createPlanSession() {
        this.facade.createPlanSession();
    }

    async newAddition() {
        let zone: any = {
            zone: {
                id: null,
                name: '',
                color: '#000000',
                settingsDeliveryScheduleStart: '0',
                settingsDeliveryScheduleEnd: '0',
                settingsForcedeparturetime: false,
                settingsIgnorecapacitylimit: false,
                settingsUseallvehicles: false,
            },
        };

        const multi = await (await this.preferencesFacade.optimizationPreferences$.pipe(take(1)).toPromise()).allowJoinIntegrationSession;
        const component = multi ? ModalMultiIntegrationComponent : ModalIntegrationComponent;
        const dialogRef = this.dialog.open(component, {
            size: 'lg',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static'
        });

        dialogRef.componentInstance.data = zone,

            dialogRef.result.then(([add, object]) => {
                if (add) {
                    this.JSONValidation(object);
                }
            });
    }

    async saveRoute(type: string) {
        let zoneIds: number[] = [];
        let solutions: any[] = [];
        let sessionId;
        for (let zoneId in this.routePlanning.planningSession.deliveryZones) {
            sessionId = this.routePlanning.planningSession.deliveryZones[zoneId].sessionId;
            break;
        }

        if (type === 'all') {
            for (let zoneId in this.routePlanning.planningSession.deliveryZones) {
                if (
                    await this.canBeSave(
                        this.routePlanning.planningSession.deliveryZones[zoneId],
                    )
                ) {
                    zoneIds.push(+zoneId);
                }
            }
        } else {
            for (let zoneId in this.routePlanning.planningSession.deliveryZones) {
                if (this.routePlanning.deliveryZonesStatus[zoneId].selected) {
                    if (
                        await this.canBeSave(
                            this.routePlanning.planningSession.deliveryZones[zoneId],
                        )
                    ) {
                        zoneIds.push(+zoneId);
                    }
                }
            }
        }
        zoneIds.forEach(element => {
            if (this.routePlanning && this.routePlanning.planningSession && this.routePlanning.planningSession.deliveryZones
                && this.routePlanning.planningSession.deliveryZones[element] && this.routePlanning.planningSession.deliveryZones[element].optimization
                && this.routePlanning.planningSession.deliveryZones[element].optimization.solution && this.routePlanning.planningSession.deliveryZones[element].optimization.solution.routes) {
                this.routePlanning.planningSession.deliveryZones[element].optimization.solution.routes.forEach(x => {
                    solutions.push({ solutionId: x.solutionId, zoneId: element });
                });
            }

        });

        if (!this.routePlanning.saved) {
            const dialogRef = this.dialog.open(SaveRouteComponent, {
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static',
                size: 'lg',
                windowClass: 'modal-save-route-special'
            });

            dialogRef.result.then(([add, object]) => {
                if (add) {
                    object.savedDate = objectToString(object.savedDate);
                    object.solutions = solutions;
                    this.facade.saveSession(sessionId, object);
                }
            });
        } else {
            let data = _.cloneDeep(this.routePlanning.saved);
            data.solutions = solutions;
            this.facade.saveSession(sessionId, data);
        }

    }


    public showDeliveryPointPending() {
        const dialogRef = this.dialog.open(ModalDeliveryPointPendingComponent, {
            size: 'lg',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: true
        });
        dialogRef.result.then(data => {
            if (data && data.length > 0) {
                this.addDeliveryPointPending(data);
            }
        });
    }

    async recoverWithoutSaved(session: any) {
        this.facade.logout();
        this.loadingService.showLoading();
        this.service.recoverSessionById(session.id).pipe(take(1)).subscribe((data) => {
            this.facade.recoverSession(data)

            this.facade.isPlanningSessionLoaded$.pipe(take(1)).subscribe((data) => {
                if (data) {
                    this.service.recoverRoutePlanningSession(session.id).pipe(take(1)).subscribe((data) => {
                        if (data.length === 0) {
                            this.loadingService.hideLoading();
                            return;

                        }
                        data.zones.forEach((zone: any, index) => {
                            this.facade.optimizationSuccess(zone.zoneId, zone);
                            if (index + 1 === data.zones.length) {
                                this.loadingService.hideLoading();
                            }
                        });
                    });

                    this.facade.getDeliveryPointPending();
                }

            });
        });


    }

    addDeliveryPointPending(deliveryPointsPending: number[]) {
        let sessionId = this.routePlanning.planningSession.id;
        this.backend.post('route_planning/session/add_delivery_points_pending', {
            sessionId,
            deliveryPointsPending
        }).pipe(take(1)).subscribe((response) => {
            this.recoverWithoutSaved({ id: sessionId });
        })
    }


    private hasVehicles(zone: PlanningDeliveryZone) {
        if (zone.vehicles.length >= 1) return true;
        for (let subZoneId in zone.deliveryZones) {
            if (zone.deliveryZones[subZoneId].vehicles.length >= 1) return true;
        }
        return false;
    }

    recoverOptimization(): void {
        const dialogRef = this.dialog.open(ModalRecoverOptimizationComponent, {
            size: 'lg',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static'
        });
        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.recoverSession(object);
            }
        });
    }

    planningVisits() {
        const dialogRef = this.dialog.open(VisitsPlanningComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static'
        });
        dialogRef.result.then((add) => {
            if (add) {
                this.JSONValidation(add, 'visit');
            }
        });
    }

    loadTemplateRoute() {
        const dialogRef = this.dialog.open(ModalLoadTemplateComponent, {
            centered: true,
            backdrop: 'static',
            backdropClass: 'modal-backdrop-ticket',
            windowClass: 'modal-load-template-route',
            size: 'lg'
        });
        dialogRef.result.then((add) => {
            if (add) {
                console.log('ir a proceso para crear los puntos');
            }
        });
    }


    async automatic() {
        const dialogRef = this.dialog.open(ModalAutomaticOptimizationComponent, {
            size: 'md',
            centered: true,
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            windowClass: 'automatic-modal'

        });

        const zonesArray = [];
        const vehiclesZone = [];
        let zones = await this.facade.allZones$.pipe(take(1)).toPromise();
        for (const key in zones) {
            zonesArray.push({
                name: zones[key].name,
                id: zones[key].id
            });

            if (zones[key].vehicles && zones[key].vehicles.length > 0) {

                zones[key].vehicles.forEach(element => {
                    vehiclesZone.push(element);
                });
            }
        }
        const vehicles = await this.vehicleFacade.allVehicles$.pipe(take(1)).toPromise();
        dialogRef.componentInstance.zones = zonesArray;
        dialogRef.componentInstance.vehicles = vehicles;
        dialogRef.componentInstance.vehiclesZone = vehiclesZone;

        dialogRef.result.then(async (data) => {
            if (data) {


                if (data.settings.ignoreCapacityLimit) {
                    this.facade.joinZones(data.zones, data.vehicles, data.settings, true);
                } else {

                    let zonesTrans: any = this.pipeKeyValue.transform(data.zones);
                    let demand = 0;
                    zonesTrans.forEach((element) => {
                        demand += zones[+element.value].deliveryPoints.map(x => x.demand).reduce((sum, element) => sum + element);
                    });

                    let capacity = data.vehicles.map(x => x.capacity).reduce((sum, element) => sum + element);

                    if (demand <= capacity) {
                        this.facade.joinZones(data.zones, data.vehicles, data.settings, true);
                    } else {
                        this.facade.joinZones(data.zones, data.vehicles, data.settings, false);
                    }

                }


            }
        })
    }

    async recoverSession(session: any) {
        this.facade.logout();
        this.loadingService.showLoading();
        this.service.recoverSessionById(session.id).pipe(take(1)).subscribe((data) => {
            data.saved = session;
            this.facade.recoverSession(data)

            this.facade.isPlanningSessionLoaded$.pipe(take(1)).subscribe((data) => {
                if (data) {
                    this.service.recoverRoutePlanningSession(session.id).pipe(take(1)).subscribe((data) => {
                        if (data.length === 0) {
                            this.loadingService.hideLoading();
                            return;

                        }
                        data.zones.forEach((zone: any, index) => {
                            this.facade.optimizationSuccess(zone.zoneId, zone);
                            if (index + 1 === data.zones.length) {
                                this.loadingService.hideLoading();
                            }
                        });
                    });

                    this.facade.getDeliveryPointPending();
                }

            });
        });


    }

    private hasDeliveryPoints(zone: PlanningDeliveryZone) {
        if (zone.deliveryPoints.length > 0) return true;
        return false;
    }

    private async enoughCapacity(zone: PlanningDeliveryZone) {
        if (zone.settings.ignoreCapacityLimit) return true;
        else {
            let zoneInfoChips = await this.facade
                .getZoneInfoChips(zone.id)
                .pipe(take(1))
                .toPromise();
            return zoneInfoChips.demand <= zoneInfoChips.vehiclesCapacity;
        }
    }

    private async enoughVolumen(zone: PlanningDeliveryZone) {
        if (zone.settings.ignoreCapacityLimit) return true;
        else {
            let zoneInfoChips = await this.facade
                .getZoneInfoChips(zone.id)
                .pipe(take(1))
                .toPromise();
            return zoneInfoChips.volumetric <= zoneInfoChips.vehiclesVolumen;
        }
    }

    private async isBeingOptimized(zone: PlanningDeliveryZone) {
        const optimizationStatus = await this.facade
            .getOptimizationStatus(zone.id)
            .pipe(take(1))
            .toPromise();
        return optimizationStatus.loading;
    }

    private async canBeOptimized(zone: PlanningDeliveryZone) {
        return (
            this.hasDeliveryPoints(zone) &&
            this.hasVehicles(zone) &&
            (await this.enoughCapacity(zone)) &&
            (await this.enoughVolumen(zone)) &&
            !(await this.isBeingOptimized(zone))
        );
    }

    private async canBeEvaluate(zone: PlanningDeliveryZone) {
        return (
            this.hasDeliveryPoints(zone) &&
            this.hasVehicles(zone)
        );
    }

    private async canBeAsignEvaluate(zone: PlanningDeliveryZone) {
        return (
            this.hasDeliveryPoints(zone) &&
            this.hasVehicles(zone) &&
            (await this.enoughVolumen(zone)) &&
            (await this.enoughCapacity(zone))

        );
    }

    private async canBeAsign(zone: PlanningDeliveryZone) {
        return (
            this.hasDeliveryPoints(zone) &&
            this.hasVehicles(zone) &&
            this.hasOptimized(zone) &&
            (await this.enoughCapacity(zone)) &&
            !(await this.isBeingOptimized(zone))
        );
    }

    private async canBeSave(zone: PlanningDeliveryZone) {
        return (
            this.hasDeliveryPoints(zone) &&
            this.hasOptimized(zone) &&
            (await this.enoughCapacity(zone)) &&
            (await this.enoughVolumen(zone)) &&
            !(await this.isBeingOptimized(zone))
        );
    }

    hasOptimized(zone: PlanningDeliveryZone) {
        return zone.optimization ? true : false;
    }

    async asign(type: string) {
        let zoneIds: number[] = [];
        let routes: Route[] = [];
        if (type === 'all') {
            for (let zoneId in this.routePlanning.planningSession.deliveryZones) {
                if (
                    await this.canBeAsign(
                        this.routePlanning.planningSession.deliveryZones[zoneId],
                    )
                ) {
                    zoneIds.push(+zoneId);
                }
            }
        } else {
            for (let zoneId in this.routePlanning.planningSession.deliveryZones) {
                if (this.routePlanning.deliveryZonesStatus[zoneId].selected) {
                    if (
                        await this.canBeAsign(
                            this.routePlanning.planningSession.deliveryZones[zoneId],
                        )
                    ) {
                        zoneIds.push(+zoneId);
                    }
                }
            }
        }

        if (this.haveNotAssigned(zoneIds)) {

            let notAssigned = [];
            zoneIds.forEach(zoneId => {
                this.routePlanning.planningSession.deliveryZones[zoneId].optimization.solution.routes.forEach(route => {
                    if (route.deliveryPointsUnassigned && route.deliveryPointsUnassigned.length > 0) {
                        route.deliveryPointsUnassigned.forEach((element: any) => {
                            const id = this.routePlanning.planningSession.deliveryZones[zoneId].deliveryPoints.find(x => x.identifier === element.identifier).id;
                            notAssigned.push({
                                id: element.deliveryPointId,
                                routePlanningDeliveryPointId: id,
                                name: element.name,
                                nif: element.nif,
                                address: element.address,
                                deliveryZoneId: this.routePlanning.planningSession.deliveryZones[zoneId].identifier,
                                demand: element.demand,
                                serviceTime: element.serviceTime,
                                coordinatesLatitude: element.coordinates.latitude,
                                coordinatesLongitude: element.coordinates.longitude,
                                deliveryWindowStart: element.deliveryWindow.start,
                                deliveryWindowEnd: element.deliveryWindow.end,
                                zone: this.routePlanning.planningSession.deliveryZones[zoneId].identifier,
                                routeId: element.routeId
                            });
                        });
                    }
                })
            });

            const dialogRef = this.dialog.open(ModalPointPendingComponent, {
                size: 'lg',
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static'
            });

            dialogRef.componentInstance.notAssigned = notAssigned;

            dialogRef.result.then(async (result) => {
                if (result) {

                    if (result.option === '1') {
                        // TODO: mandar hacer una nueva ruta.
                        let zone: Zone = {
                            color: '#000000',
                            identifier: 'Libre',
                            name: 'Libre',
                            order: 0,
                            isActive: true,
                            zoneSettings: {
                                deliverySchedule: {
                                    start: 0,
                                    end: 86340
                                },
                                forceDepartureTime: false,
                                ignoreCapacityLimit: false,
                                useAllVehicles: false,
                                optimizationParameters: {
                                    customerWaitTime: false,
                                    delayTime: false,
                                    sizeOfFleet: false,
                                    totalTime: false,
                                    travelDistance: false,
                                    travelTime: false
                                },
                                optimizeFromIndex: 0
                            }
                        }
                        this.facade.addRoutePlanningDeliveryZone(zone, this.routePlanning.planningSession.id, []);
                        this.facade.added$.pipe(take(2)).subscribe((added) => {
                            if (added) {

                                zoneIds.forEach((zoneId) => {
                                    this.facade.addedZoneId$.pipe(take(1)).subscribe((newZoneId) => {

                                        let move = {
                                            routePlanningDeliveryZoneIdDest: newZoneId,
                                            routePlanningDeliveryPoints: notAssigned.filter(x => x.deliveryZoneId === this.routePlanning.planningSession.deliveryZones[zoneId].identifier).map(point => point.routePlanningDeliveryPointId),
                                            routePlanningDeliveryZoneIdOrig: zoneId,
                                            order: 1,
                                            routeId: notAssigned.filter(x => x.deliveryZoneId === this.routePlanning.planningSession.deliveryZones[zoneId].identifier)[0].routeId
                                        }
                                        this.facade.moveMultipleDeliveryPoint(move);

                                    })
                                });

                            }
                        });





                    } else if (result.option === '2') {
                        await this.loadingService.showLoading();
                        this.backend.post('route_planning/delivery_point_pending', { deliveryPoints: notAssigned }).pipe(take(1)).subscribe((data) => {
                            this.loadingService.hideLoading();
                            this.modelWithTime(zoneIds, routes);
                        }, error => {
                            this.toast.displayHTTPErrorToast(error.status, error.error);
                            this.loadingService.hideLoading();
                        })
                    } else {
                        this.modelWithTime(zoneIds, routes);
                    }
                }
            });

        } else {

            let date;

            if (this.routePlanning.planningSession.assignationDate) {
                date = moment(this.routePlanning.planningSession.assignationDate).toISOString();
            }
            const dialogRef = this.dialog.open(SelectDateComponent, {
                size: 'md',
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static'
            });


            dialogRef.componentInstance.data = { title: 'Fecha de asignación' },

                dialogRef.componentInstance.dateAssignate = date,

                zoneIds.forEach(element => {
                    routes.push(...this.routePlanning.planningSession.deliveryZones[element].optimization.solution.routes)
                });
            this.routePlanning.planningSession.deliveryZones

            dialogRef.result.then(async ([add, object]) => {
                if (add) {
                    if (zoneIds.length > 0) {
                        this.facade.asign({ routes, dateAsign: objectToString(object.start) });
                        this.facade.assignate$.pipe(take(2)).subscribe((data) => {
                            if (data) {
                                this.showModalFinishAssignate();
                            }
                        });

                        const optimization$ = (await this.preferencesFacade.optimizationPreferences$.pipe(take(1)).toPromise())

                        if (optimization$ && optimization$.createSession && optimization$.createSession.automaticallyExportAssign) {
                            this.integrationOptimizations(zoneIds, routes.map(x => x.id));
                        }

                    }
                } else {
                    return;
                }

            });
        }



    }


    modelWithTime(zoneIds, routes) {
        const dialogRef = this.dialog.open(SelectDateComponent, {
            size: 'md',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static'
        });

        dialogRef.componentInstance.data = { title: 'Fecha de asignación' },

            zoneIds.forEach(element => {
                routes.push(...this.routePlanning.planningSession.deliveryZones[element].optimization.solution.routes)
            });

        dialogRef.result.then(async ([add, object]) => {
            if (add) {
                if (zoneIds.length > 0) {
                    this.facade.asign(
                        { routes, dateAsign: objectToString(object.start) }

                    );
                    const optimization$ = (await this.preferencesFacade.optimizationPreferences$.pipe(take(1)).toPromise())
                    if (optimization$ && optimization$.createSession && optimization$.createSession.automaticallyExportAssign) {
                        this.integrationOptimizations(zoneIds, routes.map(x => x.id));
                    }
                }
            } else {
                return;
            }

        });
    }

    haveNotAssigned(zoneIds: number[]) {
        let have: boolean = false;
        zoneIds.forEach(zoneId => {
            this.routePlanning.planningSession.deliveryZones[zoneId].optimization.solution.routes.forEach(route => {
                if (route.deliveryPointsUnassigned && route.deliveryPointsUnassigned.length > 0) {
                    have = true;
                }
            })
        });

        return have;
    }


    showModalFinishAssignate() {
        const dialogRef = this.dialog.open(FinishAssignateComponent, {
            size: 'md',
            backdropClass: 'customBackdrop',
            centered: true,
            windowClass: 'border-modal',
            backdrop: 'static'
        });
    }

    async asign_evaluteds(type: string) {
        let zoneIds: number[] = [];
        if (type === 'all') {
            for (let zoneId in this.routePlanning.planningSession.deliveryZones) {
                if (
                    await this.canBeAsignEvaluate(
                        this.routePlanning.planningSession.deliveryZones[zoneId],
                    )
                ) {
                    zoneIds.push(+zoneId);
                }
            }
        } else {
            for (let zoneId in this.routePlanning.planningSession.deliveryZones) {
                if (this.routePlanning.deliveryZonesStatus[zoneId].selected) {
                    if (
                        await this.canBeAsignEvaluate(
                            this.routePlanning.planningSession.deliveryZones[zoneId],
                        )
                    ) {
                        zoneIds.push(+zoneId);
                    }
                }
            }
        }
        const dialogRef = this.dialog.open(SelectDateComponent, {
            size: 'md',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static'
        });

        let date;
        if (this.routePlanning.planningSession.assignationDate) {
            date = moment(this.routePlanning.planningSession.assignationDate).toISOString();
        }

        dialogRef.componentInstance.data = { title: 'Fecha de asignación' };

        dialogRef.componentInstance.dateAssignate = date;

        dialogRef.result.then(async ([add, object]) => {
            if (add) {
                if (zoneIds.length > 0) {
                    this.facade.asign_evaluateds({ zoneIds, dateAsign: objectToString(object.start) });
                    this.facade.assignate$.pipe(take(2)).subscribe((data) => {
                        if (data) {
                            this.showModalFinishAssignate();
                        }
                    });
                    const optimization$ = (await this.preferencesFacade.optimizationPreferences$.pipe(take(1)).toPromise())
                    if (optimization$ && optimization$.createSession && optimization$.createSession.automaticallyExportAssign) {
                        this.integrationEvaluations(zoneIds);
                    }
                }
            } else {
                return;
            }

        });

    }

    integrationEvaluations(evaluateds) {

        this.facade.allZones$
            .pipe(take(2))
            .subscribe((deliveryZones: { [zoneId: number]: PlanningDeliveryZone }) => {
                for (const zoneId in deliveryZones) {
                    if (!(evaluateds.includes(+zoneId))) {
                        deliveryZones = { ...deliveryZones, [zoneId]: null };
                        delete deliveryZones[zoneId];
                    }
                }

                let json = exportEvaluateds(deliveryZones, ExportFormat.JSON);

                this.backend.post('integration/route/evaluation', JSON.parse(json)).toPromise();


            });
    }

    async optimize(type: string) {
        let zoneIds: number[] = [];
        if (type === 'all') {
            for (let zoneId in this.routePlanning.planningSession.deliveryZones) {
                if (
                    await this.canBeOptimized(
                        this.routePlanning.planningSession.deliveryZones[zoneId],
                    )
                ) {
                    zoneIds.push(+zoneId);
                }
            }
        } else {
            for (let zoneId in this.routePlanning.planningSession.deliveryZones) {
                if (this.routePlanning.deliveryZonesStatus[zoneId].selected) {
                    if (
                        await this.canBeOptimized(
                            this.routePlanning.planningSession.deliveryZones[zoneId],
                        )
                    ) {
                        zoneIds.push(+zoneId);
                    }
                }
            }
        }
        if (zoneIds.length > 0) this.facade.optimize({ zoneIds });
    }

    async evalute(type: string) {
        let zoneIds: number[] = [];
        if (type === 'all') {
            for (let zoneId in this.routePlanning.planningSession.deliveryZones) {
                if (
                    await this.canBeEvaluate(
                        this.routePlanning.planningSession.deliveryZones[zoneId],
                    )
                ) {
                    zoneIds.push(+zoneId);
                }
            }
        } else {
            for (let zoneId in this.routePlanning.planningSession.deliveryZones) {
                if (this.routePlanning.deliveryZonesStatus[zoneId].selected) {
                    if (
                        await this.canBeEvaluate(
                            this.routePlanning.planningSession.deliveryZones[zoneId],
                        )
                    ) {
                        zoneIds.push(+zoneId);
                    }
                }
            }
        }
        if (zoneIds.length > 0) this.facade.evaluate({ zoneIds });
    }

    export() {
        const dialogRef = this.dialog.open(ExportDialogComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
            windowClass: 'modal-export-routes',
        });
    }

    searchValue(value, text: string) {
        if (text && text.length >= 1) {
            if (this.routePlanning.viewingMode == 0) {
                this.facade.deliveryPoints$.pipe(take(1)).subscribe((data) => {
                    this.deliveryPoints = data.filter(x => x.name.toLocaleUpperCase().includes(text.toLocaleUpperCase()))
                });
            } else {
                this.facade.deliveryPointOptimized$.pipe(take(1)).subscribe((data) => {
                    this.deliveryPoints = data.filter(x => x.name.toLocaleUpperCase().includes(text.toLocaleUpperCase()))
                })
            }

        } else {
            this.deliveryPoints = [];
        }

    }

    selectDeliveryPoint(point: DeliveryPoint) {
        this.deliveryPoints = [];
        this.inputFilter = '';
        this.facade.selectDeliveryPoint(point.id);
    }

    print() {
        const dialogRef = this.dialog.open(PrintDialogComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
            windowClass: 'modal-print-dialogo',
        });

        dialogRef.componentInstance.data = {
            routes: Object.values(
                this.routePlanning.planningSession.deliveryZones,
            ).reduce<{ name?: string; routes?: { [key: number]: Route } }>(
                (zonesTotal, currZone) => {

                    return currZone.optimization
                        ? {
                            ...zonesTotal,
                            [currZone.id]: {
                                routes: currZone.optimization.solution.routes.reduce<{
                                    [key: number]: Route;
                                }>((routesTotal, currRoute) => {

                                    return {
                                        ...routesTotal,
                                        [currRoute.id]: currRoute,
                                    };
                                }, {}),
                                name: currZone.name,
                            },
                        }
                        : { ...zonesTotal };
                },
                {},
            ),
            evalutes: Object.values(
                this.routePlanning.planningSession.deliveryZones,
            ).reduce<{ name?: string; deliveryZones?: { [key: number]: DeliveryZones } }>(
                (zonesTotal, currZone) => {
                    return currZone && currZone.evaluated
                        ? {
                            ...zonesTotal,
                            [currZone.id]: {
                                ...currZone,
                                name: currZone.name
                            },
                        }
                        : { ...zonesTotal };
                },
                {},
            )
        };
    }

    onSelectAllChange($event, viewingMode: RoutePlanningViewingMode) {
        if (viewingMode == RoutePlanningViewingMode.zones) {
            if ($event.checked) this.facade.selectAll();
            else this.facade.deselectAll();
        } else {
            if ($event.checked) this.facade.selectAllRoutes();
            else this.facade.deselectAllRoutes();
        }
    }

    allSelected(
        zonesStatus: { [key: number]: DeliveryZoneStatus },
        routesStatus: {
            [key: number]: { [key: number]: { selected: boolean; displayed: boolean } };
        },
        viewingMode: RoutePlanningViewingMode,
    ) {
        if (viewingMode === RoutePlanningViewingMode.zones) {
            for (let zoneId in zonesStatus) {
                if (!zonesStatus[zoneId].selected) return false;
            }
            return true;
        }
        for (const zoneId in routesStatus) {
            if (zonesStatus[zoneId] && zonesStatus[zoneId].optimized) {
                if (!zonesStatus[zoneId].selected) return false;
                for (const routeId in routesStatus[zoneId]) {
                    if (!routesStatus[zoneId][routeId].selected) return false;
                }
            }
        }
        return true;
    }

    noneZoneSelected: boolean = true;
    checkNoneZoneSelected(zonesStatus: { [key: number]: DeliveryZoneStatus }) {
        for (let zoneId in zonesStatus) {
            if (zonesStatus[zoneId].selected) return false;
        }
        return true;
    }

    onShowSelectedChange(viewingMode: RoutePlanningViewingMode) {
        this.facade.toggleShowSelected();
    }

    joinZones() {
        let zonesJoin: number[] = [];
        this.facade.allZonesStatus$.pipe(take(1))
            .subscribe((data) => {
                for (let zoneId in data) {
                    if (data[zoneId].selected) zonesJoin.push(+zoneId);
                }
                if (zonesJoin.length > 0) {
                    this.facade.joinZones();
                }
            })

    }

    onSimulateClick(option?: 'All' | 'Selected') {
        if (option) {
            if (option === 'All') this.facade.simulateAll();
            else this.facade.simulateSelected();
        } else this.facade.stopSimulation();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.mapStageSubscription.unsubscribe();
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    goToLogin() {
        this.authService.logout();
    }

    prueba() {
        return this.checkAll.nativeElement.click();
    }

}

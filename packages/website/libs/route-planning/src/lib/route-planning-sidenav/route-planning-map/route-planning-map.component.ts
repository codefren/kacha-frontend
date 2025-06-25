import { AgmMap } from '@agm/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectorRef,
    HostListener,
    ElementRef,
} from '@angular/core';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { BackendService, DeliveryZone, OptimizationPreferences, Vehicle } from '@optimroute/backend';
import {
    contrastColor,
    highlightColor,
    isColorLight,
    secondsToDayTimeAsString,
    dayTimeAsStringToSeconds,
    dayTimeAsTimeToSeconds,
    ToastService, LoadingService
} from '@optimroute/shared';
import {
    DeliveryPoint,
    DeliveryZoneStatus,
    PlanningDeliveryZone,
    RoutePlanningFacade,
    RoutePlanningMapStage,
    RoutePlanningState,
    RoutePlanningViewingMode,
} from '@optimroute/state-route-planning';
import { Generator as ContrastGenerator } from 'contrast-color-generator';
import { EditDeliveryPointComponent } from 'libs/route-planning/shared/src/lib/edit-delivery-point/edit-delivery-point.component';
import { Subscription, VirtualTimeScheduler, Subject, Observable } from 'rxjs';
import { KeyValuePipe } from '@angular/common';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import { StateUsersFacade } from '@optimroute/state-users';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { takeUntil, take, filter } from 'rxjs/operators';
import { GeolocationFacade, GeolocationEntity } from '@optimroute/state-geolocation';
import { isURL, trim } from 'validator';
import { RoutePlanningService } from '../../route-planning.service';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { CreateZoneModalComponent } from '../create-zone-modal/create-zone-modal.component';
import { ModalDeliveryPointNotSourceComponent } from './../../../../shared/src/lib/modal-delivery-point-not-source/modal-delivery-point-not-source.component';
import { DomSanitizer } from '@angular/platform-browser';
declare var require: any;
const decodePolyline = require('decode-google-map-polyline');
declare var google;
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
interface Coordinates {
    latitude: number;
    longitude: number;
}

@Component({
    selector: 'easyroute-route-planning-map',
    templateUrl: './route-planning-map.component.html',
    styleUrls: ['./route-planning-map.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePlanningMapComponent implements OnInit, OnDestroy {
    // ---------------- STATE INDIRECT BINDING ----------------

    @Input()
    zoneStatus: { [zoneId: number]: DeliveryZoneStatus } = {};
    @Input()
    routesStatus: {
        [zoneId: number]: { [routeId: number]: { selected: boolean; displayed: boolean } };
    };
    @Input()
    routePlanning: RoutePlanningState;
    @Input()
    vehicles: Vehicle[];
    @Input()
    zones: {
        [key: number]: PlanningDeliveryZone;
    };
    @Input()
    routeGeometries: { routeId: number; polyline: string }[];
    routeGeometriesCurrentState: {
        routeId: number;
        polyline: string;
        decodedPolyline: any[];
    }[];
    @Input()
    selectedPoint: number;
    @Input()
    hoveredZone: number;
    @Input()
    hoveredPoint: number;
    @Input()
    showSelected: boolean;
    @Input()
    highlightedRoute: number;

    //change values
    changePlacementZone: any;
    _order: number;
    order: number;
    selectedZoneId: number;
    _selectedZoneId: number = 0;
    zoneId: number;
    deliveryPointId: number;
    _openingTime: string;
    _closingTime: string;
    openingTime: string;
    closingTime: string;
    _isOpeningTimeNotFree: boolean;
    _isClosingTimeNotFree: boolean;
    isOpeningTimeNotFree: boolean;
    isClosingTimeNotFree: boolean;
    selectedRouteId: number;
    _selectedRouteId: number;
    zoneOptim: any;
    changePoint: boolean = false;
    map: any;
    paths: any = [];
    pathColor: string = '#000000';
    polyline: any;
    delayTimes = [];

    zonePolygon: number = 0;

    dischargingHours: number = 0;

    dischargingMinutes: number = 0;

    dischargingSeconds: number = 0;


    dischargingHoursDelay: number = 0;

    dischargingMinutesDelay: number = 0;

    dischargingSecondsDelay: number = 0;

    loadingChangeRoute: boolean = false;
    geolocation: GeolocationEntity[];
    geolocationFilter: GeolocationEntity[];
    showGeolocation: boolean = false;
    showAllSelected: boolean = false;
    loadingGeolocation: boolean = false;
    geolocation$: Observable<GeolocationEntity[]>;
    optimizationPreference$: Observable<OptimizationPreferences>;
    expandUser: boolean = true;
    filterGeo: string = '';
    hoverGeoId: number = -1;
    selectedGeoId: number = -1;
    activeGeolocation: boolean = false;
    drawingManager: any;
    markerClose: any;
    printPolygon: boolean = false;
    mapPolygon: number;
    pointInPolygon: any = [];
    _address: string;
    _latitude: number;
    _longitude: number;
    _deliveryType: string;
    _orderNumber: string;
    _deliveryNotes: string;
    agglomerationSelected: any;
    drawinManagerType = 0;
    tabSelected = 0;
    companyPreferenceDelayTimeId: number;
    allowDelayTime: boolean;
    commercial: any;
    hoursVisists = [];
    pointSelected: any = {};
    formVisits: FormGroup;
    _salesman = 0;
    _ruta = '';
    tapDibujar = 0;
    allDeliveryZone: DeliveryZone[] = [];
    scheduleDaysVisits: any[] = [
        {id: 1, isActive: false},
        {id: 2, isActive: false},
        {id: 3, isActive: false},
        {id: 4, isActive: false},
        {id: 5, isActive: false},
        {id: 6, isActive: false},
        {id: 7, isActive: false},
    ];
    scheduleDaysRoute: any[] = [
        {id: 1, isActive: false},
        {id: 2, isActive: false},
        {id: 3, isActive: false},
        {id: 4, isActive: false},
        {id: 5, isActive: false},
        {id: 6, isActive: false},
        {id: 7, isActive: false},
    ];
    // END
    // ---------------- OTHER PROPERTIES ----------------
    get optimizedZones() {
        return Object.values(this.zones).filter(
            (zone) => this.zoneStatus[zone.id].optimized,
        );
    }
    get orderedZones() {
        return this.routePlanning && this.routePlanning.planningSession
            ? Object.values(this.routePlanning.planningSession.deliveryZones)
                .reduce<PlanningDeliveryZone[]>((result, currentZone) => {
                    return currentZone.isMultiZone ? [...result, currentZone] : result;
                }, [])
                .concat(
                    Object.values(
                        this.routePlanning.planningSession.deliveryZones,
                    ).filter((zone) => !zone.isMultiZone),
                )
                .sort((a, b) =>
                    (this.routePlanning.deliveryZonesStatus[a.id].optimized &&
                        this.routePlanning.deliveryZonesStatus[b.id].optimized &&
                        Object.keys(a.deliveryPoints).length >
                        Object.keys(b.deliveryPoints).length) ||
                        (!this.routePlanning.deliveryZonesStatus[a.id].optimized &&
                            !this.routePlanning.deliveryZonesStatus[b.id].optimized &&
                            Object.keys(a.deliveryPoints).length >
                            Object.keys(b.deliveryPoints).length) ||
                        (this.routePlanning.deliveryZonesStatus[a.id].optimized &&
                            !this.routePlanning.deliveryZonesStatus[b.id].optimized)
                        ? -1
                        : 1,
                )
            : [];
    }
    zoneChanged() {
        if (this.routePlanning.viewingMode === 1) {
            this._selectedRouteId = +Object.keys(
                this.zoneOptim[this._selectedZoneId].routes,
            )[0];
        }
        this._order = Math.max(
            1,
            Math.min(this._order, this.zones[this.selectedZoneId].deliveryPoints.length),
        );
    }

    zoneChangedMap() {
        if (this.routePlanning.viewingMode === 1 && this._selectedZoneId && this._selectedZoneId > 0) {
            this._selectedRouteId = +Object.keys(
                this.zoneOptim[this._selectedZoneId].routes,
            )[0];
        }
    }
    trackById(index, item) {
        return item.id;
    }


    returnHours(date: string) {
        return moment(date).format('DD/MM/YYYY');
    }
    accept() {
        if (this.routePlanning.viewingMode === 0) {
            const updateDeliveryWindowSuccessful = this.updateDeliveryWindow();
            const updatePlacementSuccessful = this.updatePlacementZone();
            if (updateDeliveryWindowSuccessful && updatePlacementSuccessful) {
                try {
                    this.detectChange.detectChanges();
                } catch (e) {

                } this.detectChange.detectChanges();
                this.changeSelected(-1);
                this.isDraggable = true;
                this.deliveryPointId = 0;
            }
        } else {
            const updatePlacementSuccessful = this.updatePlacementRoute();
            const updateDeliveryWindowSuccessful = this.updateDeliveryWindow();
            if (updateDeliveryWindowSuccessful && updatePlacementSuccessful) {
                try {
                    this.detectChange.detectChanges();
                } catch (e) {

                }
                this.changeSelected(-1);
                this.isDraggable = true;
                this.deliveryPointId = 0;
            }
        }
    }
    updatePlacementRoute(): boolean {
        if (this.selectedRouteId !== +this._selectedRouteId || this.order !== this._order) {
            this.loading.showLoading();
            const newOrder = Math.max(
                1,
                Math.min(
                    this._order,
                    this._selectedRouteId === this.selectedRouteId
                        ? this.zoneOptim[this._selectedZoneId].routes[this._selectedRouteId]
                            .amountDeliveryPoints
                        : this.zoneOptim[this._selectedZoneId].routes[this._selectedRouteId]
                            .amountDeliveryPoints + 1,
                ),
            );

            this.facade.deliveryPointRouteMovement(
                this.deliveryPointId,
                this.selectedZoneId,
                this._selectedZoneId,
                this.selectedRouteId,
                +this._selectedRouteId,
                this.order,
                newOrder,
                false,
                this.zones[this.zoneId].evaluated,
            );

            this.facade.moving$.pipe(take(2)).subscribe((loading)=>{
                if(!loading){
                    this.loading.hideLoading();
                }
            })
        }
        return true;
    }

    openDeliveryPointNotSources(deliveryPoints: DeliveryPoint[]) {
        const modal = this._modalService.open(ModalDeliveryPointNotSourceComponent, {

            backdrop: 'static',

            backdropClass: 'customBackdrop',

            centered: true
        });

        modal.componentInstance.deliveryPoints = deliveryPoints;
    }

    updatePlacementZone(): boolean {


        if (this.selectedZoneId !== this._selectedZoneId || this.order !== this._order) {
            this.loading.showLoading();
            const newOrder = Math.max(
                1,
                Math.min(
                    this._order,
                    this._selectedZoneId === this.zoneId
                        ? this.zones[this._selectedZoneId].deliveryPoints.length
                        : this.zones[this._selectedZoneId].deliveryPoints.length + 1,
                ),
            );
            this.facade.deliveryPointZoneMovement(
                this.deliveryPointId,
                this.zoneId,
                this._selectedZoneId,
                this.order,
                newOrder,
                false,
                this.zones[this.zoneId].evaluated,
            );

            this.facade.moving$.pipe(take(2)).subscribe((loading)=>{
                if(!loading){
                    this.loading.hideLoading();
                }
            })
        }
        return true;
    }
    updateDeliveryWindow(): boolean {
        const start = dayTimeAsStringToSeconds(this._openingTime);
        const end = dayTimeAsStringToSeconds(this._closingTime);
        if (!this._isClosingTimeNotFree || !this._isOpeningTimeNotFree || start < end) {
            let timeWindow = {};
            timeWindow['start'] = start;
            timeWindow['end'] = end;
            if (
                this.isOpeningTimeNotFree !== this._isOpeningTimeNotFree ||
                (this._isOpeningTimeNotFree && this._openingTime !== this.openingTime)
            ) {
                timeWindow['start'] = this._isOpeningTimeNotFree ? start : null;
            }
            if (
                this.isClosingTimeNotFree !== this._isClosingTimeNotFree ||
                (this._isClosingTimeNotFree && this._closingTime !== this.closingTime)
            ) {
                timeWindow['end'] = this._isClosingTimeNotFree ? end : null;
            }
            if (Object.keys(timeWindow).length !== 0) {
                this.routePlanning.viewingMode === 1
                    ? this.facade.updateRouteDeliveryPointTimeWindow(
                        this.zoneId,
                        this._selectedRouteId,
                        this.deliveryPointId,
                        timeWindow,
                        undefined,
                        this._deliveryType,
                        this._orderNumber,
                        this.companyPreferenceDelayTimeId,
                        this.allowDelayTime
                        /* ,
                        this.dischargingHours * 3600 + this.dischargingMinutes * 60 + this.dischargingSeconds */
                    )
                    : this.facade.updateDeliveryPointTimeWindow(
                        this.zoneId,
                        this.deliveryPointId,
                        timeWindow,
                        {
                            latitude: this._latitude,
                            longitude: this._longitude
                        },
                        this.dischargingMinutes * 60 + this.dischargingSeconds,
                        this._address,
                        undefined,
                        undefined,
                        this._deliveryType,
                        this._orderNumber,
                        this.companyPreferenceDelayTimeId,
                        this.allowDelayTime
                    );
            }
            this.dischargingHours = 0;
            this.dischargingMinutes = 0;
            this.dischargingSeconds = 0;
            return true;
        } else {
            this.openNotValidSnackbar();
            this.openingTime = this._openingTime;
            this.closingTime = this._closingTime;
            return false;
        }
    }
    getEstablishmentAddress(event) {
        this._address = event.formatted_address;
        this._latitude = event.geometry.location.lat();
        this._longitude = event.geometry.location.lng();
    }
    openNotValidSnackbar() {
        this.toastService.displayWebsiteRelatedToast(
            'Los valores para la ventana de entrega no son válidos',
        );
    }

    decodePolyline: (polyline: string) => any[] = decodePolyline;
    @ViewChild(AgmMap, { static: true }) mapElement: any;
    falseLoadControl: boolean = false;
    fitBounds: boolean = true;
    currentCenter: Coordinates = null;
    currentCenterMoved: Coordinates = null;
    initialCenter: Coordinates = { latitude: 0, longitude: 0 };
    isDraggable: boolean;
    multipleSelectionExpanded: boolean = false;
    initialZoom: number = 3;
    currentZoom: number = this.initialZoom;
    contrastGenerator = new ContrastGenerator(0);
    private unsubscribe$ = new Subject<void>();
    mapStyles = [
        {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#6195a0',
                },
            ],
        },
        {
            featureType: 'administrative.province',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
        {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [
                {
                    lightness: '0',
                },
                {
                    saturation: '0',
                },
                {
                    color: '#f5f5f2',
                },
                {
                    gamma: '1',
                },
            ],
        },
        {
            featureType: 'landscape.man_made',
            elementType: 'all',
            stylers: [
                {
                    lightness: '-3',
                },
                {
                    gamma: '1.00',
                },
            ],
        },
        {
            featureType: 'landscape.natural.terrain',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
        {
            featureType: 'poi',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#bae5ce',
                },
                {
                    visibility: 'on',
                },
            ],
        },
        {
            featureType: 'road',
            elementType: 'all',
            stylers: [
                {
                    saturation: -100,
                },
                {
                    lightness: 45,
                },
                {
                    visibility: 'simplified',
                },
            ],
        },
        {
            featureType: 'road.highway',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'simplified',
                },
            ],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#fac9a9',
                },
                {
                    visibility: 'simplified',
                },
            ],
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text',
            stylers: [
                {
                    color: '#4e4e4e',
                },
            ],
        },
        {
            featureType: 'road.arterial',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#787878',
                },
            ],
        },
        {
            featureType: 'road.arterial',
            elementType: 'labels.icon',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
        {
            featureType: 'transit',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'simplified',
                },
            ],
        },
        {
            featureType: 'transit.station.airport',
            elementType: 'labels.icon',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
        {
            featureType: 'transit.station.rail',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
        {
            featureType: 'transit.station.rail',
            elementType: 'labels.icon',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
        {
            featureType: 'water',
            elementType: 'all',
            stylers: [
                {
                    color: '#eaf6f8',
                },
                {
                    visibility: 'on',
                },
            ],
        },
        {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#c7eced',
                },
            ],
        },
        {
            featureType: 'transit',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
    ];
    auxCounter = 0;

    mapStage: RoutePlanningMapStage = RoutePlanningMapStage.empty;
    zoneInfoChips: {
        deliveryPoints: number;
        demand: number;
        vehicles: number;
        vehiclesCapacity: number;
    };
    routeInfoChips: {
        time: number;
        travelDistance: number;
    };

    hoverInMap: boolean = false;

    mapStageSubscription: Subscription;
    zoneInfoChipsSubscription: Subscription;
    routeInfoChipsSubscription: Subscription;
    hoveredZoneSubscription: Subscription;
    hoveredPointSubscription: Subscription;
    SelectPointSubscription: Subscription;
    Agglomeration: { coordinates, datos }[];

    usersSalesman = [];

    get mapCentered(): boolean {
        return (
            this.currentCenterMoved &&
            this.currentCenterMoved.latitude == this.initialCenter.latitude &&
            this.currentCenterMoved.longitude == this.initialCenter.longitude
        );
    }

    constructor(
        private facade: RoutePlanningFacade,
        public dialog: MatDialog,
        private keyvalue: KeyValuePipe,
        public pipeKeyValue: KeyValuePipe,
        private toastService: ToastService,
        private usersFacade: StateUsersFacade,
        private preferenceFacade: PreferencesFacade,
        private detectChange: ChangeDetectorRef,
        private geolocationFacade: GeolocationFacade,
        private routePlanningService: RoutePlanningService,
        private profileFacade: ProfileSettingsFacade,
        private loading: LoadingService,
        private _modalService: NgbModal,
        private matIconRegistry: MatIconRegistry,
        private domSanitzer: DomSanitizer,
        private backend: BackendService,
        private translate: TranslateService
    ) {
        this.matIconRegistry.addSvgIconLiteral(
            'open_book',
            this.domSanitzer.bypassSecurityTrustHtml('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg id="a53ea212-20d1-4a9e-8f84-d68ee81ca035" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 35 44"><defs><clipPath id="fb75ec07-d2c4-4141-b41a-cfd1e172ab86"><rect x="7" y="7" width="21" height="21" style="fill:none"/></clipPath></defs><path d="M18.87,43.5a1,1,0,0,1-1.74,0l-5.19-9A1,1,0,0,1,12.8,33H23.2a1,1,0,0,1,.86,1.5Z" style="fill:#24397c"/><rect width="35" height="35" rx="1" style="fill:#24397c"/><g style="clip-path:url(#fb75ec07-d2c4-4141-b41a-cfd1e172ab86)"><path d="M17.5,28H7.78c-.56,0-.78-.22-.78-.78,0-5,0-10,0-15a.8.8,0,0,1,.54-.83L16.7,7.27c.78-.36.78-.36,1.55,0,3.06,1.38,6.11,2.77,9.17,4.14a.85.85,0,0,1,.58.88c0,5,0,9.94,0,14.91,0,.59-.22.8-.81.8Zm-7-1.24V15.18c0-.48.23-.73.69-.73h12.6a.76.76,0,0,1,.41.13.66.66,0,0,1,.26.64V26.76h2.3V12.7a.29.29,0,0,0-.2-.32l-8.86-4a.49.49,0,0,0-.44,0l-8.84,4a.27.27,0,0,0-.18.3V26.51a2.29,2.29,0,0,0,0,.25Zm1.24-9.84h4.14c.57,0,.78.21.78.78v9.05H18.3V22.59c0-.52.22-.74.74-.74h4.17c0-.1,0-.16,0-.22,0-1.89,0-3.79,0-5.68,0-.22-.07-.27-.28-.27H11.74ZM22,23.09v.55a.62.62,0,1,1-1.24,0v-.56H19.55v3.67h3.66V23.09Zm-6.6-1.25V18.16H14.19c0,.19,0,.37,0,.55a.6.6,0,0,1-.6.66A.61.61,0,0,1,13,18.7c0-.17,0-.35,0-.53H11.75v3.66ZM13,23.09H11.75v3.67h3.66V23.09H14.19c0,.18,0,.34,0,.5,0,.44-.23.71-.61.71S13,24,13,23.6Z" style="fill:#fff"/><path d="M17.46,12.4H15.7a.61.61,0,0,1-.68-.61.63.63,0,0,1,.67-.63h3.57a.62.62,0,1,1,0,1.24Z" style="fill:#fff"/></g></svg>')
        );
    }

    ngOnInit() {

        this.getAllDeliveryZone();
        this.backend.get('users_salesman').pipe(take(1)).subscribe(({ data }) => {
            this.usersSalesman = data;
        })

        this.facade.isPlanningSessionLoaded$.pipe(takeUntil(this.unsubscribe$)).subscribe((loaded) => {
            if (loaded) {
                this.facade.agglomeration$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
                    this.Agglomeration = data;
                });
                this.deleteSelectedShape();
                this.facade.deliveryPointsNotSource$.pipe(take(1)).subscribe((data) => {
                    if (data && data.length > 0) {
                        this.openDeliveryPointNotSources(data);
                    }

                })
            }
        })

        this.facade.allRoutePlanning$.pipe(takeUntil(this.unsubscribe$)).subscribe((routePlanning) => {
            if (routePlanning.viewingMode !== this.mapPolygon) {
                this.deleteSelectedShape();
            }
        });

        this.geolocationFacade.showAllSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe((showAllSelected) => {
            this.showAllSelected = showAllSelected;
        })
        this.profileFacade.loaded$.pipe(takeUntil(this.unsubscribe$)).subscribe((loaded) => {
            if (loaded) {
                this.profileFacade.profile$.pipe(take(1)).subscribe((profile) => {
                    this.activeGeolocation = profile.company.active_modules.find(x => x.id === 1) ? true : false;
                })
            }
        })

        this.usersFacade.loadAllDriver();

        this.mapStageSubscription = this.facade.mapStage$.subscribe(
            (mapStage) => (this.mapStage = mapStage),
        );

        this.zoneInfoChipsSubscription = this.facade.allZonesInfoChips$.subscribe(
            (zoneInfoChips) => {
                this.zoneInfoChips = zoneInfoChips;
            },
        );
        this.routeInfoChipsSubscription = this.facade.allRoutesInfoChips$.subscribe(
            (routeInfoChips) => {
                this.routeInfoChips = routeInfoChips;
            },
        );
        this.hoveredZoneSubscription = this.facade.hoveredZone$.subscribe((hoveredZone) => {
            this.hoveredZone = hoveredZone;
        });
        this.hoveredPointSubscription = this.facade.hoveredDeliveryPoint$.subscribe(
            (hoveredDeliveryPoint) => (this.hoveredPoint = hoveredDeliveryPoint),
        );
        this.SelectPointSubscription = this.facade.selectedDeliveryPoint$.subscribe(
                (pointId) => {
                    console.log('entro aui para seleccionar', pointId);
                if (pointId > 0) {
                    this.setValuesChange(pointId);
                }
            },
        );

        this.geolocationFacade.loading$.pipe(takeUntil(this.unsubscribe$)).subscribe((loading) => {
            this.loadingGeolocation = loading;
            if (this.showGeolocation && this.loadingGeolocation && (!this.geolocation || this.geolocation.length === 0)) {
                this.routePlanningService.dispatchSocket().pipe(take(1)).toPromise();
            }

            try {
                this.detectChange.detectChanges();
            } catch (e) {

            }

        })

        this.facade.showGeometry$.subscribe((routeShow) => {
            if (this.routePlanning.viewingMode === 1) {
                if (routeShow.showGeometry) {
                    if (this.polyline) {
                        this.polyline.setMap(null);
                    }
                    let ruta = this.zones[
                        routeShow.zoneShowGeometry
                    ].optimization.solution.routes.find(
                        (x) => x.id === routeShow.routeShowGeometry,
                    );
                    if (ruta) {
                        this.pathColor = ruta.color;
                        this.renderDirections(ruta.geometry);
                    }
                } else {
                    if (this.polyline) {
                        this.polyline.setMap(null);
                    }
                }
            }
        });
        this.facade.showGeometryZone$.subscribe((zoneShow) => {
            if (this.routePlanning.viewingMode === 0) {
                if (
                    zoneShow.ShowGeometryZone &&
                    this.zones[zoneShow.zoneShowGeometry].evaluated
                ) {
                    if (this.polyline) {
                        this.polyline.setMap(null);
                    }
                    let ruta = this.zones[zoneShow.zoneShowGeometry];
                    if (ruta) {
                        this.pathColor = ruta.color;
                        this.renderDirections(ruta.geometry);
                    }
                } else {
                    if (this.polyline) {
                        this.polyline.setMap(null);
                    }
                }
            }
        });
        this.facade.selectedDeliveryPoint$.subscribe((data) => {
            if (data != -1) {
                if (
                    data &&
                    this.routePlanning.viewingMode === 0
                ) {
                    this.changePoint = true;
                    this.falseLoadControl = false;
                    let zoneSelected: any = this.keyvalue
                        .transform(this.zones) ? this.keyvalue
                            .transform(this.zones)
                            .find((x: any) =>
                                x.value.deliveryPoints.find((y) => +y.id === +data)
                            ) : undefined;
                } else if (
                    data &&
                    this.routePlanning.viewingMode === 1
                ) {
                    if (this.keyvalue
                        .transform(this.zones) && this.keyvalue
                            .transform(this.zones)
                            .find(
                                (x: any) =>
                                    x.value.optimization &&
                                    x.value.optimization.solution.routes.find((y) =>
                                        y.deliveryPoints.find((z) => z.id === data),
                                    ),
                            )) {
                        let zone: any = this.keyvalue
                            .transform(this.zones)
                            .find(
                                (x: any) =>
                                    x.value.optimization &&
                                    x.value.optimization.solution.routes.find((y) =>
                                        y.deliveryPoints.find((z) => z.id === data),
                                    ),
                            ).value;
                        let route = zone.optimization.solution.routes.find((y) =>
                            y.deliveryPoints.find((x) => x.id === data),
                        );
                    }
                }
            }
        });
        this.geolocationFacade.selectedId$.pipe(takeUntil(this.unsubscribe$)).subscribe((selectedId) => {
            this.selectedGeoId = selectedId;
        });
        this.geolocation$ = this.geolocationFacade.geolocation$;
        this.geolocationFacade.hoverId$.pipe(takeUntil(this.unsubscribe$)).subscribe((hoverId) => {
            this.hoverGeoId = hoverId;
        });
        this.geolocationFacade.geolocation$.pipe(takeUntil(this.unsubscribe$)).subscribe((geolocation) => {
            if (geolocation && geolocation.length > 0) {
                this.geolocationFacade.show$.pipe(take(1)).subscribe((show) => {
                    this.showGeolocation = show;
                });
                this.geolocation = geolocation;
                this.searchUser(this.filterGeo);
                try {
                    this.detectChange.detectChanges();
                } catch (e) {

                }
            } else if (geolocation.length === 0) {
                this.geolocation = [];
            }
        });

        this.facade.moving$.pipe(takeUntil(this.unsubscribe$)).subscribe((moving) => {
            if (!moving) {
                this.changeSelected(this.selectedPoint);
                try {
                    this.detectChange.detectChanges();
                } catch (e) {

                }
            } else {
            }
        });

        this.optimizationPreference$ = this.preferenceFacade.optimizationPreferences$;
        this.loadDelayTimeData();
    }

    changeToMoment(date, format: string) {
        return moment(date).format(format);
    }

    changeMapRender() {
        this.preferenceFacade.loaded$.pipe(takeUntil(this.unsubscribe$)).subscribe((loaded) => {
            if (loaded) {
                this.preferenceFacade.optimizationPreferences$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
                    if (data && data.warehouse && data.warehouse.coordinates && data.warehouse.coordinates.latitude !== 0 && data.warehouse.coordinates.latitude !== null) {
                        this.initialCenter = data.warehouse.coordinates;
                        this.map.setCenter({ lat: data.warehouse.coordinates.latitude, lng: data.warehouse.coordinates.longitude });
                        this.initialZoom = 13;
                        this.map.setZoom(13);
                    }
                })
            }
        })

    }

    loadDelayTimeData() {
        this.backend.get('company_preference_delay_time_type').pipe(take(1)).subscribe(({ data }) => {
            this.delayTimes = data;
            try {
                this.detectChange.detectChanges();
            } catch (e) {

            }

        })
    }

    ngOnDestroy() {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.mapStageSubscription.unsubscribe();
        this.zoneInfoChipsSubscription.unsubscribe();
        this.routeInfoChipsSubscription.unsubscribe();
        this.hoveredZoneSubscription.unsubscribe();
        this.hoveredPointSubscription.unsubscribe();
        this.SelectPointSubscription.unsubscribe();
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

    }

    // ---------------- STATE ACTIONS ----------------
    toggleDisplayZone(zoneId: number) {
        this.facade.toggleDisplayZone(zoneId);
    }
    toggleSelectZone(zoneId: number) {
        this.facade.toggleSelectZone(zoneId);
    }
    toggleDisplayRoute(zoneId: number, routeId: number) {
        //this.facade.toggleDisplayRoute(zoneId, routeId);
        if (this.highlightedRoute === routeId) {
            this.facade.highlightRoute(-1);
        } else {
            if (!this.zoneStatus[zoneId].selected) this.facade.toggleSelectZone(zoneId);
            if (!this.routesStatus[zoneId][routeId].selected)
                this.facade.toggleSelectRoute(zoneId, routeId);
            this.facade.highlightRoute(routeId);
        }
    }
    toggleSelectRoute(zoneId: number, routeId: number) {
        if (this.routesStatus[zoneId][routeId].selected) {
            if (this.highlightedRoute === routeId) this.facade.highlightRoute(-1);
        } else {
            this.facade.highlightRoute(routeId);
            if (!this.zoneStatus[zoneId].selected) this.facade.toggleSelectZone(zoneId);
        }
        this.facade.toggleSelectRoute(zoneId, routeId);
    }
    public changeSelected(selectedPointId, pointSelected = undefined) {
        this.changeHovered(-1);
        this.agglomerationSelected = undefined;
        this.facade.selectDeliveryPoint(selectedPointId);
    }

    protected mapReady(map) {
        this.map = map;
    }
    renderDirections(polyline: any) {
        let geometry = google.maps.geometry;
        this.paths = geometry.encoding.decodePath(polyline);
        this.polyline = new google.maps.Polyline({
            path: this.paths,
            strokeColor: '#000000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            geodesic: true,
            icons: [
                {
                    icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
                    offset: '100%',
                    repeat: '100px',
                },
            ],
        });
        this.polyline.setMap(this.map);
    }

    move($ylat, $xlng, $direction_degree, $length_degree) {
        const $x = $xlng + $length_degree * Math.cos(($direction_degree * Math.PI) / 180);
        const $y = $ylat + $length_degree * Math.sin(($direction_degree * Math.PI) / 180);
        return { latitude: $y, longitude: $x };
    }
    async setValuesChange(selectedPointId) {
        if (
            selectedPointId >= 0 &&
            /* this.deliveryPointId != selectedPointId && */
            this.routePlanning.viewingMode === 0
        ) {
            this.tabSelected = 0;
            let zones = this.pipeKeyValue.transform(this.zones).map((x) => x.value);
            let zoneOri: any = zones.find(
                (x: any) =>
                    x.deliveryPoints.find((x) => x.id == selectedPointId) != undefined,
            );

            let point = zoneOri.deliveryPoints.find((x) => x.id == selectedPointId);
            let { data } = await this.backend.get('delivery_point/' + point.deliveryPointId).pipe(take(1)).toPromise();
            this.pointSelected = data;
            this.order = point.order;
            this._order = point.order;
            this.deliveryPointId = point.id;
            this.selectedZoneId = zoneOri.id;
            this._selectedZoneId = zoneOri.id;
            this._openingTime = secondsToDayTimeAsString(point.deliveryWindow.start);
            this._closingTime = secondsToDayTimeAsString(point.deliveryWindow.end);
            this.openingTime = secondsToDayTimeAsString(point.deliveryWindow.start);
            this.closingTime = secondsToDayTimeAsString(point.deliveryWindow.end);
            this.zoneId = zoneOri.id;
            let totalSeconds = point.serviceTime;
            this.dischargingHours = Math.floor(point.serviceTime / 3600);
            totalSeconds %= 3600;
            this.dischargingMinutes = Math.floor(totalSeconds / 60);
            this.dischargingSeconds = totalSeconds % 60;
            this._address = point.address;
            this._latitude = point.coordinates.latitude;
            this._longitude = point.coordinates.longitude;
            this._deliveryType = point.deliveryType ? point.deliveryType : 'shipment';
            this._orderNumber = point.orderNumber;
            this.companyPreferenceDelayTimeId = point.companyPreferenceDelayTimeId;
            this.allowDelayTime = point.allowDelayTime;
            this._deliveryNotes = point.deliveryNotes && point.deliveryNotes.length > 0 ? point.deliveryNotes : '';
        }
        if (
            selectedPointId >= 0 &&
            /* this.deliveryPointId != selectedPointId && */
            this.routePlanning.viewingMode === 1
        ) {

            this.tabSelected = 0;
            let point;
            let route;
            let zones = this.pipeKeyValue.transform(this.zones).map((x) => x.value);
            let zoneOri: any = zones.find((x: any) => {
                if (
                    x.optimization &&
                    x.optimization.solution &&
                    x.optimization.solution.routes
                ) {
                    route = x.optimization.solution.routes.find((x) => {
                        point = x.deliveryPoints.find((x) => x.id == selectedPointId);
                        return point;
                    });
                    return route;

                }
            });

            let { data } = await this.backend.get('delivery_point/' + point.deliveryPointId).pipe(take(1)).toPromise();
            this.pointSelected = data;
            this.zoneOptim = this.zonesPickFunction(this.zones);
            this.selectedRouteId = route.id;
            this._selectedRouteId = route.id;
            this.order = point.order;
            this._order = point.order;
            this.deliveryPointId = point.id;
            this.selectedZoneId = zoneOri.id;
            this._selectedZoneId = zoneOri.id;
            this._openingTime = secondsToDayTimeAsString(point.deliveryWindow.start);
            this._closingTime = secondsToDayTimeAsString(point.deliveryWindow.end);
            this.openingTime = secondsToDayTimeAsString(point.deliveryWindow.start);
            this.closingTime = secondsToDayTimeAsString(point.deliveryWindow.end);
            this._isOpeningTimeNotFree = point.deliveryWindow.start ? true : false;
            this._isClosingTimeNotFree = point.deliveryWindow.end ? true : false;
            this.isOpeningTimeNotFree = point.deliveryWindow.start ? true : false;
            this.isClosingTimeNotFree = point.deliveryWindow.end ? true : false;
            this.zoneId = zoneOri.id;
            let totalSeconds = point.leadTime;
            this.dischargingHours = Math.floor(point.leadTime / 3600);
            totalSeconds %= 3600;
            this.dischargingMinutes = Math.floor(totalSeconds / 60);
            this.dischargingSeconds = totalSeconds % 60;

            let totalSecondsDelay = point.allowedDelayTime;
            this.dischargingHoursDelay = Math.floor(point.allowedDelayTime / 3600);
            totalSecondsDelay %= 3600;
            this.dischargingMinutesDelay = Math.floor(totalSecondsDelay / 60);
            this.dischargingSecondsDelay = totalSecondsDelay % 60;
            this.companyPreferenceDelayTimeId = point.companyPreferenceDelayTimeId;
            this.allowDelayTime = point.allowDelayTime;
            this._deliveryType = point.deliveryType;
            this._orderNumber = point.orderNumber;
            this._deliveryNotes = point.deliveryNotes && point.deliveryNotes.length > 0 ? point.deliveryNotes : '';
        }

        try {
            this.detectChange.detectChanges();
        } catch(e){

        }

    }

    asignateCommercial() {
        if (this._salesman) {
            console.log(this.pointInPolygon);

            this.backend.post('delivery_point/multiple_visit_schedule_assign', {
                agentUserId: this._salesman,
                deliveryPoints: this.pointInPolygon.map(x => x.identifier),
                scheduleDays: this.scheduleDaysVisits
            }).pipe(take(1)).subscribe((data) => {
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this.translate.instant('GENERAL.ACCEPT')
                );
                this.deleteSelectedShape();
            }, error => {
                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            })
        }
    }

    assignateRuta(){
        if (this._ruta != '') {

            this.backend.post('delivery_point/multiple_service_schedule_assign', {
                deliveryZoneId: this._ruta,
                deliveryPoints: this.pointInPolygon.map(x => x.identifier),
                scheduleDays: this.scheduleDaysRoute
            }).pipe(take(1)).subscribe((data) => {
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this.translate.instant('GENERAL.ACCEPT')
                );
                this.deleteSelectedShape();
            }, error => {
                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            })
        }
    }
    zonesPickFunction(zones) {
        const object: any = {};
        for (const zoneId in zones) {
            if (
                this.routePlanning.viewingMode === 1 &&
                zones[zoneId] &&
                zones[zoneId].optimization &&
                zones[zoneId].optimization.solution
            )
                object[zoneId] = {
                    // id: zoneId,
                    id: zones[zoneId].id,
                    name: zones[zoneId].name,
                    amountDeliveryPoints: zones[zoneId].deliveryPoints.length,
                    routes:
                        zones[zoneId] &&
                            zones[zoneId].optimization &&
                            zones[zoneId].optimization.solution &&
                            zones[zoneId].optimization.solution.routes
                            ? this.routesPickFunction(
                                zones[zoneId].optimization.solution.routes,
                            )
                            : {},
                };
        }
        return object;
    }

    secondToTime(value) {
        return secondsToDayTimeAsString(value);
    }

    updateCommercial(value) {
        console.log(value);
        this.backend.put('delivery_point/commercial/update/' + this.pointSelected.id, {
            agentUserId: value
        }).pipe(take(1)).subscribe(({ data }) => {
            this.loading.hideLoading();
            this.pointSelected.agentUserId = +value;
            this.initFormVisit(this.hoursVisists);
            this.toastService.displayWebsiteRelatedToast(
                this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                this.translate.instant('GENERAL.ACCEPT')
            );
            this.detectChange.detectChanges();
        });
    }

    changeHoursDefault(value, time) {


        if (time === 'start') {
            this.pointSelected.deliveryWindowVisitStart = dayTimeAsStringToSeconds(value);
        } else {
            this.pointSelected.deliveryWindowVisitEnd = dayTimeAsStringToSeconds(value);
        }

        if (this.pointSelected.deliveryWindowVisitStart < this.pointSelected.deliveryWindowVisitEnd) {
            this.backend.put('delivery_point/commercial/update/' + this.pointSelected.id, {
                deliveryWindowVisitStart: this.pointSelected.deliveryWindowVisitStart,
                deliveryWindowVisitEnd: this.pointSelected.deliveryWindowVisitEnd
            }).pipe(take(1)).subscribe(({ data }) => {
                this.loading.hideLoading();
                this.initFormVisit(this.hoursVisists);
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this.translate.instant('GENERAL.ACCEPT')
                );
                this.detectChange.detectChanges();
            });
        } else {
            this.initFormVisit(this.hoursVisists);
        }


    }

    async selectCommercialTab() {
        await this.loading.showLoading();
        this.backend.get('delivery_point_visit_schedule/' + this.pointSelected.id).pipe(take(1)).subscribe(({ data }) => {
            this.loading.hideLoading();
            this.hoursVisists = data;
            this.initFormVisit(data);
            this.tabSelected = 2;
            this.detectChange.detectChanges();
        }, error => {
            this.loading.hideLoading();
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        });
    }

    async changeActivateDeliveryVisitSchedule(value) {
        await this.loading.showLoading();
        this.pointSelected.activateDeliveryVisitSchedule = value;
        this.backend.put('delivery_point_visit_schedule_day/deliveryPoint/' + this.pointSelected.id, {
            activateDeliveryVisitSchedule: value
        }).pipe(take(1)).subscribe(({ data }) => {
            this.hoursVisists = data;
            this.initFormVisit(data);
            this.loading.hideLoading();
            this.toastService.displayWebsiteRelatedToast(
                this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                this.translate.instant('GENERAL.ACCEPT')
            );
            this.detectChange.detectChanges();
        }, error => {
            this.loading.hideLoading();
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        })
    }

    async changeActiveDeliveryScheduleDay(value, day) {
        await this.loading.showLoading();
        this.backend.put('delivery_point_visit_schedule_day/' + this.hoursVisists[day].id, {
            isActive: value
        })
            .pipe(take(1)).subscribe(({ data }) => {
                this.loading.hideLoading();
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this.translate.instant('GENERAL.ACCEPT')
                );
                this.detectChange.detectChanges();
            }, error => {
                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            })
    }

    async applyAllDay() {

        await this.loading.showLoading();
        this.pointSelected.deliveryWindowVisitStart = dayTimeAsStringToSeconds(this.formVisits.get('deliveryWindowVisitStart').value);
        this.pointSelected.deliveryWindowVisitEnd = dayTimeAsStringToSeconds(this.formVisits.get('deliveryWindowVisitEnd').value);

        this.backend.put('apply_visit_schedule_every_day/deliveryPoint/' + this.pointSelected.id, {
            deliveryWindowVisitEnd: dayTimeAsStringToSeconds(this.formVisits.get('deliveryWindowVisitEnd').value),
            deliveryWindowVisitStart: dayTimeAsStringToSeconds(this.formVisits.get('deliveryWindowVisitStart').value),
        })
            .pipe(take(1)).subscribe(({ data }) => {
                this.hoursVisists = data;
                this.initFormVisit(data);
                this.loading.hideLoading();
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this.translate.instant('GENERAL.ACCEPT')
                );
                this.detectChange.detectChanges();
            })
    }

    async changeHours(value, day, time) {

        if (this.hoursVisists[day].hours.length > 0) {
            if (time === 'start') {
                this.hoursVisists[day].hours[0].timeStart = dayTimeAsStringToSeconds(value);
            } else {
                this.hoursVisists[day].hours[0].timeEnd = dayTimeAsStringToSeconds(value);
            }

            if (this.hoursVisists[day].hours[0].id > 0) {

                if (this.hoursVisists[day].hours[0].timeStart >= 0 && this.hoursVisists[day].hours[0].timeEnd >= 0) {
                    this.backend.put('delivery_point_visit_schedule_hour/' + this.hoursVisists[day].hours[0].id, this.hoursVisists[day].hours[0])
                        .pipe(take(1))
                        .subscribe((response) => {
                            this.toastService.displayWebsiteRelatedToast(
                                this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                                this.translate.instant('GENERAL.ACCEPT')
                            );
                            this.detectChange.detectChanges();
                        }, error => {
                            this.toastService.displayHTTPErrorToast(error.status, error.error.error)
                        })
                }

            }
        } else {

            this.hoursVisists[day].hours.push({
                timeStart: 0,
                timeEnd: 86399
            });


            if (time === 'start') {
                this.hoursVisists[day].hours[0].timeStart = dayTimeAsStringToSeconds(value);
            } else {
                this.hoursVisists[day].hours[0].timeEnd = dayTimeAsStringToSeconds(value);
            }

            if (this.hoursVisists[day].hours[0].timeStart >= 0
                && this.hoursVisists[day].hours[0].timeEnd >= 0
                && this.hoursVisists[day].hours[0].timeStart != -1
                && this.hoursVisists[day].hours[0].timeEnd != -1) {
                this.backend.post('delivery_point_visit_schedule_hour', {

                    deliveryPointVisitScheduleDayId: this.hoursVisists[day].id,
                    timeStart: this.hoursVisists[day].hours[0].timeStart,
                    timeEnd: this.hoursVisists[day].hours[0].timeEnd

                }).pipe(take(1)).subscribe((response) => {

                    this.hoursVisists[day].hours[0] = response.data;

                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('GENERAL.REGISTRATION'),
                        this.translate.instant('GENERAL.ACCEPT')
                    )

                    this.detectChange.detectChanges();
                }, error => {
                    this.toastService.displayHTTPErrorToast(error.status, error.error.error)
                })
            }
        }


    }

    initFormVisit(value) {
        this.formVisits = new FormGroup({
            agentUserId: new FormControl(this.pointSelected.agentUserId),
            deliveryWindowVisitStart: new FormControl(secondsToDayTimeAsString(this.pointSelected.deliveryWindowVisitStart ? this.pointSelected.deliveryWindowVisitStart : 0)),
            deliveryWindowVisitEnd: new FormControl(secondsToDayTimeAsString(this.pointSelected.deliveryWindowVisitEnd ? this.pointSelected.deliveryWindowVisitEnd : 86399)),
            activateDeliveryVisitSchedule: new FormControl(this.pointSelected.activateDeliveryVisitSchedule),
            activeScheduleMondayVisit: new FormControl(value[0].isActive),
            activeScheduleTuesdayVisit: new FormControl(value[1].isActive),
            activeScheduleWednesdayVisit: new FormControl(value[2].isActive),
            activeScheduleThursdayVisit: new FormControl(value[3].isActive),
            activeScheduleFridayVisit: new FormControl(value[4].isActive),
            activeScheduleSaturdayVisit: new FormControl(value[5].isActive),
            activeScheduleSundayVisit: new FormControl(value[6].isActive),
            startTimeScheduleMondayVisit: new FormControl(secondsToDayTimeAsString(value[0].hours && value[0].hours[0] && value[0].hours[0].timeStart ? value[0].hours[0].timeStart : 0)),
            startTimeScheduleTuesdayVisit: new FormControl(secondsToDayTimeAsString(value[1].hours && value[1].hours[0] && value[1].hours[0].timeStart ? value[1].hours[0].timeStart : 0)),
            startTimeScheduleWednesdayVisit: new FormControl(secondsToDayTimeAsString(value[2].hours && value[2].hours[0] && value[2].hours[0].timeStart ? value[2].hours[0].timeStart : 0)),
            startTimeScheduleThursdayVisit: new FormControl(secondsToDayTimeAsString(value[3].hours && value[3].hours[0] && value[3].hours[0].timeStart ? value[3].hours[0].timeStart : 0)),
            startTimeScheduleFridayVisit: new FormControl(secondsToDayTimeAsString(value[4].hours && value[4].hours[0] && value[4].hours[0].timeStart ? value[4].hours[0].timeStart : 0)),
            startTimeScheduleSaturdayVisit: new FormControl(secondsToDayTimeAsString(value[5].hours && value[5].hours[0] && value[5].hours[0].timeStart ? value[5].hours[0].timeStart : 0)),
            startTimeScheduleSundayVisit: new FormControl(secondsToDayTimeAsString(value[6].hours && value[6].hours[0] && value[6].hours[0].timeStart ? value[6].hours[0].timeStart : 0)),
            endTimeSheduleMondayVisit: new FormControl(secondsToDayTimeAsString(value[0].hours && value[0].hours[0] && value[0].hours[0].timeEnd ? value[0].hours[0].timeEnd : 86399)),
            endTimeScheduleTuesdayVisit: new FormControl(secondsToDayTimeAsString(value[1].hours && value[1].hours[0] && value[1].hours[0].timeEnd ? value[1].hours[0].timeEnd : 86399)),
            endTimeScheduleWednesdayVisit: new FormControl(secondsToDayTimeAsString(value[2].hours && value[2].hours[0] && value[2].hours[0].timeEnd ? value[2].hours[0].timeEnd : 86399)),
            endTimeScheduleThursdayVisit: new FormControl(secondsToDayTimeAsString(value[3].hours && value[3].hours[0] && value[3].hours[0].timeEnd ? value[3].hours[0].timeEnd : 86399)),
            endTimeScheduleFridayVisit: new FormControl(secondsToDayTimeAsString(value[4].hours && value[4].hours[0] && value[4].hours[0].timeEnd ? value[4].hours[0].timeEnd : 86399)),
            endTimeScheduleSaturdayVisit: new FormControl(secondsToDayTimeAsString(value[5].hours && value[5].hours[0] && value[5].hours[0].timeEnd ? value[5].hours[0].timeEnd : 86399)),
            endTimeScheduleSundayVisit: new FormControl(secondsToDayTimeAsString(value[6].hours && value[6].hours[0] && value[6].hours[0].timeEnd ? value[6].hours[0].timeEnd : 86399)),
        })

        this.detectChange.detectChanges();

    }

    routesPickFunction(routes) {
        const object: any = {};
        for (const index in routes) {
            object[routes[index].id] = {
                // id: routeId,
                route: routes[index],
                id: routes[index].id,
                /* amountDeliveryPoints: routes[index].deliveryPoints.length, */
                amountDeliveryPoints: routes[index] && routes[index].deliveryPoints ? routes[index].deliveryPoints.length : 0,
            };
        }
        return object;
    }
    public changeHovered(hoveredPointId) {
        if (hoveredPointId === -1) {
            this.hoverInMap = false;
        } else {
            this.hoverInMap = true;
        }
        this.facade.setHoveredDeliveryPoint(hoveredPointId);
    }
    toggleDepotOpened() {
        this.facade.toggleDepotOpened();
    }
    toggleUseRouteColors() {
        this.facade.toggleUseRouteColors();
    }
    toggleShowOnlyOptimizedZones() {
        this.facade.toggleShowOnlyOptimizedZones();
    }
    public switchView(newView: RoutePlanningViewingMode) {
        this.facade.toggleSwitchMapView(newView);
    }
    public changePriority(zoneId: number, dpId: number, event: any) {
        this.facade.setPriority(zoneId, dpId, event.value);
    }
    public highlightRoute(routeId: number) {
        this.facade.highlightRoute(routeId);
    }
    public expandZone(zoneId: number) {
        this.facade.toggleExpandZone(zoneId);
    }
    public centerChange() {
        this.mapElement._mapsWrapper.getCenter().then((latLngLiteral) => {
            if (this.currentCenter == null && !this.changePoint) {
                this.fitBounds = true;
                this.falseLoadControl = true;
                this.currentCenter = {
                    latitude: latLngLiteral.lat(),
                    longitude: latLngLiteral.lng(),
                };
                this.initialCenter = this.currentCenter;
            } else if (this.falseLoadControl && !this.changePoint) {
                this.falseLoadControl = false;
                /* this.currentCenter = {
                    latitude: latLngLiteral.lat(),
                    longitude: latLngLiteral.lng(),
                };
                this.initialCenter = this.currentCenter; */
            } else if (this.currentCenterMoved === null) {
                this.fitBounds = false;
                this.currentCenterMoved = {
                    latitude: latLngLiteral.lat(),
                    longitude: latLngLiteral.lng(),
                };
                this.currentCenter = {
                    latitude: latLngLiteral.lat(),
                    longitude: latLngLiteral.lng(),
                };
            } else {
                this.fitBounds = false;
                this.currentCenterMoved = {
                    latitude: latLngLiteral.lat(),
                    longitude: latLngLiteral.lng(),
                };
            }
        });

        if (
            this.mapStage !== RoutePlanningMapStage.empty &&
            this.currentZoom === this.initialZoom
        ) {
            this.centerMap();
        }
    }
    isLight(color: string) {
        return color != 'primary' && color != 'warn' && color != 'accent'
            ? isColorLight(color)
            : true;
    }

    centerMap(map?: any) {
        if (map) {
            this.map = map;
            if (this.mapStage === RoutePlanningMapStage.empty) {
                this.changeMapRender();
            }

        } else {
            this.initialZoom = 3;
        }
        if (this.mapStage === RoutePlanningMapStage.empty) {
            this.fitBounds = false;
            this.currentZoom = this.initialZoom;
        } else {
            this.fitBounds = true;
            this.falseLoadControl = true;
        }
        this.currentCenter = this.initialCenter;
        this.currentCenterMoved = this.initialCenter;

        if (!google.maps.Polygon.prototype.getBounds) {
            google.maps.Polygon.prototype.getBounds = function(latLng) {
              var bounds = new google.maps.LatLngBounds(),
                paths = this.getPaths(),
                path,
                p, i;

              for (p = 0; p < paths.getLength(); p++) {
                path = paths.getAt(p);
                for (i = 0; i < path.getLength(); i++) {
                  bounds.extend(path.getAt(i));
                }
              }

              return bounds;
            };
          }

        if(!google.maps.Polygon.prototype.containsLatLng){
            google.maps.Polygon.prototype.containsLatLng = function(latLng) {
                // Exclude points outside of bounds as there is no way they are in the poly

                var inPoly = false,
                  bounds, lat, lng,
                  numPaths, p, path, numPoints,
                  i, j, vertex1, vertex2;

                // Arguments are a pair of lat, lng variables
                if (arguments.length == 2) {
                  if (
                    typeof arguments[0] == "number" &&
                    typeof arguments[1] == "number"
                  ) {
                    lat = arguments[0];
                    lng = arguments[1];
                  }
                } else if (arguments.length == 1) {
                  bounds = this.getBounds();

                  if (!bounds && !bounds.contains(latLng)) {
                    return false;
                  }
                  lat = latLng.lat();
                  lng = latLng.lng();
                } else {
                  console.log("Wrong number of inputs in google.maps.Polygon.prototype.contains.LatLng");
                }

                // Raycast point in polygon method

                numPaths = this.getPaths().getLength();
                for (p = 0; p < numPaths; p++) {
                  path = this.getPaths().getAt(p);
                  numPoints = path.getLength();
                  j = numPoints - 1;

                  for (i = 0; i < numPoints; i++) {
                    vertex1 = path.getAt(i);
                    vertex2 = path.getAt(j);

                    if (
                      vertex1.lng() <  lng &&
                      vertex2.lng() >= lng ||
                      vertex2.lng() <  lng &&
                      vertex1.lng() >= lng
                    ) {
                      if (
                        vertex1.lat() +
                        (lng - vertex1.lng()) /
                        (vertex2.lng() - vertex1.lng()) *
                        (vertex2.lat() - vertex1.lat()) <
                        lat
                      ) {
                        inPoly = !inPoly;
                      }
                    }

                    j = i;
                  }
                }

                return inPoly;
              };
        }

    }
    onZoomChange(zoom: number) {
        this.currentZoom = zoom;
    }
    pointList: { lat: number; lng: number }[] = [];
    selectedArea = 0;
    initDrawingManager = (map: any = this.map) => {
        this._selectedZoneId = 0;
        this.drawinManagerType = 1;
        const self = this;
        try {
            self.drawingManager.setDrawingMode(null);
            self.drawingManager.setOptions({
                drawingControl: false,
            });
            self.markerClose.setMap(null);
            this.selectedShape.setMap(null);
            this.selectedArea = 0;
            this.pointList = [];

            // To hide:

        } catch (e) {

        }

        if (!this.printPolygon) {

            this.printPolygon = true;
            const options = {
                drawingControl: false,
                drawingControlOptions: {
                    drawingModes: ['polygon'],
                    position: google.maps.ControlPosition.TOP_CENTER,
                },
                polygonOptions: {
                    draggable: false,
                    editable: false
                },
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
            };
            this.drawingManager = new google.maps.drawing.DrawingManager(options);
            this.drawingManager.setMap(map);

            google.maps.event.addListener(
                this.drawingManager,
                'overlaycomplete',
                (event) => {
                    if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                        const paths = event.overlay.getPaths();
                        for (let p = 0; p < paths.getLength(); p++) {
                            google.maps.event.addListener(
                                paths.getAt(p),
                                'set_at',
                                () => {
                                    if (!event.overlay.drag) {
                                        self.updatePointList(event.overlay.getPath());
                                    }
                                }
                            );
                            google.maps.event.addListener(
                                paths.getAt(p),
                                'insert_at',
                                () => {
                                    self.updatePointList(event.overlay.getPath());
                                }
                            );
                            google.maps.event.addListener(
                                paths.getAt(p),
                                'remove_at',
                                () => {
                                    self.updatePointList(event.overlay.getPath());
                                }
                            );
                        }
                        self.updatePointList(event.overlay.getPath());
                    }
                    if (event.type !== google.maps.drawing.OverlayType.MARKER) {
                        // Switch back to non-drawing mode after drawing a shape.
                        self.drawingManager.setDrawingMode(null);
                        // To hide:
                        self.drawingManager.setOptions({
                            drawingControl: false,
                        });
                    }
                }
            );
            google.maps.event.addListener(this.drawingManager, 'polygoncomplete', (shape) => {
                this.selectedShape = shape;
                const major = this.pointList.sort((a, b) => {
                    return b.lat - a.lat;
                })[0];
                self.drawingManager.setDrawingMode(null);
                // To hide:
                self.drawingManager.setOptions({
                    drawingControl: false,
                });
                self.getAllMarkerInTheShape(shape);
                self.mapPolygon = self.routePlanning.viewingMode;
                self.markerClose = new google.maps.Marker({
                    position: major,
                    map,
                    icon: 'assets/map/close.png',
                    title: "Cerrar!",
                });
                this.map.setCenter({ lat: major.lat, lng: major.lng });
                self.detectChange.detectChanges();
                if (self.routePlanning.viewingMode === 1) {
                    this.zoneOptim = this.zonesPickFunction(this.zones);
                }
                google.maps.event.addListener(this.markerClose, "click", function () {
                    self.deleteSelectedShape();
                });
            });
        } else {
            this.printPolygon = false;
            this.pointInPolygon = [];
        }



    }

    changeZonePolygon() {

        if (this.routePlanning.viewingMode === 0) {

            this.facade.movePointsFromMap(this.zonePolygon, this.pointInPolygon.map((point) => {
                return {
                    id: point.id
                }
            }));
            this.loading.showLoading();
            this.facade.moving$.pipe(take(2)).subscribe((moving) => {
                if (!moving) {
                    this.loading.hideLoading();
                    this.deleteSelectedShape();
                }

            })
        } else {
            this.facade.routeMovePointFromMap(this.zonePolygon, this.pointInPolygon.map((point) => {
                return {
                    id: point.id
                }
            }));
            this.loading.showLoading();
            this.facade.moving$.pipe(take(2)).subscribe((moving) => {
                if (!moving) {
                    this.loading.hideLoading();
                    this.deleteSelectedShape();
                }

            })
        }

    }


    createZone() {
        const modal = this._modalService.open(CreateZoneModalComponent, {

            backdrop: 'static',

            backdropClass: 'customBackdrop',

            centered: true,

            size: 'lg'


        });

        const zones: any = this.pipeKeyValue.transform(this.zones);
        modal.componentInstance.sessionId = zones[0].value.sessionId;
        modal.componentInstance.mapView = this.routePlanning.viewingMode;
        modal.componentInstance.showZoneOld = false;
        modal.result.then((data) => {
            if (data) {
                this.zonePolygon = data;
                if (this.routePlanning.viewingMode === 1) {

                    const zones = [];
                    this.keyvalue.transform(this.routesStatus).forEach(zone => {
                        if (this.routesStatus[zone.key] !== null) {
                            Object.keys(this.routesStatus[zone.key]).forEach(route => {
                                zones.push({
                                    zoneId: zone.key,
                                    routeId: +route
                                });
                            });
                        }
                    });

                    const points = [];
                    this.pointInPolygon.forEach(point => {

                        const zoneId = zones.find(x => x.routeId === point.routeId).zoneId;

                        const deliveryPoint = this.routePlanning.planningSession.deliveryZones[zoneId].deliveryPoints.find(x => x.identifier === point.deliveryPointId);

                        points.push(deliveryPoint);


                    });

                    this.facade.movePointsFromMap(data, points.map((point) => {
                        return {
                            id: point.id
                        }
                    }));
                    this.loading.showLoading();
                    this.facade.allRoutePlanning$.pipe(take(3)).subscribe(async (routePlanning) => {
                        if (routePlanning && !routePlanning.moving) {
                            this.loading.hideLoading();
                            let zoneIds: number[] = [];
                            for (let zoneId in routePlanning.planningSession.deliveryZones) {
                                if (
                                    await this.canBeOptimized(
                                        routePlanning.planningSession.deliveryZones[zoneId],
                                    )
                                ) {
                                    zoneIds.push(+zoneId);
                                }
                            }
                            if (zoneIds.length > 0) this.facade.optimize({ zoneIds });
                            this.loading.hideLoading();
                            this.deleteSelectedShape();
                        }
                    });
                }
            }
        }, (error) => {
        });
    }

    public changeAllowDelayTime(value) {
        this.allowDelayTime = value;
        try {
            this.detectChange.detectChanges();
        } catch (e) {

        }
    }

    private async canBeOptimized(zone: PlanningDeliveryZone) {
        return (
            this.hasDeliveryPoints(zone) &&
            this.hasVehicles(zone) &&
            (await this.enoughCapacity(zone)) &&
            !(await this.isBeingOptimized(zone))
        );
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

    private async isBeingOptimized(zone: PlanningDeliveryZone) {
        const optimizationStatus = await this.facade
            .getOptimizationStatus(zone.id)
            .pipe(take(1))
            .toPromise();
        return optimizationStatus.loading;
    }

    private hasVehicles(zone: PlanningDeliveryZone) {
        if (zone.vehicles.length >= 1) return true;
        for (let subZoneId in zone.deliveryZones) {
            if (zone.deliveryZones[subZoneId].vehicles.length >= 1) return true;
        }
        return false;
    }

    getAllMarkerInTheShape(shape) {
        this.pointInPolygon = [];
        this._salesman = 0;
        this._ruta = '';
        this.tapDibujar = 0;
        this.scheduleDaysVisits = [
            {id: 1, isActive: false},
            {id: 2, isActive: false},
            {id: 3, isActive: false},
            {id: 4, isActive: false},
            {id: 5, isActive: false},
            {id: 6, isActive: false},
            {id: 7, isActive: false},
        ];
        this.scheduleDaysRoute = [
            {id: 1, isActive: false},
            {id: 2, isActive: false},
            {id: 3, isActive: false},
            {id: 4, isActive: false},
            {id: 5, isActive: false},
            {id: 6, isActive: false},
            {id: 7, isActive: false},
        ];
        if (this.routePlanning.viewingMode === 0) {
            // no optimizadas
            this.pipeKeyValue.transform(this.zones).forEach((zone: any) => {
                zone.value.deliveryPoints.forEach((point) => {
                    let myLatLng = new google.maps.LatLng({
                        lat: point.coordinates.latitude,
                        lng: point.coordinates.longitude
                    });
                    if (shape.containsLatLng(myLatLng)) {
                        this.pointInPolygon.push(point);
                        try {
                            this.detectChange.detectChanges();
                        }catch(e){

                        }
                    }
                })
            });
        } else {
            //optimizadas
            this.pipeKeyValue.transform(this.zones).forEach((zone: any) => {
                if (this.zoneStatus[zone.value.id].optimized) {
                    zone.value.optimization.solution.routes.forEach((route) => {
                        route.deliveryPoints.forEach((point) => {
                            let myLatLng = new google.maps.LatLng({
                                lat: point.coordinates.latitude,
                                lng: point.coordinates.longitude
                            });
                            if (shape.containsLatLng(myLatLng)) {
                                this.pointInPolygon.push(point);
                            }
                        });
                    })
                }
            });
        }
    }


    deleteSelectedShape() {
        this.zonePolygon = 0;
        if (this.selectedShape) {
            this.pointInPolygon = [];
            this._salesman = 0;
            this._ruta = '';
            this.tapDibujar = 0;
            this.scheduleDaysVisits = [
                {id: 1, isActive: false},
                {id: 2, isActive: false},
                {id: 3, isActive: false},
                {id: 4, isActive: false},
                {id: 5, isActive: false},
                {id: 6, isActive: false},
                {id: 7, isActive: false},
            ];
            this.scheduleDaysRoute = [
                {id: 1, isActive: false},
                {id: 2, isActive: false},
                {id: 3, isActive: false},
                {id: 4, isActive: false},
                {id: 5, isActive: false},
                {id: 6, isActive: false},
                {id: 7, isActive: false},
            ];
            this.markerClose.setMap(null);
            this.selectedShape.setMap(null);
            this.selectedArea = 0;
            this.pointList = [];
            this.printPolygon = false;
            try {
                this.detectChange.detectChanges();
            } catch (e) {

            }
        }
    }
    updatePointList(path) {
        this.pointList = [];
        const len = path.getLength();
        for (let i = 0; i < len; i++) {
            this.pointList.push(
                path.getAt(i).toJSON()
            );
        }
        this.selectedArea = google.maps.geometry.spherical.computeArea(
            path
        );
    }
    selectedShape: any;
    clearSelection() {
        if (this.selectedShape) {
            this.selectedShape.setEditable(false);
            this.selectedShape = null;
            this.pointList = [];
        }
    }
    setSelection(shape) {
        this.clearSelection();
        this.selectedShape = shape;
        shape.setEditable(true);
    }

    openDeliveryPointSettingsZone(zoneId: number, deliveryPointId: number, order: number) {
        this.dialog.open(EditDeliveryPointComponent, {
            data: {
                zoneId: zoneId,
                deliveryPointId: deliveryPointId,
                order: order,
            },
            hasBackdrop: true,
            panelClass: 'edit-delivery-point-mat-dialog-container',
        });
    }

    openDeliveryPointSettingsRoute(
        zoneId: number,
        routeId: number,
        deliveryPointId: number,
        order: number,
    ) {
        this.dialog.open(EditDeliveryPointComponent, {
            data: {
                zoneId: zoneId,
                routeId: routeId,
                deliveryPointId: deliveryPointId,
                order: order,
            },
            hasBackdrop: true,
            panelClass: 'edit-delivery-point-mat-dialog-container',
        });
    }

    // ---------------- VEHICLE RELATED QUERIES ----------------

    anyVehicles() {
        for (const zoneId in this.routePlanning.planningSession.deliveryZones) {
            const zone = this.routePlanning.planningSession.deliveryZones[zoneId];
            if (zone.vehicles.length > 0) return true;
            if (Object.keys(zone.deliveryZones).length > 0) {
                for (const subZoneId in zone.deliveryZones) {
                    if (zone.deliveryZones[subZoneId].vehicles.length > 0) return true;
                }
            }
        }
        return false;
    }
    getZoneVehicles(zoneId: number) {
        const zone = this.routePlanning.planningSession.deliveryZones[zoneId];
        let vehicles: Vehicle[] = zone.vehicles;
        if (zone.isMultiZone) {
            for (const subZoneId in zone.deliveryZones)
                vehicles = vehicles.concat(zone.deliveryZones[subZoneId].vehicles);
        }
        let vehicleMap: { [key: string]: boolean } = {};
        for (const v of vehicles) {
            vehicleMap[v.id] = true;
        }
        return this.vehicles.filter((vehicle) => vehicle.id in vehicleMap);
    }
    getRouteVehicles(zoneId: number, routeId: number) {
        const vehicleIds = this.routePlanning.planningSession.deliveryZones[
            zoneId
        ].optimization.solution.routes.map((route) => route.vehicle.vehicleId);
        let vehicleMap: { [key: string]: boolean } = {};
        for (const id of vehicleIds) {
            vehicleMap[id] = true;
        }
        return this.vehicles.filter((vehicle) => vehicle.id in vehicleMap);
    }
    getVehicle(vehicleId: number) {
        return this.vehicles.find((vehicle) => vehicle.id === vehicleId);
    }

    // ---------------- OTHER FUNCTIONS ----------------
    highlighted(color: string) {
        return highlightColor(color);
    }

    editDeliveryPoint(deliveryPointId: number) {
        this.dialog.open(EditDeliveryPointComponent, {
            data: {
                deliveryPointId: deliveryPointId,
            },
        });
    }

    transformToTime(isStart: boolean, seconds: number) {
        if (seconds !== undefined && seconds !== null) {
            return secondsToDayTimeAsString(seconds);
        } else if (isStart) {
            return '00:00';
        } else {
            return '23:59';
        }
    }

    getFormattedServiceTime(time: number): string {
        return Math.floor(time / 60) + 'm ' + (time % 60) + 's';
    }

    getFloor(x: number): number {
        return Math.floor(x);
    }

    calculatePointRadius(focused: boolean) {
        const value = focused
            ? 1.9 ** (21 - this.currentZoom)
            : 1.85 ** (21 - this.currentZoom);
        return value;
    }

    getContrastColor(originalColor: string) {
        return contrastColor(originalColor === '#000' ? '#000000' : originalColor);
    }

    decodeRouteGeometry(routeId: number): any[] {
        if (this.routeGeometries.length === 0) return [];
        if (this.routeGeometriesCurrentState == null) {
            this.routeGeometriesCurrentState = this.routeGeometries.map((geo) => {
                return geo
                    ? {
                        routeId: geo.routeId,
                        polyline: geo.polyline,
                        decodedPolyline: this.decodePolyline(geo.polyline),
                    }
                    : null;
            });
        }
        var incoming = this.routeGeometries.find(
            (item) => item != null && item.routeId === routeId,
        );
        var current = this.routeGeometriesCurrentState.find(
            (item) => item != null && item.routeId === routeId,
        );
        if (incoming == null) return [];
        if (current == null || incoming.polyline !== current.polyline) {
            current = {
                routeId: incoming.routeId,
                polyline: incoming.polyline,
                decodedPolyline: this.decodePolyline(incoming.polyline),
            };
        }
        return current.decodedPolyline;
    }

    changeDrag(newValue: boolean) {
        this.isDraggable = newValue;
    }

    changeLeadTime() {
        let time: number = this.dischargingHours * 3600 +
            this.dischargingMinutes * 60 +
            this.dischargingSeconds;
        this.facade.updateLeadTime(this.zoneId, this.selectedPoint, time);
        return true;
    }


    changeDelayTime() {
        let time: number = this.dischargingHoursDelay * 3600 +
            this.dischargingMinutesDelay * 60 +
            this.dischargingSecondsDelay;
        this.facade.updateAllowedDelayTime(this.zoneId, this.selectedPoint, time);
        return true;
    }

    onShowSelectedChange() {
        this.facade.toggleShowSelected();
    }

    showAllUser(value) {
        this.showGeolocation = value;
        this.geolocationFacade.show(value);
        try {
            this.detectChange.detectChanges();
        } catch (e) {

        }


    }

    selectedGeo(id, value) {
        this.geolocationFacade.selected(id, value);
    }

    showAllSelectedFunc(value) {
        this.geolocationFacade.showAllSelected(value);
    }

    moveToUser(geo: GeolocationEntity, id: number) {
        if (id > 0) {
            this.map.setCenter({ lat: geo.lat, lng: geo.lng })
            this.selectGeo(geo.id);
        } else {
            this.selectGeo(-1);
        }

    }

    searchUser(value) {

        if (this.filterGeo && this.filterGeo.trim() && this.filterGeo.length > 2) {
            this.geolocationFilter = this.geolocation.filter((item) => {
                return (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
            })
        } else {

            this.geolocationFilter = this.geolocation;
        }
    }

    clearFilterGeolocation() {
        this.filterGeo = '';
        this.searchUser(this.filterGeo);
    }

    selectGeo(id) {
        this.geolocationFacade.selectGeo(id);
    }

    hoverInGeo(id) {
        this.geolocationFacade.hoverIn(id);
    }

    hoverOutGeo() {
        this.geolocationFacade.hoverOut(-1);
    }

    selectedAgglomeration(agglomeration: any) {
        this.changeSelected(-1);
        this.agglomerationSelected = agglomeration;
    }

    closeAgglomeration() {
        this.agglomerationSelected = undefined;
    }

    showAgglomeration() {


        if (!this.showSelected) {
            return this.Agglomeration;
        } else {
            let agglo = this.Agglomeration.filter(x => x.datos.filter(y => this.zoneStatus[y.deliveryZoneId].selected).length > 0);

            agglo.forEach(element => {
                element.datos = element.datos.filter(y => this.zoneStatus[y.deliveryZoneId].selected)
            });
            return agglo.filter(x => x.datos.length > 0);
        }


    }

    unificarPoints(points) {
        this.facade.joinPointsAgglomeration(points.map(x => x.id), this.routePlanning.planningSession.id);
        this.closeAgglomeration();
    }


    getAllDeliveryZone(){
        this.backend.get('delivery_zone').pipe(take(1)).subscribe(({data})=>{
            this.allDeliveryZone = data;
        }, error =>{
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        })
    }


}



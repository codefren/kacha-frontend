import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {
    Route,
    RoutePlanningFacade,
    PlanningDeliveryZone,
    RoutePlanningDeliveryPoint,
} from '@optimroute/state-route-planning';
import { take, withLatestFrom, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { exportOptimizations, ExportFormat, exportEvaluateds } from '@optimroute/export-integration';
import { dateToDDMMYYY, downloadFile, contrastColor, ToastService } from '@optimroute/shared';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '@optimroute/backend';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'easyroute-export-dialog',
    templateUrl: './export-dialog.component.html',
    styleUrls: ['./export-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportDialogComponent implements OnInit, OnDestroy {

    change = {
        optimizedRoutes:"optimizedRoutes",
        evaluated:'evaluated'
      };
    
    default ='optimizedRoutes';
    
    routes: {
        [zoneId: number]: {
            name: string;
            routes: { [routeId: number]: Route };
        };
    } = {};

    selectedRoutes: { [routeId: number]: boolean } = {};
    selectedZones: { [routeId: number]: boolean } = {};
    selectedAmount = 0;

    format = 'json';

    format_evaluated = 'json';

    selectedEvaluatedAmount = 0;

    unsubscribe$ = new Subject<void>();

    evaluateds: {
        [zoneId: number]:{
            name: string;
            deliveryPoints: RoutePlanningDeliveryPoint[];
        }
    } = {}

    isZoneChecked(zoneId: any){
        return this.selectedZones[zoneId];
    }

    accept() {
        this.routePlanningFacade.allZones$
            .pipe(take(1))
            .subscribe((deliveryZones: { [zoneId: number]: PlanningDeliveryZone }) => {
                for (const zoneId in deliveryZones) {
                    if (zoneId in this.routes) {
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
                                            route => this.selectedRoutes[route.id],
                                        ),
                                    },
                                },
                            },
                        };
                        if (deliveryZones[zoneId].optimization.solution.routes.length === 0) 
                        {
                            deliveryZones = { ...deliveryZones, [zoneId]: null };
                            delete deliveryZones[zoneId];
                        }
                    } else {
                        deliveryZones = { ...deliveryZones, [zoneId]: null };
                        delete deliveryZones[zoneId];
                    }
                }
                if (this.format === 'csv') {
                    let csv = exportOptimizations(deliveryZones, ExportFormat.CSV);
                    downloadFile(csv, `polpoo_${dateToDDMMYYY(new Date())}.csv`);
                } else {
                    let json = exportOptimizations(deliveryZones, ExportFormat.JSON);
                    downloadFile(json, `polpoo_${dateToDDMMYYY(new Date())}.json`);
                }
            });
        this.closeDialog();
    }

    accept_evaluateds(){
        
      this.routePlanningFacade.allZones$
            .pipe(take(1))
            .subscribe((deliveryZones: { [zoneId: number]: PlanningDeliveryZone }) => {
                for (const zoneId in deliveryZones) {
                    if (!(zoneId in this.evaluateds)) {
                        deliveryZones = { ...deliveryZones, [zoneId]: null };
                        delete deliveryZones[zoneId];
                    }
                    if(!this.selectedZones[zoneId]){
                        deliveryZones = { ...deliveryZones, [zoneId]: null };
                        delete deliveryZones[zoneId];
                    }
                }
                if (this.format_evaluated === 'csv') {
                    let csv = exportEvaluateds(deliveryZones, ExportFormat.CSV);
                    downloadFile(csv, `polpoo_${dateToDDMMYYY(new Date())}.csv`);
                } else {
                    let json = exportEvaluateds(deliveryZones, ExportFormat.JSON);
                    downloadFile(json, `polpoo_${dateToDDMMYYY(new Date())}.json`);
                }
            });
        this.closeDialog(); 
    }

    integrationEvaluations(){
      
        this.routePlanningFacade.allZones$
        .pipe(take(2))
        .subscribe((deliveryZones: { [zoneId: number]: PlanningDeliveryZone }) => {
            for (const zoneId in deliveryZones) {
                if (!(zoneId in this.evaluateds)) {
                    deliveryZones = { ...deliveryZones, [zoneId]: null };
                    delete deliveryZones[zoneId];
                }
                if(!this.selectedZones[zoneId]){
                    deliveryZones = { ...deliveryZones, [zoneId]: null };
                    delete deliveryZones[zoneId];
                }
            }
            if (this.format_evaluated === 'json') {
                let json = exportEvaluateds(deliveryZones, ExportFormat.JSON);
                
                //this._backendService.post('integration/route/evaluation', JSON.parse(json)).toPromise();

                this._backendService.post('integration/route/evaluation', JSON.parse(json)).pipe(take(1)).subscribe(({data})=>{
                       
                    this.toastService.displayWebsiteRelatedToast(
                      this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                      this.translate.instant('GENERAL.ACCEPT')
                    );
                    
                  },error => {
                    this.toastService.displayHTTPErrorToast(error.status, error.error.error);
                  });

            }
        });
        
        this.closeDialog();
    }

    integrationOptimizations(){   
        this.routePlanningFacade.allZones$
            .pipe(take(1))
            .subscribe((deliveryZones: { [zoneId: number]: PlanningDeliveryZone }) => {
                console.log('esta es la variable routes:', this.routes);
                console.log('esta es la variable selectedRoutes:', this.selectedRoutes);
                for (const zoneId in deliveryZones) {
                    if (zoneId in this.routes) {
                        console.log('esta es la zoneID', zoneId);
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
                                            route => this.selectedRoutes[route.id],
                                        ),
                                    },
                                },
                            },
                        };
                        if (deliveryZones[zoneId].optimization.solution.routes.length === 0) 
                        {
                            deliveryZones = { ...deliveryZones, [zoneId]: null };
                            delete deliveryZones[zoneId];
                        }
                    } else {
                        deliveryZones = { ...deliveryZones, [zoneId]: null };
                        delete deliveryZones[zoneId];
                    }
                }
                if (this.format === 'json') {
                    let json = exportOptimizations(deliveryZones, ExportFormat.JSON);
                    
                  //  this._backendService.post('integration/route/optimization', JSON.parse(json)).toPromise();
                    this._backendService.post('integration/route/optimization', JSON.parse(json)).pipe(take(1)).subscribe(({data})=>{
                       
                        this.toastService.displayWebsiteRelatedToast(
                          this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                          this.translate.instant('GENERAL.ACCEPT')
                        );
                        
                      },error => {
                        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
                      });
                }
            });

        this.closeDialog();

    }

    closeDialog() {
        this.activeModal.close();
    }

    constructor(
        private routePlanningFacade: RoutePlanningFacade,
        public activeModal: NgbActiveModal,
        private changeRef: ChangeDetectorRef,
        private _backendService: BackendService,
        private toastService: ToastService,
        private translate: TranslateService,
    ) {}

    ngOnInit() {
        this.routePlanningFacade.allZones$
        .pipe(
            takeUntil(this.unsubscribe$),
            withLatestFrom(this.routePlanningFacade.allZonesStatus$),
        )
        .subscribe(([zones, zonesStatus]) => {
            let routes: {
                [zoneId: number]: {
                    name: string;
                    routes: { [routeId: number]: Route };
                };
            } = {};
            let selectedRoutes: { [routeId: number]: boolean } = {};
            let selectedEvaluateds: { [zoneId: number]: boolean } = {};
            let evaluateds: {
                [zoneId: number]:{
                    name: string;
                    deliveryPoints: RoutePlanningDeliveryPoint[];
                }
            } = {}
            for (let zoneId in zones) {
                if (zonesStatus[zoneId] && zonesStatus[zoneId].optimized) {
                    routes[zoneId] = {
                        name: zones[zoneId].name,
                        routes: {},
                    };
                    zones[zoneId].optimization.solution.routes.forEach(route => {
                        ++this.selectedAmount;
                        routes[zoneId] = {
                            ...zones[zoneId],
                            routes: {
                                ...routes[zoneId].routes,
                                [route.id]: route,
                            },
                        };
                        selectedRoutes[route.id] = true;
                    });
                }
                
                if(zonesStatus[zoneId] && zonesStatus[zoneId].evaluated){
                    ++this.selectedEvaluatedAmount;
                    evaluateds[zoneId] = {
                        name: zones[zoneId].name,
                        deliveryPoints: zones[zoneId].deliveryPoints,
                    };
                    this.selectedZones[zoneId] = true;

                }
            }
            this.routes = routes;
            this.selectedRoutes = selectedRoutes;
            this.evaluateds = evaluateds;
        });
    }

    areRoutesEmpty() {
        return Object.keys(this.routes).length === 0;
    }

    areEvaluatedsEmpty(){
        return Object.keys(this.evaluateds).length === 0;
    }

    isAllZoneChecked(zoneId: string) {
        for (let routeId in this.routes[zoneId].routes) {
            return this.selectedRoutes[routeId];
        }
    }

    checkAllZone(zoneId: string, value: boolean) {
        for (let routeId in this.routes[zoneId].routes) {
            this.toogleSelect(routeId, value);
        }
    }

    checkZoneEvaluateds(zoneId: string, value: boolean) {
        this.selectedZones[zoneId] = value
/*         if(this.routes[zoneId]){
            for (let routeId in this.routes[zoneId].routes) {
                this.selectedRoutes[routeId] = value;
            }
        } */
    }

    checkZone(zoneId: string, value: boolean) {
        if(this.routes[zoneId]){
            for (let routeId in this.routes[zoneId].routes) {
                this.selectedRoutes[routeId] = value;
            }
        }
    }
    toogleSelect(routeId: string, value: boolean) {
        if (!value) {
            this.selectedAmount -= 1;
        } else this.selectedAmount += 1;
        this.selectedRoutes[routeId] = value;
    }

    getRouteName(name: string) {
        let newName = name.split('-');
        return newName[newName.length - 1];
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    DeleteWhiteSpaces(text){
        return text.replace(/\s/g, "");
    }

    changePage(name: string){
     
        this.default = this.change[name];
      }

}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ThemePalette } from '@angular/material';
import {
    RoutePlanningFacade,
    PlanningDeliveryZone,
    RoutePlanningSolution,
    RoutePlanningState,
} from '@optimroute/state-route-planning';
import { PlanningSession } from '@optimroute/state-route-planning';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { RoutePlanningService } from 'libs/route-planning/src/lib/route-planning.service';
import * as _ from 'lodash';
@Component({
    selector: 'easyroute-route-planning-actions',
    templateUrl: './route-planning-actions.component.html',
    styleUrls: ['./route-planning-actions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePlanningActionsComponent implements OnInit {
    @Input()
    progressSpinnerDiameter = 45;

    @Input()
    color: ThemePalette;

    @Input()
    zoneId: number;

    @Input()
    hasEnoughCapacity: boolean;

    @Input()
    hasEnoughVolumen: boolean;

    @Input()
    routesCount: number;

    @Input()
    vehiclesCount = 0;

    @Input()
    deliveryPointsCount = 0;

    isEvaluated: boolean = false;

    zoneStatus$: Observable<any>;

    routePlanning: RoutePlanningState;

    unsubscribe$ = new Subject<void>();

    optimizationStatus$: Observable<{
        loading: boolean;
        progress: number;
        error?: string;
        state: string;
    }>;

    toggleShowZone(event) {
        this.facade.toggleDisplayZone(this.zoneId);
    }
    toggleSelectZone(event) {
        this.facade.toggleSelectZone(this.zoneId);
    }

    constructor(private facade: RoutePlanningFacade,
        private service: RoutePlanningService,
        private detectChange: ChangeDetectorRef) {}

    showGeometry(){
        this.facade.showRouteGeometryZone(this.zoneId);
    }

    ngOnInit() {
        this.optimizationStatus$ = this.facade.getOptimizationStatus(this.zoneId);
        let active: boolean = false;

        this.optimizationStatus$.pipe(takeUntil(this.unsubscribe$)).subscribe( async(data)=>{
            let zone = await this.facade
            .getZoneById(this.zoneId)
            .pipe(take(1))
            .toPromise();

            this.routePlanning = await this.facade
            .allRoutePlanning$
            .pipe(take(1))
            .toPromise();

            if(this.routePlanning.saved){
                if(active && data.state === 'completed' ){
                    let sessionId = zone.sessionId;
                    let datos: any = {
                        solutions: [
                            {
                                solutionId: zone.optimization.solution.id,
                                zoneId: this.zoneId
                            }
                        ]
                    };
                    await this.facade.saveSession(sessionId, datos )
                }
                active = data && data.state === 'active' && data.progress === 100 ?true:false;
            }
            this.detectChange.detectChanges();
        });
        this.zoneStatus$ = this.facade.getZoneStatus(this.zoneId);
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.facade.getZoneStatus(this.zoneId).subscribe( (resp: any) => {
            if(resp){
                this.isEvaluated = resp.evaluated;
            }
        });
    }
}

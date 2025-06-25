import {
    Component,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OptimizationPreferences } from '@optimroute/backend';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { RoutePlanningState, RoutePlanningFacade } from '@optimroute/state-route-planning';
import { takeUntil } from 'rxjs/operators';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';

@Component({
    selector: 'easyroute-route-planning',
    templateUrl: './route-planning.component.html',
    styleUrls: ['./route-planning.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePlanningComponent implements OnInit, OnDestroy {
    routePlanning$: Observable<RoutePlanningState>;
    optimizationPreferences$: Observable<OptimizationPreferences>;

    unsubscribe$ = new Subject<void>();

    constructor(
        private facade: RoutePlanningFacade,
        private preferencesFacade: PreferencesFacade,
        private easyRouteFacade: StateEasyrouteFacade,
    ) {}

    ngOnInit() {
        this.easyRouteFacade.isAuthenticated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(isAuthenticated => {
                if (isAuthenticated) {
                    this.preferencesFacade.loadAllPreferences();
                }
            });
        this.optimizationPreferences$ = this.preferencesFacade.optimizationPreferences$;
        this.routePlanning$ = this.facade.allRoutePlanning$;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutePlanningEffects } from './+state/route-planning.effects';
import { RoutePlanningFacade } from './+state/route-planning.facade';
import {
    RoutePlanningInitialState,
    routePlanningReducer,
} from './+state/route-planning.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { WebSocketService } from './web-socket.service';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('routePlanning', routePlanningReducer, {
            initialState: RoutePlanningInitialState,
        }),
        EffectsModule.forFeature([RoutePlanningEffects]),
    ],
    providers: [WebSocketService, RoutePlanningFacade, RoutePlanningEffects],
})
export class StateRoutePlanningModule {}

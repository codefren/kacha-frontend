import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { StateGeolocationPartialState, GeolocationEntity } from './state-geolocation.reducer';
import {
    LoadStateGeolocation,
    StateGeolocationLoaded,
    StateGeolocationLoadError,
    StateGeolocationActionTypes,
    StateGeolocationUpdate,
    StateGeolocationUpdateSuccess,
    StateGeolocationUpdateFail,
    StateGeolocationShow,
    StateGeolocationShowSuccess,
} from './state-geolocation.actions';
import { map, concatMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { WebSocketService } from '../state-geolocation.websocket';

@Injectable()
export class StateGeolocationEffects {


    @Effect()
    loadStateGeolocation$ = this.actions$
        .pipe(ofType<LoadStateGeolocation>(StateGeolocationActionTypes.LoadStateGeolocation))
        .pipe(
            map((action: LoadStateGeolocation) => action.payload),
            concatMap((payload) =>
                of(new StateGeolocationLoaded({ geolocation: payload.geolocation }))
            ),
            catchError((error)=> of(new StateGeolocationLoadError({error}))
        )
    );

    @Effect()
    StateGeolocationUpdate$ = this.actions$
        .pipe(ofType<StateGeolocationUpdate>(StateGeolocationActionTypes.StateGeolocationUpdate))
        .pipe(
            map((action: StateGeolocationUpdate) => action.payload),
            concatMap((payload) =>
                of(new StateGeolocationUpdateSuccess({ geolocation: payload.geolocation }))
            ),
            catchError((error)=> of(new StateGeolocationUpdateFail({error}))
        )
    );


    @Effect()
    StateGeolocationShow$ = this.actions$
        .pipe(ofType<StateGeolocationShow>(StateGeolocationActionTypes.StateGeolocationShow))
        .pipe(
            map((action: StateGeolocationShow) => action.payload),
            concatMap((payload) => {
                    if(payload.show){
                        this.websocket.connect();
                        return of(new StateGeolocationShowSuccess({ show: payload.show }))
                    }else{
                        this.websocket.desconnect();
                        return of(new StateGeolocationShowSuccess({ show: payload.show }))
                    }

                    
                }
            ),
            catchError((error)=> of(new StateGeolocationUpdateFail({error}))
        )
    );

    constructor(
        private actions$: Actions,
        private websocket: WebSocketService
    ) {}
}

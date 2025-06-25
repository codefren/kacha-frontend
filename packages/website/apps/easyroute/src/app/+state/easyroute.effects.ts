import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { EasyroutePartialState } from './easyroute.reducer';
import {
    LoadEasyroute,
    EasyrouteLoaded,
    EasyrouteLoadError,
    EasyrouteActionTypes,
} from './easyroute.actions';

@Injectable()
export class EasyrouteEffects {
    /* @Effect() loadEasyroute$ = this.dataPersistence.fetch(
        EasyrouteActionTypes.LoadEasyroute,
        {
            run: (action: LoadEasyroute, state: EasyroutePartialState) => {
                // Your custom REST 'load' logic goes here. For now just return an empty list...
                return new EasyrouteLoaded([]);
            },

            onError: (action: LoadEasyroute, error) => {
                console.error('Error', error);
                return new EasyrouteLoadError(error);
            },
        },
    ); */

    constructor(
        private actions$: Actions,
    ) {}
}

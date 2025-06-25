import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { FilterStatePartialState } from './filter-state.reducer';
import {
    LoadFilterState,
    FilterStateLoaded,
    FilterStateLoadError,
    FilterStateActionTypes,
} from './filter-state.actions';
import { catchError, concatMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class FilterStateEffects {
    /* @Effect() loadFilterState$ = this.dataPersistence.fetch(
        FilterStateActionTypes.LoadFilterState,
        {
            run: (action: LoadFilterState, state: FilterStatePartialState) => {
                // Your custom REST 'load' logic goes here. For now just return an empty list...
                return new FilterStateLoaded([]);
            },

            onError: (action: LoadFilterState, error) => {
                console.error('Error', error);
                return new FilterStateLoadError(error);
            },
        },
    ); */


    /* @Effect()
    importSession$ = this.actions$
        .pipe(ofType<LoadFilterState>(FilterStateActionTypes.LoadFilterState))
        .pipe(
            map((action) => action),
            concatMap((payload) =>
                of(new FilterStateLoaded([]))
            ),
        ); */

    constructor(
        private actions$: Actions
    ) {}
}

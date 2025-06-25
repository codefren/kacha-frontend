import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { FilterStatePartialState, Entity } from './filter-state.reducer';
import { filterStateQuery } from './filter-state.selectors';
import { FiterStateAdd, LoadFilterState } from './filter-state.actions';

@Injectable()
export class StateFilterStateFacade {
    allStateRegister$ = this.store.pipe(select(filterStateQuery.getAllFilterState));
    filters$ = this.store.pipe(select(filterStateQuery.getAllFilterState));
    constructor(private store: Store<FilterStatePartialState>) {}

    load() {
        this.store.dispatch(new LoadFilterState());
    }

    add(entity){
        this.store.dispatch(new FiterStateAdd({entity}));
    }
}

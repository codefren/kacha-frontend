import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { EasyroutePartialState } from './easyroute.reducer';
import { easyrouteQuery } from './easyroute.selectors';
import { LoadEasyroute } from './easyroute.actions';

@Injectable()
export class EasyrouteFacade {
    loaded$ = this.store.pipe(select(easyrouteQuery.getLoaded));
    allEasyroute$ = this.store.pipe(select(easyrouteQuery.getAllEasyroute));
    selectedEasyroute$ = this.store.pipe(select(easyrouteQuery.getSelectedEasyroute));

    constructor(private store: Store<EasyroutePartialState>) {}

    loadAll() {
        this.store.dispatch(new LoadEasyroute());
    }
}

import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { StatePointsPartialState } from './state-points.reducer';
import { statePointsQuery } from './state-points.selectors';
import { AddPoints, LoadPoints, UpdatePoint } from './state-points.actions';
import { Point } from '@optimroute/backend';

@Injectable()
export class StatePointsFacade {
    loaded$ = this.store.pipe(select(statePointsQuery.getLoaded));
    allStatePoints$ = this.store.pipe(select(statePointsQuery.getAllStatePoints));
    selectedStatePoints$ = this.store.pipe(select(statePointsQuery.getSelectedStatePoints));
    loading$ = this.store.pipe(select(statePointsQuery.getLoading));
    adding$ = this.store.pipe(select(statePointsQuery.getAdding));
    added$ = this.store.pipe(select(statePointsQuery.getAdded));
    updating$ = this.store.pipe(select(statePointsQuery.getUpdating));
    updated$ = this.store.pipe(select(statePointsQuery.getUpdated));


    constructor(private store: Store<StatePointsPartialState>) {}

    loadAll() {
        this.store.dispatch(new LoadPoints());
    }

    addPoint(u: Point) {
        this.store.dispatch(new AddPoints({ point: u }));
    }

    editPoint(id: string, u: Partial<Point>) {
        this.store.dispatch(new UpdatePoint({ id: id , point: u }));
    }

}

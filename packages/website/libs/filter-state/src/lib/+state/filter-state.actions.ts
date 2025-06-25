import { Action } from '@ngrx/store';
import { Entity } from './filter-state.reducer';

export enum FilterStateActionTypes {
    LoadFilterState = '[FilterState] Load FilterState',
    FilterStateLoaded = '[FilterState] FilterState Loaded',
    FilterStateLoadError = '[FilterState] FilterState Load Error',
    FilterStateAdd = '[FilterState] FilterState Add'
}

export class LoadFilterState implements Action {
    readonly type = FilterStateActionTypes.LoadFilterState;
}

export class FilterStateLoadError implements Action {
    readonly type = FilterStateActionTypes.FilterStateLoadError;
    constructor(public payload: any) {}
}

export class FilterStateLoaded implements Action {
    readonly type = FilterStateActionTypes.FilterStateLoaded;
    constructor(public payload: Entity[]) {}
}

export class FiterStateAdd implements Action {
    readonly type = FilterStateActionTypes.FilterStateAdd;
    constructor(public payload: { entity: Entity }) {}
}

export type FilterStateAction = LoadFilterState | FilterStateLoaded | FilterStateLoadError | FiterStateAdd;

export const fromFilterStateActions = {
    LoadFilterState,
    FilterStateLoaded,
    FilterStateLoadError,
    FiterStateAdd
};

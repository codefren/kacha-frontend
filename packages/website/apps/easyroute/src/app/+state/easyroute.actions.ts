import { Action } from '@ngrx/store';
import { Entity } from './easyroute.reducer';

export enum EasyrouteActionTypes {
    LoadEasyroute = '[Easyroute] Load Easyroute',
    EasyrouteLoaded = '[Easyroute] Easyroute Loaded',
    EasyrouteLoadError = '[Easyroute] Easyroute Load Error',
}

export class LoadEasyroute implements Action {
    readonly type = EasyrouteActionTypes.LoadEasyroute;
}

export class EasyrouteLoadError implements Action {
    readonly type = EasyrouteActionTypes.EasyrouteLoadError;
    constructor(public payload: any) {}
}

export class EasyrouteLoaded implements Action {
    readonly type = EasyrouteActionTypes.EasyrouteLoaded;
    constructor(public payload: Entity[]) {}
}

export type EasyrouteAction = LoadEasyroute | EasyrouteLoaded | EasyrouteLoadError;

export const fromEasyrouteActions = {
    LoadEasyroute,
    EasyrouteLoaded,
    EasyrouteLoadError,
};

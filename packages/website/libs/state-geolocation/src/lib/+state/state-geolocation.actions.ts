import { Action } from '@ngrx/store';
import { GeolocationEntity } from './state-geolocation.reducer';

export enum StateGeolocationActionTypes {
    LoadStateGeolocation = '[StateGeolocation] Load StateGeolocation',
    StateGeolocationLoaded = '[StateGeolocation] StateGeolocation Loaded',
    StateGeolocationLoadError = '[StateGeolocation] StateGeolocation Load Error',

    StateGeolocationUpdate = '[StateGeolocation] StateGeolocation Update',
    StateGeolocationUpdateSuccess = '[StateGeolocation] StateGeolocation Update Success',
    StateGeolocationUpdateFail = '[StateGeolocation] StateGeolocation Update Fail',

    StateGeolocationShow = '[StateGeolocation] StateGeolocation show',
    StateGeolocationShowSuccess = '[StateGeolocation] StateGeolocation show Success',

    StateGeolocationSelected = '[StateGeolocation] StateGeolocation Selected',
    StateGeolocationHoverIn = '[StateGeolocation] StateGeolocation Hover In',
    StateGeolocationHoverOut = '[StateGeolocation] StateGeolocation Hover out',
    StateGeolocationShowSelected = '[StateGeolocation] StateGeolocation Show Selected',
    StateGeolocationShowSelectedUser = '[StateGeolocation] StateGeolocation Show Selected users',
    StateGeolocationLogOut = '[StateGeolocation] StateGeolocation Log Out'

}

export class LoadStateGeolocation implements Action {
    readonly type = StateGeolocationActionTypes.LoadStateGeolocation;
    constructor(public payload: { geolocation: GeolocationEntity[] }) {}
}

export class StateGeolocationLoadError implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationLoadError;
    constructor(public payload: { error: any }) {}
}

export class StateGeolocationLoaded implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationLoaded;
    constructor(public payload: { geolocation: GeolocationEntity[] }) {}
}

export class StateGeolocationUpdate implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationUpdate;
    constructor(public payload: { geolocation: GeolocationEntity[] }) { }
}

export class StateGeolocationUpdateSuccess implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationUpdateSuccess;
    constructor(public payload: { geolocation: GeolocationEntity[] }) { }
}

export class StateGeolocationUpdateFail implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationUpdateFail;
    constructor(public payload: { error: any }) {}
}

export class StateGeolocationShow implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationShow;
    constructor(public payload: { show: boolean }) { }
}


export class StateGeolocationShowSuccess implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationShowSuccess;
    constructor(public payload: { show: boolean }) { }
}

export class StateGeolocationSelected implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationSelected;
    constructor(public payload: { id: number }) { }
}

export class StateGeolocationHoverIn implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationHoverIn;
    constructor(public payload: { id: number }) { }
}

export class StateGeolocationHoverOut implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationHoverOut;
    constructor(public payload: { id: number }) { }
}

export class StateGeolocationShowSelected implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationShowSelected;
    constructor(public payload: { id: number, show: boolean }) { }
}

export class StateGeolocationShowSelectedUser implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationShowSelectedUser;
    constructor(public payload: { show: boolean }) { }
}

export class StateGeolocationLogOut implements Action {
    readonly type = StateGeolocationActionTypes.StateGeolocationLogOut;
}

export type StateGeolocationAction =
    | LoadStateGeolocation
    | StateGeolocationLoaded
    | StateGeolocationLoadError
    | StateGeolocationUpdate
    | StateGeolocationUpdateSuccess
    | StateGeolocationUpdateFail
    | StateGeolocationShow
    | StateGeolocationShowSuccess
    | StateGeolocationSelected
    | StateGeolocationHoverIn
    | StateGeolocationHoverOut
    | StateGeolocationShowSelected
    | StateGeolocationShowSelectedUser
    | StateGeolocationLogOut;

export const fromStateGeolocationActions = {
    LoadStateGeolocation,
    StateGeolocationLoaded,
    StateGeolocationLoadError,
    StateGeolocationUpdate,
    StateGeolocationUpdateSuccess,
    StateGeolocationUpdateFail,
    StateGeolocationShow,
    StateGeolocationShowSuccess,
    StateGeolocationSelected,
    StateGeolocationHoverIn,
    StateGeolocationHoverOut,
    StateGeolocationShowSelected,
    StateGeolocationShowSelectedUser,
    StateGeolocationLogOut
};

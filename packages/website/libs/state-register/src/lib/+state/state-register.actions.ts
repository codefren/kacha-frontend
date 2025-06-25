import { Action } from '@ngrx/store';
import { Register } from './state-register.reducer';
import { HttpErrorResponse } from '@angular/common/http';
export enum StateRegisterActionTypes {
    LoadStateRegister = '[StateRegister] Load StateRegister',
    StateRegisterLoaded = '[StateRegister] StateRegister Loaded',
    StateRegisterLoadError = '[StateRegister] StateRegister Load Error',
    UpdateOrCreateRegister = '[StateRegister] StateRegister Update or Create Register',
    PersistRegister = '[StateRegister] PersistRegister PersistRegister',
    PersistRegisterSuccess = '[StateRegister] StateRegister PersistRegister success',
    PersistRegisterFail = '[StateRegister] StateRegisterPersistRegister Fail',
}

export class LoadStateRegister implements Action {
    readonly type = StateRegisterActionTypes.LoadStateRegister;
}

export class UpdateOrCreateRegister implements Action {
    readonly type = StateRegisterActionTypes.UpdateOrCreateRegister
    constructor(public payload: { register: Register } ){}
}

export class PersistRegister implements Action {
    readonly type = StateRegisterActionTypes.PersistRegister;
    constructor(public payload: { register: Register }) { }
  }
  
  export class PersistRegisterSuccess implements Action {
    readonly type = StateRegisterActionTypes.PersistRegisterSuccess;
    constructor(public payload: { register: Register }) { }
  }
  
  export class PersistRegisterFail implements Action {
    readonly type = StateRegisterActionTypes.PersistRegisterFail;
    constructor(public payload: { error: HttpErrorResponse }) {}
  }

export type StateRegisterAction =
    | LoadStateRegister
    | UpdateOrCreateRegister
    | PersistRegister
    | PersistRegisterSuccess
    | PersistRegisterFail;

export const fromStateRegisterActions = {
    LoadStateRegister,
    UpdateOrCreateRegister,
    PersistRegister,
    PersistRegisterSuccess,
    PersistRegisterFail
};

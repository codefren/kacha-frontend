import { Action } from '@ngrx/store';
import { Entity } from './state-easyroute.reducer';

export enum StateEasyrouteActionTypes {
    AUTHENTICATE = '[StateEasyroute] AUTHENTICATE',
    LOGOUT = '[StateEasyroute] LOGOUT'
}

export class AuthenticateAction implements Action {
    readonly type = StateEasyrouteActionTypes.AUTHENTICATE;
}
export class LogoutAction implements Action {
    readonly type = StateEasyrouteActionTypes.LOGOUT;
}

export type StateEasyrouteAction = AuthenticateAction | LogoutAction;

export const fromStateEasyrouteActions = {
    AuthenticateAction,
    LogoutAction
};

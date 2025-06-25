import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AuthenticateAction, LogoutAction } from './state-easyroute.actions';
import { StateEasyrouteState } from './state-easyroute.reducer';
import { stateEasyrouteQuery } from './state-easyroute.selectors';

@Injectable()
export class StateEasyrouteFacade {
    isAuthenticated$ = this.store.pipe(select(stateEasyrouteQuery.getIsAuthenticated));
    

    constructor(private store: Store<StateEasyrouteState>) {}

    authenticate() {
        this.store.dispatch(new AuthenticateAction());
    }
    logout() {
        this.store.dispatch(new LogoutAction());
    }
}

import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { StateRegisterPartialState, Register } from './state-register.reducer';
import { stateRegisterQuery } from './state-register.selectors';
import { LoadStateRegister, UpdateOrCreateRegister, PersistRegister } from './state-register.actions';

@Injectable()
export class StateRegisterFacade {
    loaded$ = this.store.pipe(select(stateRegisterQuery.getLoaded));
    allStateRegister$ = this.store.pipe(select(stateRegisterQuery.getStateRegister));
    persisted$ = this.store.pipe(select(stateRegisterQuery.getPersisted));

    constructor(private store: Store<StateRegisterPartialState>) {}

    load() {
        this.store.dispatch(new LoadStateRegister());
    }

    updateOrCreate(register: Register) {
        this.store.dispatch(new UpdateOrCreateRegister({register}));
    }

    persistRegister(register: Register) {
        this.store.dispatch(new PersistRegister({ register }));
    }
}

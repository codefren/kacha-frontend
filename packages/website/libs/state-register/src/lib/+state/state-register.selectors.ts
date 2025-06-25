import { createFeatureSelector, createSelector } from '@ngrx/store';
import { STATEREGISTER_FEATURE_KEY, StateRegisterState } from './state-register.reducer';

// Lookup the 'StateRegister' feature state managed by NgRx
const getStateRegisterState = createFeatureSelector<StateRegisterState>(
    STATEREGISTER_FEATURE_KEY,
);

const getLoaded = createSelector(
    getStateRegisterState,
    (state: StateRegisterState) => state.loaded,
);

const getPersisted = createSelector(
    getStateRegisterState,
    (state: StateRegisterState) => state.persisted,
);
const getError = createSelector(
    getStateRegisterState,
    (state: StateRegisterState) => state.error,
);

const getStateRegister = createSelector(
    getStateRegisterState,
    getLoaded,
    (state: StateRegisterState, isLoaded) => {
        return isLoaded ? state.register : null;
    },
);

export const stateRegisterQuery = {
    getLoaded,
    getError,
    getStateRegister,
    getPersisted
};

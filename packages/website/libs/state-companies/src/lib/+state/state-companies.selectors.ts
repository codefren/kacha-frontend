import { createFeatureSelector, createSelector } from '@ngrx/store';
import { STATECOMPANIES_FEATURE_KEY, Companies } from './state-companies.reducer';

// Lookup the 'StateCompanies' feature state managed by NgRx
const getStateCompaniesState = createFeatureSelector<Companies>(
    STATECOMPANIES_FEATURE_KEY,
);

const getLoaded = createSelector(
    getStateCompaniesState,
    (state: Companies) => state.loaded,
);
const getError = createSelector(
    getStateCompaniesState,
    (state: Companies) => state.error,
);

const getAllCompanies = createSelector(
    getStateCompaniesState,
    getLoaded,
    (state: Companies, isLoaded) => {
        return isLoaded ? state.company : [];
    },
);
const getSelectedId = createSelector(
    getStateCompaniesState,
    (state: Companies) => state.selectedId,
);
const getSelectedStateCompanies = createSelector(
    getAllCompanies,
    getSelectedId,
    (stateCompanies, id) => {
        const result = stateCompanies.find((it) => it.id === id);
        return result ? Object.assign({}, result) : undefined;
    },
);
const getLoading = createSelector(
    getStateCompaniesState,
    (state: Companies) => state.loading,
);
const getAdding = createSelector(
    getStateCompaniesState,
    (state: Companies) => state.adding,
);
const getAdded = createSelector(
    getStateCompaniesState,
    (state: Companies) => state.added,
);
const getUpdating = createSelector(
    getStateCompaniesState,
    (state: Companies) => state.updating,
);
const getUpdated = createSelector(
    getStateCompaniesState,
    (state: Companies) => state.updated,
)

const getDeleting = createSelector(
    getStateCompaniesState,
    (state: Companies) => state.deleting,
);
const getSelectedCompanies = createSelector(
    getAllCompanies,
    getSelectedId,
    (vehicles, id) => {
        const result = vehicles.find(v => v['id'] === id);
        return result ? Object.assign({}, result) : undefined;
    },
);
export const stateCompaniesQuery = {
    getLoaded,
    getError,
    getAllCompanies,
    getSelectedId,
    getSelectedStateCompanies,
    getLoading,
    getUpdating,
    getDeleting,
    getSelectedCompanies,
    getAdding,
    getAdded,
    getUpdated
};
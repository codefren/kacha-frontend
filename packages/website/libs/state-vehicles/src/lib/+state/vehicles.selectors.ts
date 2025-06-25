import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VEHICLES_FEATURE_KEY, Vehicles } from './vehicles.reducer';

// Lookup the 'Vehicles' feature state managed by NgRx
const getVehiclesState = createFeatureSelector<Vehicles>(VEHICLES_FEATURE_KEY);

const getState = createSelector(
    getVehiclesState,
    (state: Vehicles) => state,
);

const getLoaded = createSelector(
    getVehiclesState,
    (state: Vehicles) => state.loaded,
);

const getLoading = createSelector(
    getVehiclesState,
    (state: Vehicles) => state.loading,
);

const getAdding = createSelector(
    getVehiclesState,
    (state: Vehicles) => state.adding,
);

const getAdded = createSelector(
    getVehiclesState,
    (state: Vehicles) => state.added,
);

const getUpdating = createSelector(
    getVehiclesState,
    (state: Vehicles) => state.updating,
);

const getUpdated = createSelector(
    getVehiclesState,
    (state: Vehicles) => state.updated,
);

const getDeleting = createSelector(
    getVehiclesState,
    (state: Vehicles) => state.deleting,
);


const getDeleted = createSelector(
    getVehiclesState,
    (state: Vehicles) => state.deleted,
);


const getError = createSelector(
    getVehiclesState,
    (state: Vehicles) => state.error,
);

const getAllVehicles = createSelector(
    getVehiclesState,
    getLoaded,
    (state: Vehicles, isLoaded) => {
        return isLoaded ? state.vehicles : [];
    },
);
const getSelectedId = createSelector(
    getVehiclesState,
    (state: Vehicles) => state.selectedId,
);
const getSelectedVehicles = createSelector(
    getAllVehicles,
    getSelectedId,
    (vehicles, id) => {
        const result = vehicles.find(v => v['id'] === id);
        return result ? Object.assign({}, result) : undefined;
    },
);

export const vehiclesQuery = {
    getState,
    getLoaded,
    getLoading,
    getAdding,
    getUpdated,
    getAdded,
    getUpdating,
    getDeleting,
    getDeleted,
    getError,
    getAllVehicles,
    getSelectedVehicles,
};

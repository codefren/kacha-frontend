import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DELIVERYZONES_FEATURE_KEY, DeliveryZones } from './delivery-zones.reducer';

// Lookup the 'DeliveryZones' feature state managed by NgRx
const getDeliveryZonesState = createFeatureSelector<DeliveryZones>(
    DELIVERYZONES_FEATURE_KEY,
);

const getState = createSelector(
    getDeliveryZonesState,
    (state: DeliveryZones) => state,
);

const getLoaded = createSelector(
    getDeliveryZonesState,
    (state: DeliveryZones) => state.loaded,
);

const getLoading = createSelector(
    getDeliveryZonesState,
    (state: DeliveryZones) => state.loading,
);

const getError = createSelector(
    getDeliveryZonesState,
    (state: DeliveryZones) => state.error,
);

const getAllDeliveryZones = createSelector(
    getDeliveryZonesState,
    getLoaded,
    (state: DeliveryZones, isLoaded) => {
        return isLoaded ? state.zones : [];
    },
);
const getSelectedId = createSelector(
    getDeliveryZonesState,
    (state: DeliveryZones) => state.selectedId,
);
const getSelectedDeliveryZones = createSelector(
    getAllDeliveryZones,
    getSelectedId,
    (deliveryZones, id) => {
        const result = deliveryZones.find(it => it['id'] === id);
        return result ? Object.assign({}, result) : undefined;
    },
);

const getUpdating = createSelector(
    getDeliveryZonesState,
    (state: DeliveryZones) => state.updating,
);

const getAdded = createSelector(
    getDeliveryZonesState,
    (state: DeliveryZones) => state.added,
);

const getLastAdded = createSelector(
    getDeliveryZonesState,
    getAdded,
    (state, added) => {
      return added ? state.lastAdded : null;  
    }
)

const getUpdated = createSelector(
    getDeliveryZonesState,
    (state: DeliveryZones) => state.updated,
);

export const deliveryZonesQuery = {
    getState,
    getLoaded,
    getLoading,
    getError,
    getAllDeliveryZones,
    getSelectedDeliveryZones,
    getUpdating,
    getAdded,
    getUpdated,
    getLastAdded
};

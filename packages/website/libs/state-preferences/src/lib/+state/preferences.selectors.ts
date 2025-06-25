import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Preferences, PREFERENCES_FEATURE_KEY } from './preferences.reducer';

// Lookup the 'Preferences' feature state managed by NgRx
const getPreferences = createFeatureSelector<Preferences>(PREFERENCES_FEATURE_KEY);

const getLoaded = createSelector(getPreferences, (state: Preferences) => state.loaded);

const getAllPreferences = createSelector(getPreferences, (state: Preferences) => state);

const getOptimizationPreferences = createSelector(
    getPreferences,
    (state: Preferences) => state.optimization,
);

const getGeolocationPreferences = createSelector(
    getPreferences,
    (state: Preferences) => state.Geolocation,
);

const getControlPanelPreferences = createSelector(
    getPreferences,
    (state: Preferences) => state.controlPanel,
);

const getInterfacePreferences = createSelector(
    getPreferences,
    (state: Preferences) => state.interface,
);

const getManagementPreferences = createSelector(
    getPreferences,
    (state: Preferences) => state.management,
);

const getPrintingPreferences = createSelector(
    getPreferences,
    (state: Preferences) => state.printing,
);

const getOrdersPreferences = createSelector(
    getPreferences,
    (state: Preferences) => state.orders,
);

const getAppPreferences = createSelector(getPreferences, (state: Preferences) => state.app);

const getFranchisePreferences = createSelector(
    getPreferences,
    (state: Preferences) => state.franchise,
);


const getDashboardPreferences = createSelector(
    getPreferences,
    (state: Preferences) => state.dashboard,
);

const getProductPreferences = createSelector(
    getPreferences,
    (state: Preferences) => state.product,
);

const getAddresses = createSelector(
    getPreferences,
    (state: Preferences) => state.addresses,
);

const getPayment = createSelector(
    getPreferences,
    (state: Preferences) => state.payment,
);

const getDelivery= createSelector(
    getPreferences,
    (state: Preferences) => state.delivery,
);



export const preferencesQuery = {
    getAllPreferences,
    getLoaded,
    getOptimizationPreferences,
    getInterfacePreferences,
    getManagementPreferences,
    getPrintingPreferences,
    getControlPanelPreferences,
    getOrdersPreferences,
    getGeolocationPreferences,
    getAppPreferences,
    getFranchisePreferences,
    getProductPreferences,
    getAddresses,
    getPayment,
    getDelivery,
    getDashboardPreferences
};

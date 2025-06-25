import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { StatePreferencesService } from '../state-preferences.service';
import * as fromPreferences from './preferences.actions';
import { PreferencesActionTypes } from './preferences.actions';
import { ToastService } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PreferencesEffects {
    @Effect()
    loadPreferences$ = this.actions$
        .pipe(
            ofType<fromPreferences.LoadPreferences>(
                PreferencesActionTypes.LOAD_PREFERENCES,
            ),
        )
        .pipe(
            concatMap(() =>
                this.service.getPreferences().pipe(
                    // tap(results => console.log(results)),
                    map(
                        (results) =>
                            new fromPreferences.LoadPreferencesSuccess(results.preferences),
                    ),
                    catchError((error) =>
                        of(new fromPreferences.LoadPreferencesFail({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadPreferencesFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.LoadPreferencesFail>(
                PreferencesActionTypes.LOAD_PREFERENCES_FAIL,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    loadDashboardPreferences$ = this.actions$
        .pipe(
            ofType<fromPreferences.LoadDashboardPreferencesAction>(
                PreferencesActionTypes.LOAD_DASHBOARD_PREFERENCES,
            ),
        )
        .pipe(
            concatMap(() =>
                this.service.getDashboardPreferences().pipe(
                    // tap(results => console.log(results)),
                    map(
                        (results) =>
                            new fromPreferences.LoadDashboardPreferencesActionSuccess(results.data),
                    ),
                    catchError((error) =>
                        of(new fromPreferences.LoadPreferencesFail({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadDashboardPreferencesFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.LoadDashboardPreferencesActionFail>(
                PreferencesActionTypes.LOAD_DASHBOARD_PREFERENCES_FAIL,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );



    @Effect()
    loadProductsPreferences$ = this.actions$
        .pipe(ofType<fromPreferences.LoadProductPreferences>(PreferencesActionTypes.LOAD_PRODUCT_PREFERENCES))
        .pipe(
            concatMap(() =>
                this.service.getProductosPreferences().pipe(
                    // tap(results => console.log(results)),
                    map(
                        results =>
                            new fromPreferences.LoadProductPreferencesSuccess(results.data),
                    ),
                    catchError(error =>
                        of(new fromPreferences.LoadProductPreferencesFail({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadProductsPreferencesFail$ = this.actions$
        .pipe(ofType<fromPreferences.LoadProductPreferencesFail>(
            PreferencesActionTypes.LOAD_PRODUCT_PREFERENCES_FAIL,
        ))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );




    @Effect()
    loadCompanyPreparationPreferences$ = this.actions$
        .pipe(ofType<fromPreferences.LoadCompanyPreparationPreferences>(PreferencesActionTypes.LOAD_COMPANY_PREPARATION_PREFERENCES))
        .pipe(
            concatMap(() =>
                this.service.getCompanyPreferencePreparation().pipe(
                    // tap(results => console.log(results)),
                    map(
                        results =>
                            new fromPreferences.LoadCompanyPreparationPreferencesSuccess(results.data),
                    ),
                    catchError(error =>
                        of(new fromPreferences.LoadCompanyPreparationPreferencesFail({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadCompanyPreparationPreferencesFail$ = this.actions$
        .pipe(ofType<fromPreferences.LoadCompanyPreparationPreferencesFail>(
            PreferencesActionTypes.LOAD_COMPANY_PREPARATION_PREFERENCES_FAIL,
        ))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );


    @Effect()
    loadFranchisesPreferences$ = this.actions$
        .pipe(ofType<fromPreferences.LoadFranchisesPreferences>(PreferencesActionTypes.LOAD_FRANCHISES_PREFERENCES))
        .pipe(
            concatMap(() =>
                this.service.getFranchisesPreferences().pipe(
                    // tap(results => console.log(results)),
                    map(
                        results =>
                            new fromPreferences.LoadFranchisesPreferencesSuccess({ products: results.data }),
                    ),
                    catchError(error =>
                        of(new fromPreferences.LoadFranchisesPreferencesFail({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadFranchisesPreferencesFail$ = this.actions$
        .pipe(ofType<fromPreferences.LoadFranchisesPreferencesFail>(
            PreferencesActionTypes.LOAD_FRANCHISES_PREFERENCES_FAIL,
        ))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    loadGeolocationPreferences$ = this.actions$
        .pipe(ofType<fromPreferences.LoadGeolocationPreferences>(PreferencesActionTypes.LOAD_GEOLOCATION_PREFERENCES))
        .pipe(
            concatMap(() =>
                this.service.getGeolocationPreferences().pipe(
                    // tap(results => console.log(results)),
                    map(
                        results =>
                            new fromPreferences.LoadGeolocationPreferencesSuccess(results.data),
                    ),
                    catchError(error =>
                        of(new fromPreferences.LoadGeolocationPreferencesFail({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadGeolocationPreferencesFail$ = this.actions$
        .pipe(ofType<fromPreferences.LoadGeolocationPreferencesFail>(
            PreferencesActionTypes.LOAD_GEOLOCATION_PREFERENCES_FAIL,
        ))
        .pipe(
            map((x: any) => {
                console.log(x.payload);
                this.toastService.displayHTTPErrorToast(x.payload.error.code, x.payload.error.error.error);
            }),
        );

    // OPTIMIZATION PREFERENCES EFFECTS

    @Effect()
    getWarehouseCoordinates$ = this.actions$
        .pipe(
            ofType<fromPreferences.GetWarehouseCoordinatesAction>(
                PreferencesActionTypes.GET_WAREHOUSE_COORDINATES,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.getWarehouseCoordinates(payload.address).pipe(
                    map((r) => r.results[0]),
                    map((address) => {
                        if (
                            address.coordinates !== null &&
                            address.coordinates !== undefined
                        ) {
                            return new fromPreferences.GetWarehouseCoordinatesSuccessAction(
                                {
                                    warehouse: {
                                        address: payload.address,
                                        coordinates: address.coordinates,
                                    },
                                },
                            );
                        } else {
                            this.toastService.displayWebsiteRelatedToast(
                                'Warehouse Coordinates could not be retrieved',
                            );
                            return { type: 'NO_ACTION' };
                        }
                    }),
                    catchError((error) =>
                        of(
                            new fromPreferences.GetWarehouseCoordinatesFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect()
    getWarehouseCoordinatesSuccess$ = this.actions$
        .pipe(
            ofType<fromPreferences.GetWarehouseCoordinatesSuccessAction>(
                PreferencesActionTypes.GET_WAREHOUSE_COORDINATES_SUCCESS,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                of(
                    new fromPreferences.UpdateWarehouseAction({
                        warehouse: payload.warehouse,
                    }),
                ),
            ),
        );

    @Effect()
    updateWarehouse$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateWarehouseAction>(
                PreferencesActionTypes.UPDATE_WAREHOUSE,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateWarehouse(payload.warehouse).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateWarehouseSuccessAction({
                                warehouse: payload.warehouse,
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateWarehouseFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateWarehouseSuccess$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateWarehouseSuccessAction>(
                PreferencesActionTypes.UPDATE_WAREHOUSE_SUCCESS,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayWebsiteRelatedToast(
                    'La dirección del almacén ha sido actualizada',
                    this._translate.instant('GENERAL.ACCEPT'),
                    3000,
                    true,
                );
            }),
        );
    @Effect({ dispatch: false })
    updateWarehouseFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateWarehouseFailAction>(
                PreferencesActionTypes.UPDATE_WAREHOUSE_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.code, x.payload.error.error);
            }),
        );

    @Effect()
    updateDefaultServiceTime$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateDefaultServiceTimeAction>(
                PreferencesActionTypes.UPDATE_DEFAULT_SERVICE_TIME,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateServiceTime(payload.defaultServiceTime).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateDefaultServiceTimeSuccessAction(
                                payload,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateDefaultServiceTimeFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateDefaultServiceTimeFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateDefaultServiceTimeFailAction>(
                PreferencesActionTypes.UPDATE_DEFAULT_SERVICE_TIME_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.code, x.payload.error.error);
            }),
        );

    @Effect()
    updateRefreshTime$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateDefaultRefreshAction>(
                PreferencesActionTypes.UPDATE_DEFAULT_REFRESH_TIME,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateRefreshTime(payload.refreshTime).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateDefaultRefreshSuccessAction(payload),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateDefaultRefreshFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateRefreshTimeFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateDefaultRefreshFailAction>(
                PreferencesActionTypes.UPDATE_DEFAULT_REFRESH_TIME_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.code, x.payload.error.error);
            }),
        );

    @Effect()
    updateMinServiceTimeStat$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMinServiceTimeStatAction>(
                PreferencesActionTypes.UPDATE_MIN_SERVICE_TIME_STAT,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateMinServiceTimeStat(payload.minServiceTimeStat).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateMinServiceTimeStatSuccessAction(
                                payload,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateMinServiceTimeStatFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateMinServiceTimeStatFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMinServiceTimeStatFailAction>(
                PreferencesActionTypes.UPDATE_MIN_SERVICE_TIME_STAT_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.code, x.payload.error.error);
            }),
        );

    @Effect()
    updateMaxServiceTimeStat$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMaxServiceTimeStatAction>(
                PreferencesActionTypes.UPDATE_MAX_SERVICE_TIME_STAT,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateMaxServiceTimeStat(payload.maxServiceTimeStat).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateMaxServiceTimeStatSuccessAction(
                                payload,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateMaxServiceTimeStatFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateMaxServiceTimeStatFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMaxServiceTimeStatFailAction>(
                PreferencesActionTypes.UPDATE_MAX_SERVICE_TIME_STAT_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.code, x.payload.error.error);
            }),
        );

    @Effect()
    updateAutomaticEndRouteTime$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateAutomaticEndRouteTimeAction>(
                PreferencesActionTypes.UPDATE_AUTOMATIC_END_ROUTE_TIME,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateAutomaticEndRouteTime(payload.endRouteTime).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateAutomaticEndRouteTimeSuccessAction(
                                payload,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateAutomaticEndRouteTimeFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateAutomaticEndRouteTimeeFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateAutomaticEndRouteTimeFailAction>(
                PreferencesActionTypes.UPDATE_AUTOMATIC_END_ROUTE_TIME_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.code, x.payload.error.error);
            }),
        );

    @Effect()
    updateOrderMaxTime$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateOrderMaxTimeAction>(
                PreferencesActionTypes.UPDATE_ORDER_MAX_TIME,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateOrderMaxTime(payload.orderMaxTime).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateOrderMaxTimeSuccessAction(payload),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateAutomaticEndRouteTimeFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateOrderMaxTimeFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateOrderMaxTimeFailAction>(
                PreferencesActionTypes.UPDATE_ORDER_MAX_TIME_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.error.error,
                );
            }),
        );

    @Effect()
    minAvgServiceTime$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMinAvgServiceTimeAction>(
                PreferencesActionTypes.UPDATE_MIN_AVG_SERVICE_TIME,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateMinAvgServiceTime(payload.minAvgServiceTime).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateMinAvgServiceTimeSuccessAction(
                                payload,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateMinAvgServiceTimeFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    minAvgServiceTimeFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMinAvgServiceTimeFailAction>(
                PreferencesActionTypes.UPDATE_MIN_AVG_SERVICE_TIME_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.error.error,
                );
            }),
        );



    @Effect()
    maxAvgServiceTime$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMaxAvgServiceTimeAction>(
                PreferencesActionTypes.UPDATE_MAX_AVG_SERVICE_TIME,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateMaxAvgServiceTime(payload.maxAvgServiceTime).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateMaxAvgServiceTimeSuccessAction(
                                payload,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateMaxAvgServiceTimeFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    maxAvgServiceTimeFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMaxAvgServiceTimeFailAction>(
                PreferencesActionTypes.UPDATE_MAX_AVG_SERVICE_TIME_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.error.error,
                );
            }),
        );

    @Effect()
    orderSyncEachTime$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateOrderSyncEachTimeAction>(
                PreferencesActionTypes.UPDATE_ORDER_SYNC_EACH_TIME,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateOrderSyncEachTime(payload.orderSyncEachTime).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateOrderSyncEachTimeSuccessAction(
                                payload,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateOrderSyncEachTimeFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    orderSyncEachTimeFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateOrderSyncEachTimeFailAction>(
                PreferencesActionTypes.UPDATE_ORDER_SYNC_EACH_TIME_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.error.error,
                );
            }),
        );

    @Effect()
    updateStoppedCommercialMaxTime$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateStoppedCommercialMaxTimeAction>(
                PreferencesActionTypes.UPDATE_STOPPED_COMMERCIAL_MAX_TIME,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service
                    .updateStoppedCommercialMaxTime(payload.stoppedCommercialMaxtime)
                    .pipe(
                        map(
                            (result) =>
                                new fromPreferences.UpdateStoppedCommercialMaxTimeSuccessAction(
                                    payload,
                                ),
                        ),
                        catchError((error) =>
                            of(
                                new fromPreferences.UpdateStoppedCommercialMaxTimeFailAction(
                                    {
                                        error,
                                    },
                                ),
                            ),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    updateStoppedCommercialMaxTimeFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateStoppedCommercialMaxTimeFailAction>(
                PreferencesActionTypes.UPDATE_STOPPED_COMMERCIAL_MAX_TIME_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.error.error,
                );
            }),
        );

    @Effect()
    updateStoppedDriverMaxTime$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateStoppedDriverMaxTimeAction>(
                PreferencesActionTypes.UPDATE_STOPPED_DRIVER_MAX_TIME,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateStoppedDriverMaxTime(payload.stoppedDriverMaxtime).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateStoppedDriverMaxTimeSuccessAction(
                                payload,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateStoppedDriverMaxTimeFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateStoppedDriverMaxTimeFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateStoppedCommercialMaxTimeFailAction>(
                PreferencesActionTypes.UPDATE_STOPPED_DRIVER_MAX_TIME_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.error.error,
                );
            }),
        );

    @Effect()
    updateScheduleGeolocation$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateScheduleGeolocationAction>(
                PreferencesActionTypes.UPDATE_SCHEDULE_GEOLOCATION,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateScheduleGeolocation(payload.schedule).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateScheduleGeolocationSuccessAction({
                                schedule: result.data,
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateScheduleGeolocationFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateScheduleGeolocationFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateScheduleGeolocationFailAction>(
                PreferencesActionTypes.UPDATE_SCHEDULE_GEOLOCATION_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.error.error,
                );
            }),
        );

    @Effect()
    UpdateOrderSyncTimeAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateOrderSyncTimeAction>(
                PreferencesActionTypes.UPDATE_ORDER_SYNC_TIME,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateOrderSyncTime(payload.orderSyncTime).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateOrderSyncTimeSuccessAction(payload),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateOrderSyncTimeFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    UpdateOrderSyncTimeFailAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateOrderSyncTimeFailAction>(
                PreferencesActionTypes.UPDATE_ORDER_SYNC_TIME_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.error.error,
                );
            }),
        );

    @Effect()
    updateDefaultDeliverySchedule$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateDefaultDeliveryScheduleAction>(
                PreferencesActionTypes.UPDATE_DEFAULT_DELIVERY_SCHEDULE,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateDeliverySchedule(payload.deliverySchedule).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateDefaultDeliveryScheduleSuccessAction(
                                payload,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateDefaultDeliveryScheduleFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateDefaultDeliveryScheduleFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateDefaultDeliveryScheduleFailAction>(
                PreferencesActionTypes.UPDATE_DEFAULT_DELIVERY_SCHEDULE_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.code, x.payload.error.error);
            }),
        );

    @Effect()
    toggleOptionsOptimizationPreference$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleOptimizationPreferenceOption>(
                PreferencesActionTypes.TOGGLE_OPTIMIZATION_PREFERENCE_OPTION,
            ),
        )
        .pipe(
            tap((action) => console.log(action)),
            concatMap((action) =>
                this.service
                    .toggleOptionsOptimizationPreference(action.key, action.value)
                    .pipe(
                        map(
                            () =>
                                new fromPreferences.ToggleOptimizationPreferenceOptionSuccess(
                                    action.key,
                                    action.value,
                                ),
                        ),
                        catchError((error) =>
                            of(
                                new fromPreferences.ToggleOptimizationPreferenceOptionFail({
                                    error,
                                }),
                            ),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    toggleOptionsOptimizationPreferenceFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleOptimizationPreferenceOptionFail>(
                PreferencesActionTypes.TOGGLE_OPTIMIZATION_PREFERENCE_OPTION_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.code, x.payload.error.error);
            }),
        );

    @Effect()
    toggleOptionsOptimizationAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleOptimizationPreferenceAction>(
                PreferencesActionTypes.TOGGLE_OPTIMIZATION_PREFERENCE_ACTION,
            ),
        )
        .pipe(
            tap((action) => console.log(action)),
            concatMap((action) =>
                this.service
                    .toggleOptionsOptimizationPreferenceAction(action.key, action.value)
                    .pipe(
                        map(
                            () =>
                                new fromPreferences.ToggleOptimizationPreferenceActionSuccess(
                                    action.key,
                                    action.value,
                                ),
                        ),
                        catchError((error) =>
                            of(
                                new fromPreferences.ToggleOptimizationPreferenceOptionFail({
                                    error,
                                }),
                            ),
                        ),
                    ),
            ),
        );

    @Effect()
    toggleOptionsDashboardAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleDashboardPreferenceAction>(
                PreferencesActionTypes.TOGGLE_DASHBOARD_PREFERENCE_ACTION,
            ),
        )
        .pipe(
            tap((action) => console.log(action)),
            concatMap((action) =>
                this.service
                    .toggleDashboardPreferenceAction(action.key, action.value)
                    .pipe(
                        map(
                            () =>
                                new fromPreferences.ToggleDashboardPreferenceActionSuccess(
                                    action.key,
                                    action.value,
                                ),
                        ),
                        catchError((error) =>
                            of(
                                new fromPreferences.ToggleDashboardPreferenceActionFail({
                                    error,
                                }),
                            ),
                        ),
                    ),
            ),
        );

    @Effect({ dispatch: false })
    toggleDashboardPreferenceFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleDashboardPreferenceActionFail>(
                PreferencesActionTypes.TOGGLE_DASHBOARD_PREFERENCE_ACTION_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.code, x.payload.error.error);
            }),
        );

    @Effect()
    toggleAppPreference$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleAppPreferenceOption>(
                PreferencesActionTypes.TOGGLE_APP_PREFERENCE_OPTION,
            ),
        )
        .pipe(
            tap((action) => console.log(action)),
            concatMap((action) =>
                this.service.toggleAppPreference(action.key, action.value).pipe(
                    map(
                        () =>
                            new fromPreferences.ToggleAppPreferenceOptionSuccess(
                                action.key,
                                action.value,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.ToggleAppPreferenceOptionFail(
                                error,
                            ),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    toggleAppPreferenceFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleAppPreferenceOptionFail>(
                PreferencesActionTypes.TOGGLE_APP_PREFERENCE_OPTION_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.code, x.payload.error.error);
            }),
        );

    @Effect()
    toggleFranchisePreference$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleFranchisePreferenceOption>(
                PreferencesActionTypes.TOGGLE_FRANCHISE_PREFERENCE_OPTION,
            ),
        )
        .pipe(
            tap((action) => console.log(action)),
            concatMap((action) =>
                this.service.toggleFranchisePreference(action.key, action.value).pipe(
                    map(
                        () =>
                            new fromPreferences.ToggleFranchisePreferenceOptionSuccess(
                                action.key,
                                action.value,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.ToggleFranchisePreferenceOptionFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect()
    toggleFranchisePreferenceFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleAppPreferenceOptionFail>(
                PreferencesActionTypes.TOGGLE_FRANCHISE_PREFERENCE_OPTION_FAIL,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(500, x.payload.error.error.error);
            }),
        );

    @Effect()
    toggleProductPreference$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleProductPreferenceOption>(
                PreferencesActionTypes.TOGGLE_PRODUCT_PREFERENCE_OPTION,
            ),
        )
        .pipe(
            tap((action) => console.log(action)),
            concatMap((action) =>
                this.service.toggleProductPreference(action.key, action.value).pipe(
                    map(
                        () =>
                            new fromPreferences.ToggleProductPreferenceOptionSuccess(
                                action.key,
                                action.value,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.ToggleProductPreferenceOptionFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    toggleProductPreferenceFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleProductPreferenceOptionFail>(
                PreferencesActionTypes.TOGGLE_PRODUCT_PREFERENCE_OPTION_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.code, x.payload.error.error);
            }),
        );

    @Effect()
    toggleOrdersPreference$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleOrdersPreferenceOption>(
                PreferencesActionTypes.TOGGLE_ORDERS_PREFERENCE_OPTION,
            ),
        )
        .pipe(
            tap((action) => console.log(action)),
            concatMap((action) =>
                this.service.toggleOrdersPreference(action.key, action.value).pipe(
                    map(
                        () =>
                            new fromPreferences.ToggleOrdersPreferenceOptionSuccess(
                                action.key,
                                action.value,
                            ),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.ToggleOrdersPreferenceOptionFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    toggleOrdersPreferenceFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleOrdersPreferenceOptionFail>(
                PreferencesActionTypes.TOGGLE_ORDERS_PREFERENCE_OPTION_FAIL,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    toggleOptionsControlPanelPreference$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleControlPanelPreferenceOption>(
                PreferencesActionTypes.TOGGLE_CONTROL_PANEL_PREFERENCE_OPTION,
            ),
        )
        .pipe(
            tap((action) => console.log(action)),
            concatMap((action) =>
                this.service
                    .toggleOptionsControlPanelPreference(action.key, action.value)
                    .pipe(
                        map(
                            () =>
                                new fromPreferences.ToggleControlPanelPreferenceOptionSuccess(
                                    action.key,
                                    action.value,
                                ),
                        ),
                        catchError((error) =>
                            of(
                                new fromPreferences.ToggleControlPanelPreferenceOptionFail({
                                    error,
                                }),
                            ),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    toggleOptionsControlPanelPreferenceFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleControlPanelPreferenceOptionFail>(
                PreferencesActionTypes.TOGGLE_OPTIMIZATION_PREFERENCE_OPTION_FAIL,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    toggleManagementPreference$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleManamgementPreferenceOption>(
                PreferencesActionTypes.TOGGLE_MANAGEMENT_PREFERENCE_OPTION,
            ),
        )
        .pipe(
            tap((action) => console.log(action)),
            concatMap((action) =>
                this.service
                    .ToggleOptionsManamgementPreference(action.key, action.value)
                    .pipe(
                        map(
                            () =>
                                new fromPreferences.ToggleManamgementPreferenceOptionSuccess(
                                    action.key,
                                    action.value,
                                ),
                        ),
                        catchError((error) =>
                            of(
                                new fromPreferences.ToggleManamgementPreferenceOptionFail({
                                    error,
                                }),
                            ),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    toggleManagementPreferenceFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleManamgementPreferenceOptionFail>(
                PreferencesActionTypes.TOGGLE_MANAGEMENT_PREFERENCE_OPTION_FAIL,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    updateTraffic$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateTrafficAction>(
                PreferencesActionTypes.UPDATE_TRAFFIC,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateTraffic(payload.traffic).pipe(
                    map(
                        () =>
                            new fromPreferences.UpdateTrafficSuccessAction({
                                traffic: payload.traffic,
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateTrafficFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateTrafficFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateTrafficFailAction>(
                PreferencesActionTypes.UPDATE_TRAFFIC_FAIL,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    // INTERFACE PREFERENCES EFFECTS

    // @Effect()
    // updateMinimizeRouteInterfacePreference = this.actions$
    //     .pipe(ofType<UpdateMinimizeRouteInterfacePreference>(
    //         PreferencesActionTypes.UPDATE_MINIMIZE_ROUTE_INTERFACE_PREFERENCE,
    //     )
    //     .pipe(
    //         map(action => action.payload),
    //         concatMap(minRoute =>
    //             this.service.updateMinimizeRouteInterfacePreferences(minRoute).pipe(
    //                 map(
    //                     results =>
    //                         new fromPreferences.UpdateMinimizeRouteInterfacePreferenceSuccess(
    //                             minRoute,
    //                         ),
    //                 ),
    //                 catchError(error =>
    //                     of(
    //                         new fromPreferences.UpdateMinimizeRouteInterfacePreferenceFail(
    //                             error,
    //                         ),
    //                     ),
    //                 ),
    //             ),
    //         ),
    //     );

    @Effect()
    toggleOptionsInterfacePreference$ = this.actions$
        .pipe(
            ofType<fromPreferences.ToggleInterfacePreferenceOption>(
                PreferencesActionTypes.TOGGLE_INTERFACE_PREFERENCE_OPTION,
            ),
        )
        .pipe(
            concatMap((action) =>
                this.service
                    .toggleOptionsInterfacePreference(action.key, action.value)
                    .pipe(
                        map(
                            () =>
                                new fromPreferences.ToggleInterfacePreferenceOptionSuccess(
                                    action.key,
                                    action.value,
                                ),
                        ),
                        catchError((error) =>
                            of(
                                new fromPreferences.ToggleInterfacePreferenceOptionFail(
                                    error,
                                ),
                            ),
                        ),
                    ),
            ),
        );

    // // PRINTING PREFERENCES EFFECTS

    // @Effect()
    // toggleOptionsPrintingPreference$ = this.actions$
    //     .pipe(ofType<fromPreferences.TogglePrintingPreferenceOption>(
    //         PreferencesActionTypes.TOGGLE_PRINTING_PREFERENCE_OPTION,
    //     )
    //     .pipe(
    //         concatMap(action =>
    //             this.service.toggleOptionsPrintingPreference(action.key, action.value).pipe(
    //                 map(
    //                     () =>
    //                         new fromPreferences.TogglePrintingPreferenceOptionSuccess(
    //                             action.key,
    //                             action.value,
    //                         ),
    //                 ),
    //                 catchError(error =>
    //                     of(new fromPreferences.TogglePrintingPreferenceOptionFail(error)),
    //                 ),
    //             ),
    //         ),
    //     );

    /* example Addreses range */

    @Effect()
    UpdateAddresesOrderRangeAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateAddresesOrderRangeAction>(
                PreferencesActionTypes.UPDATE_ADDRESES_ORDER_RANGE,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateRangeAddreses(payload.addresses).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateAddresesOrderRangeSuccessAction({
                                addresses: payload.addresses,
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateAddresesOrderRangeFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    UpdateAddresesOrderRangeSuccessAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateAddresesOrderRangeSuccessAction>(
                PreferencesActionTypes.UPDATE_ADDRESES_ORDER_RANGE_SUCCESS,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayWebsiteRelatedToast(
                    'La dirección para el cálculo del radio ha sido actualizada',
                    this._translate.instant('GENERAL.ACCEPT'),
                    3000,
                    false,
                );
            }),
        );
    @Effect({ dispatch: false })
    UpdateAddresesOrderRangeFailAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateAddresesOrderRangeFailAction>(
                PreferencesActionTypes.UPDATE_ADDRESES_ORDER_RANGE_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.payload.error.error.error,
                );
            }),
        );

    /* end example */

    /* UpdateRangeDistance */

    @Effect()
    UpdateRangeDistance$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateRangeDistanceAction>(
                PreferencesActionTypes.UPDATE_RANGE_DISTANCE,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateRangeDistance(payload.addresses).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateRangeDistanceSuccessAction({
                                addresses: payload.addresses,
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateRangeDistanceFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    UpdateRangeDistanceSuccessAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateRangeDistanceSuccessAction>(
                PreferencesActionTypes.UPDATE_RANGE_DISTANCE_SUCCESS,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayWebsiteRelatedToast(
                    'La distancia de alcance ha sido actualizada',
                    this._translate.instant('GENERAL.ACCEPT'),
                    3000,
                    false,
                );
            }),
        );
    @Effect({ dispatch: false })
    UpdateRangeDistanceFailAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateRangeDistanceFailAction>(
                PreferencesActionTypes.UPDATE_RANGE_DISTANCE_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.payload.error.error,
                );
            }),
        );
    /* end UpdateRangeDistance */

    /* updateMInPyamient */
    @Effect()
    UpdateMinPaymentAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMinPaymentAction>(
                PreferencesActionTypes.UPDATE_MINPAYMENT,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateMinPayment(payload.payment).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateMinPaymentSuccessAction({
                                payment: payload.payment,
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateMinPaymentFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    UpdateMinPaymentSuccessAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMinPaymentSuccessAction>(
                PreferencesActionTypes.UPDATE_MINPAYMENT_SUCCESS,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayWebsiteRelatedToast(
                    'La cantidad minima de compra ha sido actualizada',
                    this._translate.instant('GENERAL.ACCEPT'),
                    3000,
                    false,
                );
            }),
        );
    @Effect({ dispatch: false })
    UpdateMinPaymentFailAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMinPaymentFailAction>(
                PreferencesActionTypes.UPDATE_MINPAYMENT_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.payload.error.error,
                );
            }),
        );



    @Effect()
    UpdateSumQuantityBuyWithoutMinimunToTicket$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateSumQuantityBuyWithoutMinimunToTicketAction>(
                PreferencesActionTypes.UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.UpdateSumQuantityBuyWithoutMinimunToTicket(payload.payment).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateSumQuantityBuyWithoutMinimunToTicketActionSuccess({
                                payment: payload.payment,
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateSumQuantityBuyWithoutMinimunToTicketActionFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    UpdateSumQuantityBuyWithoutMinimunToTicketSuccess$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateSumQuantityBuyWithoutMinimunToTicketActionSuccess>(
                PreferencesActionTypes.UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET_SUCCESS,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayWebsiteRelatedToast(
                    'Registro ha sido actualizado con exito',
                    this._translate.instant('GENERAL.ACCEPT'),
                    3000,
                    false,
                );
            }),
        );
    @Effect({ dispatch: false })
    UpdateSumQuantityBuyWithoutMinimunToTicketFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateSumQuantityBuyWithoutMinimunToTicketActionFail>(
                PreferencesActionTypes.UPDATE_SUM_QUANTITY_BUY_WITHOUT_MINIUM_TO_TICKET_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.payload.error.error,
                );
            }),
        );

    @Effect()
    UpdateAllowChangeOrderPaymentStatusAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateAllowChangeOrderPaymentStatusAction>(
                PreferencesActionTypes.UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.UpdateAllowChangeOrderPaymentStatus(payload.payment).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateAllowChangeOrderPaymentStatusActionSuccess({
                                payment: payload.payment,
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateAllowChangeOrderPaymentStatusActionFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    UpdateAllowChangeOrderPaymentStatusActionSuccess$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateAllowChangeOrderPaymentStatusActionSuccess>(
                PreferencesActionTypes.UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS_SUCCESS,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayWebsiteRelatedToast(
                    'Registro ha sido actualizado con exito',
                    this._translate.instant('GENERAL.ACCEPT'),
                    3000,
                    false,
                );
            }),
        );
    @Effect({ dispatch: false })
    UpdateAllowChangeOrderPaymentStatusActionFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateAllowChangeOrderPaymentStatusActionFail>(
                PreferencesActionTypes.UPDATE_ALLOW_CHANGE_ORDER_PAYMENT_STATUS_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.payload.error.error,
                );
            }),
        );    

    @Effect()
    UpdateSumDeliveryPriceToTicket$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateSumDeliveryPriceToTicketAction>(
                PreferencesActionTypes.UPDATE_SUM_DELIVERY_PRICE_TO_TICKET,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.UpdateSumDeliveryPriceToTicket(payload.payment).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateSumDeliveryPriceToTicketActionSuccess({
                                payment: payload.payment,
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateSumQuantityBuyWithoutMinimunToTicketActionFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    UpdateSumDeliveryPriceToTicketSuccess$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateSumDeliveryPriceToTicketActionSuccess>(
                PreferencesActionTypes.UPDATE_SUM_DELIVERY_PRICE_TO_TICKET_SUCCESS,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayWebsiteRelatedToast(
                    'Registro ha sido actualizado con exito',
                    this._translate.instant('GENERAL.ACCEPT'),
                    3000,
                    false,
                );
            }),
        );
    @Effect({ dispatch: false })
    UpdateSumDeliveryPriceToTicketFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateSumDeliveryPriceToTicketActionFail>(
                PreferencesActionTypes.UPDATE_SUM_DELIVERY_PRICE_TO_TICKET_FAIL,
            ),
        )
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(
                    Number(x.payload.error.status),
                    x.payload.error.error,
                );
            }),
        );
    /* end updateMinPayment */

    /* UpdatePrepaidPayment */
    @Effect()
    UpdatePrepaidPaymentAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdatePrepaidPaymentAction>(
                PreferencesActionTypes.UPDATE_PREPAID_PAYMENT,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updatePrepaidPayment(payload.payment).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdatePrepaidPaymentSuccessAction({
                                payment: payload.payment,
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdatePrepaidPaymentFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    UpdatePrepaidPaymentSuccessAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMinPaymentSuccessAction>(
                PreferencesActionTypes.UPDATE_PREPAID_PAYMENT_SUCCESS,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayWebsiteRelatedToast(
                    'La cantidad prepago ha sido actualizada',
                    this._translate.instant('GENERAL.ACCEPT'),
                    3000,
                    false,
                );
            }),
        );
    @Effect({ dispatch: false })
    UpdatePrepaidPaymentFailAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateMinPaymentFailAction>(
                PreferencesActionTypes.UPDATE_PREPAID_PAYMENT_FAIL,
            ))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error);
            }),
        );
    /* end UpdatePrepaidPayment */


    @Effect()
    createPreferenceDeliveryAction$ = this.actions$
        .pipe(ofType<fromPreferences.CreatePreferenceDeliveryAction>(
            PreferencesActionTypes.CREATE_PREFERENCE_DELIVERY,
        ))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.createPrefereceDelivery(payload.delivery).pipe(
                    map(
                        result =>
                            new fromPreferences.CreatePreferenceDeliverySuccessAction({
                                delivery: result.data
                            }),
                    ),
                    catchError(error =>
                        of(
                            new fromPreferences.CreatePreferenceDeliveryFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),

        );
    @Effect({ dispatch: false })
    CreatePreferenceDeliveryFailAction$ = this.actions$
        .pipe(ofType<fromPreferences.CreatePreferenceDeliveryFailAction>(
            PreferencesActionTypes.CREATE_PREFERENCE_DELIVERY_FAIL,
        ))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error);
            }),
        );



    /* updatePrefereceDelivery */

    @Effect()
    UpdatePreferenceDeliveryAction$ = this.actions$
        .pipe(ofType<fromPreferences.UpdatePreferenceDeliveryAction>(
            PreferencesActionTypes.UPDATE_PREFERENCE_DELIVERY,
        ))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.UpdatePreferenceDelivery(payload.delivery).pipe(
                    map(
                        result =>
                            new fromPreferences.UpdatePreferenceDeliverySuccessAction({
                                delivery: result.data
                            }),
                    ),
                    catchError(error =>
                        of(
                            new fromPreferences.UpdatePrepaidPaymentFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),

        );
    @Effect({ dispatch: false })
    UpdatePreferenceDeliveryFailAction$ = this.actions$
        .pipe(ofType<fromPreferences.UpdatePreferenceDeliveryFailAction>(
            PreferencesActionTypes.UPDATE_PREFERENCE_DELIVERY_FAIL,
        ))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error);
            }),
        );

    /* end updatePrefereceDelivery */

    /*  allowBuyWithoutMinimum*/
    @Effect()
    UpdateAllowBuyWithoutMinimumAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateAllowBuyWithoutMinimumAction>(
                PreferencesActionTypes.UPDATE_ALLOW_BUY_WITHOUT_MINIMUN,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateAllowBuyWithoutMinimum(payload.payment).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateAllowBuyWithoutMinimumSuccessAction({
                                payment: result.data,
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateAllowBuyWithoutMinimumFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    UpdateAllowBuyWithoutMinimumSuccessAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateAllowBuyWithoutMinimumSuccessAction>(
                PreferencesActionTypes.UPDATE_ALLOW_BUY_WITHOUT_MINIMUN_SUCCESS,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayWebsiteRelatedToast(
                    'Registro ha sido actualizado con exito',
                    this._translate.instant('GENERAL.ACCEPT'),
                    3000,
                    false,
                );
            }),
        );
    @Effect({ dispatch: false })
    UpdateAllowBuyWithoutMinimumFailAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateAllowBuyWithoutMinimumFailAction>(
                PreferencesActionTypes.UPDATE_ALLOW_BUY_WITHOUT_MINIMUN_FAIL,
            ))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error);
            }),
        );

    /* end allowBuyWithoutMinimum */


    @Effect()
    UpdateReturnToMailBoxOrderAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateReturnToMailBoxOrderAction>(
                PreferencesActionTypes.UPDATE_RETURN_MAIL_BOX_ORDER,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.UpdateReturnToMailBoxOrder(payload.returnToMailBoxOrder).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateReturnToMailBoxOrderActionSuccess({
                                returnToMailBoxOrder: result.data.returnToMailBoxOrder
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateTimeReturnToMailBoxOrderActionFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    UpdateReturnToMailBoxOrderActionSuccess$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateReturnToMailBoxOrderActionSuccess>(
                PreferencesActionTypes.UPDATE_RETURN_MAIL_BOX_ORDER_SUCCESS,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayWebsiteRelatedToast(
                    'Registro ha sido actualizado con exito',
                    this._translate.instant('GENERAL.ACCEPT'),
                    3000,
                    false,
                );
            }),
        );
    @Effect({ dispatch: false })
    UpdateReturnToMailBoxOrderActionFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateReturnToMailBoxOrderActionFail>(
                PreferencesActionTypes.UPDATE_RETURN_MAIL_BOX_ORDER_FAIL,
            ))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error);
            }),
        );



    @Effect()
    updateTimeReturnToMailBoxOrderAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateTimeReturnToMailBoxOrderAction>(
                PreferencesActionTypes.UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateTimeReturnToMailBoxOrder(payload.timeReturnToMailBoxOrder).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateTimeReturnToMailBoxOrderActionSuccess({
                                timeReturnToMailBoxOrder: result.data.timeReturnToMailBoxOrder
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateTimeReturnToMailBoxOrderActionFail({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateTimeReturnToMailBoxOrderActionSuccess$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateTimeReturnToMailBoxOrderActionSuccess>(
                PreferencesActionTypes.UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER_SUCCESS,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayWebsiteRelatedToast(
                    'Registro ha sido actualizado con exito',
                    this._translate.instant('GENERAL.ACCEPT'),
                    3000,
                    false,
                );
            }),
        );
    @Effect({ dispatch: false })
    updateTimeReturnToMailBoxOrderActionFail$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateTimeReturnToMailBoxOrderActionFail>(
                PreferencesActionTypes.UPDATE_TIME_RETURN_TO_MAIL_BOX_ORDER_FAIL,
            ))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error);
            }),
        );

    /* quantityBuyWithoutMinimum */

    @Effect()
    UpdateQuantityBuyWithoutMinimumAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateQuantityBuyWithoutMinimumAction>(
                PreferencesActionTypes.UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN,
            ),
        )
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.updateQuantityBuyWithoutMinimum(payload.payment).pipe(
                    map(
                        (result) =>
                            new fromPreferences.UpdateQuantityBuyWithoutMinimumSuccessAction({
                                payment: result.data,
                            }),
                    ),
                    catchError((error) =>
                        of(
                            new fromPreferences.UpdateAllowBuyWithoutMinimumFailAction({
                                error,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    UpdateQuantityBuyWithoutMinimumSuccessAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateAllowBuyWithoutMinimumSuccessAction>(
                PreferencesActionTypes.UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN_SUCCESS,
            ),
        )
        .pipe(
            map((x) => {
                this.toastService.displayWebsiteRelatedToast(
                    'Cantidad si no supera la cantidad minima ha sido actualizado con exito',
                    this._translate.instant('GENERAL.ACCEPT'),
                    3000,
                    false,
                );
            }),
        );
    @Effect({ dispatch: false })
    UpdateQuantityBuyWithoutMinimumFailAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateQuantityBuyWithoutMinimumFailAction>(
                PreferencesActionTypes.UPDATE_QUANTITY_BUY_WITHOUT_MINIMUN_FAIL,
            ))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error);
            }),
        );

    /* quantityBuyWithoutMinimum */

    /* quantityDelayModifySchedule */
    @Effect()
    UpdateQuantityDelayModifyScheduleAction$ = this.actions$
    .pipe(
        ofType<fromPreferences.UpdateQuantityDelayModifyScheduleAction>(
            PreferencesActionTypes.UPDATE_QUANTITY_DELAY_MODIFY_SCHEDULE,
        ),
    )
    .pipe(
        map((action) => action.payload),
        concatMap((payload) =>
            this.service.updateQuantityDelayModifySchedule(payload.quantityDelayModifySchedule).pipe(
                map(
                    (result) =>
                        new fromPreferences.UpdateQuantityDelayModifyScheduleSuccessAction(
                            payload,
                        ),
                ),
                catchError((error) =>
                    of(
                        new fromPreferences.UpdateQuantityDelayModifyScheduleFailAction({
                            error,
                        }),
                    ),
                ),
            ),
        ),
    );
    @Effect({ dispatch: false })
    UpdateQuantityDelayModifyScheduleFailAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateQuantityDelayModifyScheduleFailAction>(
                PreferencesActionTypes.UPDATE_QUANTITY_DELAY_MODIFY_SCHEDULE_FAIL,
            ))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error);
            }),
        );
    /* end quantityDelayModifySchedule */

     /* quantityDelayModifySchedule */
     @Effect()
     UpdateDelayWhenPassingTimeAction$ = this.actions$
     .pipe(
         ofType<fromPreferences.UpdateDelayWhenPassingTimeAction>(
             PreferencesActionTypes.UPDATE_DELAY_WHEN_REVIEWING_TIME,
         ),
     )
     .pipe(
         map((action) => action.payload),
         concatMap((payload) =>
             this.service.updateDelayWhenPassingTime(payload.delayWhenPassingTime).pipe(
                 map(
                     (result) =>
                         new fromPreferences.UpdateDelayWhenPassingTimeSuccessAction(
                             payload,
                         ),
                 ),
                 catchError((error) =>
                     of(
                         new fromPreferences.UpdateDelayWhenPassingTimeFailAction({
                             error,
                         }),
                     ),
                 ),
             ),
         ),
     );
     @Effect({ dispatch: false })
     UpdateDelayWhenPassingTimeFailAction$ = this.actions$
         .pipe(
             ofType<fromPreferences.UpdateDelayWhenPassingTimeFailAction>(
                 PreferencesActionTypes.UPDATE_DELAY_WHEN_REVIEWING_TIME_FAIL,
             ))
         .pipe(
             map((x: any) => {
                 this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error);
             }),
         );
     /* end quantityDelayModifySchedule */





    /* quantityAdvancesModifySchedule */
    @Effect()
    UpdateQuantityAdvancesModifyScheduleAction$ = this.actions$
    .pipe(
        ofType<fromPreferences.UpdateQuantityAdvancesModifyScheduleAction>(
            PreferencesActionTypes.UPDATE_QUANTITY_ADVANCES_MODIFY_SCHEDULE,
        ),
    )
    .pipe(
        map((action) => action.payload),
        concatMap((payload) =>
            this.service.updateQuantityAdvancesModifySchedule(payload.quantityAdvancesModifySchedule).pipe(
                map(
                    (result) =>
                        new fromPreferences.UpdateQuantityAdvancesModifyScheduleSuccessAction(
                            payload,
                        ),
                ),
                catchError((error) =>
                    of(
                        new fromPreferences.UpdateQuantityAdvancesModifyScheduleFailAction({
                            error,
                        }),
                    ),
                ),
            ),
        ),
    );
    @Effect({ dispatch: false })
    UpdateQuantityAdvancesModifyScheduleFailAction$ = this.actions$
        .pipe(
            ofType<fromPreferences.UpdateQuantityAdvancesModifyScheduleFailAction>(
                PreferencesActionTypes.UPDATE_QUANTITY_ADVANCES_MODIFY_SCHEDULE_FAIL,
            ))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error);
            }),
        );
    /* end quantityAdvancesModifySchedule */

     /* advanceWhenAnticipatingTime */
     @Effect()
     UpdateAdvanceWhenAnticipatingTimeAction$ = this.actions$
     .pipe(
         ofType<fromPreferences.UpdateAdvanceWhenAnticipatingTimeAction>(
             PreferencesActionTypes.UPDATE_ADVANCE_WHEN_ANTICIPATING_TIME,
         ),
     )
     .pipe(
         map((action) => action.payload),
         concatMap((payload) =>
             this.service.updateAdvanceWhenAnticipatingTime(payload.advanceWhenAnticipatingTime).pipe(
                 map(
                     (result) =>
                         new fromPreferences.UpdateAdvanceWhenAnticipatingTimeSuccessAction(
                             payload,
                         ),
                 ),
                 catchError((error) =>
                     of(
                         new fromPreferences.UpdateAdvanceWhenAnticipatingTimeFailAction({
                             error,
                         }),
                     ),
                 ),
             ),
         ),
     );
     @Effect({ dispatch: false })
     UpdateAdvanceWhenAnticipatingTimeFailAction$ = this.actions$
         .pipe(
             ofType<fromPreferences.UpdateAdvanceWhenAnticipatingTimeFailAction>(
                 PreferencesActionTypes.UPDATE_ADVANCE_WHEN_ANTICIPATING_TIME_FAIL,
             ))
         .pipe(
             map((x: any) => {
                 this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error);
             }),
         );
     /* end advanceWhenAnticipatingTime */

    constructor(
        private actions$: Actions,
        private service: StatePreferencesService,
        private toastService: ToastService,
        private _translate: TranslateService,
    ) { }
}

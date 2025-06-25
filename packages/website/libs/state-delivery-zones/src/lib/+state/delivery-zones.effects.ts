import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { StateDeliveryZonesService } from '../state-delivery-zones.service';
import * as fromDeliveryZones from './delivery-zones.actions';
import { DeliveryZonesActionTypes } from './delivery-zones.actions';
import { concatMap, map, catchError, switchMap } from 'rxjs/operators';
import { ToastService } from '@optimroute/shared';
import { of } from 'rxjs';

@Injectable()
export class DeliveryZonesEffects {
    @Effect()
    loadDeliveryZones$ = this.actions$
        .pipe(ofType<fromDeliveryZones.LoadDeliveryZones>(
            DeliveryZonesActionTypes.LOAD_DELIVERY_ZONES,
        ))
        .pipe(
            concatMap(() =>
                this.service.loadDeliveryZones().pipe(
                    map(results => new fromDeliveryZones.LoadDeliveryZonesSuccess({
                        results: results.data
                    })),
                    catchError(error =>
                        of(new fromDeliveryZones.LoadDeliveryZonesFail(error)),
                    ),
                ),
            ),
        );

    @Effect()
    addUser$ = this.actions$
        .pipe(ofType<fromDeliveryZones.AddDeliveryZones>(DeliveryZonesActionTypes.ADD_DELIVERY_ZONES))
        .pipe(
            map(action => action.payload.zone),
            concatMap(user =>
                this.service.addDeliveryZone(user).pipe(
                    map(
                        newZone =>
                            new fromDeliveryZones.AddDeliveryZonesSuccess({ zone: newZone.data }),
                    ),
                    catchError(error => of(new fromDeliveryZones.AddDeliveryZonesFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    addUserFail$ = this.actions$
        .pipe(ofType<fromDeliveryZones.AddDeliveryZonesFail>(DeliveryZonesActionTypes.ADD_DELIVERY_ZONES_FAIL))
        .pipe(
            map((x:any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.status),x.payload.error);
            }),
        );

    @Effect()
    updateUser$ = this.actions$
        .pipe(ofType<fromDeliveryZones.UpdateDeliveryZones>(DeliveryZonesActionTypes.UPDATE_DELIVERY_ZONES))
        .pipe(
            map(action => action.payload),
            concatMap(action =>
                this.service.updateDeliveryZone(action.id, action.zone).pipe(
                    switchMap(results => [
                        new fromDeliveryZones.UpdateDeliveryZonesSuccess({id:action.id, zone: results.data }),
                    ]),
                    catchError(error => of(new fromDeliveryZones.UpdateDeliveryZonesFail(error))),
                ),
            ),
        );

                    

    @Effect({ dispatch: false })
    updateUserFail$ = this.actions$
        .pipe(ofType<fromDeliveryZones.UpdateDeliveryZonesFail>(DeliveryZonesActionTypes.UPDATE_DELIVERY_ZONES_FAIL))
        .pipe(
            map((x:any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.status),x.payload.error);
            }),
        );
    @Effect()
    reoder$ = this.actions$
        .pipe(ofType<fromDeliveryZones.ReorderDeliveryZones>(DeliveryZonesActionTypes.REORDER_ZONE))
        .pipe(
            map(action => action.payload),
            concatMap(action =>
                this.service.reoderDeliveryZone(action.id, action.order).pipe(
                    switchMap(results => [
                        new fromDeliveryZones.ReorderDeliveryZonesSuccess({id:action.id, order: action.order }),
                    ]),
                    catchError(error => of(new fromDeliveryZones.ReorderDeliveryZonesFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    reoderFail$ = this.actions$
        .pipe(ofType<fromDeliveryZones.ReorderDeliveryZonesFail>(DeliveryZonesActionTypes.UPDATE_DELIVERY_ZONES_FAIL))
        .pipe(
            map((x:any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.status),x.payload.error);
            }),
        );

    constructor(private actions$: Actions, private service: StateDeliveryZonesService,  private toastService: ToastService) {}
}

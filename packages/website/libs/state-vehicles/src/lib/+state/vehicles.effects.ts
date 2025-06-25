import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromVehicles from './vehicles.actions';
import { VehiclesActionTypes } from './vehicles.actions';
import { switchMap, concatMap, catchError, map, tap } from 'rxjs/operators';
import { StateVehiclesService } from '../state-vehicles.service';
import { of, concat } from 'rxjs';
import {
    RemoveVehicleFromZoneSuccessAction,
    UpdateVehicleFromZoneAction,
} from '@optimroute/state-route-planning';
import { ToastService } from '@optimroute/shared';

@Injectable()
export class VehiclesEffects {
    @Effect()
    loadVehicles$ = this.actions$.pipe(
        ofType<fromVehicles.LoadVehicles>(VehiclesActionTypes.LOAD_VEHICLES)
    )
        .pipe(
            concatMap(() =>
                this.service.loadVehicles().pipe(
                    map(
                        result =>
                            new fromVehicles.LoadVehiclesSuccess({
                                vehicles: result.data.filter((x)=> x.isActive),
                            }),
                    ),
                    catchError(error => of(new fromVehicles.LoadVehiclesFail({ error }))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadVehiclesFail$ = this.actions$.pipe
        (ofType<fromVehicles.LoadVehiclesFail>(VehiclesActionTypes.LOAD_VEHICLES_FAIL))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    addVehicle$ = this.actions$
        .pipe(ofType<fromVehicles.AddVehicle>(VehiclesActionTypes.ADD_VEHICLE))
        .pipe(
            map(action => action.payload.vehicle),
            concatMap(vehicle =>
                this.service.addVehicle(vehicle).pipe(
                    map(
                        newVehicle =>
                            new fromVehicles.AddVehicleSuccess({ vehicle: newVehicle.data }),
                    ),
                    catchError(error => of(new fromVehicles.AddVehicleFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    addVehicleFail$ = this.actions$
        .pipe(ofType<fromVehicles.AddVehicleFail>(VehiclesActionTypes.ADD_VEHICLE_FAIL))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error);
            }),
        );

    @Effect()
    updateVehicle$ = this.actions$
        .pipe(ofType<fromVehicles.UpdateVehicle>(VehiclesActionTypes.UPDATE_VEHICLE))
        .pipe(
            concatMap(action =>
                this.service.updateVehicle(action.payload.id, action.payload.vehicle).pipe(
                    //tap(results => console.log(results)),
                    switchMap(results => [
                        new fromVehicles.UpdateVehicleSuccess({ id: action.payload.id, vehicle: results.data }),
                        new UpdateVehicleFromZoneAction({
                            vehicleId: action.payload.id,
                            results: results.data,
                            zoneId: action.payload.zoneId
                        }),
                    ]),
                    catchError(error => of(new fromVehicles.UpdateVehicleFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateVehicleFail$ = this.actions$
        .pipe(ofType<fromVehicles.UpdateVehicleFail>(VehiclesActionTypes.UPDATE_VEHICLE_FAIL))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.status), x.payload.error);
            }),
        );

    @Effect()
    deleteVehicle$ = this.actions$
        .pipe(ofType<fromVehicles.DeleteVehicle>(VehiclesActionTypes.DELETE_VEHICLE))
        .pipe(
            map(action => action.payload.id),
            concatMap(id =>
                this.service.deleteVehicle(id).pipe(
                    switchMap(() => [
                        new fromVehicles.DeleteVehicleSuccess({ id }),
                        new RemoveVehicleFromZoneSuccessAction({ vehicleId: id }),
                    ]),
                    catchError(error => of(new fromVehicles.DeleteVehicleFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    deleteVehicleFail$ = this.actions$
        .pipe(ofType<fromVehicles.DeleteVehicleFail>(VehiclesActionTypes.DELETE_VEHICLE_FAIL))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );


    constructor(
        private service: StateVehiclesService,
        private actions$: Actions,
        private toastService: ToastService,
    ) { }
}

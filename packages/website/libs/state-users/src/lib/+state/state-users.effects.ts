import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromUsers from './state-users.actions';
import { StateUsersPartialState } from './state-users.reducer';
import {
    UsersActionTypes
} from './state-users.actions';
import { StateUsersService } from '../state-users.service';
import { ToastService } from '@optimroute/shared';
import { map, concatMap, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class StateUsersEffects {
    @Effect()
    loadUsers$ = this.actions$
        .pipe(ofType<fromUsers.LoadUsers>(UsersActionTypes.LOAD_USERS))
        .pipe(
            map(action => action.payload.me),
            concatMap((me) =>
                this.service.loadUsers(me).pipe(
                    map(
                        result =>
                            new fromUsers.LoadUsersSuccess({
                                Users: result.data,
                            }),
                    ),
                    catchError(error => of(new fromUsers.LoadUsersFail({ error }))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadUsersFail$ = this.actions$
        .pipe(ofType<fromUsers.LoadUsersFail>(UsersActionTypes.LOAD_USERS_FAIL))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    loadUsersDrivers$ = this.actions$
        .pipe(ofType<fromUsers.LoadUsersDrivers>(UsersActionTypes.LOAD_USERS_DRIVER))
        .pipe(
            concatMap(() =>
                this.service.loadUsersDriver().pipe(
                    map(
                        result =>
                            new fromUsers.LoadUsersSuccess({
                                Users: result.data,
                            }),
                    ),
                    catchError(error => of(new fromUsers.LoadUsersFail({ error }))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadUsersDriverFail$ = this.actions$
        .pipe(ofType<fromUsers.LoadUsersDriverFail>(UsersActionTypes.LOAD_USERS_FAIL))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status),x.payload.error.error.error);
            }),
        );
    @Effect()
    loadVehicleTypes$ = this.actions$
        .pipe(ofType<fromUsers.LoadVehicleTypes>(UsersActionTypes.LOAD_VEHICLE_TYPE))
        .pipe(
            concatMap(() =>
                this.service.loadVehiclesType().pipe(
                    map(
                        result =>
                            new fromUsers.LoadVehicleTypesSuccess({
                                vehiclesTypes: result.data,
                            }),
                    ),
                    catchError(error => of(new fromUsers.LoadVehicleTypesFail({ error }))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadVehicleTypesFail$ = this.actions$
        .pipe(ofType<fromUsers.LoadVehicleTypesFail>(UsersActionTypes.LOAD_VEHICLE_TYPE_FAIL))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status),x.payload.error.error.error);
            }),
        );
    @Effect()
    addUser$ = this.actions$
        .pipe(ofType<fromUsers.AddUser>(UsersActionTypes.ADD_USER))
        .pipe(
            map(action => action.payload.user),
            concatMap(user =>
                this.service.addUser(user).pipe(
                    map(
                        newUser =>
                            new fromUsers.AddUsersuccess({ user: newUser.data }),
                    ),
                    catchError(error => of(new fromUsers.AddUserFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    addUserFail$ = this.actions$
        .pipe(ofType<fromUsers.AddUserFail>(UsersActionTypes.ADD_USER_FAIL))
        .pipe(
            map((x:any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.status),x.payload.error.error);
            }),
        );

    @Effect()
    updateUser$ = this.actions$
        .pipe(ofType<fromUsers.UpdateUser>(UsersActionTypes.UPDATE_USER))
        .pipe(
            map(action => action.payload),
            concatMap(action =>
                this.service.updateUser(action.id, action.user).pipe(
                    switchMap(results => [
                        new fromUsers.UpdateUsersuccess({id:action.id, user: results.data }),
                    ]),
                    catchError(error => of(new fromUsers.UpdateUserFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateUserFail$ = this.actions$
        .pipe(ofType<fromUsers.UpdateUserFail>(UsersActionTypes.UPDATE_USER_FAIL))
        .pipe(
            map((x:any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.status),x.payload.error.error);
            }),
        );

    @Effect()
    deleteUser$ = this.actions$
        .pipe(ofType<fromUsers.DeleteUser>(UsersActionTypes.DELETE_USER))
        .pipe(
            map(action => action.payload.id),
            concatMap(id =>
                this.service.deleteUser(id).pipe(
                    switchMap(() => [
                        new fromUsers.DeleteUsersuccess({ id }),
                    ]),
                    catchError(error => of(new fromUsers.DeleteUserFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    deleteUserFail$ = this.actions$
        .pipe(ofType<fromUsers.DeleteUserFail>(UsersActionTypes.DELETE_USER_FAIL))
        .pipe(
            map(x => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    constructor(
        private service: StateUsersService,
        private actions$: Actions,
        private toastService: ToastService,
    ) {}
}

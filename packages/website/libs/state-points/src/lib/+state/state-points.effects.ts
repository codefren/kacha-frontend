import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromPoints from './state-points.actions';
import { StatePointsPartialState } from './state-points.reducer';
import { map, concatMap, catchError, switchMap } from 'rxjs/operators';
import { StatePointService } from '../state-point.service';
import { of } from 'rxjs';
import { StatePointsActionTypes } from './state-points.actions'
import { ToastService, LoadingService } from '@optimroute/shared';
@Injectable()
export class StatePointsEffects {
    @Effect()
    loadPoints$ = this.actions$
        .pipe(ofType<fromPoints.LoadPoints>(StatePointsActionTypes.LOAD_POINTS))
        .pipe(
            map(action => action),
            concatMap(() =>
                this.service.loadPoints().pipe(
                    map(
                        result =>
                            new fromPoints.LoadPointsSuccess({
                                points : result.data,
                            }),
                    ),
                    catchError(error => of(new fromPoints.LoadPointsFail( error ))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    loadPointsFail$ = this.actions$
        .pipe(ofType<fromPoints.LoadPointsFail>(StatePointsActionTypes.LOAD_POINTS_FAIL))
        .pipe(
            map( (x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );
    @Effect()
    addPoint$ = this.actions$
        .pipe(ofType<fromPoints.AddPoints>(StatePointsActionTypes.ADD_POINT))
        .pipe(
            map(action => action.payload.point),
            concatMap(point =>
                this.service.addPoint(point).pipe(
                    map(
                        points =>
                            new fromPoints.AddPointsSuccess({ point: points.data }),
                    ),
                    catchError(error => of(new fromPoints.AddPointsFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    addPointFail$ = this.actions$
        .pipe(ofType<fromPoints.AddPointsFail>(StatePointsActionTypes.ADD_POINT_FAIL))
        .pipe(
            map((x:any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.status),x.payload.error);
                this.loadingService.hideLoading();
            }),
        );
    @Effect()
    updatePoint$ = this.actions$
        .pipe(ofType<fromPoints.UpdatePoint>(StatePointsActionTypes.UPDATE_POINT))
        .pipe(
            map(action => action.payload),
            concatMap(action =>
                this.service.updatePoint( action.id, action.point).pipe(
                    switchMap(results => [
                        new fromPoints.UpdatePointSuccess({id:action.id, point: results.data }),
                    ]),
                    catchError(error => of(new fromPoints.UpdatePointFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updatePointFail$ = this.actions$
        .pipe(ofType<fromPoints.UpdatePointFail>(StatePointsActionTypes.UPDATE_POINT_FAIL))
        .pipe(
            map((x:any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.status),x.payload.error);
                this.loadingService.hideLoading();
            }),
        );
            
    constructor(
        private actions$: Actions,
        private service: StatePointService,
        private toastService:ToastService,
        private loadingService: LoadingService
    ) {}
}

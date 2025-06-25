import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, concatMap, map, tap, withLatestFrom, switchMap } from 'rxjs/operators';
import { StateRoutePlanningService } from '../state-route-planning.service';
import { WebSocketService } from '../web-socket.service';
import { DeliveryPoint } from './route-planning.state';
import {
    AddPlanSessionFailAction,
    AddPlanSessionSuccessAction,
    AddVehicleToZoneAction,
    AddVehicleToZoneFailAction,
    AddVehicleToZoneSuccessAction,
    EvaluateAction,
    ImportPlanSessionAction,
    JoinZonesAction,
    JoinZonesFailAction,
    JoinZonesSuccessAction,
    MoveDeliveryPointRouteAction,
    MoveDeliveryPointRouteFailAction,
    MoveDeliveryPointRouteSuccessAction,
    MoveDeliveryPointZoneAction,
    MoveDeliveryPointZoneFailAction,
    MoveDeliveryPointZoneSuccessAction,
    OptimizeAction,
    OptimizeFailAction,
    PriorityChangeAction,
    PriorityChangeFailAction,
    PriorityChangeSuccessAction,
    RecomputeAction,
    RecomputeFailAction,
    RemoveVehicleFromZoneAction,
    RemoveVehicleFromZoneFailAction,
    RemoveVehicleFromZoneSuccessAction,
    RoutePlanningActionTypes,
    SplitZonesAction,
    SplitZonesFailAction,
    SplitZonesSuccessAction,
    ToggleForceDepartureTimeAction,
    ToggleForceDepartureTimeFailAction,
    ToggleForceDepartureTimeSuccessAction,
    ToggleIgnoreCapacityLimitAction,
    ToggleIgnoreCapacityLimitFailAction,
    ToggleIgnoreCapacityLimitSuccessAction,
    ToggleRouteForceDepartureTimeAction,
    ToggleRouteForceDepartureTimeFailAction,
    ToggleRouteForceDepartureTimeSuccessAction,
    ToggleUseAllVehiclesAction,
    ToggleUseAllVehiclesFailAction,
    ToggleUseAllVehiclesSuccessAction,
    UpdateDeliveryPointTimeWindowAction,
    UpdateDeliveryPointTimeWindowFailAction,
    UpdateDeliveryPointTimeWindowSuccessAction,
    UpdateExplorationLevelAction,
    UpdateExplorationLevelFailAction,
    UpdateExplorationLevelSuccessAction,
    UpdateOptimizationParametersAction,
    UpdateOptimizationParametersFailAction,
    UpdateOptimizationParametersSuccessAction,
    UpdateOptimizeFromIndexAction,
    UpdateOptimizeFromIndexFailAction,
    UpdateOptimizeFromIndexSuccessAction,
    UpdateRouteDeliveryPointTimeWindowAction,
    UpdateRouteDeliveryPointTimeWindowFailAction,
    UpdateRouteDeliveryPointTimeWindowSuccessAction,
    UpdateRouteExplorationLevelAction,
    UpdateRouteExplorationLevelFailAction,
    UpdateRouteExplorationLevelSuccessAction,
    UpdateRouteOptimizationParametersAction,
    UpdateRouteOptimizationParametersFailAction,
    UpdateRouteOptimizationParametersSuccessAction,
    UpdateZoneColorAction,
    UpdateZoneColorFailAction,
    UpdateZoneColorSuccessAction,
    UpdateZoneNameAction,
    UpdateZoneNameFailAction,
    UpdateZoneNameSuccessAction,
    UpdateDeliveryScheduleSuccessAction,
    UpdateDeliveryScheduleFailAction,
    UpdateDeliveryScheduleAction,
    UpdateRouteDeliveryScheduleAction,
    UpdateRouteDeliveryScheduleSuccessAction,
    UpdateRouteDeliveryScheduleFailAction,
    AsignAction,
    AsignFailAction,
    AsignSuccessAction,
    SaveSessionAction,
    SaveSessionSuccessAction,
    SaveSessionFailAction,
    EvaluateSuccessAction,
    AsignEvaluatedSuccessAction,
    AsignEvaluatedAction,
    DeleteDeliveryPointAction,
    DeleteDeliveryPointSuccessAction,
    DeleteDeliveryPointFailAction,
    UpdateMaxDelayFailAction,
    UpdateMaxDelayTimeAction,
    UpdateMaxDelayTimeSuccessAction,
    UpdateLeadTimeAction,
    UpdateLeadTimeSuccessAction,
    UpdateLeadTimeFailAction,
    AddDeliveryPointAction,
    AddDeliveryPointSuccessAction,
    AddDeliveryPointFailAction,
    MoveUnassignedPointAction,
    MoveUnassignedPointSuccessAction,
    MoveUnassignedPointFailAction,
    AddDeliveryEvaluatedPointAction,
    AddDeliveryEvaluatedPointSuccessAction,
    AddDeliveryEvaluatedPointFailAction,
    MoveMultipleDeliveryPointAction,
    MoveMultipleDeliveryPointSuccessAction,
    MoveMultipleDeliveryPointFailAction,
    MoveMultipleDeliveryPointOptimizeAction,
    MoveMultipleDeliveryPointOptimizeSuccessAction,
    MoveMultipleDeliveryPointOptimizeFailAction, AddRoutePlanningDeliveryZone, AddRoutePlanningDeliveryZoneSuccess, AddRoutePlanningDeliveryZoneFail, MovePointFromMap, MovePointFromMapFail, MovePointFromMapSuccess, RouteMovePointFromMap, RouteMovePointFromMapSuccess, RouteMovePointFromMapFail, CreateRouteWithZonesAction, CreateRouteWithZonesFailAction, getDeliveryPointPendingCount, getDeliveryPointPendingCountSuccess, getDeliveryPointPendingCountFail, ToggleUserSkillsAction, ToggleUserSkillsSuccessAction, ToggleUserSkillsFailAction, AddPickUpEvaluatedPointAction, AddPickUpEvaluatedPointFailAction, AddPickUpPointAction, AddPickUpPointSuccessAction, AddPickUpPointFailAction, DeletePointUnassignedAction, DeletePointUnassignedSuccessAction, DeletePointUnassignedFailAction, changeVehicleScheduleSpecificationAction, changeVehicleScheduleSpecificationSuccessAction, changeVehicleScheduleSpecificationFailAction, ChangeDriverVehicleRouteAction, ChangeDriverVehicleRouteSuccessAction, ChangeDriverVehicleRouteFailAction, joinPointsAgglomerationAction, joinPointsAgglomerationSuccessAction, joinPointsAgglomerationFailAction, changeVehicleSchedulesHoursAction, changeVehicleSchedulesHoursSuccessAction, changeVehicleSchedulesHoursFailAction, deleteZoneRouteAction, deleteZoneRouteSuccessAction, deleteZoneRouteFailAction, AddCrossDockingAction, AddCrossDockingSuccessAction, AddCrossDockingFailAction, ChangeDriverVehicleAction, ChangeDriverVehicleSuccessAction, ChangeDriverVehicleFailAction, AddFeetAction, AddFeetSuccessAction, AddFeetFailAction, ChangeFeeRouteAction, ChangeFeeRouteSuccessAction, ChangeFeeRouteFailAction, EvaluateFailAction,
    loadSessionIntoPlanningRouteAction,
    loadSessionIntoPlanningRouteSuccessAction,
    loadSessionIntoPlanningRouteFailAction,
    UpdateVehicleFromZoneAction,
    UpdateVehicleFromZoneSuccessAction,
    UpdateVehicleFromZoneFailAction
} from './route-planning.actions';
import { RoutePlanningFacade } from './route-planning.facade';
import { RoutePlanningState } from './route-planning.state';
import { ToastService } from '../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Injectable()
export class RoutePlanningEffects {
    // Importing
    @Effect()
    importSession$ = this.actions$
        .pipe(ofType<ImportPlanSessionAction>(RoutePlanningActionTypes.IMPORT_VRP_PLAN_SESSION))
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.createRoutePlanningSession(payload).pipe(
                    map((result) => {
                        return new AddPlanSessionSuccessAction({ ...result })
                    }),
                    catchError((error) => of(new AddPlanSessionFailAction({ error }))),
                ),
            ),
        );

    @Effect({ dispatch: false })
    importSessionFail$ = this.actions$
        .pipe(ofType<AddPlanSessionFailAction>(
            RoutePlanningActionTypes.VRP_PLAN_SESSION_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );

    // Optimization
    @Effect({ dispatch: false })
    optimize$ = this.actions$
        .pipe(ofType<OptimizeAction>(RoutePlanningActionTypes.OPTIMIZE))
        .pipe(
            map((action) => action.payload),
            concatMap((idList) =>
                this.service.optimize(idList).pipe(
                    tap((result) => this.wsService.compute(result)),
                    catchError((error) =>
                        of(new OptimizeFailAction({ error, zoneIds: idList })),
                    ),
                ),
            ),
    );

    // Optimization
    @Effect({ dispatch: false })
    updateVehicle$ = this.actions$
        .pipe(ofType<UpdateVehicleFromZoneAction>(RoutePlanningActionTypes.UPDATE_VEHICLE_FROM_ZONE))
        .pipe(
            map((action) => action.payload),
            concatMap((action) =>
                this.service.updateVehicleFromZone(action.zoneId, action.vehicleId, action.results).pipe(
                    map((result) => {
                        return new UpdateVehicleFromZoneSuccessAction({ vehicleId: action.vehicleId, results: action.results, zoneId: action.zoneId });
                    }),
                    catchError((error) =>
                        of(new UpdateVehicleFromZoneFailAction(error)),
                    ),
                ),
            ),
    );

    @Effect({ dispatch: false })
    updateVehicleFail$ = this.actions$
        .pipe(ofType<UpdateVehicleFromZoneFailAction>(RoutePlanningActionTypes.UPDATE_VEHICLE_FROM_ZONE_FAIL))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );


    /*  @Effect({ dispatch: false })
     asign$ = this.actions$
         .pipe(ofType<AsignAction>(RoutePlanningActionTypes.ASIGN))
         .pipe(
             map((action) => action.payload),
             concatMap((payload) =>
                 this.service.asign(payload.routes, payload.dateAsign)
                     .pipe(
                         map(
                             (result) => {

                                 new AsignSuccessAction(payload),
                                     this.toastService.displayWebsiteRelatedToast(this.translate.instant('CONTROL_PANEL.ASSIGNMENT_COMPLETED'),this.translate.instant('GENERAL.ACCEPT'));
                             }
                         ),
                         catchError((error) =>
                             of(new AsignFailAction({ error })),
                         ),
                     ),
             ),
         );
  */
    @Effect()
    asign$ = this.actions$
        .pipe(ofType<AsignAction>(
            RoutePlanningActionTypes.ASIGN,
        ))
        .pipe(
            map((action: AsignAction) => action.payload),
            concatMap((payload) =>
                !payload.isError
                    ? this.service.asign(payload.routes, payload.dateAsign)
                        .pipe(
                            switchMap((result) =>
                                [
                                    new AsignSuccessAction(payload),
                                    new getDeliveryPointPendingCount()
                                ].filter((actionToExecute) => actionToExecute !== null)

                            ),
                            catchError((error) =>
                                of(
                                    new AsignFailAction({
                                        error,
                                    }),
                                ),
                            ),
                        )
                    : of({ type: 'NO_ACTION' }),
            ),
        );

    /* @Effect({ dispatch: false })
    asign_evaluateds$ = this.actions$
        .pipe(ofType<AsignEvaluatedAction>(RoutePlanningActionTypes.ASIGN_EVALUATED))
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.asign_evaluateds(payload.zoneIds, payload.dateAsign)
                    .pipe(
                        map(
                            (result) => {
                                new AsignEvaluatedSuccessAction(payload),
                                    this.toastService.displayWebsiteRelatedToast(this.translate.instant('CONTROL_PANEL.ASSIGNMENT_COMPLETED'), this.translate.instant('GENERAL.ACCEPT'));
                            }
                        ),
                        catchError((error) =>
                            of(new AsignFailAction({ error })),
                        ),
                    ),
            ),
        ); */


    @Effect()
    asign_evaluateds$ = this.actions$
        .pipe(ofType<AsignEvaluatedAction>(
            RoutePlanningActionTypes.ASIGN_EVALUATED,
        ))
        .pipe(
            map((action: AsignEvaluatedAction) => action.payload),
            concatMap((payload) =>
                !payload.isError
                    ? this.service.asign_evaluateds(payload.zoneIds, payload.dateAsign)
                        .pipe(
                            switchMap((result) =>
                                [
                                    new AsignEvaluatedSuccessAction(payload),
                                    new getDeliveryPointPendingCount()
                                ].filter((actionToExecute) => actionToExecute !== null)

                            ),
                            catchError((error) =>
                                of(
                                    new AsignFailAction({
                                        error,
                                    }),
                                ),
                            ),
                        )
                    : of({ type: 'NO_ACTION' }),
            ),
        );

    // Recomputation
    @Effect({ dispatch: false })
    recompute$ = this.actions$
        .pipe(ofType<RecomputeAction>(RoutePlanningActionTypes.RECOMPUTE))
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.recompute(payload).pipe(
                    tap((result: any) => this.wsService.recompute(result)),
                    catchError((error) =>
                        of(
                            new RecomputeFailAction({
                                error: 'Se ha producido un error con el servidor',
                                routes: payload,
                            }),
                        ),
                    ),
                ),
            ),
        );

    // Evaluation
    @Effect()
    evaluate$ = this.actions$
        .pipe(ofType<EvaluateAction>(RoutePlanningActionTypes.EVALUATE))
        .pipe(
            map((action) => action.payload),
            concatMap((payload) => this.service.evaluate(payload)
                .pipe(
                    map(
                        (result) => new EvaluateSuccessAction(result)
                    ),
                    catchError((error) =>
                        of(new EvaluateFailAction({ error }))
                    )
                )
            )
        );

    // Update Route Planning Delivery Point delivery window
    @Effect()
    updateRoutePlanningDeliveryPointTimeWindow$ = this.actions$
        .pipe(ofType<UpdateDeliveryPointTimeWindowAction>(
            RoutePlanningActionTypes.UPDATE_DELIVERY_POINT_TIME_WINDOW,
        ))
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service
                    .updateDeliveryPointDeliveryWindow(payload.deliveryPointId, {
                        deliveryWindow: payload.deliveryWindow,
                        leadTime: payload.leadTime,
                        allowedDelayTime: payload.allowedDelayTime,
                        coordinates: payload.coordinates,
                        address: payload.address,
                        serviceTime: payload.serviceTime,
                        deliveryType: payload.deliveryType,
                        orderNumber: payload.orderNumber,
                        companyPreferenceDelayTimeId: payload.companyPreferenceDelayTimeId,
                        allowDelayTime: payload.allowDelayTime
                    })
                    .pipe(
                        map(
                            (result) =>
                                new UpdateDeliveryPointTimeWindowSuccessAction(payload),
                        ),
                        catchError((error) =>
                            of(new UpdateDeliveryPointTimeWindowFailAction({ error })),
                        ),
                    ),
            ),
        );
    @Effect()
    updateRoutePlanningRouteDeliveryPointTimeWindow$ = this.actions$
        .pipe(ofType<UpdateRouteDeliveryPointTimeWindowAction>(
            RoutePlanningActionTypes.UPDATE_ROUTE_DELIVERY_POINT_TIME_WINDOW,
        ))
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service
                    .updateRouteDeliveryPointDeliveryWindow(payload.deliveryPointId, {
                        deliveryWindow: payload.deliveryWindow,
                        leadTime: payload.leadTime,
                        deliveryType: payload.deliveryType,
                        orderNumber: payload.orderNumber,
                        companyPreferenceDelayTimeId: payload.companyPreferenceDelayTimeId,
                        allowDelayTime: payload.allowDelayTime

                    })
                    .pipe(
                        map(
                            (result) =>
                                new UpdateRouteDeliveryPointTimeWindowSuccessAction(
                                    payload,
                                ),
                        ),
                        catchError((error) =>
                            of(new UpdateRouteDeliveryPointTimeWindowFailAction({ error })),
                        ),
                    ),
            ),
        );

    @Effect()
    joinZones$ = this.actions$
        .pipe(ofType<JoinZonesAction>(
            RoutePlanningActionTypes.JOIN_ZONES,
        ))
        .pipe(
            withLatestFrom(this.routePlanningFacade.allZonesStatus$),
            map(([action, zonesStatus]) => {
                let settings = action.payload.settings;
                let vehicles = action.payload.vehicles;
                let deliveryZones: number[] = [];
                if (action.payload.zones) {
                    for (let zoneId in action.payload.zones) {
                        deliveryZones.push(+action.payload.zones[zoneId])
                    }
                } else {

                    for (let zoneId in zonesStatus) {
                        if (zonesStatus[zoneId].selected) deliveryZones.push(+zoneId);
                    }
                }

                let vehicleArray = [];
                if (action.payload.vehicles) {
                    vehicleArray = action.payload.vehicles.map(x => +x.id);
                } else {
                    vehicleArray = [];
                }
                return { deliveryZones, settings, vehicles, vehicleArray, isError: action.payload.isError, Optimize: action.payload.optimize, Evaluate: action.payload.evaluate };
            }),
            concatMap((zonesToJoin) =>
                !zonesToJoin.isError
                    ? this.service.joinZones(zonesToJoin.deliveryZones, zonesToJoin.vehicleArray, zonesToJoin.settings)
                        .pipe(
                            switchMap((result) =>
                                [
                                    new JoinZonesSuccessAction({ zonesToJoin: zonesToJoin.deliveryZones, newZone: result, vehicles: zonesToJoin.vehicles }),
                                    zonesToJoin.Optimize ? new OptimizeAction([result.id]) : null,
                                    zonesToJoin.Evaluate && result && result.deliveryZones && result.deliveryZones.find(x => x.vehicles && x.vehicles.length > 0) ? new EvaluateAction([result.id]) : null
                                ].filter((actionToExecute) => actionToExecute !== null)

                            ),
                            catchError((error) =>
                                of(
                                    new AsignFailAction({
                                        error,
                                    }),
                                ),
                            ),
                        )
                    : of({ type: 'NO_ACTION' }),
            ),
        );

    @Effect({ dispatch: false })
    joinZonesFail$ = this.actions$
        .pipe(ofType<JoinZonesFailAction>(RoutePlanningActionTypes.JOIN_ZONES_FAIL))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );

    @Effect({ dispatch: false })
    evaluationFail$ = this.actions$
        .pipe(ofType<EvaluateFailAction>(RoutePlanningActionTypes.EVALUATE_FAIL))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.status, x.payload.error.error.error);
            }),
        );


    @Effect()


    // Split Zones
    @Effect()
    splitZones$ = this.actions$
        .pipe(ofType<SplitZonesAction>(RoutePlanningActionTypes.SPLIT_ZONES))
        .pipe(
            concatMap((action) =>
                this.service.splitZones(action.payload.zoneId, action.payload.zonesToSplit)
                    .pipe(
                        switchMap((result) =>
                            [
                                new SplitZonesSuccessAction({
                                    zoneId: action.payload.zoneId,
                                    zonesToSplit: action.payload.zonesToSplit,
                                    newZones: result,
                                }),
                                action.payload.evaluate && result && result && result.filter(x => x.vehicles && x.vehicles.length > 0).length > 0 ? new EvaluateAction(
                                    result.filter(x => x.vehicles && x.vehicles.length > 0).map(x => x.id)
                                ) : null
                            ].filter((actionToExecute) => actionToExecute !== null)

                        ),
                        catchError((error) =>
                            of(
                                new SplitZonesFailAction({
                                    error,
                                }),
                            ),
                        ),
                    )


                /*.pipe(
                    /* map(
                        (result) =>
                            new SplitZonesSuccessAction({
                                zoneId: payload.zoneId,
                                zonesToSplit: payload.zonesToSplit,
                                newZones: result,
                            }),
                    ),
                    catchError((error) => of(new SplitZonesFailAction({ error }))),



                    ),*/
            ),
        );
    @Effect({ dispatch: false })
    splitZonesFail$ = this.actions$
        .pipe(ofType<SplitZonesFailAction>(RoutePlanningActionTypes.SPLIT_ZONES_FAIL))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    // Update Zone Name
    @Effect()
    updateZoneName$ = this.actions$
        .pipe(ofType<UpdateZoneNameAction>(RoutePlanningActionTypes.UPDATE_ZONE_NAME))
        .pipe(
            map((action: UpdateZoneNameAction) => action.payload),
            concatMap((payload) =>
                this.service.updateZoneName(payload.zoneId, payload.name).pipe(
                    map((result) => new UpdateZoneNameSuccessAction(payload)),
                    catchError((error) => of(new UpdateZoneNameFailAction({ error }))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateZoneNameFail$ = this.actions$
        .pipe(ofType<UpdateZoneNameFailAction>(RoutePlanningActionTypes.UPDATE_ZONE_NAME_FAIL))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    // Update Zone Color
    @Effect()
    updateZoneColor$ = this.actions$
        .pipe(ofType<UpdateZoneColorAction>(RoutePlanningActionTypes.UPDATE_ZONE_COLOR))
        .pipe(
            map((action: UpdateZoneColorAction) => action.payload),
            concatMap((payload) =>
                this.service.updateZoneColor(payload.zoneId, payload.color).pipe(
                    map((result) => new UpdateZoneColorSuccessAction(payload)),
                    catchError((error) => of(new UpdateZoneColorFailAction({ error }))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateZoneColorFail$ = this.actions$
        .pipe(ofType<UpdateZoneColorFailAction>(RoutePlanningActionTypes.UPDATE_ZONE_COLOR_FAIL))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    // Move delivery point
    @Effect()
    moveDeliveryPointZone$ = this.actions$
        .pipe(ofType<MoveDeliveryPointZoneAction>(
            RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ZONE,
        ))
        .pipe(
            map((action: MoveDeliveryPointZoneAction) => action.payload),
            concatMap((payload) =>
                !payload.isError
                    ? this.service
                        .moveDeliveryPointZone(
                            payload.newZoneId,
                            payload.deliveryPointId,
                            payload.newOrder
                        )
                        .pipe(
                            switchMap((result) =>
                                [
                                    new MoveDeliveryPointZoneSuccessAction({
                                        ...payload,
                                        deliveryZones: result
                                    }),
                                    payload.isEvaluated ? new EvaluateAction([payload.newZoneId, payload.oldZoneId]) : null
                                ].filter((actionToExecute) => actionToExecute !== null)

                            ),
                            catchError((error) =>
                                of(
                                    new MoveDeliveryPointZoneFailAction({
                                        error,
                                        originalPayload: payload,
                                    }),
                                ),
                            ),
                        )
                    : of({ type: 'NO_ACTION' }),
            ),
        );
    @Effect({ dispatch: false })
    moveDeliveryPointZoneFail$ = this.actions$
        .pipe(ofType<MoveDeliveryPointZoneFailAction>(
            RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ZONE_FAIL,
        ))
        .pipe(
            map((action: MoveDeliveryPointZoneFailAction) => action.payload),
            map((payload) => {
                this.toastService.displayHTTPErrorToast(Number(payload.error.status));
                /* this.routePlanningFacade.deliveryPointZoneMovement(
                    payload.originalPayload.deliveryPointId,
                    payload.originalPayload.newZoneId,
                    payload.originalPayload.oldZoneId,
                    payload.originalPayload.newOrder,
                    payload.originalPayload.oldOrder,
                    true,
                ); */
            }),
        );

    @Effect()
    moveDeliveryPointRoute$ = this.actions$
        .pipe(ofType<MoveDeliveryPointRouteAction>(
            RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ROUTE,
        ))
        .pipe(
            map((action: MoveDeliveryPointRouteAction) => action.payload),
            withLatestFrom(this.facade.allZones$),
            map(([payload, zones]) => {
                const identifier = zones[payload.newZoneId].optimization.solution.routes
                    .find((route) => route.id === payload.newRouteId)
                    .deliveryPoints.find((dp) => dp.id === payload.deliveryPointId)
                    .identifier;
                const deliveryPoint = zones[payload.oldZoneId].deliveryPoints.find(
                    (dp) => dp.identifier === identifier,
                );
                return {
                    ...payload,
                    zoneDeliveryPointId: deliveryPoint ? deliveryPoint.id : null,
                    orderInZone: deliveryPoint ? deliveryPoint.order : null,
                };
            }),
            concatMap((payload) =>
                !payload.isError
                    ? this.service
                        .moveDeliveryPointRoute(
                            payload.newRouteId,
                            payload.deliveryPointId,
                            payload.newOrder,
                        )
                        .pipe(
                            switchMap((result) =>
                                [
                                    new UpdateOptimizeFromIndexAction({
                                        zoneId: payload.newZoneId,
                                        routeId: payload.newRouteId,
                                        value: payload.newOrder + 1,
                                    }),
                                    payload.newRouteId !== payload.oldRouteId
                                        ? new UpdateOptimizeFromIndexAction({
                                            zoneId: payload.oldZoneId,
                                            routeId: payload.oldRouteId,
                                            value: payload.oldOrder + 1,
                                        })
                                        : null,
                                    new MoveDeliveryPointRouteSuccessAction({
                                        ...payload,
                                        newRoutes: result.routes,
                                    }),
                                    payload.orderInZone &&
                                        payload.oldZoneId !== payload.newZoneId
                                        ? new MoveDeliveryPointZoneAction({
                                            deliveryPointId:
                                                payload.zoneDeliveryPointId,
                                            isError: false,
                                            oldOrder: payload.orderInZone,
                                            oldZoneId: payload.oldZoneId,
                                            newOrder: 1,
                                            newZoneId: payload.newZoneId,
                                            isEvaluated: payload.isEvaluated

                                        })
                                        : null,
                                ].filter((actionToExecute) => actionToExecute !== null),
                            ),
                            catchError((error) =>
                                of(
                                    new MoveDeliveryPointRouteFailAction({
                                        error,
                                        originalPayload: payload,
                                    }),
                                ),
                            ),
                        )
                    : of({ type: 'NO_ACTION' }),
            ),
        );
    @Effect({ dispatch: false })
    moveDeliveryPointRouteFail$ = this.actions$
        .pipe(ofType<MoveDeliveryPointRouteFailAction>(
            RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ROUTE_FAIL,
        ))
        .pipe(
            map((action: MoveDeliveryPointRouteFailAction) => action.payload),
            tap((payload) => {
                this.toastService.displayHTTPErrorToast(Number(payload.error.status));
                /* this.routePlanningFacade.deliveryPointRouteMovement(
                    payload.originalPayload.deliveryPointId,
                    payload.originalPayload.newZoneId,
                    payload.originalPayload.oldZoneId,
                    payload.originalPayload.newRouteId,
                    payload.originalPayload.oldRouteId,
                    payload.originalPayload.newOrder,
                    payload.originalPayload.oldOrder,
                    true,
                ); */
            }),
        );

    @Effect()
    updateOptimizationParameters$ = this.actions$
        .pipe(ofType<UpdateOptimizationParametersAction>(
            RoutePlanningActionTypes.UPDATE_OPTIMIZATION_PARAMETERS,
        ))
        .pipe(
            map((action: UpdateOptimizationParametersAction) => action.payload),
            concatMap((payload) =>
                this.service
                    .updateOptimizationParameters(
                        payload.zoneId,
                        payload.optimizationParameters,
                    )
                    .pipe(
                        map(
                            (result) =>
                                new UpdateOptimizationParametersSuccessAction({
                                    zoneId: payload.zoneId,
                                    optimizationParameters: payload.optimizationParameters,
                                }),
                        ),
                        catchError((error) =>
                            of(
                                new UpdateOptimizationParametersFailAction({
                                    error,
                                }),
                            ),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    updateOptimizationParametersFail$ = this.actions$
        .pipe(ofType<UpdateOptimizationParametersFailAction>(
            RoutePlanningActionTypes.UPDATE_OPTIMIZATION_PARAMETERS_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    updateExplorationLevel$ = this.actions$
        .pipe(ofType<UpdateExplorationLevelAction>(
            RoutePlanningActionTypes.UPDATE_EXPLORATION_LEVEL,
        ))
        .pipe(
            map((action: UpdateExplorationLevelAction) => action.payload),
            concatMap((payload) =>
                this.service.updateExplorationLevel(payload.zoneId, payload.value).pipe(
                    map((result) => new UpdateExplorationLevelSuccessAction(payload)),
                    catchError((error) =>
                        of(new UpdateExplorationLevelFailAction({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateExplorationLevelFail$ = this.actions$
        .pipe(ofType<UpdateExplorationLevelFailAction>(
            RoutePlanningActionTypes.UPDATE_EXPLORATION_LEVEL_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    // Vehicle effects
    @Effect()
    addVehiclesToZone$ = this.actions$
        .pipe(ofType<AddVehicleToZoneAction>(RoutePlanningActionTypes.ADD_VEHICLES_TO_ZONE))
        .pipe(
            map((action: AddVehicleToZoneAction) => action.payload),
            concatMap((payload) =>
                this.service
                    .addVehiclesToZone(payload.zoneId, payload.vehicles.map((v) => v.id))
                    .pipe(
                        switchMap((result) =>
                            [
                                new AddVehicleToZoneSuccessAction(payload),
                                new EvaluateAction([payload.zoneId])
                            ].filter((actionToExecute) => actionToExecute !== null)

                        ),
                        catchError((error) =>
                            of(new AddVehicleToZoneFailAction({ error })),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    addVehiclesToZoneFail$ = this.actions$
        .pipe(ofType<AddVehicleToZoneFailAction>(
            RoutePlanningActionTypes.ADD_VEHICLES_TO_ZONE_FAIL,
        ))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.error.status, x.payload.error.error.error);
            }),
        );

    @Effect()
    removeVehiclesFromZone$ = this.actions$
        .pipe(ofType<RemoveVehicleFromZoneAction>(
            RoutePlanningActionTypes.REMOVE_VEHICLE_FROM_ZONE,
        ))
        .pipe(
            map((action: RemoveVehicleFromZoneAction) => action.payload),
            concatMap((payload) =>
                this.service.removeVehicleFromZone(payload.zoneId, payload.vehicleId).pipe(
                    map((result) => new RemoveVehicleFromZoneSuccessAction(payload)),
                    catchError((error) =>
                        of(
                            new RemoveVehicleFromZoneFailAction({
                                error,
                                originalPayload: payload,
                            }),
                        ),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    removeVehiclesFromZoneFail$ = this.actions$
        .pipe(ofType<RemoveVehicleFromZoneFailAction>(
            RoutePlanningActionTypes.REMOVE_VEHICLE_FROM_ZONE_FAIL,
        ))
        .pipe(
            map((x) => {
                // this.routePlanningFacade.useVehicle(x.payload.originalPayload.zoneId, [
                //     x.payload.originalPayload.vehicleId,
                // ]);
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    toggleForceDepartureTime$ = this.actions$
        .pipe(ofType<ToggleForceDepartureTimeAction>(
            RoutePlanningActionTypes.TOGGLE_FORCE_DEPARTURE_TIME,
        ))
        .pipe(
            map((action: ToggleForceDepartureTimeAction) => action.payload),
            concatMap((action) =>
                this.service.toggleForceDepartureTime(action.zoneId, action.value).pipe(
                    map(
                        (result) =>
                            new ToggleForceDepartureTimeSuccessAction({
                                zoneId: action.zoneId,
                            }),
                    ),
                    catchError((error) =>
                        of(new ToggleForceDepartureTimeFailAction({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    toggleForceDepartureTimeFail$ = this.actions$
        .pipe(ofType<ToggleForceDepartureTimeFailAction>(
            RoutePlanningActionTypes.TOGGLE_FORCE_DEPARTURE_TIME_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    updateDeliverySchedule$ = this.actions$
        .pipe(ofType<UpdateDeliveryScheduleAction>(
            RoutePlanningActionTypes.UPDATE_DELIVERY_SCHEDULE,
        ))
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service
                    .updateDeliverySchedule(payload.zoneId, payload.deliverySchedule)
                    .pipe(
                        map((result) => new UpdateDeliveryScheduleSuccessAction(payload)),
                        catchError((error) =>
                            of(new UpdateDeliveryScheduleFailAction({ error })),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    updateDeliveryScheduleFail$ = this.actions$
        .pipe(ofType<UpdateDeliveryScheduleFailAction>(
            RoutePlanningActionTypes.UPDATE_DELIVERY_SCHEDULE_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    toggleIgnoreCapacityLimit$ = this.actions$
        .pipe(ofType<ToggleIgnoreCapacityLimitAction>(
            RoutePlanningActionTypes.TOGGLE_IGNORE_CAPACITY_LIMIT,
        ))
        .pipe(
            map((action: ToggleIgnoreCapacityLimitAction) => action.payload),
            concatMap((action) =>
                this.service.toggleIgnoreCapacityLimit(action.zoneId, action.value).pipe(
                    map(
                        (result) =>
                            new ToggleIgnoreCapacityLimitSuccessAction({
                                zoneId: action.zoneId,
                            }),
                    ),
                    catchError((error) =>
                        of(new ToggleIgnoreCapacityLimitFailAction({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    toggleIgnoreCapacityLimitFail$ = this.actions$
        .pipe(ofType<ToggleIgnoreCapacityLimitFailAction>(
            RoutePlanningActionTypes.TOGGLE_IGNORE_CAPACITY_LIMIT_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );


    @Effect()
    toggleUserSkill$ = this.actions$
        .pipe(ofType<ToggleUserSkillsAction>(
            RoutePlanningActionTypes.TOGGLE_USER_SKILLS,
        ))
        .pipe(
            map((action: ToggleUserSkillsAction) => action.payload),
            concatMap((action) =>
                this.service.toggleUserSkills(action.zoneId, action.value).pipe(
                    map(
                        (result) => {
                            return new ToggleUserSkillsSuccessAction({
                                zoneId: action.zoneId,
                            });
                        }

                    ),
                    catchError((error) =>
                        of(new ToggleUserSkillsFailAction({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    toggleUserSkillFail$ = this.actions$
        .pipe(ofType<ToggleUserSkillsFailAction>(
            RoutePlanningActionTypes.TOGGLE_USER_SKILLS_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    toggleUseAllVehicles$ = this.actions$
        .pipe(ofType<ToggleUseAllVehiclesAction>(
            RoutePlanningActionTypes.TOGGLE_USE_ALL_VEHICLES,
        ))
        .pipe(
            map((action: ToggleUseAllVehiclesAction) => action.payload),
            concatMap((payload) =>
                this.service.toggleUseAllVehicles(payload.zoneId, payload.value).pipe(
                    map(
                        (result) =>
                            new ToggleUseAllVehiclesSuccessAction({
                                zoneId: payload.zoneId,
                            }),
                    ),
                    catchError((error) =>
                        of(new ToggleUseAllVehiclesFailAction({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    toggleUseAllVehiclesFail$ = this.actions$
        .pipe(ofType<ToggleUseAllVehiclesFailAction>(
            RoutePlanningActionTypes.TOGGLE_USE_ALL_VEHICLES_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    changePriority$ = this.actions$
        .pipe(ofType<PriorityChangeAction>(RoutePlanningActionTypes.PRIORITY_CHANGE))
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service
                    .changeDeliveryPointPriority(payload.deliveryPointId, payload.value)
                    .pipe(
                        map((result) => new PriorityChangeSuccessAction(payload)),
                        catchError((error) => of(new PriorityChangeFailAction({ error }))),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    changePriorityFail$ = this.actions$
        .pipe(ofType<PriorityChangeFailAction>(RoutePlanningActionTypes.PRIORITY_CHANGE_FAIL))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    // Route Settings
    @Effect()
    toggleRouteForceDepartureTime$ = this.actions$
        .pipe(ofType<ToggleRouteForceDepartureTimeAction>(
            RoutePlanningActionTypes.TOGGLE_ROUTE_FORCE_DEPARTURE_TIME,
        ))
        .pipe(
            map((action: ToggleRouteForceDepartureTimeAction) => action.payload),
            concatMap((payload) =>
                this.service
                    .toggleRouteForceDepartureTime(payload.routeId, payload.value)
                    .pipe(
                        map(
                            (result) =>
                                new ToggleRouteForceDepartureTimeSuccessAction({
                                    zoneId: payload.zoneId,
                                    routeId: payload.routeId,
                                }),
                        ),
                        catchError((error) =>
                            of(new ToggleRouteForceDepartureTimeFailAction({ error })),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    toggleRouteForceDepartureTimeFail$ = this.actions$
        .pipe(ofType<ToggleRouteForceDepartureTimeFailAction>(
            RoutePlanningActionTypes.TOGGLE_ROUTE_FORCE_DEPARTURE_TIME_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    updateRouteDeliverySchedule$ = this.actions$
        .pipe(ofType<UpdateRouteDeliveryScheduleAction>(
            RoutePlanningActionTypes.UPDATE_ROUTE_DELIVERY_SCHEDULE,
        ))
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service
                    .updateRouteDeliverySchedule(payload.routeId, payload.deliverySchedule)
                    .pipe(
                        map(
                            (result) =>
                                new UpdateRouteDeliveryScheduleSuccessAction(payload),
                        ),
                        catchError((error) =>
                            of(new UpdateRouteDeliveryScheduleFailAction({ error })),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    updateRouteDeliveryScheduleFail$ = this.actions$
        .pipe(ofType<UpdateRouteDeliveryScheduleFailAction>(
            RoutePlanningActionTypes.UPDATE_ROUTE_DELIVERY_SCHEDULE_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    updateRouteOptimizationParameters$ = this.actions$
        .pipe(ofType<UpdateRouteOptimizationParametersAction>(
            RoutePlanningActionTypes.UPDATE_ROUTE_OPTIMIZATION_PARAMETERS,
        ))
        .pipe(
            map((action: UpdateRouteOptimizationParametersAction) => action.payload),
            concatMap((payload) =>
                this.service
                    .updateRouteOptimizationParameters(
                        payload.routeId,
                        payload.optimizationParameters,
                    )
                    .pipe(
                        map(
                            (result) =>
                                new UpdateRouteOptimizationParametersSuccessAction(payload),
                        ),
                        catchError((error) =>
                            of(
                                new UpdateRouteOptimizationParametersFailAction({
                                    error,
                                }),
                            ),
                        ),
                    ),
            ),
        );
    @Effect({ dispatch: false })
    updateRouteOptimizationParametersFail$ = this.actions$
        .pipe(ofType<UpdateRouteOptimizationParametersFailAction>(
            RoutePlanningActionTypes.UPDATE_ROUTE_OPTIMIZATION_PARAMETERS_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    updateRouteExplorationLevel$ = this.actions$
        .pipe(ofType<UpdateRouteExplorationLevelAction>(
            RoutePlanningActionTypes.UPDATE_ROUTE_EXPLORATION_LEVEL,
        ))
        .pipe(
            map((action: UpdateRouteExplorationLevelAction) => action.payload),
            concatMap((payload) =>
                this.service
                    .updateRouteExplorationLevel(payload.routeId, payload.value)
                    .pipe(
                        map(
                            (result) =>
                                new UpdateRouteExplorationLevelSuccessAction(payload),
                        ),
                        catchError((error) =>
                            of(new UpdateRouteExplorationLevelFailAction({ error })),
                        ),
                    ),
            ),
        );

    @Effect({ dispatch: false })
    updateRouteExplorationLevelFail$ = this.actions$
        .pipe(ofType<UpdateRouteExplorationLevelFailAction>(
            RoutePlanningActionTypes.UPDATE_ROUTE_EXPLORATION_LEVEL_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    updateMaxDelayTime$ = this.actions$
        .pipe(ofType<UpdateMaxDelayTimeAction>(
            RoutePlanningActionTypes.UPDATE_MAX_DELAY_TIME,
        ))
        .pipe(
            map((action: UpdateMaxDelayTimeAction) => action.payload),
            concatMap((payload) =>
                this.service
                    .updateMaxDelayTime(payload.zoneId, payload.value)
                    .pipe(
                        map(
                            (result) =>
                                new UpdateMaxDelayTimeSuccessAction(payload),
                        ),
                        catchError((error) =>
                            of(new UpdateMaxDelayFailAction({ error })),
                        ),
                    ),
            ),
        );

    @Effect({ dispatch: false })
    updateMaxDelayTimeFailAction$ = this.actions$
        .pipe(ofType<UpdateMaxDelayFailAction>(
            RoutePlanningActionTypes.UPDATE_MAX_DELAY_TIME_FAIL,
        ))


    @Effect()
    updateLeadTime$ = this.actions$
        .pipe(ofType<UpdateLeadTimeAction>(
            RoutePlanningActionTypes.UPDATE_LEAD_TIME,
        ))
        .pipe(
            map((action: UpdateLeadTimeAction) => action.payload),
            concatMap((payload) =>
                this.service
                    .updateLeadTime(payload.zoneId, payload.deliveryPointId, payload.value)
                    .pipe(
                        map(
                            (result) =>
                                new UpdateLeadTimeSuccessAction(payload),
                        ),
                        catchError((error) =>
                            of(new UpdateLeadTimeFailAction({ error })),
                        ),
                    ),
            ),
        );

    @Effect({ dispatch: false })
    updateLeadTimeFailAction$ = this.actions$
        .pipe(ofType<UpdateLeadTimeFailAction>(
            RoutePlanningActionTypes.UPDATE_LEAD_TIME_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    updateDelayTime$ = this.actions$
        .pipe(ofType<UpdateLeadTimeAction>(
            RoutePlanningActionTypes.UPDATE_ALLOWED_DELAY_TIME,
        ))
        .pipe(
            map((action: UpdateLeadTimeAction) => action.payload),
            concatMap((payload) =>
                this.service
                    .updateDelayTime(payload.zoneId, payload.deliveryPointId, payload.value)
                    .pipe(
                        map(
                            (result) =>
                                new UpdateLeadTimeSuccessAction(payload),
                        ),
                        catchError((error) =>
                            of(new UpdateLeadTimeFailAction({ error })),
                        ),
                    ),
            ),
        );

    @Effect({ dispatch: false })
    updateDelayTimeFailAction$ = this.actions$
        .pipe(ofType<UpdateLeadTimeFailAction>(
            RoutePlanningActionTypes.UPDATE_DELAY_TIME_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    updateOptimizeFromIndex$ = this.actions$
        .pipe(ofType<UpdateOptimizeFromIndexAction>(
            RoutePlanningActionTypes.UPDATE_OPTIMIZE_FROM_INDEX,
        ))
        .pipe(
            map((action: UpdateOptimizeFromIndexAction) => action.payload),
            concatMap((payload) =>
                this.service.updateOptimizeFromIndex(payload.routeId, payload.value).pipe(
                    map((result) => new UpdateOptimizeFromIndexSuccessAction(payload)),
                    catchError((error) =>
                        of(new UpdateOptimizeFromIndexFailAction({ error })),
                    ),
                ),
            ),
        );
    @Effect({ dispatch: false })
    updateOptimizeFromIndexFail$ = this.actions$
        .pipe(ofType<UpdateOptimizeFromIndexFailAction>(
            RoutePlanningActionTypes.UPDATE_OPTIMIZE_FROM_INDEX_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );
    @Effect()
    saveSession$ = this.actions$
        .pipe(ofType<SaveSessionAction>(RoutePlanningActionTypes.SAVE_SESSION))
        .pipe(
            map((action: SaveSessionAction) => action.payload),
            concatMap((payload) =>
                this.service.saveRoutePlanningSession(payload.sessionId, payload.data).pipe(
                    map((result) => new SaveSessionSuccessAction(payload)),
                    catchError((error) => of(new SaveSessionFailAction({ error })))
                )
            )
        );

    @Effect({ dispatch: false })
    saveSessionFail$ = this.actions$
        .pipe(ofType<SaveSessionFailAction>(
            RoutePlanningActionTypes.SAVE_SESSION_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );

    @Effect()
    deleteDeliveryPoint$ = this.actions$
        .pipe(ofType<DeleteDeliveryPointAction>(RoutePlanningActionTypes.DELETE_DELIVERY_POINT))
        .pipe(
            map((action: DeleteDeliveryPointAction) => action.payload),
            concatMap((payload) =>
                this.service.deleteDeliveryPoint(payload.deliveryPointId).pipe(
                    switchMap(() => [
                        new DeleteDeliveryPointSuccessAction(payload),
                        payload.evaluated ? new EvaluateAction([payload.zoneId]) : null
                    ].filter((actionToExecute) => actionToExecute !== null)),
                    catchError(error => of(new AddCrossDockingFailAction(error))),
                    catchError((error) => of(new DeleteDeliveryPointFailAction({ error })))
                )
            )
        );

    @Effect({ dispatch: false })
    deleteDeliveryPointFail$ = this.actions$
        .pipe(ofType<SaveSessionFailAction>(
            RoutePlanningActionTypes.DELETE_DELIVERY_POINT_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );


    @Effect()
    addDeliveryPoint$ = this.actions$
        .pipe(ofType<AddDeliveryPointAction>(RoutePlanningActionTypes.ADD_DELIVERY_POINT))
        .pipe(
            map((action: AddDeliveryPointAction) => action.payload),
            concatMap((payload) =>
                this.service.addDeliveryPointToDeliveryZoneId(payload).pipe(
                    map((result) => new AddDeliveryPointSuccessAction({
                        deliveryPoints: result.map((element) => {
                            let point: DeliveryPoint = {
                                ...element
                            }
                            return point;
                        }),
                        routePlanningDeliveryZoneId: payload.routePlanningDeliveryZoneId
                    },
                    )),
                    catchError((error) => of(new AddDeliveryPointFailAction({ error })))
                )
            )
        );

    @Effect({ dispatch: false })
    addDeliveryPointFail$ = this.actions$
        .pipe(ofType<AddDeliveryPointFailAction>(
            RoutePlanningActionTypes.ADD_DELIVERY_POINT_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );



    @Effect()
    addPickUp$ = this.actions$
        .pipe(ofType<AddPickUpPointAction>(RoutePlanningActionTypes.ADD_PICK_UP))
        .pipe(
            map((action: AddPickUpPointAction) => action.payload),
            concatMap((payload) =>
                this.service.addDeliveryPointToDeliveryZoneId(payload).pipe(
                    map((result) => new AddDeliveryPointSuccessAction({
                        deliveryPoints: result.map((element) => {
                            let point: DeliveryPoint = {
                                ...element
                            }
                            return point;
                        }),
                        routePlanningDeliveryZoneId: payload.routePlanningDeliveryZoneId
                    },
                    )),
                    catchError((error) => of(new AddPickUpPointFailAction({ error })))
                )
            )
        );

    @Effect({ dispatch: false })
    addPickUpFail$ = this.actions$
        .pipe(ofType<AddPickUpPointFailAction>(
            RoutePlanningActionTypes.ADD_PICK_UP_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );

    @Effect()
    addDeliveryPointEvaluated$ = this.actions$
        .pipe(ofType<AddDeliveryEvaluatedPointAction>(RoutePlanningActionTypes.ADD_DELIVERY_POINT_EVALUATED))
        .pipe(
            map((action: AddDeliveryEvaluatedPointAction) => action.payload),
            concatMap((payload) =>
                this.service.addDeliveryPointToDeliveryZoneId(payload).pipe(
                    map((result) => new AddDeliveryEvaluatedPointSuccessAction({
                        planningDeliveryZone: result.deliveryZones[0],
                        totalTime: result.totalTime,
                        totalTravelTime: result.totalTravelTime,
                        totalCustomerWaitTime: result.totalCustomerWaitTime,
                        totalVehicleWaitTime: result.totalVehicleWaitTime,
                        totalDelayTime: result.totalDelayTime,
                        totalTravelDistance: result.totalTravelDistance,
                        totalDeliveryPointsServicedLate: result.totalDeliveryPointsServicedLate,
                        avgCustomerWaitTime: result.avgCustomerWaitTime,
                        avgDelayTime: result.avgDelayTime
                    },
                    )),
                    catchError((error) => of(new AddDeliveryEvaluatedPointFailAction({ error })))
                )
            )
        );

    @Effect({ dispatch: false })
    addDeliveryPointEvaluatedFail$ = this.actions$
        .pipe(ofType<AddDeliveryEvaluatedPointFailAction>(
            RoutePlanningActionTypes.ADD_DELIVERY_POINT_EVALUATED_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );


    @Effect()
    addPickPointEvaluated$ = this.actions$
        .pipe(ofType<AddPickUpEvaluatedPointAction>(RoutePlanningActionTypes.ADD_PICK_UP_POINT_EVALUATED))
        .pipe(
            map((action: AddPickUpEvaluatedPointAction) => action.payload),
            concatMap((payload) =>
                this.service.addDeliveryPointToDeliveryZoneId(payload).pipe(
                    map((result) => new AddDeliveryEvaluatedPointSuccessAction({
                        planningDeliveryZone: result.deliveryZones[0],
                        totalTime: result.totalTime,
                        totalTravelTime: result.totalTravelTime,
                        totalCustomerWaitTime: result.totalCustomerWaitTime,
                        totalVehicleWaitTime: result.totalVehicleWaitTime,
                        totalDelayTime: result.totalDelayTime,
                        totalTravelDistance: result.totalTravelDistance,
                        totalDeliveryPointsServicedLate: result.totalDeliveryPointsServicedLate,
                        avgCustomerWaitTime: result.avgCustomerWaitTime,
                        avgDelayTime: result.avgDelayTime
                    },
                    )),
                    catchError((error) => of(new AddPickUpEvaluatedPointFailAction({ error })))
                )
            )
        );

    @Effect({ dispatch: false })
    addPickUpPointEvaluatedFail$ = this.actions$
        .pipe(ofType<AddPickUpEvaluatedPointFailAction>(
            RoutePlanningActionTypes.ADD_PICK_UP_POINT_EVALUATED_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );






    @Effect()
    addFee$ = this.actions$
        .pipe(ofType<AddFeetAction>(RoutePlanningActionTypes.ADD_FEET))
        .pipe(
            map((action: AddFeetAction) => action.payload),
            concatMap((payload) =>
                this.service.changeFee(payload.zoneId, payload.userFeeCostId, payload.vehicleId).pipe(
                    /* map((result) => new AddFeetSuccessAction(payload),
                        catchError((error) => of(new AddFeetFailAction({ error })))
                    ) */

                    switchMap((result) =>
                        [
                            new AddFeetSuccessAction(payload),
                            payload.evaluated ? new EvaluateAction([payload.zoneId]) : null
                        ].filter((actionToExecute) => actionToExecute !== null)

                    )
                )
            )
        );

    @Effect({ dispatch: false })
    addFeeFail$ = this.actions$
        .pipe(ofType<AddFeetFailAction>(
            RoutePlanningActionTypes.ADD_FEET_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );



    @Effect()
    addFeeRoute$ = this.actions$
        .pipe(ofType<ChangeFeeRouteAction>(RoutePlanningActionTypes.CHANGE_FEE_ROUTE))
        .pipe(
            map((action: ChangeFeeRouteAction) => action.payload),
            concatMap((payload) =>
                this.service.changeFeeRoute(payload.routeId, payload.userFeeCostId).pipe(
                    map((result) => new ChangeFeeRouteSuccessAction(payload),
                        catchError((error) => of(new ChangeFeeRouteFailAction({ error })))
                    )
                )
            )
        );

    @Effect({ dispatch: false })
    addFeeRouteFail$ = this.actions$
        .pipe(ofType<ChangeFeeRouteFailAction>(
            RoutePlanningActionTypes.CHANGE_FEE_ROUTE_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );


    @Effect()
    moveUnassignedDeliveryPoint$ = this.actions$
        .pipe(ofType<MoveUnassignedPointAction>(RoutePlanningActionTypes.MOVE_UNASSIGNED_POINT))
        .pipe(
            map((action: MoveUnassignedPointAction) => action.payload),
            concatMap((payload) =>
                this.service.moveUnassignedPoint({
                    routeId: payload.routeId,
                    unassignedDeliveryPoints: payload.unassignedDeliveryPoints
                }).pipe(
                    map((result) => new MoveUnassignedPointSuccessAction({
                        routeId: payload.routeId,
                        routeIdOri: payload.routeIdOri,
                        routes: result.routes,
                        unassignedDeliveryPoints: payload.unassignedDeliveryPoints,
                        zoneId: payload.zoneId,
                        zoneIdOri: payload.zoneIdOri
                    })),
                    catchError((error) => of(new MoveUnassignedPointFailAction({
                        error, routeId: payload.routeId,
                        routeIdOri: payload.routeIdOri,
                        routes: [],
                        unassignedDeliveryPoints: [],
                        zoneId: payload.zoneId,
                        zoneIdOri: payload.zoneIdOri
                    })))
                )
            )
        );

    @Effect({ dispatch: false })
    moveUnassignedDeliveryPointFail$ = this.actions$
        .pipe(ofType<MoveUnassignedPointFailAction>(
            RoutePlanningActionTypes.MOVE_UNASSIGNED_POINT_FAIL,
        ))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );


    @Effect()
    moveMultipleDeliveryPoint$ = this.actions$
        .pipe(ofType<MoveMultipleDeliveryPointAction>(
            RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT,
        ))
        .pipe(
            map((action: MoveMultipleDeliveryPointAction) => action.payload),
            concatMap((payload) =>
                this.service.moveMultipleDeliveryPoint(payload)
                    .pipe(
                        switchMap((result) =>
                            [
                                new MoveMultipleDeliveryPointSuccessAction({ result: result.deliveryZones })
                            ].filter((actionToExecute) => actionToExecute !== null)

                        ),
                        catchError((error) =>
                            of(
                                new MoveMultipleDeliveryPointFailAction({
                                    error,
                                }),
                            ),
                        ),
                    )
            ),
        );


    @Effect({ dispatch: false })
    moveMultipleDeliveryPointFail$ = this.actions$
        .pipe(ofType<MoveMultipleDeliveryPointFailAction>(
            RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );


    @Effect()
    moveMultipleDeliveryPointOptimized$ = this.actions$
        .pipe(ofType<MoveMultipleDeliveryPointOptimizeAction>(RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED))
        .pipe(
            map((action: MoveMultipleDeliveryPointOptimizeAction) => action.payload),
            concatMap((payload) =>
                this.service.moveMultipleDeliveryPointOptimized(payload).pipe(
                    map((result) => new MoveMultipleDeliveryPointOptimizeSuccessAction({
                        routeId: payload.routeIdDest,
                        routeIdOri: payload.routeIdOrig,
                        routes: result.routes,
                        zoneDestId: payload.zoneDestId,
                        zoneOrigId: payload.zoneOrigId
                    })

                    ),
                    catchError((error) => of(new MoveMultipleDeliveryPointOptimizeFailAction({ error })))
                )
            )
        );

    @Effect({ dispatch: false })
    moveMultipleDeliveryPointOptimizedFail$ = this.actions$
        .pipe(ofType<MoveMultipleDeliveryPointOptimizeFailAction>(
            RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );


    @Effect()
    deletePointUnassigned$ = this.actions$
        .pipe(ofType<DeletePointUnassignedAction>(RoutePlanningActionTypes.DELETE_POINT_UNASSIGNED))
        .pipe(
            map((action: DeletePointUnassignedAction) => action.payload),
            concatMap((payload) =>
                this.service.deletePointsUnassigned(payload.routeId).pipe(
                    map((result) => new DeletePointUnassignedSuccessAction({
                        routeId: payload.routeId,
                        zoneId: payload.zoneId
                    })),
                    catchError((error) => of(new DeletePointUnassignedFailAction({ error })))
                )
            )
        );

    @Effect({ dispatch: false })
    deletePointUnassignedFail$ = this.actions$
        .pipe(ofType<DeletePointUnassignedFailAction>(
            RoutePlanningActionTypes.DELETE_POINT_UNASSIGNED_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );

    @Effect()
    addRoutePlanningZone$ = this.actions$
        .pipe(ofType<AddRoutePlanningDeliveryZone>(RoutePlanningActionTypes.ADD_ROUTE_PLANNING_DELIVERY_ZONE))

        .pipe(
            map(action => action.payload),
            concatMap(act =>
                this.service.addRoutePlanningZone(act.zone, act.sessionId).pipe(
                    switchMap((newZone) => {
                        return [
                            new AddRoutePlanningDeliveryZoneSuccess({
                                zone: {
                                    ...newZone,
                                    settings: {
                                        ignoreCapacityLimit: newZone.settingsIgnorecapacitylimit
                                    }
                                }, sessionId: act.sessionId, vehicles: act.vehicles
                            })
                            /* }), */
                            /* new AddVehicleToZoneAction({ zoneId: newZone.id, vehicles: act.vehicles, evaluated: false }) */
                        ].filter((actionToExecute) => actionToExecute !== null)
                    }


                    ),
                    catchError((error) =>
                        of(
                            new AddRoutePlanningDeliveryZoneFail({
                                error
                            }),
                        ),
                    )
                ),
            ),
        );





    @Effect({ dispatch: false })
    addRoutePlanningZoneFail$ = this.actions$
        .pipe(ofType<AddRoutePlanningDeliveryZoneFail>(RoutePlanningActionTypes.ADD_ROUTE_PLANNING_DELIVERY_ZONE_FAIL))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.status), x.payload.error);
            }),
        );



    @Effect()
    movePointFromMap$ = this.actions$
        .pipe(ofType<MovePointFromMap>(RoutePlanningActionTypes.MOVE_POINT_FROM_MAP))
        .pipe(
            map(action => action.payload),
            concatMap(act =>
                this.service.movePointFromMap(act.deliveryZoneId, act.deliveryPoints).pipe(
                    map(
                        (newZone: any) => new MovePointFromMapSuccess({ routeMove: newZone })

                    ),
                    catchError(error => of(new MovePointFromMapFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    movePointFromMapFail$ = this.actions$
        .pipe(ofType<MovePointFromMapFail>(RoutePlanningActionTypes.MOVE_POINT_FROM_MAP_FAIL))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.status), x.payload.error);
            }),
        );


    @Effect()
    routeMovePointFromMap$ = this.actions$
        .pipe(ofType<RouteMovePointFromMap>(RoutePlanningActionTypes.ROUTE_MOVE_POINT_FROM_MAP))
        .pipe(
            map(action => action.payload),
            concatMap(act =>
                this.service.routeMovePointFromMap(act.routeId, act.deliveryPoints).pipe(
                    map(
                        (newZone: any) => new RouteMovePointFromMapSuccess({ routeMove: newZone })

                    ),
                    catchError(error => of(new RouteMovePointFromMapFail(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    routeMovePointFromMapFail$ = this.actions$
        .pipe(ofType<RouteMovePointFromMapFail>(RoutePlanningActionTypes.ROUTE_MOVE_POINT_FROM_MAP_FAIL))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.status), x.payload.error);
            }),
        );


    /* @Effect()
    createRouteWithZone$ = this.actions$
        .pipe(ofType<CreateRouteWithZonesAction>(RoutePlanningActionTypes.CREATE_ROUTE_WITH_ZONES))
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.createRouteWithZones(payload).pipe(
                    map((result) => {
                        return new AddPlanSessionSuccessAction(result)
                    }),
                    catchError((error) => of(new CreateRouteWithZonesFailAction({ error }))),
                ),
            ),
        ); */


    @Effect()
    createRouteWithZone$ = this.actions$
        .pipe(ofType<CreateRouteWithZonesAction>(
            RoutePlanningActionTypes.CREATE_ROUTE_WITH_ZONES,
        ))
        .pipe(
            map((action: CreateRouteWithZonesAction) => action.payload),
            concatMap((payload) =>
                !payload.isError
                    ? this.service.createRouteWithZones(payload)
                        .pipe(
                            switchMap((result) =>
                                [
                                    new AddPlanSessionSuccessAction(result),
                                    new getDeliveryPointPendingCount()
                                ].filter((actionToExecute) => actionToExecute !== null)

                            ),
                            catchError((error) =>
                                of(
                                    new AsignFailAction({
                                        error,
                                    }),
                                ),
                            ),
                        )
                    : of({ type: 'NO_ACTION' }),
            ),
        );

    @Effect({ dispatch: false })
    createRouteWithZoneFail$ = this.actions$
        .pipe(ofType<AddPlanSessionFailAction>(
            RoutePlanningActionTypes.VRP_PLAN_SESSION_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );


    @Effect()
    getDeliveryPointPending$ = this.actions$
        .pipe(ofType<getDeliveryPointPendingCount>(RoutePlanningActionTypes.GET_DELIVERY_POINT_PENDING_COUNT))
        .pipe(
            concatMap((payload) =>
                this.service.getDeliveryPointPendingCount().pipe(
                    map(({ data }: any) => new getDeliveryPointPendingCountSuccess(data)),
                    catchError((error) => of(new getDeliveryPointPendingCountFail({ error }))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    getDeliveryPointPendingFail$ = this.actions$
        .pipe(ofType<getDeliveryPointPendingCountFail>(RoutePlanningActionTypes.GET_DELIVERY_POINT_PENDING_COUNT_FAIL))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );


    @Effect()
    changeScheduleSpecification$ = this.actions$
        .pipe(ofType<changeVehicleScheduleSpecificationAction>(RoutePlanningActionTypes.CHANGE_VEHICLE_SCHEDULE_SPECIFICATION))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.changeScheduleSpecification(payload.zoneId, payload.vehicleId, payload.datos).pipe(
                    switchMap(() => [
                        new changeVehicleScheduleSpecificationSuccessAction(payload),
                    ]),
                    catchError(error => of(new changeVehicleScheduleSpecificationFailAction(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    changeScheduleSpecificationFail$ = this.actions$
        .pipe(ofType<changeVehicleScheduleSpecificationFailAction>(RoutePlanningActionTypes.CHANGE_VEHICLE_SCHEDULE_SPECIFICATION_FAIL))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.status, x.payload.error.error);
            }),
        );


    @Effect()
    changeScheduleHours$ = this.actions$
        .pipe(ofType<changeVehicleSchedulesHoursAction>(RoutePlanningActionTypes.CHANGE_VEHICLE_SCHEDULES_HOURS))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.changeScheduleSpecification(payload.zoneId, payload.vehicleId, payload.datos).pipe(
                    switchMap(() => [
                        new changeVehicleSchedulesHoursSuccessAction(payload),
                    ]),
                    catchError(error => of(new changeVehicleSchedulesHoursFailAction(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    changeScheduleHoursFail$ = this.actions$
        .pipe(ofType<changeVehicleSchedulesHoursFailAction>(RoutePlanningActionTypes.CHANGE_VEHICLE_SCHEDULES_HOURS_FAIL))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.status, x.payload.error.error);
            }),
        );


    @Effect()
    changeDriverRouteVehicle$ = this.actions$
        .pipe(ofType<ChangeDriverVehicleRouteAction>(RoutePlanningActionTypes.CHANGE_DRIVER_VEHICLE_ROUTE))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.changeDriverVehicleRoute(payload.route.id, payload.driver, payload.route.vehicle.id).pipe(
                    switchMap(() => [
                        new ChangeDriverVehicleRouteSuccessAction(payload),
                    ]),
                    catchError(error => of(new ChangeDriverVehicleRouteFailAction(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    changeDriverRouteVehicleFail$ = this.actions$
        .pipe(ofType<ChangeDriverVehicleRouteFailAction>(RoutePlanningActionTypes.CHANGE_DRIVER_VEHICLE_ROUTE_FAIL))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.status, x.payload.error.error);
            }),
        );



    @Effect()
    changeDriverVehicle$ = this.actions$
        .pipe(ofType<ChangeDriverVehicleAction>(RoutePlanningActionTypes.CHANGE_DRIVER_VEHICLE))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.changeDriverVehicle(payload.zoneId, payload.driver).pipe(
                    switchMap(() => [
                        new ChangeDriverVehicleSuccessAction(payload),
                    ]),
                    catchError(error => of(new ChangeDriverVehicleFailAction(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    changeDriverVehicleFail$ = this.actions$
        .pipe(ofType<ChangeDriverVehicleFailAction>(RoutePlanningActionTypes.CHANGE_DRIVER_VEHICLE_FAIL))
        .pipe(
            map((x: any) => {
                this.toastService.displayHTTPErrorToast(x.payload.status, x.payload.error.error);
            }),
        );


    @Effect()
    joinPointsAgglomeration$ = this.actions$
        .pipe(ofType<joinPointsAgglomerationAction>(RoutePlanningActionTypes.JOIN_POINTS_AGGLOMERATION))
        .pipe(
            map((action) => action.payload),
            concatMap((payload) =>
                this.service.joinPoints(payload.routePlanningDeliveryPoints, payload.sessionId).pipe(
                    map((result) => {
                        return new AddPlanSessionSuccessAction(result)
                    }),
                    catchError((error) => of(new AddPlanSessionFailAction({ error }))),
                ),
            ),
        );

    @Effect({ dispatch: false })
    joinPointsAgglomerationFail$ = this.actions$
        .pipe(ofType<joinPointsAgglomerationFailAction>(
            RoutePlanningActionTypes.JOIN_POINTS_AGGLOMERATION_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error.error);
            }),
        );


    @Effect()
    deleteZoneRoute$ = this.actions$
        .pipe(ofType<deleteZoneRouteAction>(RoutePlanningActionTypes.DELETE_ZONE_ROUTE))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.deleteZoneRoute(payload.routePlanningZoneId).pipe(
                    switchMap(() => [
                        new deleteZoneRouteSuccessAction(payload),
                    ]),
                    catchError(error => of(new deleteZoneRouteFailAction(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    deleteZoneRouteFail$ = this.actions$
        .pipe(ofType<deleteZoneRouteSuccessAction>(RoutePlanningActionTypes.DELETE_ZONE_ROUTE_FAIL))
        .pipe(
            map((x: any) => {
                console.log(x);
                this.toastService.displayHTTPErrorToast(x.status, x.error.error);
            }),
        );

    // CrossDocking

    @Effect()
    addCrossDocking$ = this.actions$
        .pipe(ofType<AddCrossDockingAction>(RoutePlanningActionTypes.ADD_CROSS_DOCKING))
        .pipe(
            map(action => action.payload),
            concatMap(payload =>
                this.service.addCrossDocking(payload.crossDocking, payload.zoneId).pipe(
                    switchMap(() => [
                        new AddCrossDockingSuccessAction(payload),
                        payload.evaluated ? new EvaluateAction([payload.zoneId]) : null
                    ].filter((actionToExecute) => actionToExecute !== null)),
                    catchError(error => of(new AddCrossDockingFailAction(error))),
                ),
            ),
        );
    @Effect({ dispatch: false })
    addCrossDockingFail$ = this.actions$
        .pipe(ofType<AddCrossDockingFailAction>(RoutePlanningActionTypes.ADD_CROSS_DOCKING_FAIL))
        .pipe(
            map((x: any) => {
                console.log(x);
                this.toastService.displayHTTPErrorToast(x.status, x.error.error);
            }),
        );


    @Effect({ dispatch: false })
    asignFail$ = this.actions$
        .pipe(ofType<AsignFailAction>(RoutePlanningActionTypes.ASIGN_FAIL))
        .pipe(
            map((x: any) => {
                console.log(x.payload);
                this.toastService.displayHTTPErrorToast(x.payload.error.status, x.payload.error.error);
            }),
        );

    @Effect()
    loadIntoRoutePlanning$ = this.actions$
        .pipe(ofType<loadSessionIntoPlanningRouteAction>(RoutePlanningActionTypes.LOAD_SESSION_INTO_PLANNING_ROUTE))
        .pipe(
            map((action: loadSessionIntoPlanningRouteAction) => action.payload),
            concatMap((payload) =>
                this.service.loadSessionIntoRoutePlanning(payload.deliveryPoints, payload.sessionId).pipe(
                    map((result: any) => new loadSessionIntoPlanningRouteSuccessAction({deliveryZones: result})),
                    catchError((error) => of(new loadSessionIntoPlanningRouteFailAction({ error })))
                )
            )
        );

    @Effect({ dispatch: false })
    loadIntoRoutePlanningFail$ = this.actions$
        .pipe(ofType<loadSessionIntoPlanningRouteFailAction>(
            RoutePlanningActionTypes.LOAD_SESSION_INTO_PLANNING_ROUTE_FAIL,
        ))
        .pipe(
            map((x) => {
                this.toastService.displayHTTPErrorToast(Number(x.payload.error.status));
            }),
        );


    constructor(
        private service: StateRoutePlanningService,
        private wsService: WebSocketService,
        private actions$: Actions,
        private routePlanningFacade: RoutePlanningFacade,
        private toastService: ToastService,
        private facade: RoutePlanningFacade,
        private translate: TranslateService
    ) { }
}

import { Injectable } from '@angular/core';
import { Vehicle, Zone } from '@optimroute/backend';
import { ImportedDeliveryPointDto } from '../../../../shared/src/lib/dto/imported-delivery-point.dto';
import { select, Store } from '@ngrx/store';
import {
    AddVehicleToZoneAction,
    CreatePlanSessionAction,
    DeselectAllAction,
    DeselectAllRoutesAction,
    DeselectDeliveryPointAction,
    EvaluateAction,
    EvaluateSuccessAction,
    ExportAction,
    HighlightRouteAction,
    ImportPlanSessionAction,
    JoinZonesAction,
    MoveDeliveryPointZoneAction,
    OptimizeAction,
    OptimizeFailAction,
    OptimizeSuccessAction,
    PrintAction,
    UpdateRouteColorAction,
    RemoveVehicleFromZoneAction,
    SelectAllAction,
    SelectAllRoutesAction,
    SelectDeliveryPointAction,
    PriorityChangeAction,
    SetEvaluationProgress,
    SetHoveredDeliveryPointAction,
    SetHoveredZoneAction,
    SetOptimizationStatus,
    SimulateAllAction,
    SimulateSelectedAction,
    SplitZonesAction,
    StopSimulationAction,
    ToggleDepotOpenedAction,
    ToggleExpandZoneAction,
    ToggleExpandZonePointsAction,
    ToggleExpandZoneRoutesAction,
    ToggleExpandZoneRoutesSettingsAction,
    ToggleExpandZoneSettingsAction,
    ToggleForceDepartureTimeAction,
    ToggleIgnoreCapacityLimitAction,
    ToggleRouteDisplayedAction,
    ToggleSelectRouteAction,
    ToggleSelectZoneAction,
    ToggleUseRouteColorsAction,
    ToggleShowSelectedAction,
    ToggleShowOnlyOptimizedZonesAction,
    ToggleSwitchMapViewAction,
    ToggleUseAllVehiclesAction,
    ToggleZoneDisplayedAction,
    UpdateExplorationLevelAction,
    UpdateOptimizationParametersAction,
    SetDepotPointAction,
    SetZoneActiveRouteAction,
    UpdateZoneNameAction,
    UpdateZoneColorAction,
    MoveDeliveryPointRouteAction,
    RecomputeAction,
    SetRecomputationProgress,
    RecomputeSuccessAction,
    RecomputeFailAction,
    UpdateRouteOptimizationParametersAction,
    UpdateRouteExplorationLevelAction,
    ToggleRouteForceDepartureTimeAction,
    UpdateOptimizeFromIndexAction,
    UpdateRouteDeliveryPointTimeWindowAction,
    UpdateDeliveryPointTimeWindowAction,
    UpdateDeliveryScheduleAction,
    UpdateRouteDeliveryScheduleAction,
    LogoutRoutePlanning,
    AsignAction,
    AddPlanSessionSuccessAction,
    SaveSessionAction,
    ShowRouteGeometry,
    ShowRouteGeometryZone,
    AsignEvaluatedAction,
    DeleteDeliveryPointAction,
    UpdateMaxDelayTimeAction,
    UpdateLeadTimeAction,
    UpdatedelayTimeAction,
    AddDeliveryPointAction,
    MoveUnassignedPointAction,
    AddDeliveryEvaluatedPointAction,
    UpdateAllowDelayTimeAction,
    MoveMultipleDeliveryPointAction,
    MoveMultipleDeliveryPointOptimizeAction, AddRoutePlanningDeliveryZone, MovePointFromMap, RouteMovePointFromMap, CreateRouteWithZonesAction, getDeliveryPointPendingCount, ToggleUserSkillsAction, ToggleRoute, AddPickUpEvaluatedPointAction, AddPickUpPointAction, DeletePointUnassignedAction, changeVehicleScheduleSpecificationAction, ChangeDriverVehicleRouteAction, joinPointsAgglomerationAction, closeCompleteAction, changeVehicleSchedulesHoursAction, deleteZoneRouteAction, AddCrossDockingAction, ChangeDriverVehicleAction, AddFeetAction, ChangeFeeRouteAction, ImportTemplateRouteSucess,
    loadSessionIntoPlanningRouteAction,
    UpdateVehicleFromZoneAction
} from './route-planning.actions';
import { RoutePlanningQuery } from './route-planning.selectors';
import {
    OptimizationParameters,
    PlanningDeliveryZone,
    RoutePlanningState,
    RoutePlanningViewingMode,
    RoutePlanningDeliveryPoint,
    Route,
} from './route-planning.state';
import { map } from 'rxjs/operators';

@Injectable()
export class RoutePlanningFacade {
    allRoutePlanning$ = this.store.pipe(select(RoutePlanningQuery.getRoutePlanning));
    amountSelectedZones$ = this.store.pipe(
        select(RoutePlanningQuery.getAmountSelectedZones),
    );
    amountSelectedRoutes$ = this.store.pipe(
        select(RoutePlanningQuery.getAmountSelectedRoutes),
    );
    amountExpandedZones$ = this.store.pipe(
        select(RoutePlanningQuery.getAmountExpandedZones),
    );
    allZones$ = this.store.pipe(select(RoutePlanningQuery.getPlanningDeliveryZones));
    allRoutes$ = this.store.pipe(select(RoutePlanningQuery.getAllRoutes));
    selectedDeliveryPoint$ = this.store.pipe(
        select(RoutePlanningQuery.getSelectedDeliveryPoint),
    );
    showGeometry$ = this.store.pipe(select(RoutePlanningQuery.getShowGeometry));
    showGeometryZone$ = this.store.pipe(select(RoutePlanningQuery.getShowGeometryZone));
    showOnlyOptimizedZones$ = this.store.pipe(
        select(RoutePlanningQuery.getShowOnlyOptimizedZones),
    );
    useRouteColors$ = this.store.pipe(select(RoutePlanningQuery.getUseRouteColors));
    hoveredZone$ = this.store.pipe(select(RoutePlanningQuery.getHoveredZone));
    hoveredDeliveryPoint$ = this.store.pipe(
        select(RoutePlanningQuery.getHoveredDeliveryPoint),
    );
    showSelected$ = this.store.pipe(select(RoutePlanningQuery.getShowSelected));
    highlightedRoute$ = this.store.pipe(select(RoutePlanningQuery.getHighlightedRoute));

    simulating$ = this.store.pipe(select(RoutePlanningQuery.getSimulating));
    simulatingVelocity$ = this.store.pipe(select(RoutePlanningQuery.getSimulatingVelocity));
    simulatingTime$ = this.store.pipe(select(RoutePlanningQuery.getSimulatingTime));

    planningSession$ = this.store.pipe(select(RoutePlanningQuery.getPlanningSession));
    planningSessionVehicles$ = this.store.pipe(
        select(RoutePlanningQuery.getPlanningSessionVehicles),
    );

    routePlanningVehicles$ = this.store.pipe(select(RoutePlanningQuery.getPlanningSessionVehiclesForEachRoute));

    adding$ = this.store.pipe(select(RoutePlanningQuery.getAddingDeliveryPoint));
    moving$ = this.store.pipe(select(RoutePlanningQuery.getMovingDeliveryPoint));
    moved$ = this.store.pipe(select(RoutePlanningQuery.getMovedDeliveryPoint));
    deliveryPointsNotSource$ = this.store.pipe(select(RoutePlanningQuery.getDeliveryPointsNotSource));
    deliveryPoints$ = this.store.pipe(select(RoutePlanningQuery.getDeliveryPointsSearch));
    deliveryPointOptimized$ = this.store.pipe(select(RoutePlanningQuery.getDeliveryPointsOptimizedSearch));

    deliveryPointPending$ = this.store.pipe(select(RoutePlanningQuery.getDeliveryPointPending));
    getZonesOptimizedCount$ = this.store.pipe(select(RoutePlanningQuery.getQuantityZonesOptimized));

    closeComplete$ = this.store.pipe(select(RoutePlanningQuery.getCloseComplete));

    assignate$ = this.store.pipe(select(RoutePlanningQuery.getAsignate));

    getErrorMaxDelaytime(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getErrorMaxDelayTime),
            map((f) => f(zoneId)),
        );
    }


    mapStage$ = this.store.pipe(select(RoutePlanningQuery.getMapStage));
    //zoneInfoChips$ = this.store.pipe(select(RoutePlanningQuery.getZoneInfoChips));
    //routeInfoChips$ = this.store.pipe(select(RoutePlanningQuery.getRouteInfoChips));
    allZonesInfoChips$ = this.store.pipe(select(RoutePlanningQuery.getAllZonesInfoChips));

    allRoutesInfoChips$ = this.store.pipe(select(RoutePlanningQuery.getAllRoutesInfoChips));
    viewingMode$ = this.store.pipe(select(RoutePlanningQuery.getViewingMode));
    sideNavState$ = this.store.pipe(select(RoutePlanningQuery.getSidenavState));

    allZonesStatus$ = this.store.pipe(select(RoutePlanningQuery.getAllZonesStatus));
    allRoutesStatus$ = this.store.pipe(select(RoutePlanningQuery.getAllRoutesStatus));

    isPlanningSessionLoading$ = this.store.pipe(
        select(RoutePlanningQuery.getLoadingPlanningSession),
    );
    isPlanningSessionLoaded$ = this.store.pipe(
        select(RoutePlanningQuery.getLoadedPlanningSession),
    );

    added$ = this.store.pipe(select(RoutePlanningQuery.getAdded));

    addedZoneId$ = this.store.pipe(select(RoutePlanningQuery.getZoneIdAdded));

    agglomeration$ = this.store.pipe(select(RoutePlanningQuery.getPointAgglomeration));

    deliveryPendingAll$ = this.store.pipe(select(RoutePlanningQuery.getDeliveryPointPendingAll));

    getZoneActiveRoute(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getZoneActiveRoute),
            map((f) => f(zoneId)),
        );
    }
    getZoneInfoChips(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getZoneInfoChips),
            map((f) => f(zoneId)),
        );
    }

    getZoneRouteInfoChips(zoneId: number, routeId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getZoneRouteInfoChips),
            map((f) => f(zoneId, routeId)),
        );
    }
    getZoneRoutesInfoChips(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getZoneRoutesInfoChips),
            map((f) => f(zoneId)),
        );
    }

    getZoneById(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getZoneById),
            map((f) => f(zoneId)),
        );
    }

    getZoneVehicles(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getZoneVehicles),
            map((f) => f(zoneId)),
        );
    }

    getZoneOptimization(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getZoneOptimization),
            map((f) => f(zoneId)),
        );
    }

    getZoneOptimizationParameters(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getZoneOptimizationParameters),
            map((f) => f(zoneId)),
        );
    }

    getZoneStatusOptimized(zoneId) {
        return this.store.pipe(
            select(RoutePlanningQuery.getZoneStatusOptimized),
            map((f) => f(zoneId)),
        );
    }

    getZoneExplorationLevel(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getZoneExplorationLevel),
            map((f) => f(zoneId)),
        );
    }

    getZoneMaxDelayTime(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getMaxDelayTime),
            map((f) => f(zoneId)),
        );
    }

    getZoneStatus(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getZoneStatus),
            map((f) => f(zoneId)),
        );
    }

    getRouteStatus(zoneId: number, routeId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getRouteStatus),
            map((f) => f(zoneId, routeId)),
        );
    }

    getZoneRouteById(zoneId: number, routeId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getZoneRouteById),
            map((f) => f(zoneId, routeId)),
        );
    }

    getRoutesStatus(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getRoutesStatus),
            map((f) => f(zoneId)),
        );
    }

    getOptimizationStatus(zoneId: number) {
        return this.store.pipe(
            select(RoutePlanningQuery.getOptimizationStatus),
            map((f) => f(zoneId)),
        );
    }

    selectAll() {
        this.store.dispatch(new SelectAllAction());
    }
    deselectAll() {
        this.store.dispatch(new DeselectAllAction());
    }
    selectAllRoutes() {
        this.store.dispatch(new SelectAllRoutesAction());
    }
    deselectAllRoutes() {
        this.store.dispatch(new DeselectAllRoutesAction());
    }
    toggleShowSelected() {
        this.store.dispatch(new ToggleShowSelectedAction());
    }
    toggleExpandZone(x: number) {
        this.store.dispatch(new ToggleExpandZoneAction({ zoneId: x }));
    }
    toggleExpandZonePoints(x: number) {
        this.store.dispatch(new ToggleExpandZonePointsAction({ zoneId: x }));
    }
    toggleExpandZoneSettings(x: number) {
        this.store.dispatch(new ToggleExpandZoneSettingsAction({ zoneId: x }));
    }
    toggleExpandZoneRoutes(x: number) {
        this.store.dispatch(new ToggleExpandZoneRoutesAction({ zoneId: x }));
    }
    toggleExpandZoneRoutesSettings(x: number) {
        this.store.dispatch(new ToggleExpandZoneRoutesSettingsAction({ zoneId: x }));
    }
    toggleDisplayZone(zoneId: number) {
        this.store.dispatch(new ToggleZoneDisplayedAction({ zoneId: zoneId }));
    }
    toggleDisplayRoute(zoneId: number, routeId: number) {
        this.store.dispatch(
            new ToggleRouteDisplayedAction({ zoneId: zoneId, routeId: routeId }),
        );
    }
    toggleSelectZone(zoneId: number) {
        this.store.dispatch(new ToggleSelectZoneAction({ zoneId: zoneId }));
    }


    toggleRoute(zoneId: number, routeIndex: number) {
        this.store.dispatch(new ToggleRoute({ zoneId, routeIndex }));
    }

    showRouteGeometry(zoneId: number, routeId: number) {
        this.store.dispatch(new ShowRouteGeometry({ zoneId: zoneId, routeId: routeId }))
    }

    showRouteGeometryZone(zoneId: number) {
        this.store.dispatch(new ShowRouteGeometryZone({ zoneId: zoneId }))
    }
    /*
    selectZone(zoneId: number) {
        this.store.dispatch(new SelectOneZoneAction({ zoneId: zoneId }));
    }
    deselectZone(zoneId: number) {
        this.store.dispatch(new DeselectOneZoneAction({ zoneId: zoneId }));
    }
    */
    toggleSelectRoute(zoneId: number, routeId: number) {
        this.store.dispatch(
            new ToggleSelectRouteAction({ zoneId: zoneId, routeId: routeId }),
        );
    }
    /*
    selectRoute(zoneId: number, routeId: number) {
        this.store.dispatch(new SelectOneRouteAction({ zoneId: zoneId, routeId: routeId }));
    }
    deselectRoute(x: number, y: number) {
        this.store.dispatch(new DeselectOneRouteAction({ zoneId: x, routeId: y }));
    }
    */
    toggleUseRouteColors() {
        this.store.dispatch(new ToggleUseRouteColorsAction());
    }
    toggleShowOnlyOptimizedZones() {
        this.store.dispatch(new ToggleShowOnlyOptimizedZonesAction());
    }
    toggleSwitchMapView(view: RoutePlanningViewingMode) {
        this.store.dispatch(new ToggleSwitchMapViewAction({ view: view }));
    }
    setHoveredZone(zoneId: number) {
        this.store.dispatch(new SetHoveredZoneAction({ zoneId: zoneId }));
    }
    selectDeliveryPoint(selectedId: number) {
        return this.store.dispatch(
            new SelectDeliveryPointAction({
                selectedPointId: selectedId,
            }),
        );
    }
    deselectDeliveryPoint() {
        this.store.dispatch(new DeselectDeliveryPointAction());
    }
    setHoveredDeliveryPoint(hoveredId: number) {
        this.store.dispatch(
            new SetHoveredDeliveryPointAction({ deliveryPointId: hoveredId }),
        );
    }
    setZoneActiveRoute(zoneId: number, routeId: number) {
        this.store.dispatch(
            new SetZoneActiveRouteAction({ zoneId: zoneId, routeId: routeId }),
        );
    }
    toggleDepotOpened() {
        this.store.dispatch(new ToggleDepotOpenedAction());
    }
    setDepotPoint(
        name: string,
        coordinates: { latitude: number; longitude: number },
        address: string,
    ) {
        this.store.dispatch(
            new SetDepotPointAction({ depotPoint: { name, coordinates, address } }),
        );
    }

    simulateAll() {
        this.store.dispatch(new SimulateAllAction());
    }
    simulateSelected() {
        this.store.dispatch(new SimulateSelectedAction());
    }
    stopSimulation() {
        this.store.dispatch(new StopSimulationAction());
    }
    simulationFail() {
        console.log('Facade Simulation Fail');
    }
    simulationSuccess() {
        console.log('Facade Simulation Success');
    }

    importPlanSession(payload: {
        deliveryPoints: ImportedDeliveryPointDto[];
        warehouse: any;
        assignationDate?: string;
        options: {
            createDeliveryPoints: boolean;
            updateDeliveryPoints: boolean;
            createDeliveryZones: boolean;
            createUnassignedZone: boolean;
            setUnassignedZone: boolean;
        };
        vehicle: any[],
        sessionType?: string;
    }) {
        this.store.dispatch(new ImportPlanSessionAction(payload));
    }

    createRouteWithZones(payload: {
        warehouse: any;
        deliveryZones: string[]
    }) {
        this.store.dispatch(new CreateRouteWithZonesAction(payload))
    }

    importTemplateRoute(payload: any)
    {
        this.store.dispatch(new ImportTemplateRouteSucess(payload))
    }

    recoverSession(payload: any
    ) {
        this.store.dispatch(new AddPlanSessionSuccessAction(payload))
    }



    createPlanSession() {
        this.store.dispatch(new CreatePlanSessionAction());
    }
    // TODO:
    optimize(zones: { zoneIds: number[] }) {
        this.store.dispatch(new OptimizeAction(zones.zoneIds));
    }
    asign(zones: { dateAsign: string, routes: Route[] }) {
        this.store.dispatch(new AsignAction(zones));
    }

    asign_evaluateds(zones: { dateAsign: string, zoneIds: number[] }) {
        this.store.dispatch(new AsignEvaluatedAction(zones));
    }

    setOptimizationStatus(routePlanningZoneId: number, state: string, progress: number) {
        this.store.dispatch(
            new SetOptimizationStatus({ zoneId: routePlanningZoneId, state, progress }),
        );
    }

    optimizationSuccess(zoneId: number, result: any) {
        this.store.dispatch(
            new OptimizeSuccessAction({ zoneId: zoneId, solution: result }),
        );
    }

    optimizationFail(zoneIds: number[], error: any) {
        this.store.dispatch(new OptimizeFailAction({ zoneIds: zoneIds, error: error }));
    }

    recompute(payload: {
        [routeId: number]: { routeId: number; zoneId: number; start: number };
    }) {
        this.store.dispatch(new RecomputeAction(payload));
    }

    setRecomputationProgress(zoneId: number, routeId: number, progress: number) {
        this.store.dispatch(new SetRecomputationProgress({ zoneId, routeId, progress }));
    }

    recomputationSuccess(zoneId: number, routeId: number, result: any) {
        this.store.dispatch(new RecomputeSuccessAction({ zoneId, routeId, route: result }));
    }

    recomputationFail(
        routes: { [routeId: number]: { routeId: number; zoneId: number } },
        error: any,
    ) {
        this.store.dispatch(new RecomputeFailAction({ error, routes }));
    }

    evaluate(zones: { zoneIds: number[] }) {
        this.store.dispatch(new EvaluateAction(zones.zoneIds));
    }

    setEvaluationProgress(routePlanningZoneId: number, progress: number) {
        this.store.dispatch(
            new SetEvaluationProgress({
                zoneId: routePlanningZoneId,
                progress,
            }),
        );
    }
    evaluationSuccess(evaluation: any) {
        this.store.dispatch(
            new EvaluateSuccessAction(evaluation),
        );
    }
    joinZones(zones?, vehicles?: Vehicle[], settings?: { ignoreCapacityLimit: boolean, useAllVehicles: boolean, useSkills: boolean }, optimize?: boolean, evaluate?: boolean) {
        this.store.dispatch(new JoinZonesAction({ settings, vehicles, zones, optimize, evaluate }));
    }
    removeFromMultiZone(multiZoneId: number, zoneToRemove: number, evaluate?: boolean) {
        this.store.dispatch(
            new SplitZonesAction({ zoneId: multiZoneId, zonesToSplit: [zoneToRemove], evaluate }),
        );
    }

    removeAllFromMultiZone(multiZoneId: number, zoneToRemove: number[], evaluate?: boolean) {
        this.store.dispatch(
            new SplitZonesAction({ zoneId: multiZoneId, zonesToSplit: zoneToRemove, evaluate }),
        );
    }

    updateZoneName(zoneId: number, name: string) {
        this.store.dispatch(new UpdateZoneNameAction({ zoneId: zoneId, name: name }));
    }
    updateZoneColor(zoneId: number, color: string) {
        this.store.dispatch(new UpdateZoneColorAction({ zoneId: zoneId, color: color }));
    }
    updateRouteColor(zoneId: number, routeId: number, color: string) {
        this.store.dispatch(
            new UpdateRouteColorAction({ zoneId: zoneId, routeId: routeId, color: color }),
        );
    }

    export() {
        this.store.dispatch(new ExportAction());
    }
    print() {
        this.store.dispatch(new PrintAction());
    }

    deliveryPointZoneMovement(
        deliveryPointId: number,
        oldZoneId: number,
        newZoneId: number,
        oldOrder: number,
        newOrder: number,
        isError?: boolean,
        isEvaluated?: boolean,
    ) {
        this.store.dispatch(
            new MoveDeliveryPointZoneAction({
                deliveryPointId,
                oldZoneId,
                newZoneId,
                oldOrder,
                newOrder,
                isError: isError ? isError : false,
                isEvaluated: isEvaluated ? isEvaluated : false
            }),
        );
    }
    deliveryPointRouteMovement(
        deliveryPointId: number,
        oldZoneId: number,
        newZoneId: number,
        oldRouteId: number,
        newRouteId: number,
        oldOrder: number,
        newOrder: number,
        isError?: boolean,
        isEvaluated?: boolean,
    ) {
        this.store.dispatch(
            new MoveDeliveryPointRouteAction({
                deliveryPointId,
                oldZoneId,
                newZoneId,
                oldRouteId,
                newRouteId,
                oldOrder,
                newOrder,
                isError: isError ? isError : false,
                isEvaluated: isEvaluated ? isEvaluated : false
            }),
        );
    }

    setPriority(zoneId: number, deliveryPointId: number, value: number) {
        this.store.dispatch(
            new PriorityChangeAction({
                zoneId: zoneId,
                deliveryPointId: deliveryPointId,
                value: value,
            }),
        );
    }

    useVehicle(zoneId: number, vehicles: Vehicle[], evaluated: boolean) {
        this.store.dispatch(new AddVehicleToZoneAction({ zoneId: zoneId, vehicles, evaluated }));
    }

    stopUsingVehicle(zoneId: number, vehicleId: number, zone: PlanningDeliveryZone) {
        if (zone.isMultiZone) {
            let found = false;
            zone.vehicles.forEach((v) => {
                if (v.id === vehicleId) {
                    found = true;
                }
            });
            if (!found) {

                for (let subZoneId in zone.deliveryZones) {
                    zone.deliveryZones[subZoneId].vehicles.forEach((v) => {
                        if (v.id === vehicleId) {
                            zoneId = +subZoneId;
                        }
                    });
                }
            }
        }
        this.store.dispatch(
            new RemoveVehicleFromZoneAction({ zoneId: zoneId, vehicleId: vehicleId }),
        );
    }

    toggleUseAllVehicles(zoneId: number, value: boolean) {
        this.store.dispatch(new ToggleUseAllVehiclesAction({ zoneId, value }));
    }
    toggleIgnoreCapacityLimit(zoneId: number, value: boolean) {
        this.store.dispatch(new ToggleIgnoreCapacityLimitAction({ zoneId, value }));
    }

    toggleUserSkill(zoneId: number, value: boolean) {
        this.store.dispatch(new ToggleUserSkillsAction({ zoneId, value }));
    }

    updateOptimizationParameters(
        zoneId: number,
        optimizationParameters: Partial<OptimizationParameters>,
    ) {
        this.store.dispatch(
            new UpdateOptimizationParametersAction({
                zoneId: zoneId,
                optimizationParameters: optimizationParameters,
            }),
        );
    }

    updateExplorationLevel(zoneId: number, value: number) {
        this.store.dispatch(
            new UpdateExplorationLevelAction({ zoneId: zoneId, value: value }),
        );
    }

    highlightRoute(routeId: number) {
        this.store.dispatch(new HighlightRouteAction({ routeId: routeId }));
    }

    updateDeliveryScheduleStart(zoneId: number, value: number) {
        this.store.dispatch(
            new UpdateDeliveryScheduleAction({
                zoneId,
                deliverySchedule: { start: value },
            }),
        );
    }
    updateDeliveryScheduleEnd(zoneId: number, value: number) {
        this.store.dispatch(
            new UpdateDeliveryScheduleAction({ zoneId, deliverySchedule: { end: value } }),
        );
    }
    toggleForceDepartureValue(zoneId: number, value: boolean) {
        this.store.dispatch(new ToggleForceDepartureTimeAction({ zoneId, value }));
    }

    updateDeliveryPointTimeWindow(
        zoneId: number,
        deliveryPointId: number,
        deliveryWindow: Partial<RoutePlanningDeliveryPoint['deliveryWindow']>,
        coordinates: {
            latitude: number,
            longitude: number
        },
        serviceTime: number,
        address: string,
        leadTime?: number,
        allowedDelayTime?: number,
        deliveryType?: string,
        orderNumber?: string,
        companyPreferenceDelayTimeId?: number,
        allowDelayTime?: boolean
    ) {
        this.store.dispatch(
            new UpdateDeliveryPointTimeWindowAction({
                zoneId,
                deliveryPointId,
                deliveryWindow,
                leadTime,
                allowedDelayTime,
                coordinates,
                serviceTime,
                address,
                deliveryType,
                orderNumber,
                companyPreferenceDelayTimeId,
                allowDelayTime
            }),
        );
    }

    updateRouteDeliveryPointTimeWindow(
        zoneId: number,
        routeId: number,
        deliveryPointId: number,
        deliveryWindow: Partial<RoutePlanningDeliveryPoint['deliveryWindow']>,
        leadTime?: number,
        deliveryType?: string,
        orderNumber?: string,
        companyPreferenceDelayTimeId?: number,
        allowDelayTime?: boolean
    ) {
        this.store.dispatch(
            new UpdateRouteDeliveryPointTimeWindowAction({
                zoneId,
                routeId,
                deliveryPointId,
                deliveryWindow,
                leadTime,
                deliveryType,
                orderNumber,
                companyPreferenceDelayTimeId,
                allowDelayTime
            }),
        );
    }

    // Route Settings

    updateRouteOptimizationParameters(
        zoneId: number,
        routeId: number,
        optimizationParameters: Partial<OptimizationParameters>,
    ) {
        this.store.dispatch(
            new UpdateRouteOptimizationParametersAction({
                zoneId: zoneId,
                routeId,
                optimizationParameters: optimizationParameters,
            }),
        );
    }

    updateRouteExplorationLevel(zoneId: number, routeId: number, value: number) {
        this.store.dispatch(
            new UpdateRouteExplorationLevelAction({
                zoneId: zoneId,
                routeId,
                value: value,
            }),
        );
    }

    updateMaxDelayTime(zoneId: number, value: number) {
        this.store.dispatch(
            new UpdateMaxDelayTimeAction({
                zoneId: zoneId,
                value: value,
            }),
        );
    }

    updateLeadTime(zoneId: number, pointId: number, value: number) {
        this.store.dispatch(
            new UpdateLeadTimeAction({
                zoneId: zoneId,
                deliveryPointId: pointId,
                value: value
            }),
        );
    }

    updateAllowedDelayTime(zoneId: number, pointId: number, value: number) {
        this.store.dispatch(
            new UpdateAllowDelayTimeAction({
                zoneId: zoneId,
                deliveryPointId: pointId,
                value: value
            }),
        );
    }

    updateRouteDeliveryScheduleStart(zoneId: number, routeId: number, value: number) {
        this.store.dispatch(
            new UpdateRouteDeliveryScheduleAction({
                zoneId,
                routeId,
                deliverySchedule: { start: value },
            }),
        );
    }
    updateRouteDeliveryScheduleEnd(zoneId: number, routeId: number, value: number) {
        this.store.dispatch(
            new UpdateRouteDeliveryScheduleAction({
                zoneId,
                routeId,
                deliverySchedule: { end: value },
            }),
        );
    }
    toggleRouteForceDepartureValue(zoneId: number, routeId: number, value: boolean) {
        this.store.dispatch(
            new ToggleRouteForceDepartureTimeAction({ zoneId, routeId, value }),
        );
    }

    updateOptimizeFromIndex(zoneId: number, routeId: number, value: number) {
        this.store.dispatch(new UpdateOptimizeFromIndexAction({ zoneId, routeId, value }));
    }

    saveSession(sessionId: number, data: any) {
        this.store.dispatch(new SaveSessionAction({ sessionId: sessionId, data: data }));
    }

    deleteDeliveryPoint(deliveryPointId: number, zoneId: number, evaluated: boolean) {
        this.store.dispatch(new DeleteDeliveryPointAction({ deliveryPointId, zoneId, evaluated }));
    }

    addDeliveryPoint(deliveryPoints: number[], routePlanningDeliveryZoneId: number) {
        this.store.dispatch(new AddDeliveryPointAction({
            deliveryPoints,
            routePlanningDeliveryZoneId
        }));
    }

    addPickUp(deliveryPoints: any[], routePlanningDeliveryZoneId: number) {
        this.store.dispatch(new AddPickUpPointAction({
            deliveryPoints,
            routePlanningDeliveryZoneId
        }));
    }

    addDeliveryPointEvaluted(deliveryPoints: number[], routePlanningDeliveryZoneId: number) {
        this.store.dispatch(new AddDeliveryEvaluatedPointAction({
            deliveryPoints,
            routePlanningDeliveryZoneId
        }));
    }

    addPickUpPointEvaluted(deliveryPoints: any[], routePlanningDeliveryZoneId: number) {
        this.store.dispatch(new AddPickUpEvaluatedPointAction({
            deliveryPoints,
            routePlanningDeliveryZoneId
        }));
    }

    moveUnassignedDeliveryPoint(routeId: number, routeIdOri: number, unassignedDeliveryPoints: any[], zoneId: number, zoneIdOri: number) {
        this.store.dispatch(new MoveUnassignedPointAction({
            routeId,
            unassignedDeliveryPoints,
            routeIdOri,
            zoneId,
            zoneIdOri
        }))
    }

    moveMultipleDeliveryPoint(data: {
        routePlanningDeliveryZoneIdOrig: number,
        routePlanningDeliveryZoneIdDest: number,
        routePlanningDeliveryPoints: number[],
        order: number
    }) {
        this.store.dispatch(new MoveMultipleDeliveryPointAction(data));
    }


    deletePointsUnassigned(routeId, zoneId) {
        this.store.dispatch(new DeletePointUnassignedAction({ routeId, zoneId }));
    }

    moveMultipleDeliveryPointOptimized(data: {
        routeIdOrig: number,
        routeIdDest: number,
        zoneOrigId: number,
        zoneDestId: number,
        routePlanningRouteDeliveryPoints: number[],
        order: number
    }) {
        this.store.dispatch(new MoveMultipleDeliveryPointOptimizeAction(data));
    }

    movePointsFromMap(deliveryZoneId: number, deliveryPoints) {
        this.store.dispatch(new MovePointFromMap({
            deliveryZoneId,
            deliveryPoints
        }));
    }

    routeMovePointFromMap(routeId: number, deliveryPoints) {
        this.store.dispatch(new RouteMovePointFromMap({
            deliveryPoints,
            routeId
        }));
    }

    addRoutePlanningDeliveryZone(zone: Zone, sessionId: number, vehicles: Vehicle[]) {
        this.store.dispatch(new AddRoutePlanningDeliveryZone({ zone, sessionId, vehicles }));
    }


    getDeliveryPointPending() {
        this.store.dispatch(new getDeliveryPointPendingCount());
    }


    changeScheduleSpecification(zoneId, vehicleId, datos: {
        vehicleScheduleSpecificationId?: number,
        timeStart: number,
        timeEnd: number,
        deliveryPointScheduleTypeId?: number
    }) {
        this.store.dispatch(new changeVehicleScheduleSpecificationAction({ zoneId, vehicleId, datos }));
    }


    changeSchedulesHourd(vehicleId: number, zoneId: number, datos: {
        deliveryPointScheduleTypeId: number,
        vehicleScheduleDayId: number,
        vehicleScheduleHourId: number,
        timeStart: number,
        timeEnd: number,
        vehicleScheduleSpecificationId: number
    }){
        this.store.dispatch(new changeVehicleSchedulesHoursAction({ datos, vehicleId, zoneId }));
    }

    changeDriverVehicleRoute(zoneId, driver: number, route) {
        this.store.dispatch(new ChangeDriverVehicleRouteAction({ zoneId, driver, route }))
    }

    addFeet(zoneId: number, userFeeCostId: number, vehicleId: number, evaluated: boolean){
        this.store.dispatch(new AddFeetAction({ zoneId, userFeeCostId, vehicleId, evaluated }));
    }

    changeFeeRoute(userFeeCostId: number, routeId: number, zoneId){
        this.store.dispatch(new ChangeFeeRouteAction({ userFeeCostId, routeId, zoneId }))
    }

    changeDriverVehicle(zoneId, driver: number, vehicleId: number, User: any) {
        this.store.dispatch(new ChangeDriverVehicleAction({ zoneId, driver, vehicleId, User }))
    }


    joinPointsAgglomeration(routePlanningDeliveryPoints: number[], sessionId: number) {
        this.store.dispatch(new joinPointsAgglomerationAction({ routePlanningDeliveryPoints, sessionId }));
    }

    logout() {
        this.store.dispatch(new LogoutRoutePlanning());
    }

    closeComplete(closeComplete: boolean){
        this.store.dispatch(new closeCompleteAction( { closeComplete } ))
    }

    deleteRouteDeliveryZone(routePlanningZoneId: number){
        this.store.dispatch(new deleteZoneRouteAction({
            routePlanningZoneId
        }));
    }

    addCrossDocking(crossDocking: number, zoneId: number, evaluated: boolean){
        this.store.dispatch(new AddCrossDockingAction({ crossDocking, zoneId, evaluated }));
    }

    loadSessionIntoPlanningRoute(deliveryPoints: any, sessionId: number){
        this.store.dispatch(new loadSessionIntoPlanningRouteAction({ deliveryPoints, sessionId }));
    }

    updateVehicle(payload: { zoneId?: number; vehicleId: number; results: Partial<Vehicle> }){
        this.store.dispatch(new UpdateVehicleFromZoneAction(payload));
    }


    constructor(private store: Store<RoutePlanningState>) { }
}

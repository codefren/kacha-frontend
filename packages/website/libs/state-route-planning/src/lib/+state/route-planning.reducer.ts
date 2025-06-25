import { getDeliveryPointPendingCount, RoutePlanningAction, RoutePlanningActionTypes } from './route-planning.actions';
import {
    DeliveryZoneStatus,
    initialDeliveryZoneStatus,
    initialQuantifiedOptimizationParameters,
    PlanningDeliveryZone,
    RoutePlanningState,
    RoutePlanningViewingMode,
    DeliveryPoint,
    Route,
    RoutePlanningSolution,
    RouteStatus,
    initialRouteStatus,
    OptimizationStatus,
    initialOptimizationStatus,
} from './route-planning.state';
import { environment } from '@optimroute/env/environment';
import { initialAlreadyOptimizedZones } from './hardcoded';
import { computeStats } from '../../../../shared/src/lib/util-functions/route-stats';
import { addDeliveryPointToRoute, removeDeliveryPointFromRoute } from '../../../../shared/src/lib/util-functions/route-reordering';
import * as _ from 'lodash';
import { stat } from 'fs';
import { act } from '@ngrx/effects';

export const RoutePlanningInitialState: RoutePlanningState = environment.loadDefaultRoutes
    ? initialAlreadyOptimizedZones
    : {
        deliveryZonesStatus: null,
        routesStatus: null,
        optimizationStatus: null,
        showSelected: false,
        sidenavOpened: false,
        simulating: 'None',
        highlightedRoute: -1,
        useRouteColors: true,
        showOnlyOptimizedZones: true,
        simulationVelocity: null,
        simulationTime: null,
        selectedDeliveryPoint: -1,
        hoveredDeliveryPoint: -1,
        hoveredZone: -1,
        depotOpened: false,
        planningSession: null,
        loadingPlanningSession: false,
        loadedPlanningSession: false,
        viewingMode: 0,
        routeShowGeometry: 0,
        zoneShowGeometry: 0,
        deliveryPointPending: 0,
        ShowGeometry: false,
        saved: null,
        adding: false,
        moving: false,
        assignate: false,
        closeComplete: false
    };

export function routePlanningReducer(
    state: RoutePlanningState = RoutePlanningInitialState,
    action: RoutePlanningAction,
): RoutePlanningState {
    switch (action.type) {
        // General Zone State Actions
        case RoutePlanningActionTypes.SELECT_ALL: {
            let newDeliveryZonesStatus: {
                [key: number]: DeliveryZoneStatus;
            } = { ...state.deliveryZonesStatus };
            for (const key in newDeliveryZonesStatus) {
                newDeliveryZonesStatus = {
                    ...newDeliveryZonesStatus,
                    [key]: {
                        ...newDeliveryZonesStatus[key],
                        selected: true,
                    },
                };
            }
            return { ...state, deliveryZonesStatus: newDeliveryZonesStatus };
        }
        case RoutePlanningActionTypes.DESELECT_ALL: {
            let newDeliveryZonesStatus: { [key: number]: DeliveryZoneStatus } = {
                ...state.deliveryZonesStatus,
            };
            for (const key in newDeliveryZonesStatus) {
                newDeliveryZonesStatus = {
                    ...newDeliveryZonesStatus,
                    [key]: {
                        ...newDeliveryZonesStatus[key],
                        selected: false,
                    },
                };
            }
            return { ...state, deliveryZonesStatus: newDeliveryZonesStatus };
        }
        case RoutePlanningActionTypes.SELECT_ALL_ROUTES: {
            let newRouteStatus: {
                [zoneId: number]: {
                    [routeId: number]: RouteStatus;
                };
            } = { ...state.routesStatus };
            let newZoneStatus: { [zoneId: number]: DeliveryZoneStatus } = {
                ...state.deliveryZonesStatus,
            };
            for (const zoneId in newRouteStatus) {
                newZoneStatus = {
                    ...newZoneStatus,
                    [zoneId]: {
                        ...newZoneStatus[zoneId],
                        selected: true,
                    },
                };
                for (const routeId in newRouteStatus[zoneId]) {
                    newRouteStatus = {
                        ...newRouteStatus,
                        [zoneId]: {
                            ...newRouteStatus[zoneId],
                            [routeId]: {
                                ...newRouteStatus[zoneId][routeId],
                                selected: true,
                            },
                        },
                    };
                }
            }
            return {
                ...state,
                deliveryZonesStatus: newZoneStatus,
                routesStatus: newRouteStatus,
            };
        }
        case RoutePlanningActionTypes.DESELECT_ALL_ROUTES: {
            let newRouteStatus: {
                [zoneId: number]: {
                    [routeId: number]: RouteStatus;
                };
            } = { ...state.routesStatus };
            let newZoneStatus: { [zoneId: number]: DeliveryZoneStatus } = {
                ...state.deliveryZonesStatus,
            };
            for (const zoneId in state.routesStatus) {
                newZoneStatus = {
                    ...newZoneStatus,
                    [zoneId]: { ...newZoneStatus[zoneId], selected: false },
                };
                for (const routeId in state.routesStatus[zoneId]) {
                    newRouteStatus = {
                        ...newRouteStatus,
                        [zoneId]: {
                            ...newRouteStatus[zoneId],
                            [routeId]: {
                                ...newRouteStatus[zoneId][routeId],
                                selected: false,
                            },
                        },
                    };
                }
            }
            return {
                ...state,
                deliveryZonesStatus: newZoneStatus,
                routesStatus: newRouteStatus,
            };
        }
        case RoutePlanningActionTypes.TOGGLE_SHOW_SELECTED: {
            return { ...state, showSelected: !state.showSelected };
        }
        case RoutePlanningActionTypes.TOGGLE_SELECT_ZONE: {
            return {
                ...state,
                deliveryZonesStatus: {
                    ...state.deliveryZonesStatus,
                    [action.payload.zoneId]: {
                        ...state.deliveryZonesStatus[action.payload.zoneId],
                        selected: !state.deliveryZonesStatus[action.payload.zoneId]
                            .selected,
                    },
                },
            };
        }
        case RoutePlanningActionTypes.SHOW_GEOMETRY_ROUTE: {
            return {
                ...state,
                routeShowGeometry:
                    action.payload.routeId === state.routeShowGeometry
                        ? 0
                        : action.payload.routeId,
                zoneShowGeometry: action.payload.zoneId,
                ShowGeometry:
                    action.payload.routeId === state.routeShowGeometry ? false : true,
                ShowGeometryZone: false,
            };
        }
        case RoutePlanningActionTypes.SHOW_GEOMETRY_ZONE: {
            return {
                ...state,
                zoneShowGeometry:
                    action.payload.zoneId === state.zoneShowGeometry
                        ? 0
                        : action.payload.zoneId,
                ShowGeometryZone:
                    action.payload.zoneId === state.zoneShowGeometry ? false : true,
            };
        }
        case RoutePlanningActionTypes.TOGGLE_SELECT_ROUTE: {
            return {
                ...state,
                routesStatus: {
                    ...state.routesStatus,
                    [action.payload.zoneId]: state.routesStatus[action.payload.zoneId]
                        ? {
                            ...state.routesStatus[action.payload.zoneId],
                            [action.payload.routeId]: {
                                ...state.routesStatus[action.payload.zoneId][
                                action.payload.routeId
                                ],
                                selected: !state.routesStatus[action.payload.zoneId][
                                    action.payload.routeId
                                ].selected,
                            },
                        }
                        : null,
                },
            };
        }
        case RoutePlanningActionTypes.TOGGLE_ZONE_DISPLAYED: {
            return {
                ...state,
                deliveryZonesStatus: {
                    ...state.deliveryZonesStatus,
                    [action.payload.zoneId]: {
                        ...state.deliveryZonesStatus[action.payload.zoneId],
                        displayed: !state.deliveryZonesStatus[action.payload.zoneId]
                            .displayed,
                    },
                },
            };
        }
        case RoutePlanningActionTypes.TOGGLE_ROUTE_DISPLAYED: {
            return {
                ...state,
                routesStatus: {
                    ...state.routesStatus,
                    [action.payload.zoneId]: {
                        ...state.routesStatus[action.payload.zoneId],
                        [action.payload.routeId]: {
                            ...state.routesStatus[action.payload.zoneId][
                            action.payload.routeId
                            ],
                            displayed: !state.routesStatus[action.payload.zoneId][
                                action.payload.routeId
                            ].displayed,
                        },
                    },
                },
            };
        }
        case RoutePlanningActionTypes.TOGGLE_EXPAND_ZONE: {
            return {
                ...state,
                deliveryZonesStatus: {
                    ...state.deliveryZonesStatus,
                    [action.payload.zoneId]: {
                        ...state.deliveryZonesStatus[action.payload.zoneId],
                        expanded: !state.deliveryZonesStatus[action.payload.zoneId]
                            .expanded,
                    },
                },
            };
        }
        case RoutePlanningActionTypes.TOGGLE_EXPAND_ZONE_POINTS: {
            return {
                ...state,
                deliveryZonesStatus: {
                    ...state.deliveryZonesStatus,
                    [action.payload.zoneId]: {
                        ...state.deliveryZonesStatus[action.payload.zoneId],
                        expandedPoints: !state.deliveryZonesStatus[action.payload.zoneId]
                            .expandedPoints,
                    },
                },
            };
        }
        case RoutePlanningActionTypes.TOGGLE_EXPAND_ZONE_SETTINGS: {
            return {
                ...state,
                deliveryZonesStatus: {
                    ...state.deliveryZonesStatus,
                    [action.payload.zoneId]: {
                        ...state.deliveryZonesStatus[action.payload.zoneId],
                        expandedSettings: !state.deliveryZonesStatus[action.payload.zoneId]
                            .expandedSettings,
                    },
                },
            };
        }
        case RoutePlanningActionTypes.TOGGLE_EXPAND_ZONE_ROUTES: {
            return {
                ...state,
                deliveryZonesStatus: {
                    ...state.deliveryZonesStatus,
                    [action.payload.zoneId]: {
                        ...state.deliveryZonesStatus[action.payload.zoneId],
                        expandedRoutes: !state.deliveryZonesStatus[action.payload.zoneId]
                            .expandedRoutes,
                    },
                },
            };
        }
        case RoutePlanningActionTypes.TOGGLE_SWITCH_MAP_VIEW: {
            return {
                ...state,
                viewingMode: action.payload.view,
                ShowGeometry: false,
                ShowGeometryZone: false,
                zoneShowGeometry: 0,
                routeShowGeometry: 0,
            };
        }
        case RoutePlanningActionTypes.TOGGLE_EXPAND_ZONE_ROUTES_SETTINGS: {
            return {
                ...state,
                deliveryZonesStatus: {
                    ...state.deliveryZonesStatus,
                    [action.payload.zoneId]: {
                        ...state.deliveryZonesStatus[action.payload.zoneId],
                        expandedRoutesSettings: !state.deliveryZonesStatus[
                            action.payload.zoneId
                        ].expandedRoutesSettings,
                    },
                },
            };
        }
        case RoutePlanningActionTypes.SELECT_DELIVERY_POINT: {
            return {
                ...state,
                selectedDeliveryPoint:
                    state.selectedDeliveryPoint === action.payload.selectedPointId
                        ? -1
                        : action.payload.selectedPointId,
                depotOpened: false,
            };
        }
        case RoutePlanningActionTypes.TOGGLE_SWITCH_MAP_VIEW: {
            return { ...state, viewingMode: action.payload.view };
        }
        case RoutePlanningActionTypes.DESELECT_DELIVERY_POINT: {
            return { ...state, selectedDeliveryPoint: -1 };
        }
        case RoutePlanningActionTypes.SET_HOVERED_DELIVERY_POINT: {
            return { ...state, hoveredDeliveryPoint: action.payload.deliveryPointId };
        }
        case RoutePlanningActionTypes.TOGGLE_DEPOT_OPENED: {
            return { ...state, selectedDeliveryPoint: -1, depotOpened: !state.depotOpened };
        }
        case RoutePlanningActionTypes.SET_DEPOT_POINT: {
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    depotPoint: action.payload.depotPoint,
                },
            };
        }
        case RoutePlanningActionTypes.SET_HOVERED_ZONE: {
            return { ...state, hoveredZone: action.payload.zoneId };
        }
        case RoutePlanningActionTypes.HIGHLIGHT_ROUTE: {
            return { ...state, highlightedRoute: action.payload.routeId };
        }
        case RoutePlanningActionTypes.TOGGLE_USE_ROUTE_COLORS: {
            return { ...state, useRouteColors: !state.useRouteColors };
        }
        case RoutePlanningActionTypes.TOGGLE_SHOW_ONLY_OPTIMIZED_ZONES: {
            return { ...state, showOnlyOptimizedZones: !state.showOnlyOptimizedZones };
        }
        case RoutePlanningActionTypes.IMPORT_VRP_PLAN_SESSION: {
            return { ...state, loadedPlanningSession: false, loadingPlanningSession: true };
        }
        case RoutePlanningActionTypes.CREATE_VRP_PLAN_SESSION: {
            return state;
        }
        case RoutePlanningActionTypes.VRP_PLAN_SESSION_FAIL: {
            return { ...state, loadingPlanningSession: false, loadedPlanningSession: true };
        }
        case RoutePlanningActionTypes.SET_ZONE_ACTIVE_ROUTE: {
            return {
                ...state,
                deliveryZonesStatus: {
                    ...state.deliveryZonesStatus,
                    [action.payload.zoneId]: {
                        ...state.deliveryZonesStatus[action.payload.zoneId],
                        activeRoute: action.payload.routeId,
                    },
                },
            };
        }

        case RoutePlanningActionTypes.IMPORT_TEMPLATE_ROUTE_SUCESS: {
            let assignationDate = action.payload.assignationDate;
            let zones: { [key: number]: PlanningDeliveryZone } = {};
            let deliveryZonesStatus: { [key: number]: DeliveryZoneStatus } = {};
            let optimizationStatus: {
                [key: number]: OptimizationStatus;
            } = {};

            action.payload.deliveryZones.forEach((zone) => {
                let subZones = {};
                if (zone.isMultiZone) {
                    zone.deliveryZones.forEach((subZone) => {
                        subZones[subZone.id] = subZone;
                    });
                }
                optimizationStatus[zone.id] = initialOptimizationStatus;
                deliveryZonesStatus[zone.id] = initialDeliveryZoneStatus;
                deliveryZonesStatus[zone.id] = {
                    ...deliveryZonesStatus[zone.id],
                    evaluated: zone.evaluated,
                };
                zones[zone.id] = {
                    ...zone,
                    deliveryZones: subZones,
                    evaluated: zone.evaluated,
                };
            });
            return {
                ...state,
                viewingMode: RoutePlanningViewingMode.zones,
                sidenavOpened: true,
                loadingPlanningSession: false,
                loadedPlanningSession: true,
                deliveryZonesStatus: deliveryZonesStatus,
                optimizationStatus: optimizationStatus,
                routesStatus: null,
                planningSession: {
                    ...state.planningSession,
                    assignationDate,
                    depotPoint: action.payload.warehouse,
                    id: action.payload.id,
                    deliveryZones: zones,
                },
                saved: action.payload.saved,
            };
        }

        case RoutePlanningActionTypes.VRP_PLAN_SESSION_SUCCESS: {
            let assignationDate = action.payload.assignationDate;
            let zones: { [key: number]: PlanningDeliveryZone } = {};
            let deliveryZonesStatus: { [key: number]: DeliveryZoneStatus } = {};
            let optimizationStatus: {
                [key: number]: OptimizationStatus;
            } = {};

            action.payload.deliveryZones.forEach((zone) => {
                let subZones = {};
                if (zone.isMultiZone) {
                    zone.deliveryZones.forEach((subZone) => {
                        subZones[subZone.id] = subZone;
                    });
                }
                optimizationStatus[zone.id] = initialOptimizationStatus;
                deliveryZonesStatus[zone.id] = initialDeliveryZoneStatus;
                deliveryZonesStatus[zone.id] = {
                    ...deliveryZonesStatus[zone.id],
                    evaluated: zone.evaluated,
                };
                zones[zone.id] = {
                    ...zone,
                    deliveryZones: subZones,
                    evaluated: zone.evaluated,
                };
            });
            return {
                ...state,
                viewingMode: RoutePlanningViewingMode.zones,
                sidenavOpened: true,
                loadingPlanningSession: false,
                loadedPlanningSession: true,
                deliveryZonesStatus: deliveryZonesStatus,
                optimizationStatus: optimizationStatus,
                routesStatus: null,
                planningSession: {
                    ...state.planningSession,
                    assignationDate,
                    depotPoint: action.payload.warehouse,
                    id: action.payload.id,
                    deliveryZones: zones,
                },
                saved: action.payload.saved,
            };
        }

        // Simulation Actions
        case RoutePlanningActionTypes.SIMULATE_ALL: {
            return {
                ...state,
                simulating: 'All',
                simulationTime: 0,
                simulationVelocity: 3,
            };
        }
        case RoutePlanningActionTypes.SIMULATE_SELECTION: {
            return {
                ...state,
                simulating: 'Selected',
                simulationTime: 0,
                simulationVelocity: 3,
            };
        }
        case RoutePlanningActionTypes.CHANGE_SIMULATE_VELOCITY: {
            return { ...state, simulationVelocity: action.payload.newVelocity };
        }
        case RoutePlanningActionTypes.SIMULATE_STOP: {
            return { ...state, simulating: 'None' };
        }

        // Optimization Actions
        case RoutePlanningActionTypes.OPTIMIZE: {
            const optimizationStatus: {
                [key: number]: OptimizationStatus;
            } = { ...state.optimizationStatus };
            for (const zoneId of action.payload) {
                optimizationStatus[zoneId] = {
                    ...optimizationStatus[zoneId],
                    loading: true,
                    progress: 0,
                    state: null,
                };
            }
            return { ...state, optimizationStatus: optimizationStatus };
        }

        case RoutePlanningActionTypes.UPDATE_MAX_DELAY_TIME_SUCCESS: {
            const zone = state.planningSession.deliveryZones[action.payload.zoneId];
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...zone,
                            settings: {
                                ...zone.settings,
                                maxDelayTime: action.payload.value
                            }
                        }

                    }
                },
            };
        }

        // Asign Actions
        case RoutePlanningActionTypes.ASIGN: {
            return {
                ...state,
                assignate: false
            };
        }
        case RoutePlanningActionTypes.ASIGN_SUCCESS: {
            return {
                ...state,
                assignate: true
            };
        }
        case RoutePlanningActionTypes.ASIGN_FAIL: {
            return {
                ...state,
                assignate: false
            };
        }

        case RoutePlanningActionTypes.ASIGN_EVALUATED: {
            return {
                ...state,
                assignate: false
            };
        }

        case RoutePlanningActionTypes.ASIGN_EVALUATED_SUCCESS: {
            return {
                ...state,
                assignate: true
            };
        }


        case RoutePlanningActionTypes.OPTIMIZE_SUCCESS: {
            const zone = state.planningSession.deliveryZones[action.payload.zoneId];

            if (zone === undefined) {
                return {
                    ...state
                }
            }
            let routeStatus: {
                [key: number]: RouteStatus;
            } = {};
            action.payload.solution.routes.forEach((route) => {
                routeStatus[route.id] = initialRouteStatus;
            });
            let solution = _.cloneDeep(action.payload.solution.routes);
            return {
                ...state,
                optimizationStatus: {
                    ...state.optimizationStatus,
                    [zone.id]: {
                        ...state.optimizationStatus[zone.id],
                        loading: false,
                        state: 'completed',
                        error: undefined
                    },
                },
                deliveryZonesStatus: {
                    ...state.deliveryZonesStatus,
                    [zone.id]: {
                        ...state.deliveryZonesStatus[zone.id],
                        optimized: true,
                        selected: true,
                    },
                },
                routesStatus: { ...state.routesStatus, [zone.id]: routeStatus },
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...zone,
                            optimization: {
                                ...zone.optimization,
                                solution: {
                                    ...action.payload.solution,
                                    routes: solution,
                                },
                            },
                        },
                    },
                },
            };
        }
        case RoutePlanningActionTypes.OPTIMIZE_FAIL: {
            const optimizationStatus: {
                [key: number]: OptimizationStatus;
            } = { ...state.optimizationStatus };

            console.log(action.payload.zoneIds);
            for (const zoneId of action.payload.zoneIds) {
                optimizationStatus[zoneId] = {
                    loading: false,
                    progress: 0,
                    error: action.payload.error,
                    state: 'error',
                };
            }

            console.log(optimizationStatus);
            return { ...state, optimizationStatus: optimizationStatus };
        }
        case RoutePlanningActionTypes.SET_OPTIMIZATION_STATUS: {
            return {
                ...state,
                optimizationStatus: {
                    ...state.optimizationStatus,
                    [action.payload.zoneId]: {
                        ...state.optimizationStatus[action.payload.zoneId],
                        progress: action.payload.progress,
                        state:
                            action.payload.state == null
                                ? state.optimizationStatus[action.payload.zoneId].state
                                : action.payload.state,
                    },
                },
            };
        }

        case RoutePlanningActionTypes.TOGGLE_ROUTE: {

            let routes = _.cloneDeep(state.planningSession.deliveryZones[action.payload.zoneId].optimization.solution.routes);
            routes[action.payload.routeIndex] = {
                ...routes[action.payload.routeIndex],
                toggle: !routes[action.payload.routeIndex].toggle
            };
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            optimization: {
                                ...state.planningSession.deliveryZones[action.payload.zoneId].optimization,
                                solution: {
                                    ...state.planningSession.deliveryZones[action.payload.zoneId].optimization.solution,
                                    routes: routes
                                }
                            }
                        }
                    }
                }
            };
        }

        case RoutePlanningActionTypes.EVALUATE_SUCCESS: {
            let evaluate: any = {};

            evaluate.avgCustomerWaitTime = action.payload.avgCustomerWaitTime;
            evaluate.avgDelayTime = action.payload.avgDelayTime;
            evaluate.totalCustomerWaitTime = action.payload.totalCustomerWaitTime;
            evaluate.totalDelayTime = action.payload.totalDelayTime;
            evaluate.totalDeliveryPointsServicedLate =
                action.payload.totalDeliveryPointsServicedLate;
            evaluate.totalTime = action.payload.totalTime;
            evaluate.totalTravelDistance = action.payload.totalTravelDistance;
            evaluate.totalTravelTime = action.payload.totalTravelTime;
            evaluate.totalVehicleWaitTime = action.payload.totalVehicleWaitTime;

            // zones
            let zones = _.cloneDeep(state.planningSession.deliveryZones);
            let deliveryZonesStatus = _.cloneDeep(state.deliveryZonesStatus);

            action.payload.deliveryZones.forEach((element: any) => {
                if(element.evaluated && zones && zones[element.id]){
                    zones[element.id].geometry = element.geometry;
                zones[element.id].time = element.time;
                zones[element.id].travelDistance = element.travelDistance;
                zones[element.id].travelDistanceToFirst = element.travelDistanceToFirst;
                zones[element.id].travelTime = element.travelTime;
                zones[element.id].travelTimeToFirst = element.travelTimeToFirst;
                zones[element.id].evaluated = true;
                zones[element.id].customerWaitTime = element.customerWaitTime;
                zones[element.id].delayTime = element.delayTime;
                zones[element.id].vehicleWaitTime = element.vehicleWaitTime;
                zones[element.id].depotArrivalDayTime = element.depotArrivalDayTime;
                zones[element.id].departureDayTime = element.departureDayTime;
                zones[element.id].costTotal = element.costTotal;
                deliveryZonesStatus[element.id].evaluated = true;
                element.deliveryPoints.forEach((point) => {
                    if (zones[element.id].deliveryPoints.find(
                        (x) => x.id === point.id,
                    )) {
                        zones[element.id].deliveryPoints.find(
                            (x) => x.id === point.id,
                        ).travelDistanceToNext = point.travelDistanceToNext;
                        zones[element.id].deliveryPoints.find(
                            (x) => x.id === point.id,
                        ).travelTimeToNext = point.travelTimeToNext;
                        zones[element.id].deliveryPoints.find(
                            (x) => x.id === point.id,
                        ).vehicleWaitTime = point.vehicleWaitTime;
                        zones[element.id].deliveryPoints.find(
                            (x) => x.id === point.id,
                        ).arrivalDayTime = point.arrivalDayTime;
                        zones[element.id].deliveryPoints.find(
                            (x) => x.id === point.id,
                        ).arrivalTime = point.arrivalTime;
                        zones[element.id].deliveryPoints.find(
                            (x) => x.id === point.id,
                        ).customerWaitTime = point.customerWaitTime;
                        zones[element.id].deliveryPoints.find(
                            (x) => x.id === point.id,
                        ).delayTime = point.delayTime;
                        zones[element.id].deliveryPoints.find((x) => x.id === point.id).order =
                            point.order;
                        zones[element.id].deliveryPoints.find(
                                (x) => x.id === point.id,
                        ).cost = point.cost;
                    }
                });
                }
            });

            return {
                ...state,
                deliveryZonesStatus: deliveryZonesStatus,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: zones,
                    evaluate: evaluate,
                },
            };
        }

        case RoutePlanningActionTypes.SAVE_SESSION: {
            return { ...state };
        }

        case RoutePlanningActionTypes.SAVE_SESSION_SUCCESS: {
            return { ...state, saved: action.payload.data };
        }

        case RoutePlanningActionTypes.SAVE_SESSION_FAIL: {
            return { ...state };
        }

        case RoutePlanningActionTypes.RECOMPUTE: {
            const routeStatus: {
                [zoneId: number]: {
                    [routeId: number]: RouteStatus;
                };
            } = { ...state.routesStatus };
            for (const routeId in action.payload) {
                const zoneId = action.payload[routeId].zoneId;
                routeStatus[zoneId] = {
                    ...routeStatus[zoneId],
                    [routeId]: {
                        ...routeStatus[zoneId][routeId],
                        progress: 0,
                        recomputing: true,
                    },
                };
            }
            return { ...state, routesStatus: routeStatus };
        }
        //TODO:

        case RoutePlanningActionTypes.RECOMPUTE_SUCCESS: {
            let newRouteStatus: {
                [zoneId: number]: {
                    [routeId: number]: RouteStatus;
                };
            } = {
                ...state.routesStatus,
                [action.payload.zoneId]: {
                    ...state.routesStatus[action.payload.zoneId],
                    [action.payload.routeId]: {
                        ...state.routesStatus[action.payload.zoneId][
                        action.payload.routeId
                        ],
                        recomputing: false,
                    },
                },
            };
            let solution = _.cloneDeep(action.payload.route);

            const index = state.planningSession.deliveryZones[
                action.payload.zoneId
            ].optimization.solution.routes.findIndex(x => x.id === solution.id);

            solution = {
                ...solution,
                toggle: state.planningSession.deliveryZones[
                    action.payload.zoneId
                ].optimization.solution.routes[index].toggle
            }
            let newState = {
                ...state,
                routesStatus: newRouteStatus,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            optimization: {
                                ...state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].optimization,
                                solution: {
                                    ...state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].optimization.solution,
                                    routes: state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].optimization.solution.routes.map((route) => {
                                        if (route.id === solution.id) return solution;
                                        else return route;
                                    }),
                                },
                            },
                        },
                    },
                },
            };
            computeStats(
                newState.planningSession.deliveryZones[action.payload.zoneId].optimization
                    .solution,
            );
            return newState;
        }
        case RoutePlanningActionTypes.RECOMPUTE_FAIL: {
            const routeStatus: {
                [zoneId: number]: {
                    [routeId: number]: RouteStatus;
                };
            } = { ...state.routesStatus };
            for (const routeId in action.payload.routes) {
                const zoneId = action.payload.routes[routeId].zoneId;
                routeStatus[zoneId] = {
                    ...routeStatus[zoneId],
                    [routeId]: {
                        ...routeStatus[zoneId][routeId],
                        recomputing: false,
                        error: action.payload.error,
                    },
                };
            }
            return { ...state, routesStatus: routeStatus };
        }
        case RoutePlanningActionTypes.SET_RECOMPUTATION_PROGRESS: {
            return {
                ...state,
                routesStatus: {
                    ...state.routesStatus,
                    [action.payload.zoneId]: {
                        ...state.routesStatus[action.payload.zoneId],
                        [action.payload.routeId]: {
                            ...state.routesStatus[action.payload.zoneId][
                            action.payload.routeId
                            ],
                            progress: action.payload.progress,
                        },
                    },
                },
            };
        }

        // Evaluation Actions
        case RoutePlanningActionTypes.EVALUATE: {
            return state;
        }
        case RoutePlanningActionTypes.EVALUATE_SUCCESS: {
            return state;
        }
        case RoutePlanningActionTypes.EVALUATE_FAIL: {
            return {
                ...state,
                adding: false,
                moving: false,
                loadingPlanningSession: false,


            };
        }
        case RoutePlanningActionTypes.SET_EVALUATION_PROGRESS: {
            return state;
        }
        //

        case RoutePlanningActionTypes.CHANGE_FEE_ROUTE_SUCCESS: {
            let index = state.planningSession.deliveryZones[action.payload.zoneId].optimization.solution.routes.findIndex(x => x.id === action.payload.routeId);
            let routes = _.cloneDeep(state.planningSession.deliveryZones[action.payload.zoneId].optimization.solution.routes);


            routes[index] = {
                ...routes[index],
                vehicle: {
                    ...routes[index].vehicle,
                    userFeeCostId: action.payload.userFeeCostId
                }
            }

            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            optimization: {
                                ...state.planningSession.deliveryZones[action.payload.zoneId].optimization,
                                solution: {
                                    ...state.planningSession.deliveryZones[action.payload.zoneId].optimization.solution,
                                    routes: routes
                                }
                            }
                        }
                    }
                }
            }
        }

        case RoutePlanningActionTypes.JOIN_ZONES_SUCCESS: {
            let newDeliveryZones: { [key: number]: PlanningDeliveryZone } = {
                ...state.planningSession.deliveryZones
            };
            let newDeliveryZonesStatus: { [key: number]: DeliveryZoneStatus } = {
                ...state.deliveryZonesStatus,
            };
            let newRoutesStatus: {
                [zoneId: number]: {
                    [routeId: number]: RouteStatus;
                };
            } = { ...state.routesStatus };
            let newOptimizationStatus: {
                [zoneId: number]: OptimizationStatus;
            } = { ...state.optimizationStatus };
            for (const zoneId of action.payload.zonesToJoin) {
                newDeliveryZones = { ...newDeliveryZones, [zoneId]: null };
                newDeliveryZonesStatus = { ...newDeliveryZonesStatus, [zoneId]: null };
                newRoutesStatus = { ...newRoutesStatus, [zoneId]: null };
                newOptimizationStatus = { ...newOptimizationStatus, [zoneId]: null };
                delete newDeliveryZones[zoneId];
                delete newDeliveryZonesStatus[zoneId];
                delete newRoutesStatus[zoneId];
                delete newOptimizationStatus[zoneId];
            }
            let subZones = {};
            action.payload.newZone.deliveryZones.forEach((subZone) => {
                subZones[subZone.id] = subZone;
            });
            newDeliveryZones[action.payload.newZone.id] = {
                ...action.payload.newZone,
                deliveryZones: subZones,
                vehicles: action.payload.vehicles ? action.payload.vehicles : [],
                settings: {
                    ...action.payload.newZone.settings,
                    optimizationParameters: initialQuantifiedOptimizationParameters,
                },
            };

            newDeliveryZonesStatus = {
                ...newDeliveryZonesStatus,
                [action.payload.newZone.id]: {
                    ...initialDeliveryZoneStatus,
                    evaluated: false,
                    selected: true,
                },
            };
            newOptimizationStatus = {
                ...newOptimizationStatus,
                [action.payload.newZone.id]: initialOptimizationStatus,
            };
            let viewingMode = state.viewingMode;
            if (viewingMode === 1 && Object.keys(newRoutesStatus).length === 0) {
                viewingMode = 0;
            }
            return {
                ...state,
                viewingMode: viewingMode,
                deliveryZonesStatus: newDeliveryZonesStatus,
                routesStatus: newRoutesStatus,
                optimizationStatus: newOptimizationStatus,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: newDeliveryZones,
                },
            };
        }
        case RoutePlanningActionTypes.SPLIT_ZONES_SUCCESS: {
            let newDeliveryZones: { [key: number]: PlanningDeliveryZone } = {
                ...state.planningSession.deliveryZones,
            };
            let newDeliveryZonesStatus: { [key: number]: DeliveryZoneStatus } = {
                ...state.deliveryZonesStatus,
            };
            let newRoutesStatus: {
                [zoneId: number]: {
                    [routeId: number]: RouteStatus;
                };
            } = { ...state.routesStatus };

            let newOptimizationStatus: {
                [zoneId: number]: OptimizationStatus;
            } = { ...state.optimizationStatus };
            for (const zone of action.payload.newZones as PlanningDeliveryZone[]) {
                newDeliveryZones = { ...newDeliveryZones, [zone.id]: null };
                newRoutesStatus = { ...newRoutesStatus, [zone.id]: null };
                newOptimizationStatus = { ...newOptimizationStatus, [zone.id]: null };
                delete newDeliveryZones[zone.id];
                delete newRoutesStatus[zone.id];
                delete newOptimizationStatus[zone.id];
                if (zone.id === action.payload.zoneId) {
                    newDeliveryZones = { ...newDeliveryZones, [zone.id]: null };
                    newRoutesStatus = { ...newRoutesStatus, [zone.id]: null };
                    delete newDeliveryZones[zone.id];
                    delete newRoutesStatus[zone.id];

                    newDeliveryZones = {
                        ...newDeliveryZones,
                        [action.payload.zoneId]: {
                            ...newDeliveryZones[action.payload.zoneId],
                            ...zone,
                        },
                    };

                    newOptimizationStatus = {
                        ...newOptimizationStatus,
                        [zone.id]: initialOptimizationStatus,
                    };

                    newDeliveryZonesStatus = {
                        ...newDeliveryZonesStatus,
                        [zone.id]: {
                            ...newDeliveryZonesStatus[zone.id],
                            optimized: false,
                            evaluated: false,
                        },
                    };

                    if (newDeliveryZones[zone.id].optimization) {
                        newDeliveryZones = {
                            ...newDeliveryZones,
                            [zone.id]: {
                                ...newDeliveryZones[zone.id],
                                optimization: null,
                            },
                        };
                    }
                } else {
                    newDeliveryZonesStatus = {
                        ...newDeliveryZonesStatus,
                        [zone.id]: {
                            ...initialDeliveryZoneStatus,
                            evaluated: false
                        },
                    };
                    newDeliveryZones = {
                        ...newDeliveryZones,
                        [zone.id]: {
                            ...zone,
                            settings: {
                                ...zone.settings,
                                optimizationParameters: initialQuantifiedOptimizationParameters,
                            },
                        },
                    };
                    newOptimizationStatus = {
                        ...newOptimizationStatus,
                        [zone.id]: initialOptimizationStatus,
                    };
                }
            }
            if (
                !action.payload.newZones
                    .map((x: PlanningDeliveryZone) => x.id)
                    .includes(action.payload.zoneId)
            ) {
                delete newDeliveryZones[action.payload.zoneId];
                delete newDeliveryZonesStatus[action.payload.zoneId];
            }
            let viewingMode = state.viewingMode;


            let countZonesOptimized = 0;
            Object.keys(newDeliveryZones).map((key) => {
                if (state.deliveryZonesStatus[key] && state.deliveryZonesStatus[key].optimized) {
                    countZonesOptimized += 1;
                }
            });

            if (viewingMode === 1 && countZonesOptimized === 0) {
                viewingMode = 0;
            }
            return {
                ...state,
                viewingMode: viewingMode,
                deliveryZonesStatus: newDeliveryZonesStatus,
                routesStatus: newRoutesStatus,
                optimizationStatus: newOptimizationStatus,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: newDeliveryZones,
                },
            };
        }

        case RoutePlanningActionTypes.UPDATE_ZONE_NAME: {
            const zone = state.planningSession.deliveryZones[action.payload.zoneId];
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: { ...zone, name: action.payload.name },
                    },
                },
            };
        }
        case RoutePlanningActionTypes.UPDATE_ZONE_COLOR: {
            const zone = state.planningSession.deliveryZones[action.payload.zoneId];
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: { ...zone, color: action.payload.color },
                    },
                },
            };
        }
        case RoutePlanningActionTypes.UPDATE_ROUTE_COLOR: {
            const zone = state.planningSession.deliveryZones[action.payload.zoneId];
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...zone,
                            optimization: {
                                ...zone.optimization,
                                solution: {
                                    ...zone.optimization.solution,
                                    routes: zone.optimization.solution.routes.map(
                                        (route) => {
                                            if (route.id === action.payload.routeId) {
                                                return {
                                                    ...route,
                                                    color: action.payload.color,
                                                };
                                            } else {
                                                return route;
                                            }
                                        },
                                    ),
                                },
                            },
                        },
                    },
                },
            };
        }

        case RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ZONE_FAIL: {
            return {
                ...state,
                moving: false
            }
        }

        case RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ZONE_SUCCESS: {

            let zones: { [key: number]: PlanningDeliveryZone } = {};
            let deliveryZonesStatus: { [key: number]: DeliveryZoneStatus } = {};

            action.payload.deliveryZones.forEach((zone) => {
                let optimization = null;
                if(state.planningSession.deliveryZones[zone.id] && state.planningSession.deliveryZones[zone.id].optimization){
                    optimization = {
                        ...state.planningSession.deliveryZones[zone.id].optimization
                    }
                }
                let subZones = {};
                if (zone.isMultiZone) {
                    zone.deliveryZones.forEach((subZone) => {
                        subZones[subZone.id] = subZone;
                    });
                }

                zones[zone.id] = {
                    ...zone,
                    deliveryZones: subZones,
                    evaluated: zone.evaluated,
                };

                if(optimization){
                    zones[zone.id] = {
                        ...zones[zone.id],
                        optimization: optimization
                    };
                }
                deliveryZonesStatus[zone.id] = {
                    ...deliveryZonesStatus[zone.id],
                    evaluated: zone.evaluated,
                };
            });


            console.log('aqui llego', action.payload);
            //if (action.payload.newZoneId !== action.payload.oldZoneId) {
                return {
                    ...state,
                    moving: false,
                    viewingMode: RoutePlanningViewingMode.zones,
                    planningSession: {
                        ...state.planningSession,
                        deliveryZones: zones,
                    }
                };
            /* } else {
                let newDeliveryPoints: DeliveryPoint[];
                newDeliveryPoints = [
                    ...state.planningSession.deliveryZones[action.payload.oldZoneId]
                        .deliveryPoints,
                ];
                let newOrder = Math.max(
                    Math.min(action.payload.newOrder, newDeliveryPoints.length),
                    1,
                );
                newDeliveryPoints[action.payload.oldOrder - 1] = {
                    ...newDeliveryPoints[action.payload.oldOrder - 1],
                    order: newOrder,
                };
                let movedDeliveryPoint = newDeliveryPoints[action.payload.oldOrder - 1];
                if (newOrder > action.payload.oldOrder) {
                    for (let i = action.payload.oldOrder; i < newOrder; ++i) {
                        newDeliveryPoints[i] = {
                            ...newDeliveryPoints[i],
                            order: newDeliveryPoints[i].order - 1,
                        };
                    }
                } else if (newOrder < action.payload.oldOrder) {
                    for (let i = action.payload.oldOrder - 1; i >= newOrder - 1; --i) {
                        newDeliveryPoints[i] = {
                            ...newDeliveryPoints[i],
                            order: newDeliveryPoints[i].order + 1,
                        };
                    }
                }
                newDeliveryPoints.splice(action.payload.oldOrder - 1, 1);
                newDeliveryPoints.splice(newOrder - 1, 0, movedDeliveryPoint);
                return {
                    ...state,
                    moving: false,
                    planningSession: {
                        ...state.planningSession,
                        deliveryZones: {
                            ...state.planningSession.deliveryZones,
                            [action.payload.oldZoneId]: {
                                ...state.planningSession.deliveryZones[
                                action.payload.oldZoneId
                                ],
                                deliveryPoints: newDeliveryPoints,
                            },
                        },
                    },
                };
            } */

        }

        case RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ZONE: {
            return {
                ...state,
                moving: true
            }
        }
        case RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ROUTE: {
            let newDeliveryZones = { ...state.planningSession.deliveryZones };
            if (action.payload.oldZoneId === action.payload.newZoneId) {
                const zone = { ...newDeliveryZones[action.payload.newZoneId] };
                const newRoutes = [...zone.optimization.solution.routes];
                if (action.payload.oldRouteId === action.payload.newRouteId) {
                    const index = newRoutes.findIndex(
                        (r: Route) => r.id === action.payload.newRouteId,
                    );
                    let newRoute = { ...newRoutes[index] };
                    const newDeliveryPoints = [...newRoute.deliveryPoints];
                    let dp = {
                        ...newDeliveryPoints[action.payload.oldOrder - 1],
                        order: action.payload.newOrder,
                    };
                    if (action.payload.newOrder > action.payload.oldOrder) {
                        for (
                            let i = action.payload.oldOrder;
                            i < action.payload.newOrder;
                            ++i
                        ) {
                            newDeliveryPoints[i] = {
                                ...newDeliveryPoints[i],
                                order: newDeliveryPoints[i].order - 1,
                            };
                        }
                    } else if (action.payload.newOrder < action.payload.oldOrder) {
                        for (
                            let i = action.payload.oldOrder - 2;
                            i > action.payload.newOrder - 1;
                            --i
                        ) {
                            newDeliveryPoints[i] = {
                                ...newDeliveryPoints[i],
                                order: newDeliveryPoints[i].order - 1,
                            };
                        }
                    }
                    newDeliveryPoints.splice(action.payload.oldOrder - 1, 1);
                    newDeliveryPoints.splice(action.payload.newOrder - 1, 0, dp);
                    newRoute.deliveryPoints = newDeliveryPoints;

                    return {
                        ...state,
                        moving: true,
                        planningSession: {
                            ...state.planningSession,
                            deliveryZones: {
                                ...state.planningSession.deliveryZones,
                                [zone.id]: {
                                    ...zone,
                                    optimization: {
                                        ...zone.optimization,
                                        solution: {
                                            ...zone.optimization.solution,
                                            routes: zone.optimization.solution.routes.map(
                                                (route: Route) => {
                                                    if (route.id === newRoute.id) {
                                                        return newRoute;
                                                    } else {
                                                        return route;
                                                    }
                                                },
                                            ),
                                        },
                                    },
                                },
                            },
                        },
                        routesStatus: {
                            ...state.routesStatus,
                            [zone.id]: {
                                ...state.routesStatus[zone.id],
                                [newRoute.id]: {
                                    ...state.routesStatus[zone.id][newRoute.id],
                                    evaluating: true,
                                },
                            },
                        },
                    };
                } else {
                    const zone = {
                        ...state.planningSession.deliveryZones[action.payload.newZoneId],
                    };
                    const zoneRoutes = [...zone.optimization.solution.routes];
                    const originalRouteIndex = zoneRoutes.findIndex(
                        (route: Route) => route.id === action.payload.oldRouteId,
                    );
                    const originalRoute = { ...zoneRoutes[originalRouteIndex] };
                    const objectiveRouteIndex = zoneRoutes.findIndex(
                        (route: Route) => route.id === action.payload.newRouteId,
                    );
                    const objectiveRoute = { ...zoneRoutes[objectiveRouteIndex] };
                    const movingDeliveryPoint = {
                        ...originalRoute.deliveryPoints[action.payload.oldOrder - 1],
                    };
                    const newZoneRoutes =
                        originalRouteIndex < objectiveRouteIndex
                            ? [
                                ...zoneRoutes.slice(0, originalRouteIndex),
                                {
                                    ...removeDeliveryPointFromRoute(
                                        originalRoute,
                                        action.payload.oldOrder,
                                    ),
                                },
                                ...zoneRoutes.slice(
                                    originalRouteIndex + 1,
                                    objectiveRouteIndex,
                                ),
                                {
                                    ...addDeliveryPointToRoute(
                                        objectiveRoute,
                                        movingDeliveryPoint,
                                        action.payload.newOrder,
                                    ),
                                },
                                ...zoneRoutes.slice(objectiveRouteIndex + 1),
                            ]
                            : [
                                ...zoneRoutes.slice(0, objectiveRouteIndex),
                                {
                                    ...addDeliveryPointToRoute(
                                        objectiveRoute,
                                        movingDeliveryPoint,
                                        action.payload.newOrder,
                                    ),
                                },
                                ...zoneRoutes.slice(
                                    objectiveRouteIndex + 1,
                                    originalRouteIndex,
                                ),
                                {
                                    ...removeDeliveryPointFromRoute(
                                        originalRoute,
                                        action.payload.oldOrder,
                                    ),
                                },
                                ...zoneRoutes.slice(originalRouteIndex + 1),
                            ];

                    return {
                        ...state,
                        moving: true,
                        planningSession: {
                            ...state.planningSession,
                            deliveryZones: {
                                ...state.planningSession.deliveryZones,
                                [zone.id]: {
                                    ...zone,
                                    optimization: {
                                        ...zone.optimization,
                                        solution: {
                                            ...zone.optimization.solution,
                                            routes: [...newZoneRoutes],
                                        },
                                    },
                                },
                            },
                        },
                        routesStatus: {
                            ...state.routesStatus,
                            [action.payload.oldZoneId]: {
                                ...state.routesStatus[action.payload.oldZoneId],
                                [action.payload.oldRouteId]: {
                                    ...state.routesStatus[action.payload.oldZoneId][
                                    action.payload.oldRouteId
                                    ],
                                    evaluating: true,
                                },
                                [action.payload.newRouteId]: {
                                    ...state.routesStatus[action.payload.oldZoneId][
                                    action.payload.newRouteId
                                    ],
                                    evaluating: true,
                                },
                            },
                        },
                    };
                }
            } else {
                const originZone = {
                    ...state.planningSession.deliveryZones[action.payload.oldZoneId],
                };

                const originRouteIndex = originZone.optimization.solution.routes.findIndex(
                    (route: Route) => route.id == action.payload.oldRouteId,
                );


                const position = action.payload.oldOrder - 1;
                const movingDeliveryPoint = {
                    ...originZone.optimization.solution.routes[originRouteIndex]
                        .deliveryPoints[position === -1 ? 0 : position],
                };
                const newPastRoute = removeDeliveryPointFromRoute(
                    {
                        ...originZone.optimization.solution.routes[originRouteIndex],
                    },
                    action.payload.oldOrder,
                );


                const objectiveZone = {
                    ...state.planningSession.deliveryZones[action.payload.newZoneId],
                };

                const objectiveRouteIndex = objectiveZone.optimization.solution.routes.findIndex(
                    (route: Route) => route.id == action.payload.newRouteId,
                );


                const newObjectiveRoute = addDeliveryPointToRoute(
                    {
                        ...objectiveZone.optimization.solution.routes[objectiveRouteIndex],
                    },
                    movingDeliveryPoint,
                    action.payload.newOrder,
                );

                return {
                    ...state,
                    moving: true,
                    planningSession: {
                        ...state.planningSession,
                        deliveryZones: {
                            ...state.planningSession.deliveryZones,
                            [originZone.id]: {
                                ...originZone,
                                optimization: {
                                    ...originZone.optimization,
                                    solution: {
                                        ...originZone.optimization.solution,
                                        routes: [
                                            ...originZone.optimization.solution.routes.slice(
                                                0,
                                                originRouteIndex,
                                            ),
                                            {
                                                ...newPastRoute,
                                            },
                                            ...originZone.optimization.solution.routes.slice(
                                                originRouteIndex + 1,
                                            ),
                                        ],
                                    },
                                },
                            },
                            [objectiveZone.id]: {
                                ...objectiveZone,
                                optimization: {
                                    ...objectiveZone.optimization,
                                    solution: {
                                        ...objectiveZone.optimization.solution,
                                        routes: [
                                            ...objectiveZone.optimization.solution.routes.slice(
                                                0,
                                                objectiveRouteIndex,
                                            ),
                                            {
                                                ...newObjectiveRoute,
                                            },
                                            ...objectiveZone.optimization.solution.routes.slice(
                                                objectiveRouteIndex + 1,
                                            ),
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    routesStatus: {
                        ...state.routesStatus,
                        [action.payload.oldZoneId]: {
                            ...state.routesStatus[action.payload.oldZoneId],
                            [action.payload.oldRouteId]: {
                                ...state.routesStatus[action.payload.oldZoneId][
                                action.payload.oldRouteId
                                ],
                                evaluating: true,
                            },
                        },
                        [action.payload.newZoneId]: {
                            ...state.routesStatus[action.payload.newZoneId],
                            [action.payload.newRouteId]: {
                                ...state.routesStatus[action.payload.newZoneId][
                                action.payload.newRouteId
                                ],
                                evaluating: true,
                            },
                        },
                    },
                };
            }
        }
        case RoutePlanningActionTypes.MOVE_DELIVERY_POINT_ROUTE_SUCCESS: {

            if (action.payload.oldZoneId === action.payload.newZoneId) {
                const zone = state.planningSession.deliveryZones[action.payload.oldZoneId];
                if (action.payload.oldRouteId === action.payload.newRouteId) {
                    const newSolution: RoutePlanningSolution = {
                        ...zone.optimization.solution,
                        routes: zone.optimization.solution.routes.map((route) => {
                            if (route.id === action.payload.newRouteId) {
                                return {
                                    ...action.payload.newRoutes[0],
                                    toggle: true
                                };
                            } else return route;
                        }),
                    };
                    computeStats(newSolution);

                    return {
                        ...state,
                        moving: false,
                        planningSession: {
                            ...state.planningSession,
                            deliveryZones: {
                                ...state.planningSession.deliveryZones,
                                [action.payload.oldZoneId]: {
                                    ...state.planningSession.deliveryZones[
                                    action.payload.oldZoneId
                                    ],
                                    optimization: {
                                        ...state.planningSession.deliveryZones[
                                            action.payload.oldZoneId
                                        ].optimization,
                                        solution: newSolution,
                                    },
                                },
                            },
                        },
                        routesStatus: {
                            ...state.routesStatus,
                            [action.payload.oldZoneId]: {
                                ...state.routesStatus[action.payload.oldZoneId],
                                [action.payload.oldRouteId]: {
                                    ...state.routesStatus[action.payload.oldZoneId][
                                    action.payload.oldRouteId
                                    ],
                                    evaluating: false,
                                },
                            },
                        },
                    };
                } else {
                    const newSolution: RoutePlanningSolution = {
                        ...zone.optimization.solution,
                        routes: zone.optimization.solution.routes.map((route) => {
                            if (route.id === action.payload.newRouteId) {
                                return action.payload.newRoutes.find(
                                    (newRoute) => newRoute.id === action.payload.newRouteId,
                                );
                            } else if (route.id === action.payload.oldRouteId) {
                                return action.payload.newRoutes.find(
                                    (newRoute) => newRoute.id === action.payload.oldRouteId,
                                );
                            } else return route;
                        }),
                    };
                    computeStats(newSolution);
                    return {
                        ...state,
                        moving: false,
                        planningSession: {
                            ...state.planningSession,
                            deliveryZones: {
                                ...state.planningSession.deliveryZones,
                                [action.payload.oldZoneId]: {
                                    ...state.planningSession.deliveryZones[
                                    action.payload.oldZoneId
                                    ],
                                    optimization: {
                                        ...state.planningSession.deliveryZones[
                                            action.payload.oldZoneId
                                        ].optimization,
                                        solution: newSolution,
                                    },
                                },
                            },
                        },

                        routesStatus: {
                            ...state.routesStatus,
                            [action.payload.oldZoneId]: {
                                ...state.routesStatus[action.payload.oldZoneId],
                                [action.payload.oldRouteId]: {
                                    ...state.routesStatus[action.payload.oldZoneId][
                                    action.payload.oldRouteId
                                    ],
                                    evaluating: false,
                                },
                                [action.payload.newRouteId]: {
                                    ...state.routesStatus[action.payload.oldZoneId][
                                    action.payload.newRouteId
                                    ],
                                    evaluating: false,
                                },
                            },
                        },
                    };
                }
            } else {
                const oldZone =
                    state.planningSession.deliveryZones[action.payload.oldZoneId];
                const newZone =
                    state.planningSession.deliveryZones[action.payload.newZoneId];

                const newSolutionOrigin: RoutePlanningSolution = {
                    ...oldZone.optimization.solution,
                    routes: oldZone.optimization.solution.routes.map((route: Route) => {
                        if (route.id === action.payload.oldRouteId) {
                            return {
                                ...action.payload.newRoutes.find(
                                    (x) => x.id === action.payload.oldRouteId,
                                ),
                                toggle: true
                            }
                        } else {
                            return {
                                ...route,
                                toggle: true
                            };
                        }
                    }),
                };

                const newSolutionDest = {
                    ...newZone.optimization.solution,
                    routes: newZone.optimization.solution.routes.map((route: Route) => {
                        if (route.id === action.payload.newRouteId) {

                            return {
                                ...action.payload.newRoutes.find(
                                    (x) => x.id === action.payload.newRouteId,
                                ),
                                toggle: true
                            }
                        } else {
                            return {
                                ...route,
                                toggle: true
                            };
                        }
                    }),
                };

                computeStats(newSolutionOrigin);
                computeStats(newSolutionDest);
                return {
                    ...state,
                    moving: false,
                    planningSession: {
                        ...state.planningSession,
                        deliveryZones: {
                            ...state.planningSession.deliveryZones,
                            [action.payload.oldZoneId]: {
                                ...state.planningSession.deliveryZones[
                                action.payload.oldZoneId
                                ],
                                optimization: {
                                    ...state.planningSession.deliveryZones[
                                        action.payload.oldZoneId
                                    ].optimization,
                                    solution: newSolutionOrigin,
                                },
                            },
                            [action.payload.newZoneId]: {
                                ...state.planningSession.deliveryZones[
                                action.payload.newZoneId
                                ],
                                optimization: {
                                    ...state.planningSession.deliveryZones[
                                        action.payload.newZoneId
                                    ].optimization,
                                    solution: newSolutionDest,
                                },
                            },
                        },
                    },
                    routesStatus: {
                        ...state.routesStatus,
                        [action.payload.oldZoneId]: {
                            ...state.routesStatus[action.payload.oldZoneId],
                            [action.payload.oldRouteId]: {
                                ...state.routesStatus[action.payload.oldZoneId][
                                action.payload.oldRouteId
                                ],
                                evaluating: false,
                            },
                        },
                        [action.payload.newZoneId]: {
                            ...state.routesStatus[action.payload.newZoneId],
                            [action.payload.newRouteId]: {
                                ...state.routesStatus[action.payload.newZoneId][
                                action.payload.newRouteId
                                ],
                                evaluating: false,
                            },
                        },
                    },
                };
            }
        }
        case RoutePlanningActionTypes.PRIORITY_CHANGE_SUCCESS: {
            const zone = state.planningSession.deliveryZones[action.payload.zoneId];
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...zone,
                            deliveryPoints: zone.deliveryPoints.map((dp) =>
                                dp.id !== action.payload.deliveryPointId
                                    ? dp
                                    : {
                                        ...dp,
                                        priority: action.payload.value,
                                    },
                            ),
                        },
                    },
                },
            };
        }

        // Zone Settings -> Assigned Vehicles Actions
        case RoutePlanningActionTypes.ADD_VEHICLES_TO_ZONE_SUCCESS: {
            let vehiclesObject = {};
            action.payload.vehicles.forEach((v) => (vehiclesObject[v.id] = v));
            let deliveryZones = {};
            for (let zoneId in state.planningSession.deliveryZones) {
                if (state.planningSession.deliveryZones[zoneId].isMultiZone) {
                    if (+zoneId === action.payload.zoneId) {
                        deliveryZones[zoneId] = {
                            ...state.planningSession.deliveryZones[zoneId],
                            vehicles:  action.payload.vehicles
                        };
                    } else {
                        let subZones = {};
                        for (let subZoneId in state.planningSession.deliveryZones[zoneId]
                            .deliveryZones) {
                            subZones[subZoneId] = {
                                ...state.planningSession.deliveryZones[zoneId]
                                    .deliveryZones[subZoneId],
                                vehicles: state.planningSession.deliveryZones[
                                    zoneId
                                ].deliveryZones[subZoneId].vehicles.filter(
                                    (v) => !(v.id in vehiclesObject),
                                ),
                            };
                        }
                        deliveryZones[zoneId] = {
                            ...state.planningSession.deliveryZones[zoneId],
                            vehicles: state.planningSession.deliveryZones[
                                zoneId
                            ].vehicles.filter((v) => !(v.id in vehiclesObject)),
                            deliveryZones: subZones,
                        };
                    }
                } else {
                    if (+zoneId === action.payload.zoneId) {

                        deliveryZones[zoneId] = {
                            ...state.planningSession.deliveryZones[zoneId],
                            vehicles: action.payload.vehicles,
                        };
                    } else {
                        deliveryZones[zoneId] = {
                            ...state.planningSession.deliveryZones[zoneId],
                            vehicles: state.planningSession.deliveryZones[
                                zoneId
                            ].vehicles.filter((v) => !(v.id in vehiclesObject)),
                        };
                    }
                }
            }
            return {
                ...state,
                planningSession: { ...state.planningSession, deliveryZones: deliveryZones },
            };
        }

        case RoutePlanningActionTypes.UPDATE_VEHICLE_FROM_ZONE: {
            let zoneId: number;
            if (!action.payload.zoneId && state.planningSession) {
                for (let zone in state.planningSession.deliveryZones) {
                    if (state.planningSession.deliveryZones[zone].isMultiZone) {
                        state.planningSession.deliveryZones[zone].vehicles.forEach((v) => {
                            if (v.id === action.payload.vehicleId) {
                                zoneId = +zone;
                            }
                        });
                        if (!zoneId) {
                            for (let subZoneId in state.planningSession.deliveryZones[zone]
                                .deliveryZones) {
                                state.planningSession.deliveryZones[zone].deliveryZones[
                                    subZoneId
                                ].vehicles.forEach((v) => {
                                    if (v.id === action.payload.vehicleId) {
                                        zoneId = +subZoneId;
                                    }
                                });
                            }
                        }
                    } else {
                        state.planningSession.deliveryZones[zone].vehicles.forEach((v) => {

                            console.log('aqui llego este', action.payload);
                            if (v.id === action.payload.vehicleId) {
                                zoneId = +zone;
                            }
                        });
                    }
                }
            } else if (action.payload.zoneId) zoneId = action.payload.zoneId;
            if (!state.planningSession || !zoneId) return state;
            let deliveryZone = {};
            for (let zone in state.planningSession.deliveryZones) {
                if (state.planningSession.deliveryZones[zone].isMultiZone) {
                    if (state.planningSession.deliveryZones[zone].id === zoneId) {
                        deliveryZone[zone] = {
                            ...state.planningSession.deliveryZones[zone],
                            vehicles: state.planningSession.deliveryZones[
                                zone
                            ].vehicles.map((v) => {
                                if (v.id === action.payload.vehicleId) {
                                    return {
                                        ...v,
                                        ...action.payload.results,
                                    };
                                } else {
                                    return { ...v };
                                }
                            }),
                        };
                    } else {
                        if (
                            zoneId in
                            state.planningSession.deliveryZones[zone].deliveryZones
                        ) {
                            deliveryZone[zone] = {
                                ...state.planningSession.deliveryZones[zone],
                                deliveryZones: {
                                    ...state.planningSession.deliveryZones[zone]
                                        .deliveryZones,
                                    [zoneId]: {
                                        ...state.planningSession.deliveryZones[zone]
                                            .deliveryZones[zoneId],
                                        vehicles: state.planningSession.deliveryZones[
                                            zone
                                        ].deliveryZones[zoneId].vehicles.map((v) => {
                                            if (v.id === action.payload.vehicleId) {
                                                return {
                                                    ...v,
                                                    ...action.payload.results,
                                                };
                                            } else {
                                                return { ...v };
                                            }
                                        }),
                                    },
                                },
                            };
                        }
                    }
                } else {
                    if (state.planningSession.deliveryZones[zone].id === zoneId) {
                        deliveryZone[zone] = {
                            ...state.planningSession.deliveryZones[zone],
                            vehicles: state.planningSession.deliveryZones[
                                zone
                            ].vehicles.map((v) => {
                                if (v.id === action.payload.vehicleId) {
                                    return {
                                        ...v,
                                        ...action.payload.results,
                                    };
                                } else {
                                    return { ...v };
                                }
                            }),
                        };
                    }
                }
            }
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        ...deliveryZone,
                    },
                },
            };
        }

        case RoutePlanningActionTypes.UPDATE_VEHICLE_FROM_ZONE_SUCCESS: {
            let zoneId: number;
            if (!action.payload.zoneId && state.planningSession) {
                for (let zone in state.planningSession.deliveryZones) {
                    if (state.planningSession.deliveryZones[zone].isMultiZone) {
                        state.planningSession.deliveryZones[zone].vehicles.forEach((v) => {
                            if (v.id === action.payload.vehicleId) {
                                zoneId = +zone;
                            }
                        });
                        if (!zoneId) {
                            for (let subZoneId in state.planningSession.deliveryZones[zone]
                                .deliveryZones) {
                                state.planningSession.deliveryZones[zone].deliveryZones[
                                    subZoneId
                                ].vehicles.forEach((v) => {
                                    if (v.id === action.payload.vehicleId) {
                                        zoneId = +subZoneId;
                                    }
                                });
                            }
                        }
                    } else {
                        state.planningSession.deliveryZones[zone].vehicles.forEach((v) => {

                            console.log('aqui llego este', action.payload);
                            if (v.id === action.payload.vehicleId) {
                                zoneId = +zone;
                            }
                        });
                    }
                }
            } else if (action.payload.zoneId) zoneId = action.payload.zoneId;
            if (!state.planningSession || !zoneId) return state;
            let deliveryZone = {};
            for (let zone in state.planningSession.deliveryZones) {
                if (state.planningSession.deliveryZones[zone].isMultiZone) {
                    if (state.planningSession.deliveryZones[zone].id === zoneId) {
                        deliveryZone[zone] = {
                            ...state.planningSession.deliveryZones[zone],
                            vehicles: state.planningSession.deliveryZones[
                                zone
                            ].vehicles.map((v) => {
                                if (v.id === action.payload.vehicleId) {
                                    return {
                                        ...v,
                                        ...action.payload.results,
                                    };
                                } else {
                                    return { ...v };
                                }
                            }),
                        };
                    } else {
                        if (
                            zoneId in
                            state.planningSession.deliveryZones[zone].deliveryZones
                        ) {
                            deliveryZone[zone] = {
                                ...state.planningSession.deliveryZones[zone],
                                deliveryZones: {
                                    ...state.planningSession.deliveryZones[zone]
                                        .deliveryZones,
                                    [zoneId]: {
                                        ...state.planningSession.deliveryZones[zone]
                                            .deliveryZones[zoneId],
                                        vehicles: state.planningSession.deliveryZones[
                                            zone
                                        ].deliveryZones[zoneId].vehicles.map((v) => {
                                            if (v.id === action.payload.vehicleId) {
                                                return {
                                                    ...v,
                                                    ...action.payload.results,
                                                };
                                            } else {
                                                return { ...v };
                                            }
                                        }),
                                    },
                                },
                            };
                        }
                    }
                } else {
                    if (state.planningSession.deliveryZones[zone].id === zoneId) {
                        deliveryZone[zone] = {
                            ...state.planningSession.deliveryZones[zone],
                            vehicles: state.planningSession.deliveryZones[
                                zone
                            ].vehicles.map((v) => {
                                if (v.id === action.payload.vehicleId) {
                                    return {
                                        ...v,
                                        ...action.payload.results,
                                    };
                                } else {
                                    return { ...v };
                                }
                            }),
                        };
                    }
                }
            }
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        ...deliveryZone,
                    },
                },
            };
        }
        case RoutePlanningActionTypes.REMOVE_VEHICLE_FROM_ZONE_SUCCESS: {
            let zoneId: number;
            if (!action.payload.zoneId && state.planningSession) {
                for (let zone in state.planningSession.deliveryZones) {
                    if (state.planningSession.deliveryZones[zone].isMultiZone) {
                        state.planningSession.deliveryZones[zone].vehicles.forEach((v) => {
                            if (v.id === action.payload.vehicleId) {
                                zoneId = +zone;
                            }
                        });
                        if (!zoneId) {
                            for (let subZoneId in state.planningSession.deliveryZones[zone]
                                .deliveryZones) {
                                state.planningSession.deliveryZones[zone].deliveryZones[
                                    subZoneId
                                ].vehicles.forEach((v) => {
                                    if (v.id === action.payload.vehicleId) {
                                        zoneId = +subZoneId;
                                    }
                                });
                            }
                        }
                    } else {
                        state.planningSession.deliveryZones[zone].vehicles.forEach((v) => {
                            if (v.id === action.payload.vehicleId) {
                                zoneId = +zone;
                            }
                        });
                    }
                }
            } else if (action.payload.zoneId) zoneId = action.payload.zoneId;
            if (!state.planningSession || !zoneId) return state;
            let deliveryZone = {};
            for (let zone in state.planningSession.deliveryZones) {
                if (state.planningSession.deliveryZones[zone].isMultiZone) {
                    if (state.planningSession.deliveryZones[zone].id === zoneId) {
                        deliveryZone[zone] = {
                            ...state.planningSession.deliveryZones[zone],
                            vehicles: state.planningSession.deliveryZones[
                                zone
                            ].vehicles.filter((v) => v.id !== action.payload.vehicleId),
                        };
                    } else {
                        if (
                            zoneId in
                            state.planningSession.deliveryZones[zone].deliveryZones
                        ) {
                            deliveryZone[zone] = {
                                ...state.planningSession.deliveryZones[zone],
                                deliveryZones: {
                                    ...state.planningSession.deliveryZones[zone]
                                        .deliveryZones,
                                    [zoneId]: {
                                        ...state.planningSession.deliveryZones[zone]
                                            .deliveryZones[zoneId],
                                        vehicles: state.planningSession.deliveryZones[
                                            zone
                                        ].deliveryZones[zoneId].vehicles.filter(
                                            (v) => v.id !== action.payload.vehicleId,
                                        ),
                                    },
                                },
                            };
                        }
                    }
                } else {
                    if (state.planningSession.deliveryZones[zone].id === zoneId) {
                        deliveryZone[zone] = {
                            ...state.planningSession.deliveryZones[zone],
                            vehicles: state.planningSession.deliveryZones[
                                zone
                            ].vehicles.filter((v) => +v.id !== +action.payload.vehicleId),
                        };

                    }
                }
            }
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        ...deliveryZone,
                    },
                },
                adding: false
            };
        }
        case RoutePlanningActionTypes.REMOVE_VEHICLE_FROM_ZONE: {
            return {
                ...state,
                adding: true
            }
        }
        case RoutePlanningActionTypes.TOGGLE_USE_ALL_VEHICLES_SUCCESS: {
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            settings: {
                                ...state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].settings,
                                useAllVehicles: !state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].settings.useAllVehicles,
                            },
                        },
                    },
                },
            };
        }
        case RoutePlanningActionTypes.TOGGLE_IGNORE_CAPACITY_LIMIT_SUCCESS: {
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            settings: {
                                ...state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].settings,
                                ignoreCapacityLimit: !state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].settings.ignoreCapacityLimit,
                            },
                        },
                    },
                },
            };
        }

        case RoutePlanningActionTypes.TOGGLE_USER_SKILLS_SUCCESS: {
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            settings: {
                                ...state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].settings,
                                settingsUseSkills: !state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].settings.settingsUseSkills,
                            },
                        },
                    },
                },
            };
        }

        case RoutePlanningActionTypes.TOGGLE_FORCE_DEPARTURE_TIME_SUCCESS: {
            const zone = state.planningSession.deliveryZones[action.payload.zoneId];
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...zone,
                            settings: {
                                ...zone.settings,
                                forceDepartureTime: !zone.settings.forceDepartureTime,
                            },
                        },
                    },
                },
            };
        }

        // Zone Settings -> Parameters to Optimize Actions
        case RoutePlanningActionTypes.UPDATE_OPTIMIZATION_PARAMETERS: {
            const zone = state.planningSession.deliveryZones[action.payload.zoneId];
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...zone,
                            settings: {
                                ...zone.settings,
                                optimizationParameters: {
                                    preference: {
                                        ...zone.settings.optimizationParameters.preference,
                                        ...action.payload.optimizationParameters.preference,
                                    },
                                },
                            },
                        },
                    },
                },
            };
        }

        // Zone Settings -> Delivery Schedule Actions
        case RoutePlanningActionTypes.UPDATE_DELIVERY_SCHEDULE_SUCCESS: {
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            settings: {
                                ...state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].settings,
                                deliverySchedule: {
                                    ...state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].settings.deliverySchedule,
                                    ...action.payload.deliverySchedule,
                                },
                            },
                        },
                    },
                },
            };
        }
        case RoutePlanningActionTypes.UPDATE_EXPLORATION_LEVEL_SUCCESS: {
            const zone = state.planningSession.deliveryZones[action.payload.zoneId];
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...zone,
                            settings: {
                                ...zone.settings,
                                explorationLevel: action.payload.value,
                            },
                        },
                    },
                },
            };
        }

        case RoutePlanningActionTypes.UPDATE_DELIVERY_POINT_TIME_WINDOW_SUCCESS: {
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            deliveryPoints: state.planningSession.deliveryZones[
                                action.payload.zoneId
                            ].deliveryPoints.map((dp) => {
                                if (dp.id === action.payload.deliveryPointId) {
                                    return {
                                        ...dp,
                                        deliveryWindow: {
                                            ...dp.deliveryWindow,
                                            ...action.payload.deliveryWindow,
                                        },
                                        address: action.payload.address,
                                        serviceTime: action.payload.serviceTime,
                                        coordinates: action.payload.coordinates,
                                        leadTime: action.payload.leadTime,
                                        allowedDelayTime: action.payload.allowedDelayTime,
                                        deliveryType: action.payload.deliveryType,
                                        orderNumber: action.payload.orderNumber,
                                        allowDelayTime: action.payload.allowDelayTime,
                                        companyPreferenceDelayTimeId: action.payload.companyPreferenceDelayTimeId
                                    };
                                } else {
                                    return dp;
                                }
                            }),
                        },
                    },
                },
            };
        }

        case RoutePlanningActionTypes.UPDATE_ROUTE_DELIVERY_POINT_TIME_WINDOW_SUCCESS: {
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            optimization: {
                                ...state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].optimization,
                                solution: {
                                    ...state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].optimization.solution,
                                    routes: state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].optimization.solution.routes.map((route) => {
                                        if (route.id === action.payload.routeId) {
                                            return {
                                                ...route,
                                                deliveryPoints: route.deliveryPoints.map(
                                                    (dp) => {
                                                        if (
                                                            dp.id ===
                                                            action.payload.deliveryPointId
                                                        ) {
                                                            return {
                                                                ...dp,
                                                                deliveryWindow: {
                                                                    ...dp.deliveryWindow,
                                                                    ...action.payload
                                                                        .deliveryWindow,
                                                                },
                                                                leadTime: action.payload.leadTime,
                                                                deliveryType: action.payload.deliveryType,
                                                                orderNumber: action.payload.orderNumber,
                                                                allowDelayTime: action.payload.allowDelayTime,
                                                                companyPreferenceDelayTimeId: action.payload.companyPreferenceDelayTimeId
                                                            };
                                                        } else return dp;
                                                    },
                                                ),
                                            };
                                        } else {
                                            return route;
                                        }
                                    }),
                                },
                            },
                        },
                    },
                },
            };
        }

        // Route Settings

        case RoutePlanningActionTypes.UPDATE_ROUTE_OPTIMIZATION_PARAMETERS: {
            const zone = state.planningSession.deliveryZones[action.payload.zoneId];
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...zone,
                            settings: {
                                ...zone.settings,
                                optimizationParameters: {
                                    preference: {
                                        ...zone.settings.optimizationParameters.preference,
                                        ...action.payload.optimizationParameters.preference,
                                    },
                                },
                            },
                        },
                    },
                },
            };
        }

        case RoutePlanningActionTypes.UPDATE_ROUTE_DELIVERY_SCHEDULE_SUCCESS: {
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            optimization: {
                                ...state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].optimization,
                                solution: {
                                    ...state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].optimization.solution,
                                    routes: state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].optimization.solution.routes.map((route) => {
                                        if (route.id === action.payload.routeId) {
                                            return {
                                                ...route,
                                                settings: {
                                                    ...route.settings,
                                                    deliverySchedule: {
                                                        ...route.settings.deliverySchedule,
                                                        ...action.payload.deliverySchedule,
                                                    },
                                                },
                                            };
                                        } else {
                                            return route;
                                        }
                                    }),
                                },
                            },
                        },
                    },
                },
            };
        }
        case RoutePlanningActionTypes.UPDATE_ROUTE_EXPLORATION_LEVEL_SUCCESS: {
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            optimization: {
                                ...state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].optimization,
                                solution: {
                                    ...state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].optimization.solution,
                                    routes: state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].optimization.solution.routes.map((route) => {
                                        if (route.id === action.payload.routeId) {
                                            return {
                                                ...route,
                                                settings: {
                                                    ...route.settings,
                                                    explorationLevel: action.payload.value,
                                                },
                                            };
                                        } else {
                                            return route;
                                        }
                                    }),
                                },
                            },
                        },
                    },
                },
            };
        }

        case RoutePlanningActionTypes.TOGGLE_ROUTE_FORCE_DEPARTURE_TIME_SUCCESS: {
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            optimization: {
                                ...state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].optimization,
                                solution: {
                                    ...state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].optimization.solution,
                                    routes: state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].optimization.solution.routes.map((route) => {
                                        if (route.id === action.payload.routeId) {
                                            return {
                                                ...route,
                                                settings: {
                                                    ...route.settings,
                                                    forceDepartureTime: !route.settings
                                                        .forceDepartureTime,
                                                },
                                            };
                                        } else {
                                            return route;
                                        }
                                    }),
                                },
                            },
                        },
                    },
                },
            };
        }

        case RoutePlanningActionTypes.UPDATE_OPTIMIZE_FROM_INDEX_SUCCESS: {
            let solution = _.cloneDeep(
                state.planningSession.deliveryZones[action.payload.zoneId].optimization
                    .solution.routes,
            );
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            optimization: {
                                ...state.planningSession.deliveryZones[
                                    action.payload.zoneId
                                ].optimization,
                                solution: {
                                    ...state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].optimization.solution,
                                    routes: state.planningSession.deliveryZones[
                                        action.payload.zoneId
                                    ].optimization.solution.routes.map((route) => {
                                        if (route.id === action.payload.routeId) {
                                            return {
                                                ...solution.find((x) => x.id === route.id),
                                                settings: {
                                                    ...route.settings,
                                                    optimizeFromIndex: action.payload.value,
                                                },
                                            };
                                        } else {
                                            return route;
                                        }
                                    }),
                                },
                            },
                        },
                    },
                },
            };
        }
        case RoutePlanningActionTypes.DELETE_DELIVERY_POINT_SUCCESS: {
            let points = _.cloneDeep(
                state.planningSession.deliveryZones[action.payload.zoneId].deliveryPoints,
            );
            const index = state.planningSession.deliveryZones[
                action.payload.zoneId
            ].deliveryPoints.findIndex((x) => x.id === action.payload.deliveryPointId);
            let deliveryZones = _.cloneDeep(state.planningSession.deliveryZones);
            deliveryZones[action.payload.zoneId] = {
                ...deliveryZones[action.payload.zoneId],
                evaluated: false,
                geometry: '',
                customerWaitTime: 0,
                evaluation: null,
                deliveryPoints: points,
                delayTime: 0,
                depotArrivalDayTime: 0,
                travelDistance: 0,
                travelTime: 0,
                vehicleWaitTime: 0,
            };
            points.splice(index, 1);

            deliveryZones[action.payload.zoneId] = {
                ...deliveryZones[action.payload.zoneId],
                evaluated: false,
                geometry: '',
                customerWaitTime: 0,
                evaluation: null,
                deliveryPoints: points,
            };

            return {
                ...state,
                deliveryZonesStatus: {
                    ...state.deliveryZonesStatus,
                    [action.payload.zoneId]: {
                        ...state.deliveryZonesStatus[action.payload.zoneId],
                        evaluated: false,
                    },
                },
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: deliveryZones,
                },
            };
        }
        case RoutePlanningActionTypes.LOGOUT_ROUTE_PLANNING: {
            return RoutePlanningInitialState;
        }
        case RoutePlanningActionTypes.ADD_DELIVERY_POINT: {
            return {
                ...state,
                adding: true
            }
        }
        case RoutePlanningActionTypes.ADD_DELIVERY_POINT_SUCCESS: {
            let points = _.cloneDeep(state.planningSession.deliveryZones[action.payload.routePlanningDeliveryZoneId].deliveryPoints);
            action.payload.deliveryPoints.forEach(element => {
                points.push(element);
            });
            points.push
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.routePlanningDeliveryZoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.routePlanningDeliveryZoneId],
                            deliveryPoints: points
                        }
                    }
                },
                adding: false
            }
        }

        case RoutePlanningActionTypes.ADD_DELIVERY_POINT_FAIL: {
            return {
                ...state,
                adding: false
            }
        }
        case RoutePlanningActionTypes.ADD_DELIVERY_POINT_EVALUATED: {
            return {
                ...state,
                adding: true
            }
        }

        case RoutePlanningActionTypes.ADD_DELIVERY_POINT_EVALUATED_FAIL: {
            return {
                ...state,
                adding: false
            }
        }
        case RoutePlanningActionTypes.ADD_DELIVERY_POINT_EVALUATED_SUCCESS: {
            const deliveryZone = state.planningSession.deliveryZones[action
                .payload.planningDeliveryZone.id];

            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    evaluate: {
                        ...state.planningSession.evaluate,
                        totalTime: action.payload.totalTime,
                        totalTravelTime: action.payload.totalTravelTime,
                        totalCustomerWaitTime: action.payload.totalCustomerWaitTime,
                        totalVehicleWaitTime: action.payload.totalVehicleWaitTime,
                        totalDelayTime: action.payload.totalDelayTime,
                        totalTravelDistance: action.payload.totalTravelDistance,
                        totalDeliveryPointsServicedLate: action.payload.totalDeliveryPointsServicedLate,
                        avgCustomerWaitTime: action.payload.avgCustomerWaitTime,
                        avgDelayTime: action.payload.avgDelayTime
                    },
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.planningDeliveryZone.id]: {
                            ...action.payload.planningDeliveryZone,
                            optimization: deliveryZone.optimization,
                            vehicles: deliveryZone.vehicles,
                            settings: deliveryZone.settings,

                        },
                    },
                },
                adding: false
            }
        }
        case RoutePlanningActionTypes.MOVE_UNASSIGNED_POINT: {
            return {
                ...state,
                routesStatus: {
                    ...state.routesStatus,
                    [action.payload.zoneIdOri]: {
                        ...state.routesStatus[action.payload.zoneIdOri],
                        [action.payload.routeIdOri]: {
                            ...state.routesStatus[action.payload.zoneIdOri][
                            action.payload.routeIdOri
                            ],
                            evaluating: true,
                        },
                    },
                    [action.payload.zoneId]: {
                        ...state.routesStatus[action.payload.zoneId],
                        [action.payload.routeId]: {
                            ...state.routesStatus[action.payload.zoneId][
                            action.payload.routeId
                            ],
                            evaluating: true,
                        },
                    }
                },
            }
        }
        case RoutePlanningActionTypes.MOVE_UNASSIGNED_POINT_FAIL: {
            return {
                ...state,
                routesStatus: {
                    ...state.routesStatus,
                    [action.payload.zoneIdOri]: {
                        ...state.routesStatus[action.payload.zoneIdOri],
                        [action.payload.routeIdOri]: {
                            ...state.routesStatus[action.payload.zoneIdOri][
                            action.payload.routeIdOri
                            ],
                            evaluating: false,
                        },
                    },
                    [action.payload.zoneId]: {
                        ...state.routesStatus[action.payload.zoneId],
                        [action.payload.routeId]: {
                            ...state.routesStatus[action.payload.zoneId][
                            action.payload.routeId
                            ],
                            evaluating: false,
                        },
                    }
                },
            }
        }
        case RoutePlanningActionTypes.DELETE_POINT_UNASSIGNED_SUCCESS: {


            const routes = _.cloneDeep(state.planningSession.deliveryZones[action.payload.zoneId].optimization.solution.routes);
            routes.forEach((route) => {
                if (route.id === action.payload.routeId) {
                    route.deliveryPointsUnassigned = [];
                }
            })
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            optimization: {
                                ...state.planningSession.deliveryZones[action.payload.zoneId].optimization,
                                solution: {
                                    ...state.planningSession.deliveryZones[action.payload.zoneId].optimization.solution,
                                    routes
                                }
                            }
                        }
                    }
                }

            }
        }
        case RoutePlanningActionTypes.MOVE_UNASSIGNED_POINT_SUCCESS: {

            console.log('esta es la acción', action);
            if (action.payload.routeId !== action.payload.routeIdOri) {
                const routes = state.planningSession.deliveryZones[action.payload.zoneId]
                    .optimization.solution.routes
                    .filter(x => x.id != action.payload.routeId);


                const index = routes.findIndex(x => x.id != action.payload.routeId);

                routes.push({
                    ...action.payload.routes[0],
                });


                routes[index] = {
                    ...routes[index],
                    toggle: true
                }

                const unassinedPoints = state.planningSession.deliveryZones[action.payload.zoneIdOri]
                    .optimization.solution.routes.find(x => x.id === action.payload.routeIdOri)
                    .deliveryPointsUnassigned.filter(x => x.id !== action.payload.unassignedDeliveryPoints[0].id);
                return {
                    ...state,
                    planningSession: {
                        ...state.planningSession,
                        deliveryZones: {
                            ...state.planningSession.deliveryZones,
                            [action.payload.zoneId]: {
                                ...state.planningSession.deliveryZones[action.payload.zoneId],
                                optimization: {
                                    ...state.planningSession.deliveryZones[action.payload.zoneId].optimization,
                                    solution: {
                                        ...state.planningSession.deliveryZones[action.payload.zoneId].optimization.solution,
                                        routes: routes
                                    }
                                }
                            },
                            [action.payload.zoneIdOri]: {
                                ...state.planningSession.deliveryZones[action.payload.zoneIdOri],
                                optimization: {
                                    ...state.planningSession.deliveryZones[action.payload.zoneIdOri].optimization,
                                    solution: {
                                        ...state.planningSession.deliveryZones[action.payload.zoneIdOri].optimization.solution,
                                        routes: state.planningSession.deliveryZones[action.payload.zoneIdOri].optimization.solution.routes.map((route) => {
                                            if (route.id === action.payload.routeIdOri) {
                                                return {
                                                    ...route,
                                                    deliveryPointsUnassigned: unassinedPoints
                                                };
                                            } else {
                                                return route;
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    },
                    routesStatus: {
                        ...state.routesStatus,
                        [action.payload.zoneIdOri]: {
                            ...state.routesStatus[action.payload.zoneIdOri],
                            [action.payload.routeIdOri]: {
                                ...state.routesStatus[action.payload.zoneIdOri][
                                action.payload.routeIdOri
                                ],
                                evaluating: false,
                            },
                        },
                        [action.payload.zoneId]: {
                            ...state.routesStatus[action.payload.zoneId],
                            [action.payload.routeId]: {
                                ...state.routesStatus[action.payload.zoneId][
                                action.payload.routeId
                                ],
                                evaluating: false,
                            },
                        }
                    },
                }
            } else {
                const routes = state.planningSession.deliveryZones[action.payload.zoneId]
                    .optimization.solution.routes
                    .filter(x => x.id != action.payload.routeId);
                routes.push(
                    {
                        ...action.payload.routes[0],
                        toggle: true
                    });
                return {
                    ...state,
                    planningSession: {
                        ...state.planningSession,
                        deliveryZones: {
                            ...state.planningSession.deliveryZones,
                            [action.payload.zoneId]: {
                                ...state.planningSession.deliveryZones[action.payload.zoneId],
                                optimization: {
                                    ...state.planningSession.deliveryZones[action.payload.zoneId].optimization,
                                    solution: {
                                        ...state.planningSession.deliveryZones[action.payload.zoneId].optimization.solution,
                                        routes: routes
                                    }
                                }
                            }
                        }
                    },
                    routesStatus: {
                        ...state.routesStatus,
                        [action.payload.zoneId]: {
                            ...state.routesStatus[action.payload.zoneId],
                            [action.payload.routeId]: {
                                ...state.routesStatus[action.payload.zoneId][
                                action.payload.routeId
                                ],
                                evaluating: false,
                            },
                        }
                    },
                }
            }

        }
        case RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT: {
            return {
                ...state,
                moving: true
            }
        }
        case RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT_SUCCESS: {
            let deliveryZones = state.planningSession.deliveryZones;

            let deliveryZonesStatus = _.cloneDeep(state.deliveryZonesStatus);


            action.payload.result.forEach((data) => {
                console.log(action.payload, data);
                deliveryZones = {
                    ...deliveryZones,
                    [data.id]: {
                        ...state.planningSession.deliveryZones[data.id],
                        deliveryPoints: data.deliveryPoints,
                        optimization: {}
                    }
                };

                deliveryZonesStatus = {
                    ...deliveryZonesStatus,
                    [data.id]: {
                        ...deliveryZonesStatus[data.id],
                        optimized: false
                    }
                }
            });
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: deliveryZones,
                },
                deliveryZonesStatus: deliveryZonesStatus,
                viewingMode: 0,
                moving: false
            }
        }

        case RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED: {
            return {
                ...state,
                moving: true
            }
        }
        case RoutePlanningActionTypes.MOVE_MULTIPLE_DELIVERY_POINT_OPTIMIZED_SUCCESS: {


            // busqueda de ruta nueva y asignación de la misma
            const routes = state.planningSession.deliveryZones[action.payload.zoneDestId]
                .optimization.solution.routes
                .filter(x => x.id != action.payload.routeId);
            routes.push(action.payload.routes.find(x => x.id === action.payload.routeId));

            // busqueda y asignacion de la ruta origen
            const routesOri = state.planningSession.deliveryZones[action.payload.zoneOrigId]
                .optimization.solution.routes
                .filter(x => x.id != action.payload.routeIdOri);
            routesOri.push(action.payload.routes.find(x => x.id === action.payload.routeIdOri));

            return {
                ...state,
                moving: false,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneDestId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneDestId],
                            optimization: {
                                ...state.planningSession.deliveryZones[action.payload.zoneDestId].optimization,
                                solution: {
                                    ...state.planningSession.deliveryZones[action.payload.zoneDestId].optimization.solution,
                                    routes: routes
                                }
                            }
                        },
                        [action.payload.zoneOrigId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneOrigId],
                            optimization: {
                                ...state.planningSession.deliveryZones[action.payload.zoneOrigId].optimization,
                                solution: {
                                    ...state.planningSession.deliveryZones[action.payload.zoneOrigId].optimization.solution,
                                    routes: routesOri
                                }
                            }
                        }
                    }
                },
                routesStatus: {
                    ...state.routesStatus,
                    [action.payload.zoneOrigId]: {
                        ...state.routesStatus[action.payload.zoneOrigId],
                        [action.payload.routeIdOri]: {
                            ...state.routesStatus[action.payload.zoneOrigId][
                            action.payload.routeIdOri
                            ],
                            evaluating: false,
                        },
                    },
                    [action.payload.zoneDestId]: {
                        ...state.routesStatus[action.payload.zoneDestId],
                        [action.payload.routeId]: {
                            ...state.routesStatus[action.payload.zoneDestId][
                            action.payload.routeId
                            ],
                            evaluating: false,
                        },
                    }
                },
            }
        }
        case RoutePlanningActionTypes.ADD_ROUTE_PLANNING_DELIVERY_ZONE: {
            return {
                ...state,
                added: false
            }
        }

        case RoutePlanningActionTypes.ADD_CROSS_DOCKING_SUCCESS: {
            const zoneId: number = action.payload.zoneId;
            const crossDocking: number =  action.payload.crossDocking;
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [zoneId]: {
                            ...state.planningSession.deliveryZones[zoneId],
                            crossDocking: crossDocking
                        }
                    }
                }
            }
        }

        case RoutePlanningActionTypes.ADD_ROUTE_PLANNING_DELIVERY_ZONE_SUCCESS: {
            const zoneId: number = action.payload.zone.id;
            return {
                ...state,
                added: true,
                addZoneId: zoneId,
                deliveryZonesStatus: {
                    ...state.deliveryZonesStatus,
                    [zoneId]: {
                        activeRoute: 0,
                        displayed: false,
                        evaluated: false,
                        dirty: false,
                        expanded: false,
                        expandedPoints: false,
                        expandedRoutes: false,
                        expandedRoutesSettings: false,
                        expandedSettings: false,
                        optimized: false,
                        selected: false
                    }
                },
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [zoneId]: {
                            id: zoneId,
                            name: action.payload.zone.name,
                            color: action.payload.zone.color,
                            sessionId: action.payload.sessionId,
                            deliveryPoints: [],
                            identifier: action.payload.zone.identifier,
                            useDefaultSettings: true,
                            associatedRoute: action.payload.zone.associatedRoute,
                            isMultiZone: false,
                            settings: {
                                ...action.payload.zone.settings,
                                optimizationParameters: {
                                    preference: {
                                        customerSatisfaction: 0,
                                        numVehicles: 0,
                                        travelDistance: 0,
                                        vehicleTimeBalance: 0
                                    }
                                }
                            },
                            vehicles: action.payload.vehicles,

                        }
                    }
                },
                optimizationStatus: {
                    ...state.optimizationStatus,
                    [zoneId]: {
                        loading: false,
                        progress: 0,
                        state: ''
                    }
                }
            }
        }

        case RoutePlanningActionTypes.MOVE_POINT_FROM_MAP: {
            return {
                ...state,
                moving: true,
            }
        }
        case RoutePlanningActionTypes.MOVE_POINT_FROM_MAP_SUCCESS: {
            let deliveryZones = _.cloneDeep(state.planningSession.deliveryZones);
            let optimizationStatus = _.cloneDeep(state.optimizationStatus);
            action.payload.routeMove.deliveryZones.forEach((zone) => {


                if (!zone.multiDeliveryZoneId || zone.multiDeliveryZoneId == null) {
                    deliveryZones = {
                        ...deliveryZones,
                        [zone.id]: {
                            ...zone,
                            deliveryZones: deliveryZones[zone.id].deliveryZones,
                            vehicles: zone.vehicles ? zone.vehicles : deliveryZones[zone.id] && deliveryZones[zone.id].vehicles ? deliveryZones[zone.id].vehicles : [],
                            settings: {
                                ignoreCapacityLimit: zone.settingsIgnorecapacitylimit,
                                optimizationParameters: {
                                    preference: {
                                        customerSatisfaction: 0,
                                        numVehicles: 0,
                                        travelDistance: 0,
                                        vehicleTimeBalance: 0
                                    }
                                }
                            },
                            optimization: deliveryZones[zone.id] ? deliveryZones[zone.id].optimization : {}
                        }
                    }

                    optimizationStatus = {
                        ...optimizationStatus,
                        [zone.id]: {
                            loading: false,
                            progress: 0,
                            state: ''
                        }
                    }
                }
            });
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...deliveryZones
                    },
                },
                optimizationStatus: {
                    ...optimizationStatus
                },
                moving: false
            }
        }

        case RoutePlanningActionTypes.ADD_FEET_SUCCESS: {

            let vehicles =  _.cloneDeep(state.planningSession.deliveryZones[action.payload.zoneId].vehicles);
            let index = vehicles.findIndex(x => x.id === action.payload.vehicleId);

            vehicles[index] = {
                ...vehicles[index],
                userFeeCostId: action.payload.userFeeCostId
            }


            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            vehicles: vehicles
                        }
                    },
                }
            }
        }

        case RoutePlanningActionTypes.ROUTE_MOVE_POINT_FROM_MAP: {
            return {
                ...state,
                moving: true,
                moved: false
            }
        }

        case RoutePlanningActionTypes.ROUTE_MOVE_POINT_FROM_MAP_SUCCESS: {

            let zones = Object.keys(state.planningSession.deliveryZones).map((key) => state.planningSession.deliveryZones[key]);;
            let deliveryZones = _.cloneDeep(state.planningSession.deliveryZones);
            var result = zones.filter((zone) => {
                return zone.optimization
                    && zone.optimization.solution
                    && zone.optimization.solution.routes
                    && zone.optimization.solution.routes.length > 0
                    && action.payload.routeMove.routes.find(x => zone.optimization.solution.routes.find(y => y.id === x.id) != undefined)
            });
            result.forEach((zone) => {
                if (action.payload.routeMove.routes.filter(x => zone.optimization.solution.routes.find(y => y.id === x.id) != undefined)) {
                    action.payload.routeMove.routes.filter(x => zone.optimization.solution.routes.find(y => y.id === x.id) != undefined).forEach((element) => {


                        let index = deliveryZones[zone.id].optimization.solution.routes.findIndex(x => x.id === element.id);
                        let routes = deliveryZones[zone.id].optimization.solution.routes;
                        routes[index] = element;

                        deliveryZones[zone.id] = {
                            ...deliveryZones[zone.id],
                            optimization: {
                                ...deliveryZones[zone.id].optimization,
                                solution: {
                                    ...deliveryZones[zone.id].optimization.solution,
                                    routes,


                                }
                            }
                        }
                    });

                    computeStats(deliveryZones[zone.id].optimization.solution);
                }

            })
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...deliveryZones
                    }

                },
                moving: false,
                moved: true,
            }
        }


        case RoutePlanningActionTypes.GET_DELIVERY_POINT_PENDING_COUNT_SUCCESS: {
            return {
                ...state,
                deliveryPointPending: action.payload.count
            }
        }

        case RoutePlanningActionTypes.CHANGE_VEHICLE_SCHEDULE_SPECIFICATION_SUCCESS: {

            const index = state.planningSession.deliveryZones[action.payload.zoneId].vehicles.findIndex(v => v.id === +action.payload.vehicleId);
            const vehicles = _.cloneDeep(state.planningSession.deliveryZones[action.payload.zoneId].vehicles);

            vehicles[index].vehicleScheduleSpecificationId = +action.payload.datos.vehicleScheduleSpecificationId;


            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            vehicles
                        }
                    }
                }
            }
        }

        case RoutePlanningActionTypes.CHANGE_VEHICLE_SCHEDULES_HOURS_SUCCESS: {


            console.log('action change hours:', action.payload);

            const index = state.planningSession.deliveryZones[action.payload.zoneId].vehicles.findIndex(v => v.id === +action.payload.vehicleId);
            const vehicles = _.cloneDeep(state.planningSession.deliveryZones[action.payload.zoneId].vehicles);

            vehicles[index].deliveryPointScheduleTypeId = +action.payload.datos.deliveryPointScheduleTypeId;


            vehicles[index].schedules.find(x => x.id === +action.payload.datos.vehicleScheduleDayId).hours[0] = {
                timeEnd: action.payload.datos.timeEnd,
                timeStart: action.payload.datos.timeStart,
                id: action.payload.datos.vehicleScheduleHourId
            }

            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            vehicles
                        }
                    }
                }
            }
        }

        case RoutePlanningActionTypes.CHANGE_DRIVER_VEHICLE_ROUTE_SUCCCESS: {

            const routes = _.cloneDeep(state.planningSession.deliveryZones[action.payload.zoneId].optimization.solution.routes);
            const index = state.planningSession.deliveryZones[action.payload.zoneId].optimization.solution.routes.findIndex(x => x.id === action.payload.route.id);

            routes[index] = {
                ...routes[index],
                vehicle: {
                    ...routes[index].vehicle,
                    userId: action.payload.driver
                }
            }


            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            optimization: {
                                ...state.planningSession.deliveryZones[action.payload.zoneId].optimization,
                                solution: {
                                    ...state.planningSession.deliveryZones[action.payload.zoneId].optimization.solution,
                                    routes
                                }
                            }
                        }
                    }
                }
            }
        }


        case RoutePlanningActionTypes.CHANGE_DRIVER_VEHICLE_SUCCCESS: {
            let vehicles =  _.cloneDeep(state.planningSession.deliveryZones[action.payload.zoneId].vehicles);
            let index = vehicles.findIndex(x => x.id === action.payload.vehicleId);

            console.log(action.payload.User);
            vehicles[index] = {
                ...vehicles[index],
                userId: action.payload.driver,
                user: action.payload.User
            }

            console.log('<---- vehicle ----->', vehicles);
            return {
                ...state,
                planningSession: {
                    ...state.planningSession,
                    deliveryZones: {
                        ...state.planningSession.deliveryZones,
                        [action.payload.zoneId]: {
                            ...state.planningSession.deliveryZones[action.payload.zoneId],
                            vehicles: vehicles
                        }
                    },
                }
            }
        }


        case RoutePlanningActionTypes.CLOSE_COMPLETE_ACTION: {
            return {
                ...state,
                closeComplete: action.payload.closeComplete
            }
        }

        case RoutePlanningActionTypes.DELETE_ZONE_ROUTE_SUCCESS: {


            const deliveryZones = state.planningSession.deliveryZones;

            const deliveryZonesStatus = state.deliveryZonesStatus;



            const { [action.payload.routePlanningZoneId]: removedProperty, ...deliveryZonesRest } = deliveryZones;

            const { [action.payload.routePlanningZoneId]: removedProperty2, ...deliveryZonesStatusRest } = deliveryZonesStatus;


            if (_.isEmpty(deliveryZonesRest)) {
                return RoutePlanningInitialState;
            }
            else {
                return {
                    ...state,
                    planningSession: {
                        ...state.planningSession,
                        deliveryZones: deliveryZonesRest
                    },
                    deliveryZonesStatus: deliveryZonesStatusRest
                }
            }


        }

        case RoutePlanningActionTypes.LOAD_SESSION_INTO_PLANNING_ROUTE: {
            return {
                ...state,
                moving: true,
                moved: false,
            }
        }

        case RoutePlanningActionTypes.LOAD_SESSION_INTO_PLANNING_ROUTE_SUCCESS: {
            return {
                ...state,
                moving: false,
                moved: true,
            }
        }


        case RoutePlanningActionTypes.JOIN_POINTS_AGGLOMERATION: {
            return RoutePlanningInitialState;
        }


        default: {
            return state;
        }
    }
}

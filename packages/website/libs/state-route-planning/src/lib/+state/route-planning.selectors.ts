import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    RoutePlanningState,
    PlanningSession,
    RoutePlanningMapStage,
    PlanningDeliveryZone,
    Route,
    DeliveryZoneStatus, DeliveryPoint
} from './route-planning.state';
import { Point, Vehicle } from '@optimroute/backend';
import { property } from 'ngx-custom-validators/src/app/property/validator';
import { stat } from 'fs';
import * as _ from 'lodash';

const getRoutePlanning = createFeatureSelector<RoutePlanningState>('routePlanning');

const getLoadingPlanningSession = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.loadingPlanningSession,
);

const getAdded = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.added,
);

const getAsignate = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.assignate,
);

const getZoneIdAdded = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.addZoneId,
);

const getLoadedPlanningSession = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.loadedPlanningSession,
);

const getShowSelected = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.showSelected,
);

const getShowGeometry = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => {
        return {
            showGeometry: state.ShowGeometry,
            routeShowGeometry: state.routeShowGeometry,
            zoneShowGeometry: state.zoneShowGeometry,
        };
    },
);

const getShowGeometryZone = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => {
        return {
            ShowGeometryZone: state.ShowGeometryZone,
            zoneShowGeometry: state.zoneShowGeometry,
        };
    },
);

const getPlanningSession = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.planningSession,
);
const getPlanningDeliveryZones = createSelector(
    getPlanningSession,
    (planningSession: PlanningSession) =>
        planningSession ? planningSession.deliveryZones : null,
);

const getUseRouteColors = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => (state ? state.useRouteColors : null),
);
const getShowOnlyOptimizedZones = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => (state ? state.showOnlyOptimizedZones : null),
);
const getSelectedDeliveryPoint = createSelector(
    getRoutePlanning,
    (state) => state.selectedDeliveryPoint,
);
const getHoveredZone = createSelector(
    getRoutePlanning,
    (state) => state.hoveredZone,
);
const getHoveredDeliveryPoint = createSelector(
    getRoutePlanning,
    (state) => state.hoveredDeliveryPoint,
);
const getHighlightedRoute = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.highlightedRoute,
);
const getSimulating = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.simulating,
);
const getSimulatingTime = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.simulationTime,
);
const getSimulatingVelocity = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.simulationVelocity,
);
const getSidenavState = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.sidenavOpened,
);

const getZoneById = createSelector(
    getPlanningDeliveryZones,
    (deliveryZones: { [zoneId: number]: PlanningDeliveryZone }) => (zoneId: number) =>
        deliveryZones ? deliveryZones[zoneId] : null,
);

const getPlanningSessionVehiclesForEachDeliveryZone = createSelector(
    getPlanningSession,
    getLoadedPlanningSession,
    (planningSession: PlanningSession, loaded: boolean) => {
        if (planningSession && loaded) {
            let vehicles: {} = {};
            for (const key in planningSession.deliveryZones) {
                const zone = planningSession.deliveryZones[key];
                let vehiclesArray: Vehicle[] = [];
                if (zone.isMultiZone) {
                    vehiclesArray = vehiclesArray.concat(zone.vehicles);
                    for (const key2 in zone.deliveryZones) {
                        const subZone = zone.deliveryZones[key2];
                        vehiclesArray = vehiclesArray.concat(subZone.vehicles);
                    }
                } else {
                    vehiclesArray = zone.vehicles.filter(x => x.userId && x.userId > 0);
                }
                vehicles[zone.id] = vehiclesArray.filter(x => x.userId && x.userId > 0);
            }
            return vehicles;
        } else {
            return null;
        }
    },
);


const getPlanningSessionVehiclesForEachRoute = createSelector(
    getPlanningSession,
    getLoadedPlanningSession,
    getRoutePlanning,
    (planningSession: PlanningSession, loaded: boolean, state) => {
        if (planningSession && loaded) {
            let vehicles: {} = {};
            for (const key in planningSession.deliveryZones) {
                const zone = planningSession.deliveryZones[key];

                let vehiclesArray: Vehicle[] = [];
                if (state.deliveryZonesStatus[key].optimized) {
                    if (zone.optimization && zone.optimization.solution && zone.optimization.solution.routes
                        && zone.optimization.solution.routes.length > 0) {

                        zone.optimization.solution.routes.forEach(route => {

                            vehiclesArray.push(route.vehicle);
                        })
                    }
                }
                vehicles[zone.id] = vehiclesArray.filter(x => x.userId && x.userId > 0);
            }
            return vehicles;
        } else {
            return null;
        }
    },
);

const getZoneVehicles = createSelector(
    getZoneById,
    (getZoneById: (id: number) => PlanningDeliveryZone) => (zoneId: number) => {
        const zone: PlanningDeliveryZone = getZoneById(zoneId);
        if (zone && zone.vehicles) {
            let vehicles = zone.vehicles;
            if (zone.isMultiZone) {

                if (zone.vehicles.length === 0) {
                    for (const x in zone.deliveryZones) {
                        vehicles = vehicles.concat(zone.deliveryZones[x].vehicles);
                    }
                } else {
                    for (const x in zone.deliveryZones) {
                        vehicles = zone.vehicles;
                    }
                }

            }
            return vehicles;
        }
    },
);

const getZoneOptimization = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => (zoneId: number) => {
        if (
            state.planningSession.deliveryZones[zoneId] &&
            state.planningSession.deliveryZones[zoneId].optimization
        ) {
            return state.planningSession.deliveryZones[zoneId].optimization;
        }
    },
);

const getAllZonesStatus = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => {
        return state.deliveryZonesStatus;
    },
);



const getCloseComplete = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => {
        return state.closeComplete;
    },
);

const getZoneStatus = createSelector(
    getAllZonesStatus,
    (zoneStatus: { [zoneId: number]: DeliveryZoneStatus }) => (zoneId: number) => {
        return zoneStatus ? zoneStatus[zoneId] : null;
    },
);

const getZoneStatusOptimized = createSelector(
    getZoneStatus,
    (getZoneStatus: (zoneId: number) => DeliveryZoneStatus) => (zoneId: number) =>
        getZoneStatus(zoneId) ? getZoneStatus(zoneId).optimized : null,
);

const getZoneActiveRoute = createSelector(
    getZoneStatus,
    (getZoneStatus: (zoneId: number) => DeliveryZoneStatus) => (zoneId: number) => {
        const zone = getZoneStatus(zoneId);
        return zone ? zone.activeRoute : null;
    },
);

const getZoneRouteById = createSelector(
    getZoneById,
    (getZoneById: (id: number) => PlanningDeliveryZone) => (
        zoneId: number,
        routeId: number,
    ) => {
        const zone: PlanningDeliveryZone = getZoneById(zoneId);
        if (zone && zone.optimization && zone.optimization.solution && zone.optimization.solution.routes) {
            return zone.optimization.solution.routes.find((x: Route) => x.id == routeId);
        }
    },
);

const getAllRoutesStatus = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => {
        return state.routesStatus;
    },
);

const getOptimizationStatus = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => (zoneId: number) =>
        state.optimizationStatus ? state.optimizationStatus[zoneId] : null,
);

const getRoutesStatus = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => (zoneId: number) => state.routesStatus[zoneId],
);

const getRouteStatus = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => (zoneId: number, routeId: number) => {
        return state.routesStatus[zoneId][routeId];
    },
);

const getViewingMode = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.viewingMode,
);

const getZoneOptimizationParameters = createSelector(
    getZoneById,
    (getZoneById: (id: number) => PlanningDeliveryZone) => (zoneId: number) => {
        const zone = getZoneById(zoneId);
        if (zone) {
            return zone.settings.optimizationParameters;
        }
        return {};
    },
);


const getDeliveryPointsNotSource = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => {
        let points: DeliveryPoint[] = [];
        let zones = Object.keys(state.planningSession.deliveryZones).map((key) => state.planningSession.deliveryZones[key]);
        zones.forEach(zone => {
            state.planningSession.deliveryZones[zone.id].deliveryPoints.forEach((point) => {
                if (point.coordinates.latitude === 0 && point.coordinates.longitude === 0) {
                    point = {
                        ...point,
                        zoneId: zone.id
                    };
                    points.push(point);
                }
            })
        })

        return points;
    }
)


const getDeliveryPointsSearch = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => {
        let points: DeliveryPoint[] = [];
        let zones = Object.keys(state.planningSession.deliveryZones).map((key) => state.planningSession.deliveryZones[key]);
        zones.forEach(zone => {
            if (state.showSelected) {
                if (state.deliveryZonesStatus[zone.id].selected) {
                    state.planningSession.deliveryZones[zone.id].deliveryPoints.forEach((point) => {
                        point = {
                            ...point,
                            zoneId: zone.id
                        };
                        points.push(point);
                    });
                }
            } else {
                state.planningSession.deliveryZones[zone.id].deliveryPoints.forEach((point) => {
                    point = {
                        ...point,
                        zoneId: zone.id
                    };
                    points.push(point);
                })
            }

        });
        return points.sort((a, b) => {
            if (b.name.toLocaleLowerCase() > a.name.toLocaleLowerCase()) {
                return -1;
            }
            if (b.name.toLocaleLowerCase() < a.name.toLocaleLowerCase()) {
                return 1;
            }
            return 0;
        });
    }
)

const getDeliveryPointsOptimizedSearch = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => {
        let points: DeliveryPoint[] = [];
        let zones = Object.keys(state.planningSession.deliveryZones).map((key) => state.planningSession.deliveryZones[key]);
        zones.forEach(zone => {
            if (state.showSelected) {
                if (state.deliveryZonesStatus[zone.id].selected) {
                    if (state.planningSession.deliveryZones[zone.id].optimization && state.planningSession.deliveryZones[zone.id].optimization.solution
                        && state.planningSession.deliveryZones[zone.id].optimization.solution.routes && state.planningSession.deliveryZones[zone.id].optimization.solution.routes.length > 0) {
                        state.planningSession.deliveryZones[zone.id].optimization.solution.routes.forEach((route) => {
                            route.deliveryPoints.forEach((point) => {
                                point = {
                                    ...point,
                                    zoneId: zone.id
                                };
                                points.push(point);
                            })
                        })
                    }
                }
            } else {
                if (state.planningSession.deliveryZones[zone.id].optimization && state.planningSession.deliveryZones[zone.id].optimization.solution
                    && state.planningSession.deliveryZones[zone.id].optimization.solution.routes && state.planningSession.deliveryZones[zone.id].optimization.solution.routes.length > 0) {
                    state.planningSession.deliveryZones[zone.id].optimization.solution.routes.forEach((route) => {
                        route.deliveryPoints.forEach((point) => {
                            point = {
                                ...point,
                                zoneId: zone.id
                            };
                            points.push(point);
                        })
                    })
                }
            }

        });
        return points.sort((a, b) => {
            if (b.name.toLocaleLowerCase() > a.name.toLocaleLowerCase()) {
                return -1;
            }
            if (b.name.toLocaleLowerCase() < a.name.toLocaleLowerCase()) {
                return 1;
            }
            return 0;
        });
    }
)


const getMaxDelayTime = createSelector(
    getZoneById,
    (getZoneById: (id: number) => PlanningDeliveryZone) => (zoneId: number) => {
        const zone = getZoneById(zoneId);
        if (zone) {
            return zone.settings.maxDelayTime;
        }
        return {};
    },
);

const getPointAgglomeration = createSelector(
    getRoutePlanning,
    getLoadedPlanningSession,
    (state: RoutePlanningState, loaded: boolean) => {
        if (loaded) {
            const zones = Object.keys(state.planningSession.deliveryZones);
            const points: DeliveryPoint[] = [];
            zones.forEach((zone) => {
                points.push(...state.planningSession.deliveryZones[zone].deliveryPoints.map((point) => {
                    if(point && point.coordinates && point.coordinates.latitude){
                        return {
                            ...point,
                            deliveryZoneId: +zone,
                            coordinatesConcat: point.coordinates.latitude + '-' + point.coordinates.longitude
                        }
                    }
                }));
            });
            let result = _.chain(points).groupBy("coordinatesConcat").map((value, key) => ({ coordinates: value[0] && value[0].coordinates ? value[0].coordinates : { latitude : 0, longitude: 0}, datos: value })).value().filter(x => x.datos.length > 1);
            return result;

        }

    }
)

const getErrorMaxDelayTime = createSelector(
    getZoneById,
    (getZoneById: (id: number) => PlanningDeliveryZone) => (zoneId: number) => {
        const zone = getZoneById(zoneId);
        let value: boolean = false;
        let maxDelayTime = zone.settings.maxDelayTime;
        if (zone && zone.optimization && zone.optimization.solution && zone.optimization.solution.routes) {
            zone.optimization.solution.routes.forEach(element => {
                element.deliveryPoints.forEach(point => {

                    if (!value) {

                        value = point.delayTime > maxDelayTime ? true : false;

                    }
                });
            });
            return value;
        }
        return value;
    },
);

const getZoneExplorationLevel = createSelector(
    getZoneById,
    (getZoneById: (id: number) => PlanningDeliveryZone) => (zoneId: number) => {
        const zone = getZoneById(zoneId);
        if (zone) {
            return zone.settings.explorationLevel;
        }
        return {};
    },
);

// Parlar per si es posa a l'estat directaent o que???
const getMapStage = createSelector(
    getAllZonesStatus,
    (zonesStatus) => {
        if (!zonesStatus) return RoutePlanningMapStage.empty;
        for (const zoneId in zonesStatus) {
            if (zonesStatus[zoneId].optimized) {
                return RoutePlanningMapStage.routes;
            }
        }
        return RoutePlanningMapStage.zones;
    },
);

const getAllRoutes = createSelector(
    getPlanningDeliveryZones,
    getAllZonesStatus,
    (zones, zonesStatus) => {
        let routes: any[] = [];
        for (const zoneId in zones) {
            if (
                zones[zoneId] &&
                zonesStatus[zoneId].optimized &&
                zones[zoneId].optimization
            ) {
                routes = routes.concat(zones[zoneId].optimization.solution.routes);
            }
        }
    },
);

const getZoneInfoChips = createSelector(
    getZoneById,
    (getZoneById: (zoneId: number) => PlanningDeliveryZone) => (zoneId) => {
        const zone = getZoneById(zoneId);
        return zone
            ?
            {
                deliveryPoints: zone.deliveryPoints.length,
                demand: Object.values(zone.deliveryPoints).reduce<number>(
                    (tot, currentDP) => {
                        return currentDP.deliveryType && currentDP.deliveryType === 'pickup' ? tot + 0 : tot + currentDP.demand
                    },
                    0,
                ),
                volumetric: Object.values(zone.deliveryPoints).reduce<number>(
                    (tot, currentDP) => {
                        return currentDP.deliveryType && currentDP.deliveryType === 'pickup' ? tot + 0 : tot + (currentDP.volumetric != null ? (+currentDP.volumetric) : 0)
                    },
                    0,
                ),
                box: Object.values(zone.deliveryPoints).reduce<number>(
                    (tot, currentDP) => {
                        return tot + currentDP.box
                    },
                    0,
                ),
                crossDocking: zone.crossDocking,
                time: zone.evaluated === true && zone.time ? zone.time : 0,
                isEvaluated: zone.evaluated === true ? 1 : 0,
                travelDistance: zone.evaluated === true && zone.travelDistance ? zone.travelDistance : 0,
                travelTime: zone.evaluated === true && zone.travelTime ? zone.travelTime : 0,
                customerWaitTime: zone.evaluated === true && zone.customerWaitTime ? zone.customerWaitTime : 0,
                delayTime: zone.evaluated === true && zone.delayTime ? zone.delayTime : 0,
                vehicleWaitTime: zone.evaluated === true && zone.vehicleWaitTime ? zone.vehicleWaitTime : 0,
                costTotal: zone.evaluated === true && zone.costTotal ? zone.costTotal : 0,
                vehicles:
                    zone.vehicles.length +
                    (!zone.isMultiZone
                        ? 0
                        : Object.values(zone.deliveryZones).reduce<number>(
                            (total, currentZone) => total + currentZone.vehicles.length,
                            0,
                        )),
                vehiclesCapacity:
                    Object.values(zone.vehicles).reduce<number>(
                        (total, currentVehicle) => total + currentVehicle.capacity,
                        0,
                    ) +
                    (!zone.isMultiZone
                        ? 0
                        : Object.values(zone.deliveryZones).reduce<number>(
                            (total, currentZone) =>
                                total +
                                Object.values(currentZone.vehicles).reduce<number>(
                                    (total, currentVehicle) =>
                                        total + currentVehicle.capacity,
                                    0,
                                ),
                            0,
                        )),
                vehiclesVolumen:
                    Object.values(zone.vehicles).reduce<number>(
                        (total, currentVehicle) => total + (currentVehicle.totalVolumetricCapacity ? (+currentVehicle.totalVolumetricCapacity):0 ),
                        0,
                    ) +
                    (!zone.isMultiZone
                        ? 0
                        : Object.values(zone.deliveryZones).reduce<number>(
                            (total, currentZone) =>
                                total +
                                Object.values(currentZone.vehicles).reduce<number>(
                                    (total, currentVehicle) =>
                                        total + (currentVehicle.totalVolumetricCapacity ? (+currentVehicle.totalVolumetricCapacity):0),
                                    0,
                                ),
                            0,
                        )),
            }
            : null;
    },
);

const getZoneRouteInfoChips = createSelector(
    getZoneById,
    getZoneStatusOptimized,
    (
        getZoneById: (zoneId: number) => PlanningDeliveryZone,
        getZoneStatusOptimized: (zoneId: number) => boolean,
    ) => (zoneId: number, routeId: number) => {
        const zone = getZoneById(zoneId);
        const optimized = getZoneStatusOptimized(zoneId);
        if (optimized && zone) {
            const route = zone.optimization.solution.routes.find(
                (route) => route.id === routeId,
            );
            if (route)
                return {
                    deliveryPoints: route.deliveryPoints.length,
                    travelDistance: route.travelDistance,
                    time: route.time,
                    customerWaitTime: route.avgCustomerWaitTime,
                    vehicleWaitTime: route.vehicleWaitTime,
                    crossDocking: zone.crossDocking,
                    costTotal: route.costTotal,
                    delayTime: route.delayTime,
                    deliveryPointsUnassigned: route.deliveryPointsUnassigned ? route.deliveryPointsUnassigned.length : 0,
                    demand: Object.values(route.deliveryPoints).reduce<number>(
                        (tot, currentDP) => {
                            return currentDP.deliveryType && currentDP.deliveryType === 'pickup' ? tot + 0 : tot + currentDP.demand
                        },
                        0,
                    ),
                    volumetric: Object.values(route.deliveryPoints).reduce<number>(
                        (tot, currentDP) => {
                            return currentDP.deliveryType && currentDP.deliveryType === 'pickup' ? tot + 0 : tot + (+currentDP.volumetric)
                        },
                        0,
                    ),
                    box: Object.values(route.deliveryPoints).reduce<number>(
                        (tot, currentDP) => {
                            return tot + currentDP.box
                        },
                        0,
                    ),
                    vehiclesCapacity: route.vehicle.capacity
                };
            return {
                deliveryPoints: 0,
                travelDistance: 0,
                time: 0,
                customerWaitTime: 0,
                vehicleWaitTime: 0,
                delayTime: 0,
                deliveryPointsUnassigned: 0,
                demand: 0,
                vehiclesCapacity: 0,
                costTotal: 0,
                box: 0
            };
        } else
            return {
                deliveryPoints: 0,
                travelDistance: 0,
                time: 0,
                customerWaitTime: 0,
                vehicleWaitTime: 0,
                delayTime: 0,
                deliveryPointsUnassigned: 0,
                demand: 0,
                vehiclesCapacity: 0,
                crossDocking: 0,
                costTotal: 0,
                box: 0
            };
    },
);

const getZoneRoutesInfoChips = createSelector(
    getZoneById,
    getZoneStatusOptimized,
    (
        getZoneById: (zoneId: number) => PlanningDeliveryZone,
        getZoneStatusOptimized: (zoneId: number) => boolean,
    ) => (zoneId: number) => {
        const zone = getZoneById(zoneId);
        const optimized = getZoneStatusOptimized(zoneId);

        if (optimized && zone && zone.optimization && zone.optimization.solution) {
            let deliveryPoints = 0;
            zone.optimization.solution.routes.forEach((route) => {
                deliveryPoints += route.deliveryPoints.length;
            });
            return {
                deliveryPoints,
                travelDistance: zone.optimization.solution.totalTravelDistance,
                time: zone.optimization.solution.totalTime,
                customerWaitTime: zone.optimization.solution.avgCustomerWaitTime,
                vehicleWaitTime: zone.optimization.solution.totalVehicleWaitTime,
                delayTime: zone.optimization.solution.totalDelayTime,
                vehicles: zone.optimization.solution.routes.length > 0 ?
                    zone.optimization.solution.routes.length : 0,
                deliveryPointsUnassigned: zone && zone.optimization
                    && zone.optimization.solution && zone.optimization.solution.routes
                    && zone.optimization.solution.routes.length > 0
                    ? zone.optimization.solution.routes.reduce((sum, current) => sum + (current.deliveryPointsUnassigned ? current.deliveryPointsUnassigned.length : 0), 0) : 0,
                demand: zone && zone.optimization
                    && zone.optimization.solution && zone.optimization.solution.routes
                    && zone.optimization.solution.routes.length > 0
                    ? zone.optimization.solution.routes.reduce((sum, current) => sum + (current.deliveryPoints ? current.deliveryPoints.map(x =>
                        x.deliveryType && x.deliveryType === 'pickup' ? 0 : x.demand
                    ).reduce((i, y) => i + y, 0) : 0), 0) : 0,
                volumetric: zone && zone.optimization
                    && zone.optimization.solution && zone.optimization.solution.routes
                    && zone.optimization.solution.routes.length > 0
                    ? zone.optimization.solution.routes.reduce((sum, current) => sum + (current.deliveryPoints ? current.deliveryPoints.map(x =>
                        x.deliveryType && x.deliveryType === 'pickup' ? 0 : (+x.volumetric)
                    ).reduce((i, y) => i + y, 0) : 0), 0) : 0,
                vehiclesCapacity: zone.optimization.solution.routes.reduce((sum, current) => sum + (current.vehicle ? current.vehicle.capacity : 0), 0),
                vehiclesVolumen: zone.optimization.solution.routes.reduce((sum, current) => sum + (current.vehicle ? current.vehicle.totalVolumetricCapacity : 0), 0),
                costTotal: zone.optimization.solution.routes.reduce((sum, current) => sum + (current.costTotal ? current.costTotal : 0), 0),
                box: zone && zone.optimization
                    && zone.optimization.solution && zone.optimization.solution.routes
                    && zone.optimization.solution.routes.length > 0
                    ? zone.optimization.solution.routes.reduce((sum, current) => sum + (current.deliveryPoints ? current.deliveryPoints.map(x =>
                        x.box
                    ).reduce((i, y) => i + y, 0) : 0), 0) : 0,
            };
        } else
            return {
                deliveryPoints: 0,
                travelDistance: 0,
                time: 0,
                customerWaitTime: 0,
                vehicleWaitTime: 0,
                delayTime: 0,
                deliveryPointsUnassigned: 0,
                vehicles: 0,
                demand: 0,
                volumetric: 0,
                vehiclesCapacity: 0,
                vehiclesVolumen: 0,
                costTotal: 0
            };
        //travelTime: zone.optimization.solution.totalTravelTime | 0,
        //delayTime: zone.optimization.solution.totalDelayTime | 0,
        //vehicleWaitTime: zone.optimization.solution.vehicleWaitTime | 0,
        //customerWaitTime: zone.optimization.solution.customerWaitTime | 0,
        //avgCustomerWaitTime: zone.optimization.solution.avgCustomerWaitTime | 0,
    },
);

const getAllZonesInfoChips = createSelector(
    getPlanningDeliveryZones,
    getZoneInfoChips,
    (
        zones: { [zoneId: number]: PlanningDeliveryZone },
        getZoneInfoChips: (zoneId: number) => any,
    ) => {
        return zones
            ? Object.keys(zones).reduce<{
                deliveryPoints: number;
                demand: number;
                vehicles: number;
                vehiclesCapacity: number;
                vehiclesVolumen: number;
                time: number;
                travelDistance: number;
                travelDistanceToFirst: number;
                travelTime: number;
                travelTimeToFirst: number;
                customerWaitTime: number;
                delayTime: number;
                vehicleWaitTime: number;
                isEvaluated: number;
                costTotal: number;
                volumetric: number;
            }>(
                (total, currZoneId) => {
                    const infoChips = getZoneInfoChips(+currZoneId);
                    for (const key in total) total[key] += infoChips[key];
                    return total;
                },

                {
                    deliveryPoints: 0,
                    demand: 0,
                    vehicles: 0,
                    vehiclesCapacity: 0,
                    time: 0,
                    travelDistance: 0,
                    travelDistanceToFirst: 0,
                    travelTime: 0,
                    travelTimeToFirst: 0,
                    customerWaitTime: 0,
                    delayTime: 0,
                    vehicleWaitTime: 0,
                    isEvaluated: 0,
                    costTotal: 0,
                    vehiclesVolumen: 0,
                    volumetric: 0
                },
            )
            : null;
    },
);

const getAllRoutesInfoChips = createSelector(
    getPlanningDeliveryZones,
    getZoneRoutesInfoChips,
    (
        zones: { [zoneId: number]: PlanningDeliveryZone },
        getZoneRoutesInfoChips: (zoneId: number) => any,
    ) => {
        return zones
            ? Object.keys(zones).reduce<{
                deliveryPoints: number;
                travelDistance: number;
                time: number;
                customerWaitTime: number;
                vehicleWaitTime: number;
                delayTime: number;
                vehicles: number;
                costTotal: number;
            }>(
                (total, currZoneId) => {
                    const infoChips = getZoneRoutesInfoChips(+currZoneId);
                    for (const key in total) total[key] += infoChips[key];
                    return total;
                },
                {
                    deliveryPoints: 0,
                    travelDistance: 0,
                    time: 0,
                    customerWaitTime: 0,
                    vehicleWaitTime: 0,
                    delayTime: 0,
                    vehicles: 0,
                    costTotal: 0
                },
            )
            : null;
    },
);

/*const getAllZonesInfoChips = createSelector(
    getPlanningSession,
    (state: PlanningSession) => {
        let zoneChips = {
            deliveryPoints: 0,
            demand: 0,
            vehicles: 0,
            vehiclesCapacity: 0,
        };
        if (state != null) {
            for (const key in state.deliveryZones) {
                const zone = state.deliveryZones[key];
                zoneChips.deliveryPoints += zone.deliveryPoints.length;
                zone.deliveryPoints.forEach(dp => {
                    zoneChips.demand += dp.demand;
                });
                if (zone.isMultiZone) {
                    zoneChips.vehicles += zone.vehicles.length;
                    zoneChips.vehiclesCapacity += zone.vehicles.reduce(
                        (v1: Vehicle, v2: Vehicle) => ({
                            ...v1,
                            capacity: v1.capacity + v2.capacity,
                        }),
                        {
                            name: '',
                            id: 0,
                            capacity: 0,
                            deliveryZoneId: '',
                        },
                    ).capacity;
                    for (const key2 in zone.deliveryZones) {
                        const subZone = zone.deliveryZones[key2];
                        zoneChips.vehicles += subZone.vehicles.length;
                        zoneChips.vehiclesCapacity += subZone.vehicles.reduce(
                            (v1: Vehicle, v2: Vehicle) => ({
                                ...v1,
                                capacity: v1.capacity + v2.capacity,
                            }),
                            {
                                name: '',
                                id: 0,
                                capacity: 0,
                                deliveryZoneId: '',
                            },
                        ).capacity;
                    }
                } else {
                    zoneChips.vehicles += zone.vehicles.length;
                    zoneChips.vehiclesCapacity += zone.vehicles.reduce(
                        (v1: Vehicle, v2: Vehicle) => ({
                            ...v1,
                            capacity: v1.capacity + v2.capacity,
                        }),
                        {
                            name: '',
                            id: 0,
                            capacity: 0,
                            deliveryZoneId: '',
                        },
                    ).capacity;
                }
            }
        }
        return zoneChips;
    },
);

const getAllRoutesInfoChips = createSelector(
    getRoutePlanning,
    getAllZonesStatus,
    (state: RoutePlanningState, zonesStatus) => {
        let routeChips = {
            // customerWaitTime: 0,
            // vehicleWaitTime: 0,
            // delayTime: 0,
            // avgCustomerWaitTime: 0,
            // avgDelayTime: 0,
            travelDistance: 0,
            // travelTime: 0,
            time: 0,
        };
        if (state.planningSession != null) {
            for (const zoneId in state.planningSession.deliveryZones) {
                const zone = state.planningSession.deliveryZones[zoneId];
                if (zonesStatus[zoneId].optimized) {
                    if (zone.optimization.solution) {
                        // routeChips.customerWaitTime +=
                        //     zone.optimization.solution.totalCustomerWaitTime;
                        // routeChips.vehicleWaitTime +=
                        //     zone.optimization.solution.totalVehicleWaitTime;
                        // routeChips.delayTime += zone.optimization.solution.totalDelayTime;
                        // routeChips.avgCustomerWaitTime +=
                        //     zone.optimization.solution.avgCustomerWaitTime;
                        // routeChips.avgDelayTime += zone.optimization.solution.avgDelayTime;
                        routeChips.travelDistance +=
                            zone.optimization.solution.totalTravelDistance;
                        // routeChips.travelTime += zone.optimization.solution.totalTravelTime;
                        routeChips.time += zone.optimization.solution.totalTime;
                    }
                }
            }
        }
        return routeChips;
    },
);*/

const getAmountSelectedZones = createSelector(
    getAllZonesStatus,
    (zonesStatus: { [key: number]: DeliveryZoneStatus }) => {
        let amount = 0;
        for (const zoneId in zonesStatus) {
            if (zonesStatus[zoneId].selected) ++amount;
        }
        return amount;
    },
);
const getAmountSelectedRoutes = createSelector(
    getAllRoutesStatus,
    (routesStatus: {
        [zoneId: number]: { [routeId: number]: { displayed: boolean; selected: boolean } };
    }) => {
        let amount = 0;
        for (const zoneId in routesStatus) {
            for (const routeId in routesStatus[zoneId])
                if (routesStatus[zoneId][routeId].selected) ++amount;
        }
        return amount;
    },
);

const getAmountExpandedZones = createSelector(
    getAllZonesStatus,
    (zonesStatus: { [key: number]: DeliveryZoneStatus }) => {
        let amount = 0;
        for (const zoneId in zonesStatus) {
            if (zonesStatus[zoneId].expanded) ++amount;
        }
        return amount;
    },
);

const getAddingDeliveryPoint = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.adding,
);

const getMovingDeliveryPoint = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.moving,
);


const getMovedDeliveryPoint = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.moved,
);


const getDeliveryPointPending = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => state.deliveryPointPending
)


const getDeliveryPointPendingAll = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => {
        let countPending = 0;

        state && state.planningSession && state.planningSession.deliveryZones ?

            Object.keys(state.planningSession.deliveryZones).map((key) => {
                if (state.deliveryZonesStatus[key] && state.deliveryZonesStatus[key].optimized) {
                    if (state.planningSession.deliveryZones[key].optimization.solution.routes && state.planningSession.deliveryZones[key].optimization.solution.routes.length > 0) {
                        state.planningSession.deliveryZones[key].optimization.solution.routes.forEach(route => {


                            countPending += route.deliveryPointsUnassigned ? route.deliveryPointsUnassigned.length : 0;
                        });
                    }
                }
            }) : 0;

        return countPending;
    }
)


const getQuantityZonesOptimized = createSelector(
    getRoutePlanning,
    (state: RoutePlanningState) => {
        let countZones = 0;
        let countZonesOptimized = 0;
        if (state.planningSession && state.planningSession.deliveryZones) {
            Object.keys(state.planningSession.deliveryZones).map((key) => {
                countZones += 1;
                if (state.deliveryZonesStatus[key] && state.deliveryZonesStatus[key].optimized) {
                    countZonesOptimized += 1;
                }
            });
        }


        return {
            countZones,
            countZonesOptimized
        }
    }
)

export const RoutePlanningQuery = {
    getLoadedPlanningSession,
    getLoadingPlanningSession,
    getRoutePlanning,
    getShowSelected,
    getSimulating,
    getSimulatingTime,
    getSimulatingVelocity,
    getPlanningSession,
    getSidenavState,
    getPlanningDeliveryZones,
    getPlanningSessionVehicles: getPlanningSessionVehiclesForEachDeliveryZone,
    getViewingMode,
    getHighlightedRoute,
    getZoneById,
    getMapStage,
    getZoneInfoChips,
    getZoneRoutesInfoChips,
    getUseRouteColors,
    getShowOnlyOptimizedZones,
    getAllZonesInfoChips,
    getZoneRouteInfoChips,
    getAllRoutesInfoChips,
    getAllRoutes,
    getHoveredZone,
    getSelectedDeliveryPoint,
    getHoveredDeliveryPoint,
    getZoneVehicles,
    getZoneOptimization,
    getAllZonesStatus,
    getZoneStatus,
    getAllRoutesStatus,
    getRouteStatus,
    getRoutesStatus,
    getZoneOptimizationParameters,
    getZoneExplorationLevel,
    getOptimizationStatus,
    getAmountExpandedZones,
    getAmountSelectedZones,
    getAmountSelectedRoutes,
    getZoneActiveRoute,
    getZoneRouteById,
    getZoneStatusOptimized,
    getShowGeometry,
    getShowGeometryZone,
    getMaxDelayTime,
    getErrorMaxDelayTime,
    getAddingDeliveryPoint,
    getMovingDeliveryPoint,
    getMovedDeliveryPoint,
    getAdded,
    getZoneIdAdded,
    getDeliveryPointsNotSource,
    getPointAgglomeration,
    getDeliveryPointsSearch,
    getDeliveryPointsOptimizedSearch,
    getDeliveryPointPending,
    getQuantityZonesOptimized,
    getDeliveryPointPendingAll,
    getPlanningSessionVehiclesForEachRoute,
    getCloseComplete,
    getAsignate
};

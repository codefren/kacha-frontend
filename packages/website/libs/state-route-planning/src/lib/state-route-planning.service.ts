import { Injectable } from '@angular/core';
import {
    BackendService,
    OptimizationPreferences,
    JobDescriptor,
    Zone,
} from '@optimroute/backend';
import { ImportedDeliveryPointDto } from '@optimroute/shared';
import { delay, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
    PlanningDeliveryZoneSettings,
    OptimizationParameters,
    Route,
    DeliveryPoint,
} from './+state/route-planning.state';
import { PTO } from './+state/route-planning.actions';

@Injectable({
    providedIn: 'root',
})
export class StateRoutePlanningService {
    createRoutePlanningSession(payload: {
        deliveryPoints: ImportedDeliveryPointDto[];
        assignationDate?: string,
        options: {
            createDeliveryPoints: boolean;
            updateDeliveryPoints: boolean;
            createDeliveryZones: boolean;
            createUnassignedZone: boolean;
            setUnassignedZone: boolean;
        };
        sessionType?: string,
        vehicle: any[];
    }) {

        return this.backendService.post('route-planning/session', payload);
    }


    joinPoints(routePlanningDeliveryPoints: number[], sessionId: number) {
        return this.backendService.post('route_planning/delivery_point/join', {
            routePlanningDeliveryPoints,
            sessionId
        })
    }

    optimize(deliveryZones: number[]): Observable<{ id: number; job: JobDescriptor }[]> {
        return this.backendService
            .post('route-planning/zone/optimize', { deliveryZones })
            .pipe(map((payload) => payload.result));
    }

    asign(routes: Route[], date: string): Observable<{ id: number; job: JobDescriptor }[]> {
        return this.backendService
            .post('route_planning/route/assign_routes', { routes, date })
            .pipe(map((payload) => payload.result));
    }

    asign_evaluateds(zonesId: number[], date: string) {
        return this.backendService
            .post('route_planning/assignate_zones', { deliveryZones: zonesId, date })
            .pipe(map((payload) => payload.result));
    }

    recompute(routes: {
        [routeId: number]: { zoneId: number; routeId: number; start?: number };
    }): Observable<{ id: number; job: JobDescriptor }[]> {

        console.log(routes);
        return this.backendService
            .post('route-planning/route/optimize', {
                routes: Object.values(routes).map((payload) => {
                    return { id: +payload.routeId, start: payload.start };
                }),
            })
            .pipe(map((payload) => {

                payload.result[0].zoneId = routes[payload.result[0].id].zoneId;
                return payload.result
            }));
            /* .pipe(
                map((payload) => payload.result),
                map((results) =>{
                    console.log(results);
                    return results.map((result) => ({
                        job: result,
                        zoneId: routes[result.id].zoneId,
                    }));
                }

                ),
            ); */
    }

    addRoutePlanningZone(zone: Zone, sessionId: number) {
        return this.backendService.post('delivery_zone', {
            ...zone,
            sessionId: sessionId,
        });
    }

    evaluate(ids: number[]) {
        return this.backendService.post('route_planning/evaluate_zones', {
            deliveryZones: ids,
        });
    }

    joinZones(
        deliveryZones: number[],
        vehicles?: number[],
        settings?: { ignoreCapacity?: boolean; useAllVehicles: boolean },
    ) {
        return this.backendService.post('route-planning/zone/join', {
            deliveryZones,
            vehicles,
            settings,
        });
    }

    splitZones(zoneId: number, idsList: number[]) {
        return this.backendService.post('route-planning/zone/' + zoneId + '/split', {
            deliveryZones: idsList,
        });
    }

    updateZoneName(zoneId: number, name: string) {
        return this.backendService.patch('route-planning/zone/' + zoneId, {
            name: name,
        });
    }

    movePointFromMap(deliveryZoneId: number, deliveryPoints: any[]) {
        return this.backendService.post('route_planning/move_points_from_map', {
            deliveryZoneId,
            deliveryPoints,
        });
    }

    routeMovePointFromMap(routeId: number, deliveryPoints: any[]) {
        return this.backendService.post('route_planning/route/move_points_from_map', {
            routeId,
            deliveryPoints,
        });
    }

    updateZoneColor(zoneId: number, color: string) {
        return this.backendService.patch('route-planning/zone/' + zoneId, {
            color: color,
        });
    }

    updateOptimizationParameters(
        zoneId: number,
        optimizationParameters: Partial<OptimizationParameters>,
    ) {
        return this.backendService.patch('route-planning/zone/' + zoneId, {
            settings: {
                optimizationParameters: optimizationParameters,
            },
        });
    }

    updateExplorationLevel(zoneId: number, explorationLevel: number) {
        return this.backendService.patch('route-planning/zone/' + zoneId, {
            settings: {
                explorationLevel: explorationLevel,
            },
        });
    }

    moveDeliveryPointZone(zoneDestId: number, deliveryPointId: number, newOrder: number) {
        return this.backendService.patch(
            'route-planning/zone/' +
            zoneDestId +
            '/move-delivery-point/' +
            deliveryPointId +
            '/new-order/' +
            newOrder,
        );
    }

    moveDeliveryPointRoute(routeDestId: number, deliveryPointId: number, newOrder: number) {
        return this.backendService.patch(
            'route-planning/route/' +
            routeDestId +
            '/move-delivery-point/' +
            deliveryPointId +
            '/new-order/' +
            newOrder,
        );
    }

    updateDeliveryPointDeliveryWindow(
        deliveryPointId: number,
        dto:
            {
                deliveryWindow: { start?: number; end?: number },
                serviceTime: number,
                address: string,
                coordinates: {
                    latitude: number;
                    longitude: number;
                },
                leadTime?: number,
                allowedDelayTime?: number,
                deliveryType?: string,
                orderNumber?: string,
                companyPreferenceDelayTimeId?: number,
                allowDelayTime?: boolean
            },
    ) {
        return this.backendService.patch(
            'route-planning/delivery-point/' + deliveryPointId,
            dto,
        );
    }

    updateRouteDeliveryPointDeliveryWindow(
        deliveryPointId: number,
        dto: {
            deliveryWindow: { start?: number; end?: number }, leadTime?: number,
            deliveryType?: string, orderNumber?: string,
            companyPreferenceDelayTimeId?: number, allowDelayTime?: boolean
        },
    ) {
        return this.backendService.patch(
            'route-planning/route-delivery-point/' + deliveryPointId,
            dto,
        );
    }
    deleteDeliveryPoint(id: Number) {
        return this.backendService.delete('route-planning/delivery-point/' + id);
    }
    addVehiclesToZone(zoneId: number, vehiclesId: number[]) {
        return this.backendService.post('route-planning/zone/' + zoneId + '/vehicle', {
            vehicles: vehiclesId,
        });
    }

    updateVehicleFromZone(zoneId: number, vehicleId: number, data: any) {
        return this.backendService.put(
            'route-planning/zone/' + zoneId + '/vehicle/' + vehicleId, data
        );
    }

    removeVehicleFromZone(zoneId: number, vehicleId: number) {
        return this.backendService.delete(
            'route-planning/zone/' + zoneId + '/vehicle/' + vehicleId,
        );
    }

    toggleForceDepartureTime(zoneId: number, value: boolean) {
        return this.backendService.patch('route-planning/zone/' + zoneId, {
            settings: { forceDepartureTime: value },
        });
    }
    updateDeliverySchedule(zoneId: number, value: { start?: number; end?: number }) {
        return this.backendService.patch('route-planning/zone/' + zoneId, {
            settings: { deliverySchedule: value },
        });
    }

    toggleIgnoreCapacityLimit(zoneId: number, value: boolean) {
        return this.backendService.patch('route-planning/zone/' + zoneId, {
            settings: {
                ignoreCapacityLimit: value,
            },
        });
    }

    toggleUserSkills(zoneId: number, value: boolean) {
        return this.backendService.patch('route-planning/zone/' + zoneId, {
            settings: {
                settingsUseSkills: value,
            },
        });
    }

    toggleUseAllVehicles(zoneId: number, value: boolean) {
        return this.backendService.patch('route-planning/zone/' + zoneId, {
            settings: {
                useAllVehicles: value,
            },
        });
    }

    changeDeliveryPointPriority(deliveryPointId: number, newValue: number) {
        return this.backendService.patch(
            'route-planning/delivery-point/' + deliveryPointId,
            {
                priority: newValue,
            },
        );
    }

    // Route Settings

    toggleRouteForceDepartureTime(routeId: number, value: boolean) {
        return this.backendService.patch('route-planning/route/' + routeId, {
            settings: {
                forceDepartureTime: value,
            },
        });
    }

    updateRouteDeliverySchedule(routeId: number, value: { start?: number; end?: number }) {
        return this.backendService.patch('route-planning/route/' + routeId, {
            settings: {
                deliverySchedule: value,
            },
        });
    }

    updateRouteOptimizationParameters(
        routeId: number,
        optimizationParameters: Partial<OptimizationParameters>,
    ) {
        return this.backendService.patch('route-planning/route/' + routeId, {
            settings: {
                optimizationParameters: optimizationParameters,
            },
        });
    }

    updateRouteExplorationLevel(routeId: number, explorationLevel: number) {
        return this.backendService.patch('route-planning/route/' + routeId, {
            settings: {
                explorationLevel: explorationLevel,
            },
        });
    }

    updateMaxDelayTime(zoneId: number, maxDelayTime: number) {
        return this.backendService.patch('route-planning/zone/' + zoneId, {
            settings: {
                maxDelayTime: maxDelayTime,
            },
        });
    }

    updateLeadTime(zoneId: number, deliveryPointId: number, leadTime: number) {
        return this.backendService.patch(
            'route-planning/delivery-point/' + deliveryPointId,
            {
                leadTime: leadTime,
            },
        );
    }

    updateDelayTime(zoneId: number, deliveryPointId: number, delayTime: number) {
        return this.backendService.patch(
            'route-planning/delivery-point/' + deliveryPointId,
            {
                allowrdDelayTime: delayTime,
            },
        );
    }

    updateOptimizeFromIndex(routeId: number, value: number) {
        return this.backendService.patch('route-planning/route/' + routeId, {
            settings: {
                optimizeFromIndex: value,
            },
        });
    }

    getRoutesAssigned(dateDeliveryStart: string, statusRouteId: number) {
        return this.backendService.post('route_planning/route/assigned', {
            dateDeliveryStart,
            statusRouteId,
        });
    }

    // para hoja de rutas
    getRoutesAssignedSheet(dateDeliveryStart: string) {
        return this.backendService.post('route_planning/route/assigned', {
            dateDeliveryStart,

        });
    }

    // para muelle de carga
    getRoutesAssignedDock(dateDeliveryStart: string) {
        return this.backendService.post('route_planning/route/assigned_dock', {
            dateDeliveryStart,

        });
    }

    //getDataDuringDelivery
    getDataDuringDelivery( routeId: number) {
        return this.backendService.post('route_planning/route/data_during_delivery', {
            routeId
        });
    }
    getRouteStartData( routeId: number) {
        return this.backendService.post('route_planning/route/route_start_data', {
            routeId
        });
    }
    getRefuelingTotalRoute( vehicleId: number, dateDeliveryStart: string) {
        return this.backendService.post('refueling_total_route', {
            vehicleId,
            dateDeliveryStart
        });
    }
    getRefuelingTotalTravel( data: any) {

        return this.backendService.post('refueling_total_travel', data);

    }

    postDeliveryPoint( data: any){
        return this.backendService.post('route_planning/route/travel_tracking_point', data);
    }

    getDeliveryPointDetailAssigned(routeId: number, deliveryPointId: number) {
        return this.backendService.get(
            'route_planning/route/assigned/' +
            routeId +
            '/delivery_point/' +
            deliveryPointId,
        );
    }
    getDeliveryPointDetailAssignedDetaild(deliveryPointId: number) {
        return this.backendService.get(
            'route-planning/route-delivery-point/' + deliveryPointId,
        );
    }
    getDeliveryPointDetail(deliveryPointId: number) {
        return this.backendService.get(
            'route-planning/route-delivery-point/' + deliveryPointId,
        );
    }
    getPdfDeliveryPoint(routeId: number, deliveryPointId: number) {
        return this.backendService.getPDF(
            'route_planning/delivery_note/route/' +
            routeId +
            '/delivery_point/' +
            deliveryPointId,
        );
    }
    //updatedeliveryNoteOrderCode

    updateDeliveryNoteOrderCode(deliveryNoteId: number, data: any) {
        return this.backendService.put('route_planning/delivery_note_detail/' + deliveryNoteId, data);
    }

    //updateDeliveryOrderCode

    updateDeliveryOrderCode(deliveryId: number, data: any) {
        return this.backendService.put('route-planning/route-delivery-point/' + deliveryId, data);
    }

    uploadProductosRoute(deliveryPointWithProducts: any) {
        return this.backendService.post(
            'route_planning/route/assign_products',
            deliveryPointWithProducts,
        );
    }

    uploadClientsDuplicates(deliveryPointWithDupicales: any) {
        return this.backendService.post(
            'group_delivery_point/add_verify',
            deliveryPointWithDupicales,
        );
    }

    movePointToRoute(deliveryPoints) {
        return this.backendService.post(
            'route_planning/route/move_point_route',
            deliveryPoints,
        );
    }

    updateDeliveryZone(routeId: number, id: string, point: Partial<DeliveryPoint>) {
        return this.backendService.put(
            'route_planning/route/' +
            routeId +
            '/route_assigned_point/' +
            id +
            '/order/' +
            point.order,
        );
    }

    finishRoute(routeId) {
        return this.backendService.post('route_planning/route/finish_route', {
            routeId,
        });
    }

    getIntegrationSessionList() {
        return this.backendService.get('integration/session');
    }
    postIntegrationGeneratorjson(id: number) {
        return this.backendService.get('integration/session/' + id);
    }

    postMultiIntegration(integrationSessions: []) {
        return this.backendService.post('integration/session_multiple', { integrationSessions });
    }

    getListRecoverSession() {
        return this.backendService.get('route-planning/session/saved');
    }
    saveRoutePlanningSession(sessionId: number, data: any) {
        return this.backendService.put('route-planning/session/save/' + sessionId, data);
    }
    changeVehicles(routeId: number, vehicleId: number, name: any) {
        return this.backendService.put(
            'route_planning/route/' + routeId + '/change_vehicle_route_assigned',
            { vehicleId: vehicleId, vehicleName: name },
        );
    }

    loadSessionIntoRoutePlanning(deliveryPoints: any, sessionId: number){
        return this.backendService.post('route-planning/session/' + sessionId + '/delivery-points', {
            deliveryPoints
        });
    }

    changeDrivers(routeId:number, userId: number){
        return this.backendService.put( 'route_planning/route/' + routeId + '/change_driver_route_assigned',
            { userId: userId },
        );
    }


    jsonRouteDeliveryPoint(routeId: number) {
        return this.backendService.post('route_planning/route/json_route_delivery_point', {
            routeId: routeId,
        });
    }

    ftpRouteDeliveryPoint(routeId: number, name: string) {
        return this.backendService.post('integration/route/history_route', {
            routeId: routeId,
            name: name,
        });
    }

    jsonRouteDeliveryPointGeneral(routes: any) {
        return this.backendService.post(
            'route_planning/route/json_route_delivery_point_general',
            {
                routes,
            },
        );
    }

    jsonRouteDeliverySummary(summary: { companyId: number; dateDeliveryStart: string }) {
        return this.backendService.post(
            'route_planning/delivery_summary/json_route_delivery_point_general',
            summary,
        );
    }

    ftpRouteDeliveryPointGeneral(routes: any) {
        return this.backendService.post(
            'integration/route/json_route_delivery_point_general',
            {
                routes,
            },
        );
    }

    ftpDeliverySummaryGeneral(summary: { companyId: number; dateDeliveryStart: string }) {
        return this.backendService.post(
            'integration/delivery_summary/json_route_delivery_point_general',
            summary,
        );
    }

    uploadProductosRouteGlobal(deliveryPointWithProducts: any) {
        return this.backendService.post(
            'route_planning/route/assign_products_global',
            deliveryPointWithProducts,
        );
    }

    // load deliveryNote travelTraching

    uploadProductosRouteGlobaTravel(deliveryPointWithProducts: any) {
        return this.backendService.post(
            'route_planning/tracking/assign_products_global',
            deliveryPointWithProducts,
        );
    }

    //load ftp travelTraking

    ftpUploadProductosRouteGlobalTravel(data: any) {
        return this.backendService.post('integration/tracking/assign_products_global', data);
    }

    ftpUploadProductosRouteGlobal(dateDeliveryStart: any) {
        return this.backendService.post('integration/route/assign_products_global', {
            dateDeliveryStart,
        });
    }

    addDeliveryPointToDeliveryZoneId(data: any) {
        return this.backendService.post('route-planning/delivery-points', data);
    }

    moveUnassignedPoint(data: any) {
        return this.backendService.post('route-planning/route/add-unassigned-point', data);
    }

    moveMultipleDeliveryPoint(data: any) {
        return this.backendService.post(
            'route-planning/delivery_point_multiple_move',
            data,
        );
    }

    moveMultipleDeliveryPointOptimized(data: any) {
        return this.backendService.post(
            'route-planning/route/delivery_point_multiple_move',
            data,
        );
    }


    deletePointsUnassigned(routeId) {
        return this.backendService.delete('route-planning/route/delete-unassigned-points/' + routeId);
    }

    createRouteWithZones(data: any) {
        return this.backendService.post('route-planning/session_zones', data);
    }

    getDeliveryPointPendingCount() {
        return this.backendService.get('route_planning/delivery_point_pending_count');
    }

    changeScheduleSpecification(zoneId, vehicleId, datos) {
        return this.backendService.put('route-planning/zone/' + zoneId + '/vehicle/' + vehicleId, datos);
    }

    changeDriverVehicleRoute(routeId, userId, vrpVehicleId) {
        return this.backendService.post('route_planning/route/' + routeId + '/change_driver_vehicle_route_assigned', {
            userId,
            vrpVehicleId
        })
    }

    changeDriverVehicle(zoneId, userId) {
        return this.backendService.post('route-planning/zone/'+ zoneId +'/change_driver', {
            userId
        })
    }

    changeFee(zoneId, userFeeCostId, vehicleId) {
        return this.backendService.post('route-planning/zone/' + zoneId + '/change_fee', {
            userFeeCostId,
            vehicleId
        })
    }

    changeFeeRoute(routeId, userFeeCostId) {
        return this.backendService.post('route-planning/route/' + routeId + '/change_fee', {
            userFeeCostId,
        })
    }



    deleteZoneRoute(routePlanningZoneID) {
        return this.backendService.delete('route-planning/zone/' + routePlanningZoneID);
    }

    //Get details devolution
    getDevolutionDetail(deliveryPointId: number) {
        return this.backendService.get('route_planning/delivery_point/detailDevolution?routePlanningRouteDeliveryPointId=' + deliveryPointId);
    }

    addCrossDocking(crossDocking: number, zoneId: number){
        return this.backendService.post('route-planning/zone/' + zoneId + '/cross_docking', {crossDocking});
    }


    constructor(private backendService: BackendService) { }
}

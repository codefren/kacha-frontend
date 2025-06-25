import { Injectable } from '@angular/core';
import { BackendService, Point } from '@optimroute/backend';

@Injectable({
    providedIn: 'root',
})
export class StatePointService {
    loadPoints() {
        return this.backendService.get('delivery_points');
    }

    addPoint(v: Point) {
        return this.backendService.post('delivery_point', v);
    }

    updatePoint(id: string, user: Partial<Point>) {
        return this.backendService.put('delivery_point/' + id, user);
    }

    getIntegrationSession(id: number) {
        return this.backendService.get('integration_session/' + id);
    }

    createIntegrationSession(data: any) {
        return this.backendService.post('integration_session', data);
    }

    updateIntegrationSession(id: string, data: any) {
        return this.backendService.put('integration_session/' + id, data);
    }

    createIntegrationSessionDeliveryPoint(id: string, deliveryZones: any) {
        return this.backendService.post('integration_session/add_delivery_zones', {
            id: id,
            deliveryZones: deliveryZones,
        });
    }

    addIntegrationSessionDeliveryPoints(data: any) {
        return this.backendService.post('integration_session/add_delivery_points', data);
    }

    deleteIntegrationSessionDeliveryZones(data: any) {
        return this.backendService.put(
            'integration_session/delete_delivery_zones/delete',
            data,
        );
    }

    deleteIntegrationSessionDeliveryPoints(data: any) {
        return this.backendService.put(
            'integration_session/delete_delivery_points/delete',
            data,
        );
    }

    addDeliveryPointImportExcel(file: any) {
        return this.backendService.postFile('delivery_point_import_excel', file);
    }

    getDeliveryPointExportJson(url) {
        return this.backendService.get(url);
    }

    updateIntegrationDeliveryPoint(id: number, data: any) {
        return this.backendService.put(
            'integration_session/update_delivery_point/' + id,
            data,
        );
    }

    constructor(private backendService: BackendService) {}
}

import { Point } from './point.type';
export interface integrationDeliveryZone {
    id: number;
    integrationSessionId: number;
    companyId: number;
    deliveryZoneId: string;
    integration_delivery_points: Point[];
}

export class integrationDeliveryZone implements integrationDeliveryZone {
    constructor() {
        (this.id = 0),
            (this.integrationSessionId = 0),
            (this.companyId = 0),
            (this.deliveryZoneId = '');
        this.integration_delivery_points = [];
    }
}

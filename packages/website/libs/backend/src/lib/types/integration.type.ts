import { integrationDeliveryZone } from './integration-delivery-zone.type';
export interface Integration{
    id: number,
    name: string,
    description: string,
    dateSession?: string
    integration_delivery_zones: integrationDeliveryZone[];
}

export class Integration implements Integration{
    constructor(){
    this.id= 0,
    this.name= '',
    this.description=  '',
    this.dateSession = ''
    this.integration_delivery_zones =[];
    }
}

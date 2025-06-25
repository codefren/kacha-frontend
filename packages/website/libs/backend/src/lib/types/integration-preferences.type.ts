export interface IntegrationPreferences {
    id: number,
    companyId?: number;
    templateName?: string,
    readTo?: number,
    deliveryPointId?: string,
    name?: string,
    address?: string,
    deliveryZoneId?: string,
    population?: string,
    postalCode?: string,
    deliveryWindowStart?: string,
    deliveryWindowEnd?: string,
    phoneNumnber?: string,
    email?: string,
    demand?: string,
    volumetric?: string,
    deliveryNotes?: string,
    isActive ?:boolean,
    orderNumber?: string,
    concatenateAddress?: boolean,
  }

  export class IntegrationPreferences  implements IntegrationPreferences  {
	constructor(){
        this.id = 0,
        this.readTo = 0;
        this.companyId = 0;
        this.templateName = '',
        this.deliveryPointId = '',
        this.name = '',
        this.address = '',
        this.deliveryZoneId = '',
        this.population = '',
        this.postalCode = '',
        this.deliveryWindowStart = '',
        this.deliveryWindowEnd = '',
        this.phoneNumnber = '',
        this.email = '',
        this.demand = '',
        this.volumetric = '',
        this.deliveryNotes = '',
        this.isActive = false,
        this.orderNumber = '',
        this.concatenateAddress = false;
	}
}

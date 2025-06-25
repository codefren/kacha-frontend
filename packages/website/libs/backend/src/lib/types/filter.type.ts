export interface Filter {

    commercialId?: string,
    statusOrderId?: string,
    deliveryPointId: [],
    dateFrom: string,
    dateTo: string,
    date: string,
    deliveryTomorrow?: string,
    deliveryFromTomorrow?: string,
    userDriverId? :string
    
}

export class Filter implements Filter {
   
    constructor() {
        this.commercialId = '';
        this.statusOrderId ='';
        this.deliveryPointId = [];
        this.dateFrom = '';
        this.dateFrom = '';
        this.date = '';
        this.deliveryTomorrow = '';
        this.deliveryFromTomorrow = '';
        this.userDriverId = '';
 
    }
}

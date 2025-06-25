export interface Franchise {
    id: number;
    name: string;
    nif: string;
    streetAddress: string;
    phone: string,
    billingEmail: string,
    password: string,
    responsableName: string,
    scheduleStart: 0,
    scheduleEnd: 0,
    activeInApp: boolean,
    receiveProductsFromCompanyParent: boolean,
    productReceptionTimeFromCompanyParent: number,
    productReceptionEachTimeFromCompanyParent: number,
    images?: { 
        id: number;
        urlimage: string;
        image?: string
     }[];
     deliverySchedule?: any [],
     companyPreferencePreparation?: {
        multipleOrderBox: boolean;
     }
     
}

export class Franchise implements Franchise {
    constructor() {
        this.id = 0;
        this.name = '';
        this.nif = '';
        this.streetAddress = '';
        this.phone = '';
        this.billingEmail = '';
        this.password = '';
        this.responsableName = '';
        this.scheduleStart = 0;
        this.scheduleEnd = 0;
        this.activeInApp = false,
        this.receiveProductsFromCompanyParent = false;
        this.productReceptionTimeFromCompanyParent = 0;
        this.productReceptionEachTimeFromCompanyParent = 0;
        this.images = [];
        this.deliverySchedule =[];
        this.companyPreferencePreparation = {
            multipleOrderBox: false
        };
    }
}


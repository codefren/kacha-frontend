import { Company } from './companies.type';

export interface User {
    createdAt?: string;
    updatedAt?: string;
    created_by_user?: string;
    id?: number;
    email?: string;
    company?: Company;
    address?: {
        countryCode: string;
        streetAddress: string;
        city: string;
        province: string;
        zipCode: string;
    };
    name?: string;
    surname?: string;
    nationalId?: string;
    phone?: string;
    deliveryPointNationalId?: string;
    deliveryPointCity?: string;
    urlVideo?:string;
    deliveryPointPostalCode?: string;
    deliveryPointAdress?: string;
    deliveryPointEmail?: string;
    delveryPointName?: string;
    subscription?: {
        basePriceEuroCents: number;
        periodicPriceEuroCents: number;
        paymentPeriodicityMonths: number;
        basePaid: boolean;
    };
    preferences?: {
        optimization: {
            defaultServiceTime: number;
            minServiceTimeStat: number;
            maxServiceTimeStat: number;
            warehouse: {
                address: string;
                coordinates: {
                    latitude: number;
                    longitude: number;
                };
            };
            defaultSettings: {
                forceDepartureTime: boolean;
                ignoreCapacityLimit: boolean;
                useAllVehicles: boolean;
                optimizeFromIndex: number;
                explorationLevel: number;
                deliverySchedule: {
                    start: number;
                    end: number;
                };
                optimizationParameters: {
                    preference: {
                        travelDistance: number;
                        numVehicles: number;
                        customerSatisfaction: number;
                        vehicleTimeBalance: number;
                    };
                };
                traffic: {
                    range1: Range;
                    range2: Range;
                    range3: Range;
                };
            };
            createSession: {
                createDeliveryPoints: boolean;
                updateDeliveryPoints: boolean;
                createDeliveryZones: boolean;
                createUnassignedZone: boolean;
                setUnassignedZone: boolean;
                autoSaveSession: boolean;
            };
        };
        interface: {
            expandZoneOptions: boolean;
            expandZones: boolean;
            expandRoutes: boolean;
            expandRouteOptions: boolean;
            autoEvaluation: boolean;
            deliveryPointListFields: {
                readyTime: boolean;
                limitTime: boolean;
                arrival: boolean;
                travelTime: boolean;
                travelDistance: boolean;
                vehicleWaitTime: boolean;
                customerWaitTime: boolean;
            };
        };
        printing: {
            printProperties: {
                summaryPage: boolean;
                originalZone: boolean;
                customerName: boolean;
                customerCode: boolean;
                order: boolean;
                opening: boolean;
                deliveryTimeLimit: boolean;
                plannedArrivalTime: boolean;
                load: boolean;
                customerWaitTime: boolean;
            };
        };
        controlPanel: {
            assignmentNextDay: boolean;
            refreshTime: number;
        },
        management: {
            updateDeliveryPointAddressOnOpt: boolean;
            updateDeliveryPointDeliveryEndOnOpt: boolean;
            updateDeliveryPointDeliveryStartOnOpt: boolean;
            updateDeliveryPointNameOnOpt: boolean;
            updateDeliveryPointZoneIdOnOpt: boolean;
            updateDeliveryZoneColor: boolean;
            updateDeliveryZoneColorOnOpt: boolean;
            updateDeliveryZoneDeliveryEndOnOpt: boolean;
            updateDeliveryZoneDeliveryStartOnOpt: boolean;
            updateDeliveryZoneForceDepartureTimeOnOpt: boolean;
            updateDeliveryZoneIgnoreCapacityLimitOnOpt: boolean;
            updateDeliveryZoneNameOnOpt: boolean;
            useDeliveryPointPersistedAddress: boolean;
            useDeliveryPointPersistedDeliveryStart: boolean;
            useDeliveryPointPersistedScheduleEnd: boolean;
            useDeliveryPointPersistedServiceTime: boolean;
            useDeliveryZonePersistedColor: boolean;
            useDeliveryZonePersistedDeliveryEnd: boolean;
            useDeliveryZonePersistedDeliveryStart: boolean;
            useDeliveryZonePersistedForceDeparture: boolean;
            useDeliveryZonePersistedIgnoreCapacityLimit: boolean;
            useDeliveryZonePersistedName: boolean;
            useDeliveryZonePersistedUseAllVehicles: boolean;
            usePointSaved: boolean;
        }
    };
    profiles?: any;
    password?:string;
    companyId?:number;
    idCompany?:number;
    password_confirmation?:string;
    isActive?: boolean;
    allowedQuantityOrders?: number;
    allowDeliveryNoteIdentificator?: boolean,
    deliveryNoteNomenclature?: string,
    country?: string;
    countryCode?: string;
    monthlyObjective? : number,
    commissionOrdersPercentage? : number,
    commissionOrdersAppPercentage? : number,
    useSchedule?: boolean;
    schedule?: {
        days: any[]
    }
    profile?:any;
    userTypeId?:number;
    userType?: {
        id: number, 
        name: string
    }
    vehicleBreakdown?:[];
    drivingLicenses?: any[];
    otherLicenses?: any[];
    image?:string,
    urlImage?:string,
    idERP?:string;

}

export class User implements User{
    constructor(){
        this.createdAt = '';
        this.created_by_user = '',
        this.company = new Company();
        this.email = '';
        this.id = 0;
        this.name = '';
        this.nationalId = '';
        this.companyId = 0;
        this.idCompany = 0;
        this.phone = '';
        this.country = '';
        this.countryCode = '';
        this.surname = '';
        this.isActive = true;
        this.allowedQuantityOrders = 0;
        this.deliveryPointNationalId = '';
        this.deliveryPointCity = '';
        this.urlVideo = '';
        this.deliveryPointPostalCode = '';
        this.deliveryPointAdress = '';
        this.deliveryPointEmail = '';
        this.delveryPointName = '';
        this.useSchedule = false;
        this.monthlyObjective = null;
        this.commissionOrdersPercentage = null;
        this.commissionOrdersAppPercentage = null;
        this.schedule = {
            days: []
        };
        this.userTypeId =1;
        this.userType = {
            id: 1, 
            name: ''
        }
        this.vehicleBreakdown=[];
        this.drivingLicenses=[];
        this.otherLicenses=[];
        this.image ='',
        this.urlImage =''
    }
}
export interface Range {
    active: boolean;
    timeInterval: {
        start: number;
        end: number;
    };
    increaseProportion: number;
}

export interface createUserDto {
    id?:string;
    roles: string[];
    email: string;
    company?: Company;
    profile: {
        name: string;
        surname: string;
        nationalId: string;
        phoneNumber: string;
    };
    address: {
        countryCode: string;
        streetAddress: string;
        city: string;
        province: string;
        zipCode: string;
    };
    subscription: {
        basePriceEuroCents: number;
        periodicPriceEuroCents: number;
    };
    companyId?:number;
    subscriptionVehicles:number;
}
export class  createUserDto implements createUserDto {

    constructor(){
        this.id = ''
        this.roles = [];
        this.address = {
              city:"",
              countryCode:"",
              province:"",
              streetAddress:"",
              zipCode:""
        };
        this.email = "";
        this.profile ={
              name:"",
              nationalId:"",
              phoneNumber:"",
              surname:""
        };
        this.subscription ={
              basePriceEuroCents:0,
              periodicPriceEuroCents:0
        };
        this.company = new Company();
        this.companyId = 0;
        this.subscriptionVehicles = 0;
    };
}

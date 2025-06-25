export interface Point{
    id: string,
    companyId: string,
    name: string,
    address: string,
    useBillingAddress:boolean,
    billingAddress: string,
    demand: number,
    serviceTime: number,
    priority?: number,
    keyOpen: boolean,
    deliveryNotes?: string,
    deliveryZoneId: string,
    coordinatesLatitude: string,
    coordinatesLongitude: string,
    deliveryWindowStart: string,
    deliveryWindowEnd: string,
    postalCode?: string,
    population?: string,
    province?: string,
    phoneNumber?: string,
    email?: string,
    deliveryPointPaymentTypeId? :number,
    fiscalName? : string,
    accountingCode? : string,
    specialConditions? : string,
    specialRate? : number,
    maximumUnpaid? : number,
    created_at? : string,
    disabled_at ? :string,
    contactName?: string,
    nif?: string,
    sendDeliveryNoteMail?: boolean
    companyAssociatedId?: number,
    leadTime?: number,
    delayTime?: number,
    allowedDelayTime?: number
    userAgentId?: number,
    agentUserId?: number,
    equivalence?: boolean,
    verifiedByDriver?: boolean,
    avgServiceTime?: number,
    isActive?: boolean,
    agent_user?: {
        id?: number;
        name?: string;
        surname?: string;
        country?: string;
        companyId?: number;
        email?: string;
        isActive?: boolean;
    };
    //deliveryPointServiceType?:any[],
    //deliveryPointServiceType?:number,
    deliveryPointServiceType?: {
        id: number;
        name: string;
    };
    showDeliveryNotePrice?: boolean;
    activateDeliverySchedule?: boolean;
    timeSpecification?: boolean;
    deliveryPointScheduleTypeId?: number;
    schedule?: {
        days: any[];
    };
    images?: {
        id: number;
        urlImage: string;
        image?: string;
     }[];
     companyPreferenceDelayTimeId?: number,
     allowDelayTime?:boolean,
     statusDeliveryPointId?:number,
     deliveryWindowVisitStart?: string,
     deliveryWindowVisitEnd?: string,
     activateDeliveryVisitSchedule?: boolean,
     deliveryPointVisitScheduleTypeId?:number,
     scheduleVisit?:{
        days:any []
     },
    /*  deliveryZoneSpecificationType?:any[], */
    deliveryZoneSpecificationType?: {
        id: number;
        name: string;
    };
    isGroup?: boolean;
    pendingContainers?:number;
}

export class Point implements Point{
    constructor(){
        this.id ='',
        this.companyId = '',
        this.name = '',
        this.address = '',
        this.useBillingAddress = false,
        this.billingAddress = '',
        this.demand = 0,
        this.serviceTime = 0,
        this.priority = 0,
        this.keyOpen = false,
        this.deliveryNotes = '',
        this.deliveryZoneId = '',
        this.coordinatesLatitude = '',
        this.coordinatesLongitude = '',
        this.deliveryWindowStart = '',
        this.deliveryWindowEnd = '',
        this.postalCode = '',
        this.population = '',
        this.province = '',
        this.phoneNumber = '',
        this.email = '',
        this.deliveryPointPaymentTypeId = null,
        this.fiscalName = '',
        this.accountingCode ='',
        this.specialConditions ='',
        this.specialRate = null,
        this.maximumUnpaid = null,
        this.created_at = '',
        this.disabled_at ='',
        this.contactName ='',
        this.nif = ''
        this.sendDeliveryNoteMail = false,
        this.companyAssociatedId = null;
        this.leadTime = 0;
        this.delayTime = 0;
        this.allowedDelayTime = 0;
        this.userAgentId = null;
        this.agentUserId = 0;
        this.equivalence = false;
        this.verifiedByDriver = false;
        this.agent_user = null;
        this.isActive = true;
        this.isGroup = false;
        this.pendingContainers = 0;
        //this.deliveryPointServiceType =[];
        //this.deliveryPointServiceType =null,
        (this.deliveryZoneSpecificationType = {
            id: null,
            name: '',
        }),
            (this.deliveryPointServiceType = {
                id: null,
                name: '',
            }),
            (this.showDeliveryNotePrice = true),
            (this.activateDeliverySchedule = false),
            (this.timeSpecification = false),
            (this.deliveryPointScheduleTypeId = 0),
            (this.schedule = {
                days: [],
            });
        (this.images = []),
            (this.companyPreferenceDelayTimeId = null),
            (this.allowDelayTime = false),
            (this.statusDeliveryPointId = 0),
            (this.deliveryWindowVisitStart = ''),
            (this.deliveryWindowVisitEnd = ''),
            (this.activateDeliveryVisitSchedule = false),
            (this.deliveryPointVisitScheduleTypeId = 0),
            (this.scheduleVisit = {
                days: [],
            });
    }
}

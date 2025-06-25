import {  ClientSchedule } from './client-schedule.type';

export interface ClientInterface {
    id?: number;
    idapp?:number,
    code?: string,
    name: string,
    nif: string,
    address?:string,
    postalCode?: string,
    province?: string,
    population?: string,
    phoneNumber?: string,
    phonePersonal?: string,
    agentUserId?: number,
    agentUser?: {
        id?: string,
        name?:string,
        surname?: string
    },
    equivalence?: boolean,
    deliveryNoteQuantity?: '',
    commerceTypeId?: number,
    commerceType?: {
        id:string,
        name: string
    },
    coordinatesLatitude?: number,
    coordinatesLongitude?: number,
    clientNearId?: number ,
    clientNear?: {
        id: string,
        name: string,
        email: string,
        address: string
    },
    email?:string,
    fiscalName:string,
    fiscalResidence:string,
    fiscalPostalCode: string,
    fiscalProvince: string,
    fiscalPhoneNumber:string,
    fiscalPopulation: string,
    paymentMethodId?: number,
    paymentMethod?: {
        id: string,
        name: string,
    },
    billingTypeId?: number,
    billingType?: {
        id: string,
        name: string
    },
    collectorUserId?: number,
    collectorUser?: {
        id:string,
        name: string,
        surname: string,
        email:string
    },
    publicStateImage:string,
    dniImage: string,  
    urlPublicStateImage:string,
    urlDniImage: string,      
    isActive: boolean,
    schedule: ClientSchedule,
    clientsTable: [];
    company_zone?:{
        companyId: number,
        zone?:{
        id: number,
        name: string
        },
        zoneId: number
    }
}


export class ClientInterface  implements ClientInterface  {
	constructor(){
        this.id = 0;
        this.idapp = 0;
        this.code = '',
        this.name = '',
        this.nif = '',
        this.address = '',
        this.postalCode = '',
        this.province = '',
        this.population = '',
        this.phoneNumber = '',
        this.phonePersonal = '',
        this.agentUserId = 0,
        this.agentUser = {
            id: '',
            name:'',
            surname: ''
        },
        this.equivalence = true,
        this.deliveryNoteQuantity = '',
        this.commerceTypeId = 0, 
        this.commerceType= {
            id:'',
            name: ''
        },
        this.coordinatesLatitude = 1,
        this.coordinatesLongitude = 1,
        this.clientNearId = 0,
        this.clientNear = {
            id: '',
            name: '',
            email: '',
            address: ''
        },
        this.email ='',
        this.fiscalName ='',
        this.fiscalResidence ='',
        this.fiscalPostalCode = '',
        this.fiscalProvince = '',
        this.fiscalPhoneNumber ='',
        this.fiscalPopulation = '',
        this.paymentMethodId = 0,
        this.paymentMethod = {
            id: '',
            name: '',
        },
        this.billingTypeId = 0,
        this.billingType = {
            id: '',
            name: ''
        },
        this.collectorUserId = 0,
        this.collectorUser= {
            id: '',
            name: '',
            surname: '',
            email: ''
        };
        this.publicStateImage ='',
        this.dniImage = '',
        this.urlPublicStateImage ='',
        this.urlDniImage = '',
        this.isActive = true,
        this.schedule = new ClientSchedule(); 
        this.clientsTable= [];
        this.company_zone = {
            companyId: 0,
            zone :{
            id: 0,
            name: ''
            },
            zoneId:0
        };
	}
}

import { ClientInterface } from './clients.type';
import { ProductsInterface } from './products.type';
import { Point } from './point.type';

export interface Orders {
    id: number;
    orderDate: string,
    isActive: boolean,
    interval: number,
    observations: string
    user_seller: {
        id : string,
        name : string,
        surname : string
    },
    company: ClientInterface,
    delivery_point:Point,
    order_product: ProductsInterface ,
    order_assigned?:{
        assigned: boolean
        dateAssigned: string,
        id: number,
        user: {
            id: number, 
            name: string, 
            surname: string,
            rol:{
                id: number,
                name: string
            };
        }
        userId: number
    };
    order_delivery_assigned?:{
        assigned: boolean,
        dateAssigned: string,
        id: number,
        user: {
            id: number, 
            name: string, 
            surname: string,
            rol:{
                id: number,
                name: string
            };
        }
        userId: number;
    },
    status?:string;
    status_order: any;
    code: string;
    company_preference_delivery?: any,
    order_payment_status?: any,
    order_payment_type?: any,
    ticketTotal: number,
    total: number,
    last_order_payment: any,
    prepaidAmount: number,
    user_address: {
        address: string,
        buildingFloor: string,
        buildingName: string,
        doorName: string,
        id: number,
        phone: string,
        postalCode: string,
        province: string
    } | null,
    user_phone?:{
    default: boolean,
    id: number,
    phone: string,
    userId: number
    } | null,
    quantityBuyWithoutMinimun?: number,
    notElevator?:boolean,
    preparationStart?:string,
    preparationEnd?: string,
    deliveryStart?: string,
    deliveryEnd?: string,
    zone_delivery?: {
        express: boolean
        id: number
        isActive: boolean
        maxTime: number
        minTime: number
        name: string,
        price: number
    }
    
}


export class Orders  implements Orders  {
	constructor(){
        this.id = 0;
        this.orderDate = '',
        this.isActive = true,
        this.interval = 10,
        this.observations = '',
        this.status_order = {},
        this.status ='',
        this.code = "",
        this.user_seller = {
            id: '',
            name : '',
            surname : '',
        },
        this.company = new ClientInterface(),
        this.order_product = new ProductsInterface();
        this.order_assigned ={
            assigned: false,
            dateAssigned: '',
            id: 0,
            user: {
                id: 0, 
                name: '', 
                surname: '',
                rol:{
                    id: 0,
                    name: ''
                    },
            },
            userId: 0
        };
        this.order_delivery_assigned ={
            assigned: false,
            dateAssigned: '',
            id: 0,
            user: {
                id: 0, 
                name: '', 
                surname: '',
                rol:{
                    id: 0,
                    name: ''
                },
            },
            userId: 0,
        };
        this.preparationStart = '',
        this.preparationEnd = '',
        this.deliveryStart = '',
        this.deliveryEnd = '',
        this.ticketTotal = 0;
        this.total = 0;
        this.prepaidAmount = 0;
        this.user_address = null;
        this.user_phone = null;
        this.quantityBuyWithoutMinimun = 0;
        this.notElevator = false;
        this.zone_delivery = {
            express: false,
            id: 0,
            isActive: false,
            maxTime: 0,
            minTime: 0,
            name: '',
            price: 0
        };
	}
}

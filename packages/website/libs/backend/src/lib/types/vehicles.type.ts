export interface Vehicle {
    id?: number;
    name?: string;
    deliveryZoneId?: string;
    capacity: number;
    weightLimit?: number;
    registration?: string;
    nextVehicleInspection?: Date;
    userId?: number;
    vehicleTypeId?: number;
    user?:{
        id:number;
        name: string;
        surname: string;
        idERP?: string
    },
    vehicleType?: {
        id:number;
        name: string;
    };
    deliveryWindowEnd?: number;
    deliveryWindowStart?: number;
    vehicleServiceType?: any[];
    accessories?: string;
    deliveryLimit?: number;
    stopRequired?: boolean;
    vehicleStopType?:any[],
    activateDeliverySchedule?:boolean;
    deliveryPointScheduleTypeId?:number,
    vehicleScheduleSpecification?: any[],
    vehicleScheduleSpecificationId?: number;
    schedules?: any[];
    schedule?: {
        days: any[]
    }
    timeZone?: any[];

    isActive?: boolean;

    vehicleBrand?:string;

    model?:string;

    frameNumber?:number;

    acquisitionDate?:string;

    lowDate?:string;

    licenseId?:number;

    tare?:number;

    mma?:number;

    usefulLoad?:number;

    liftGate?:boolean;

    length?:number;

    tall?:number;

    width?:number;

    totalVolumetricCapacity?: number;

    urlImage?:string,
    image?:string

    userFeeCostId?: number;

    idERP?: string;

}

export class Vehicle implements Vehicle{
    constructor(){
        this.id = 0,
        this.name = '',
        this.deliveryZoneId = '',
        this.capacity = 0,
        this.weightLimit = 0,
        this.registration = '',
        this.userId = 0,
        this.user={
            id: 0,
            name: '',
            surname: ''
        },
        this.vehicleType = {
            id:0,
            name: ''
        },
        this.deliveryWindowEnd = 0,
        this.deliveryWindowStart = 0,
        this.vehicleServiceType =[],
        this.accessories = '';
        this.deliveryLimit = 0;
        this.stopRequired = false;
        this.vehicleStopType =[],
        this.activateDeliverySchedule = false,
        this.deliveryPointScheduleTypeId = 0,
        this.schedule = {
            days: []
        };
        this.timeZone =[];

        this.schedules = [];

        this.isActive = true;

        this.vehicleBrand = '';

        this.model = '';

        this.frameNumber = 0;

        this.acquisitionDate = '';

        this.lowDate = '';

        this.tare = 0;

        this.mma = 0;

        this.usefulLoad = 0;

        this.liftGate = false;

        this.length = 0;

        this.tall = 0;

        this.width = 0;

        this.totalVolumetricCapacity = 0;

        this.urlImage ='';

        this.image = '';

    }
}

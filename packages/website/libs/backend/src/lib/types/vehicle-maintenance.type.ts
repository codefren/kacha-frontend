export interface VehicleMaintenance {
    
    companyId?: number,
    date?: string,
    id?: number,
    images?: { 
        id: number;
        urlImage: string;
     }[];
    isActive?: boolean,
    maintenanceStatus?: {
        id: number, 
        name: string
    },
    maintenanceStatusId?: number,
    maintenanceVehicleReview?: [{
        comentary: string,
        id: number
        maintenanceReviewTypeId: number,
    }],
    maintenanceVehicleStateType?: {
        id: number, 
        name: string
    },
    maintenanceVehicleStateTypeId?: number,
    total_preference_review?: number,
    total_vehicle_review?: number,
    user?: {
        companyId: number,
        country: string,
        email: string,
        id: number,
        isActive: boolean,
        name: string
        surname: string
    },
    userId?: number,
    vehicle?: {
        id: number, 
        name: string, 
        capacity: number
    },
    vehicleId?: number,
    
}

export class VehicleMaintenance  implements VehicleMaintenance  {
	constructor(){
        this.companyId = 0,
        this.date = '',
        this.id = 0,
        this.images = [],
        this.isActive = false,
        this.maintenanceStatus = {
            id: 0, 
            name: ''
        },
        this.maintenanceStatusId = 0,
        this.maintenanceVehicleReview = [{
            comentary: '',
            id: 0,
            maintenanceReviewTypeId: 0,
        }],
        this.maintenanceVehicleStateType = {
            id: 0, 
            name: ''
        },
        this.maintenanceVehicleStateTypeId = 0,
        this.total_preference_review = 0,
        this.total_vehicle_review = 0,
        this.user = {
            companyId: 0,
            country: '',
            email: '',
            id: 0,
            isActive: false,
            name: '',
            surname: ''
        },
        this.userId = 0,
        this.vehicle = {
            id: 0, 
            name: '', 
            capacity: 0
        },
        this.vehicleId =0
	}
}

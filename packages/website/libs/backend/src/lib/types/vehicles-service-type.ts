export interface VehiclesServiceType {
    id?: number,
    code?:string,
    name?: string,
    isActive?: boolean,

    licenses?:any[];
}

export class VehiclesServiceType  implements VehiclesServiceType  {
	constructor(){
        this.id = 0,
        this.code ='',
        this.name = '',
        this.isActive = true;
        this.licenses =[];
	}
}
export interface DeliverySpecificationType {
    id?: number,
    code?:string,
    name?: string,
    isActive?: boolean,

}

export class DeliverySpecificationType  implements DeliverySpecificationType  {
	constructor(){
        this.id = 0,
        this.code ='',
        this.name = '',
        this.isActive = true;
	}
}
export interface DeliverySchedule {

   
    id: number,
    company_id: number,
    name: string,
    scheduleStart: number,
    scheduleEnd: number,
    isActive: boolean,

}

export class DeliverySchedule implements DeliverySchedule {
    constructor() {
       
        this.id = 0,
        this.company_id = 0,
        this.name = 'string',
        this.scheduleStart = 0,
        this.scheduleEnd = 0,
        this.isActive = false
    }
}
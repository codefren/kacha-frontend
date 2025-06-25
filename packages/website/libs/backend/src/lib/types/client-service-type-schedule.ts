export interface ClientServiceTypesSchedule {
    id?: number,
    code?:string,
    name?: string,
    isActive?: boolean,
    timeStart?: 0,
	timeEnd?:0

}

export class ClientServiceTypesSchedule  implements ClientServiceTypesSchedule  {
	constructor(){
        this.id = 0,
        this.code ='',
        this.name = '',
        this.timeStart = 0,
	    this.timeEnd =0,
        this.isActive = true
	}
}
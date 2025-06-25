export interface AllowDelayTime {
    id: number,
    companyId?: number,
    name?: string,
    time?: number,
    isActive?: boolean,
    created?: string,
    updated?: string,
  }

  export class AllowDelayTime  implements AllowDelayTime  {
	constructor(){
        this.id = 0,
        this.companyId = 0,
        this.name = '',
        this.time = 0,
        this.isActive = false,
        this.created = '',
        this.updated = ''
	}
}
export interface predefine {
    companyId?: number,
    id?: number,
    isActive?:false,
    name?:string
  }

  export class predefine  implements predefine  {
	constructor(){
        this.companyId = 0,
        this.id = 0,
        this.isActive =false,
        this.name = ''
	}
}
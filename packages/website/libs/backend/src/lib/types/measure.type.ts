export interface MeasureInterface {
    id: number,
    companyId: number;
    code?:string,
    name: string,
    isActive: boolean,
    allowFloatQuantity: boolean,
    activateEquivalentAmount: boolean,
    equivalentAmount: number,
    company: {
      id: number,
      name : string,
    }
  }

  export class MeasureInterface  implements MeasureInterface  {
	constructor(){
        this.id = 0,
        this.companyId = 0,
        this.code = '',
        this.name = '',
        this.isActive = true,
        this.allowFloatQuantity = false,
        this.activateEquivalentAmount = false,
        this.company = {
          id: 0,
          name : '',
        }
	}
}
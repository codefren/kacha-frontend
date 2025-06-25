export interface IntegrationDeliveryNote {
    id: number,
    companyId?: number;
    templateName?: string,
    readTo?: number;
    deliveryPointId?: string,
    deliveryNoteCode?:string,
    code? : string,
    name?: string,
    quantity?: string,
    price?: string,
    taxPercent?: string,
    measure?: string,
    deliveryNoteObservation?: string,
    promptPayDiscountPercent?: string,
    discountPercent?: string,
    grossMass?: string,
    netMass?: string,
    observation?: string,
    lotCode?: string,
    isActive ?:boolean
  }

  export class IntegrationDeliveryNote  implements IntegrationDeliveryNote  {
	constructor(){
        this.id = 0,
        this.companyId = 0;
        this.templateName = '',
        this.readTo = 0,
        this.deliveryPointId = '',
        this.deliveryNoteCode = '',
        this.code = '',
        this.name = '',
        this.quantity = '',
        this.price = '',
        this.taxPercent = '',
        this.measure = '',
        this.deliveryNoteObservation = '',
        this.promptPayDiscountPercent = '',
        this.discountPercent = '',
        this.grossMass = '',
        this.netMass = '',
        this.observation = '',
        this.lotCode = '',
        this.isActive = false
	}
}
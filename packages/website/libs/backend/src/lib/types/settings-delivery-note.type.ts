export interface DeliveryNoteInterface {
    billingEmail?: string;
    companyId?: number;
    country?: string;
    countryCode?: string;
    id?: number;
    isActive?: boolean;
    name?: string;
    nif?: string;
    phone?: string;
    province?: string;
    streetAddress?: string;
    urlLogo?: string;
    zipCode?: string;
    base64Logo?: string;
  }

  export class DeliveryNoteInterface  implements DeliveryNoteInterface  {
	constructor(){
        this.billingEmail = 'string';
        this.companyId = 0,
        this.country = '',
        this.countryCode = '',
        this.id = 0,
        this.isActive = false,
        this.name = '',
        this.nif = '',
        this.phone = '',
        this.province = '',
        this.streetAddress = '',
        this.urlLogo = '',
        this.zipCode = '',
        this.base64Logo =''
	}
}
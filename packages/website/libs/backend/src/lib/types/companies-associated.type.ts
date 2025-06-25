export interface AssociatedCompany {
  code?: string,
  id: number;
  companyId: number;
  name: string;
  nif: string;
  countryCode: string;
  country: string;
  streetAddress: string;
  city: string;
  province: string;
  zipCode: string;
  phone: string;
  billingEmail: string;
  serviceType:  {
      id : number,
      name: string
  };
  isActive: boolean; 
  urlLogo: string;
  serviceTypeId?: number
};

export class AssociatedCompany implements AssociatedCompany {

  constructor() {
    this.code = '';
    this.id = 0;
    this.companyId = 0;
    this.name = '';
    this.nif = '';
    this.countryCode = '';
    this.country = '';
    this.streetAddress = '';
    this.city = '';
    this.province = '';
    this.zipCode = '';
    this.phone = '';
    this.billingEmail = '';
    this.serviceType = {
      id: 0,
      name: ''
    };
    this.isActive = false;
    this.urlLogo = null;
  }
}
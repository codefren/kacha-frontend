export interface CompanyMe {
    id: number;
    name: string;
	countryCode: string,
	streetAddress: string,
	city: string,
	province: string,
	zipCode: string,
	nif: string,
	phone: string,
	billingEmail:string,
	vehicles: number,
	serviceType :  {
			id : number,
			name: string
		},
	isActive: boolean,
	isDemo: boolean,
	isSupport: boolean,
	startDemoDate: string,
	endDemoDate: string,
	accountNumber: string,
	subscription: {
		daysLate: number,
		isDemo: boolean;
		isTrial: boolean;
        nextPay: string;
        plan:{
          description: string,
          id: number,
          monthPrice: string,
          name: string,
          planId: number,
          vehicles: string
        }
	}
	
}


export class CompanyMe implements CompanyMe {
	constructor(){
		this.id = 0,
		this.name = "";
		this.countryCode = "",
		this.streetAddress = "",
		this.city = "",
		this.province= "",
		this.zipCode= "",
		this.nif= "",
		this.phone= "",
		this.billingEmail= "",
		this.vehicles = 0,
		this.serviceType = {
			id : null,
			name: ""
		},
		this.isActive = false,
		this.isDemo = false,
		this.isSupport = false,
		this.startDemoDate = "",
		this.endDemoDate = ""
		this.accountNumber = "";
		this.subscription= {
            daysLate: 0,
            isDemo: false,
            isTrial: false,
            nextPay: '',
            plan:{
              description: '',
              id: 0,
              monthPrice: '',
              name: '',
              planId: 0,
              vehicles: ''
            }
        }
	}
}

export interface Company {
    id: number;
    name: string;
    countryCode: string;
    country: string;
    streetAddress: string;
    city: string;
    province: string;
    zipCode: string;
    nif: string;
    phone: string;
    billingEmail: string;
    vehicles: number;
    serviceType: {
        id: number;
        name: string;
    };
    serviceTypeId?: number;
    email?:string;
    name_user?:string;
    surname?:string;
    nationalId?:string;
    phone_user?:string;
    password?:string;
    password_confirmation?:string;
    isActive: boolean;
    isDemo: boolean;
    isSupport: boolean;
    autonomous?: boolean;
    promotionCovid?: boolean;
    startDemoDate: string;
    endDemoDate: string;
    accountNumber: string;
    ftpUserName: string;
    ftpPassword: string;
    currencyId?: number;
    erpName?:string;
    erpEmail?:string;
    erpResponsable?:string;
    phoneErp?:string;
    companyProfileTypeId?:number;
    companyProfile: {
        id: number;
        name: string;
    }
    stripeMonthlyPrice?:number;
    stripeMonthlyPriceIva?:number;
    plan: {
        planId: number;
        planRateId: number;
        priceSetup: string;
        monthPrice: string;
        vehicleMonthPrice?: string;
    };
    subscribed?: boolean;
    companyUsersCount?:number;
    incidentCount?: number;
    modulesActiveCount?: number;
    completedIntegration?: boolean;
    completedIntegrationDate?: string;
    subscriptionDate?:string;
    integrationDays?: string;
    created_at?: string;
    multiStore?: boolean;

    isPartnerType?:boolean;
    activeLogoNomenclature?: boolean;
    urlPartnerType?: string;
    urlLogoTypePartner?: string;
    nameLogoTypePartner?: string;
    integrationTxt?: boolean;
    rateId?: number;
    suplementarySetup?: number;
    suplementaryMonthly?: number;
    setupPrice?: number;
    setupPriceIva?: number;
    maxUser?: number;
    maxVehicle?: number;
    hideMultidelegation?:boolean;
}

export class Company implements Company {
    constructor() {
        (this.id = 0),
        (this.name = '');
        (this.countryCode = ''),
        (this.country = ''),
        (this.streetAddress = ''),
        (this.city = ''),
        (this.province = ''),
        (this.zipCode = ''),
        (this.nif = ''),
        (this.phone = ''),
        (this.billingEmail = ''),
        (this.vehicles = 0),
        (this.currencyId = 0),
        (this.serviceType = {
            id: null,
            name: '',
        }),
        (this.email = '');
        (this.name_user = '');
        (this.surname = '');
        (this.nationalId = '');
        (this.phone_user ='');
        (this.password = '');
        (this.password_confirmation = '');
        (this.isActive = false),
        (this.isDemo = false),
        (this.isSupport = false),
        (this.autonomous = false),
        (this.promotionCovid = false),
        (this.startDemoDate = ''),
        (this.endDemoDate = '');
        this.accountNumber = '';
        this.ftpUserName ='';
        this.ftpPassword =='';
        this.erpName ='';
        this.erpEmail ='';
        this.erpResponsable ='';
        this.phoneErp ='';
        this.companyProfileTypeId = 0;
        (this.companyProfile = {
            id: null,
            name: '',
        }),
        this.stripeMonthlyPrice = 0;
        this.stripeMonthlyPriceIva = 0;
        this.plan = {
            planId: 0,
            planRateId: 0,
            priceSetup: '',
            monthPrice: '',
            vehicleMonthPrice: '',
        };
        this.companyUsersCount = 0;
        this.subscriptionDate ='';
        this.incidentCount = 0;
        this.modulesActiveCount = 0;
        this.completedIntegration = false;
        this.completedIntegrationDate = '';
        this.integrationDays = '';
        this.created_at = '';
        this.isPartnerType = false;
        this.activeLogoNomenclature = false;
        this.urlPartnerType = '';
        this.urlLogoTypePartner = '';
        this.nameLogoTypePartner = '';
        this.rateId = 0;
        this.hideMultidelegation = false;
    }
}

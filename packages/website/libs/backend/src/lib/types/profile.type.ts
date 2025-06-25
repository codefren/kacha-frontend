import { email } from 'ngx-custom-validators/src/app/email/validator';
import { currency } from './currency.type';


export interface Profile {
    email?: string;
    profile: ProfileInfo;
    address?: Address;
    company?: CompanyProfile;
    showTipsModal?: boolean;
    noveltyLast?: boolean;
    endHelpGuide?: boolean;
    helpGuideId?: number;
    helpGuide?: HelpGuide;
    profiles?:any[];
    userId?: number;

}


export interface HelpGuide {
    id: number;
    step: number;
    count: number;
    title: string;
    description: string;
    beforeUrl: string;
    nextUrl: string;
    currentUrl: string;
    nextStep: number;
    beforeStep: number;
}

export interface ProfileInfo {
    id?: number,
    name?: string;
    surname?: string;
    companyName?: string;
    nationalId?: string;
    phone?: string;
    country?: string;
}

export interface Address {
    countryCode?: string;
    streetAddress?: string;
    city?: string;
    province?: string;
    zipCode?: string;
}

export interface subscription {
    id: number,
    company_id: number,
    name: string,
    stripe_id: string,
    stripe_status: string,
    stripe_plan: string,
    quantity: number,
    trial_ends_at: string,
    ends_at: string,
    created_at: string,
    updated_at: string
}

export interface CompanyProfile{
    id?: number,
    name?: string,
    country?:string,
    countryCode?: string,
    streetAddress?: string,
    city?: string,
    province?: string,
    zipCode?: string,
    billingEmail?: string,
    serviceTypeId?: number,
    accountNumber?: string,
    isDemo?: boolean,
    startDemoDate?: string,
    endDemoDate?: string,
    isActive?: boolean,
    createdAt?: string,
    lastLogin?: string,
    vehicles?:number,
    createdBy?: {
        name: string,
        email: string
    },
    subscriptions?: subscription[],
    trial?:boolean,
    setupPaid?: boolean,
    lastMonthPaid?: boolean,
    logo?: string,
    urlLogoTypePartner?: string
    urlLogo?: string,
    termsAccepted?: boolean,
    currencyId?: number,
    currency?: currency,
    active_modules?: any[],
    nif?: string,
    companyParentId?: number,
    companyProfileTypeId?: number,
    phone?: string,
    hideMultidelegation?: boolean,
    integrationTxt?: boolean
}

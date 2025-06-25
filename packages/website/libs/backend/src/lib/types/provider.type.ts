export interface ProviderInterface {
    id: number;
    name: string;
    providerTypeId: number;
    providerType: {
        id:number,
        name: string,
    };
    providerAssigmentTypeId: number;
    providerAssigmentType: {
        id:number,
        name: string,
    };
    contactPerson?: string;
    email?: string;
    phoneNumber?: string;
    providerTypeConcept?: { 
        id: number;
        name: string;
        price: number;
        providerTypeGenericConceptId: number;
    }[];
    created_at: string,
    createdByUserData?: {
        name: string;
        surname: string;
    },
    isActive: boolean
}

export class ProviderInterface  implements ProviderInterface  {
	constructor(){
        this.id = 0,
        this.name = '',
        this.providerTypeId = 0,
        this.providerType = {
            id: 0,
            name: '',
        },
        this.providerAssigmentTypeId = 0,
        this.providerAssigmentType = {
            id: 0,
            name: '',
        },
        this.contactPerson = '',
        this.email = '',
        this.phoneNumber = '',
        this.providerTypeConcept = [],
        this.created_at = '',
        this.createdByUserData = {
            name: '',
            surname: '',
        },
        this.isActive = true
    }
}
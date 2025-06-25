export interface CompanyModuleInterface {
    id: number;
    companyId: number;
    isActive: boolean;
    moduleId: number;
    payed: boolean;
}

export class CompanyModuleInterface implements CompanyModuleInterface {
    constructor() {
        this.id = 0;
        this.companyId = 0;
        this.isActive = true;
        this.moduleId = 0;
        this.payed = false;
    }
}

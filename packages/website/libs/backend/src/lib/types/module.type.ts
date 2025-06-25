import { CompanyModuleInterface } from './company-module.type';

export interface ModuleInterface {
    id: number;
    name: string;
    isActive: boolean;
    price: number;
    company_module?: CompanyModuleInterface[];
}

export class ModuleInterface implements ModuleInterface {
    constructor() {
        this.id = 0;
        this.name = '';
        this.isActive = true;
        this.price = 0;
        this.company_module = [];
    }
}

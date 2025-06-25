import { Injectable } from '@angular/core';
import { BackendService } from '@optimroute/backend';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private _backend:BackendService) {}

    changePassword(data:any){
        return this._backend.post('change_password',data);
    }

    getCurrency() {
       return this._backend.get('currency'); 
    }

    getModules() {
        return this._backend.get('module_list'); 
     }
     updateModule(module: any) {
        return this._backend.post('stripe_pay_module', module); 
     }
}

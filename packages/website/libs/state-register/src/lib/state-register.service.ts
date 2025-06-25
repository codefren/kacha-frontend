import { Injectable } from "@angular/core";
import {  BackendService } from '@optimroute/backend';
import { Register } from './+state/state-register.reducer';
@Injectable({
  providedIn: "root"
})
export class StateRegisterService {
  constructor(private backendService: BackendService) {}

  persistRegister(register: Register) {
    return this.backendService.post_client('CompanyCreateAccount', register);
  }
}

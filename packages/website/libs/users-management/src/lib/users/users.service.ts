import { Injectable } from '@angular/core';
import { BackendService } from '@optimroute/backend';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private backendService:BackendService) { }
  loadProfiles() {
    return this.backendService.get('profile');
  }

  loadPartners() {
    return this.backendService.get('company_type_partner_list');
  }

  getUser() {
    return this.backendService.get('user_type');
  }

  getIncident(userId: number) {
    return this.backendService.get('user_incident_reports/'+ userId);
  }
  destroyCompanyDoc(userId: number){
    return this.backendService.delete('user_doc/'+ userId);
  }

  addCompanyDoc(companyDoc: FormData) {
    return this.backendService.postFile('user_doc', companyDoc);
  }

  editCompanyDoc(companyDoc: FormData, userId) {
    return this.backendService.postFile('user_doc/' + userId, companyDoc);
  }

}

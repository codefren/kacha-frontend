import { Injectable } from '@angular/core';
import { BackendService, User } from '@optimroute/backend';

@Injectable({
  providedIn: 'root'
})
export class ManageUsersService {

  constructor(private backendService:BackendService) { }
  loadProfiles() {
    return this.backendService.get('profile');
  }
  
  getUser() {
    return this.backendService.get('user_type');
  }

  addUserFranquise(v: User) {
    //console.log(v);
    return this.backendService.post('user_store_manage', v);
  }

  updateUserFranquise(id: number, user: User) {
    console.log('entro por actualizar');
      return this.backendService.put('user_update_manage/' + id, user);
  }

}

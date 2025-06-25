import { Injectable } from '@angular/core';
import { BackendService, User, createUserDto } from '@optimroute/backend';

@Injectable({
  providedIn: 'root'
})
export class StateUsersService {

  loadUsers(me: boolean) {
    if(me){
      return this.backendService.get('users?me=true');  
    }else{
      return this.backendService.get('users');
    }
    
  }

  addUser(v: User) {
      //console.log(v);
      return this.backendService.post('users', v);
  }

  updateUser(id: number, user: Partial<User>) {
      return this.backendService.put('users/' + id, user);
  }

  deleteUser(id: number) {
      return this.backendService.delete('users/' + id);
  }
  loadUsersDriver() {    
    return this.backendService.get('drivers');
  }

  loadVehiclesType() {    
    return this.backendService.get('vehicle_type');
  }

  activate(id: number) {
    return this.backendService.put('user_activate/' + id);
  }

  deactivate(id: number) {
    return this.backendService.put('user_deactivate/' + id);
  }

  getUsersPreparer(){
    return this.backendService.get('users_preparer');
  }
  // get serviceTypeVehicles
  loadVehiclesServiceType() {    
    return this.backendService.get('company_vehicle_service_type');
  }

  loadVehiclesLicenseServiceType() {    
    return this.backendService.get('license_all');
  }
  //vehicles document

  destroyVehiclesDoc(userId: number){
    return this.backendService.delete('vehicle_doc/'+ userId);
  }

  addVehiclesDoc(vehicleDoc: FormData) {
    return this.backendService.postFile('vehicle_doc', vehicleDoc);
  }

  editVehiclesDoc(vehicleDoc: FormData, userId) {
    return this.backendService.postFile('vehicle_doc/' + userId, vehicleDoc);
  }
  //BREAK_TIME
  getBreakTime(){
    return this.backendService.get('stop_type');
  }

  loadOtherLicenseByCompany() {    
    return this.backendService.get('company_other_license_list');
  }

  loadLicenseByCompany() {    
    return this.backendService.get('license_by_company');
  }

  addLoadUserTemplateInExcel (file: any){
    return this.backendService.postFile('load_user_template_in_excel ', file );
  }

  loadSalaryByExcel (file: any){
    return this.backendService.postFile('user_load_salary_by_excel ', file );
  }

  constructor(private backendService: BackendService) {}
}

import { Injectable } from '@angular/core';
import { BackendService } from '@optimroute/backend';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private backendService:BackendService) { }

  loadListByUser() {
    return this.backendService.get('company_note_list_by_user');
  }
  loadCompanies() {
      return this.backendService.get('company');
  }
  getNotes(id : number){
    return this.backendService.get('company_note/'+ id);
  }
  getUsers(userSalesmanId: number){
    return this.backendService.get('users_salesman?userSalesmanId=' + userSalesmanId);
  }
  registerNote( data: any){
    return this.backendService.post('company_note', data);
  }
  registerSubNote( data: any){
    return this.backendService.post('company_sub_note', data);
  }
  updateSubNote( id: number ,data: any){
    return this.backendService.put('company_sub_note/' +id, data);
  }
  updateNote(id :number , data: any){
    return this.backendService.put('company_note/'+ id, data);
  }

  deleteSubnotes(id :number){
    return this.backendService.delete('company_sub_note/'+ id);
  }

  updateActiveUsers(userId:number, userRequest: any){
    return this.backendService.put('users/'+ userId, userRequest);
  }

  addUserShareNote(data, idNote) {
    return this.backendService.put('company_note_share/' + idNote, data);
  }
  deleteUserShareNote(data, idNote) {
    return this.backendService.put('delete_company_note_share/' + idNote, data);
  }
}

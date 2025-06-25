import { Injectable } from '@angular/core';
import { BackendService } from '@optimroute/backend';

@Injectable({
  providedIn: 'root'
})
export class MyNoteService {

  constructor(private _backendService: BackendService) { }

  getNotes(id : number){
    return this._backendService.get('company_note/'+ id);
  }
  registerNote( data: any){
    return this._backendService.post('company_note_store_user', data);
  }
  updateNote(id :number, data: any){
    return this._backendService.put('company_note/'+ id, data);
  }
  registerSubNote( data: any){
    return this._backendService.post('company_sub_note', data);
  }
  updateSubNote( id: number ,data: any){
    return this._backendService.put('company_sub_note/' +id, data);
  }
  deleteSubnotes(id :number){
    return this._backendService.delete('company_sub_note/'+ id);
  }

  addUserShareNote(data, idNote) {
    return this._backendService.put('company_note_share/' + idNote, data);
  }
  deleteUserShareNote(data, idNote) {
    return this._backendService.put('delete_company_note_share/' + idNote, data);
  }

}

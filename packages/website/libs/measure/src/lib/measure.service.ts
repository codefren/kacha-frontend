import { Injectable } from '@angular/core';
import { BackendService } from '@optimroute/backend';

@Injectable({
  providedIn: 'root'
})
export class MeasureService {

  constructor(private backendService:BackendService) { }

  getMeasure(id : number){
    return this.backendService.get('measure/'+ id);
  }
  registerMeasure( data: any){
    return this.backendService.post('measure', data);
  }
  updateMeasure(id :number , data: any){
    return this.backendService.put('measure/'+ id, data);
  }

}

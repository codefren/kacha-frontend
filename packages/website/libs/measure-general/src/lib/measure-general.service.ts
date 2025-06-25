import { Injectable } from '@angular/core';
import { BackendService } from '@optimroute/backend';

@Injectable({
  providedIn: 'root'
})
export class MeasureGeneralService {

  constructor(private backendService:BackendService) { }

  getMeasure(id : number){
    return this.backendService.get('measure/'+ id);
  }
  registerMeasureGeneral( data: any){
    return this.backendService.post('measure_store_without_company', data);
  }
  updateMeasureGeneral(id :number , data: any){
    return this.backendService.put('measure_update_without_company/'+ id, data);
  }
  
}

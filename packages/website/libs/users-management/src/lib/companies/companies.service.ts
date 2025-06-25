import { Injectable } from '@angular/core';
import { BackendService } from '@optimroute/backend';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(private backendService:BackendService) { }

}

import { StateCompaniesService } from './../../../../../../state-companies/src/lib/state-companies.service';
import { LoadingService } from './../../../../../../shared/src/lib/services/loading.service';
import { ToastService } from './../../../../../../shared/src/lib/services/toast.service';
import { StateEasyrouteService } from './../../../../../../state-easyroute/src/lib/state-easyroute.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Company } from 'libs/backend/src/lib/types/companies.type';


@Component({
  selector: 'easyroute-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {

  change ={
    companies:'companies',
    rates:'rates',
    incidents:'incidents'
  };

   default ='companies';
   company: Company;
   companies: Company;

 
  constructor(
    private toastService: ToastService,
    private _activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private companiesService: StateCompaniesService,
    private stateEasyrouteService: StateEasyrouteService,
  ) { }

  ngOnInit() {
   
    this.load();
  
    
  }

  load() {
    console.log(this.companies, '');
    this._activatedRoute.params.subscribe((params) => {
        if (params['companie_id'] !== 'new') {
          this.loadingService.showLoading();
          
          this.companiesService.getCompanyPartner(params['companie_id']).subscribe(
            (resp: any) => {
               
               this.company = resp.data;
               this.companies= resp.data;
                this.loadingService.hideLoading();
            },
            (error: any) => {
                this.loadingService.hideLoading();
                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
          
        } else {

          
          this.company = new Company();
          
          this.loadingService.hideLoading();
          // this.novelty = new Novelty();

          // this.validaciones(this.novelty);
        }
    });

  }

  changePage(name: string){
     
    this.default = this.change[name];
  }

  getData(data: any){
    
    this.company = data;

  }

}

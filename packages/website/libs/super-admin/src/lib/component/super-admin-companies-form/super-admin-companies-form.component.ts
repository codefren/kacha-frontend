import { Component, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { StateCompaniesService } from '../../../../../state-companies/src/lib/state-companies.service';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { Company } from '../../../../../backend/src/lib/types/companies.type';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';

@Component({
  selector: 'easyroute-super-admin-companies-form',
  templateUrl: './super-admin-companies-form.component.html',
  styleUrls: ['./super-admin-companies-form.component.scss']
})
export class SuperAdminCompaniesFormComponent implements OnInit {

  change ={
    companies:'companies',
    rates:'rates',
    incidents:'incidents'
  };

   default ='companies'
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
    this._activatedRoute.params.subscribe((params) => {
        if (params['companie_id'] !== 'new') {
          this.loadingService.showLoading();
          
          this.companiesService.getCompany(params['companie_id']).subscribe(
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
          console.log('aqui', this.company);

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

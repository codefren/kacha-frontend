import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
declare var $;
@Component({
  selector: 'easyroute-modal-change-company',
  templateUrl: './modal-change-company.component.html',
  styleUrls: ['./modal-change-company.component.scss']
})
export class ModalChangeCompanyComponent implements OnInit {

  companiesFilter : any;
  profile: any;
  companies: any;
  companySelect: any;

  constructor(
    public authLocal: AuthLocalService,
    public activeModal: NgbActiveModal
    ) { }

  ngOnInit() {
    console.log(this.companiesFilter,'company filter')
    console.log(this.profile, 'profile');
  }

 
  filterCompany(filter){
    if (filter && filter.trim() !== '' && filter.length > 2) {
        this.companiesFilter = this.companies.filter((item) => {
  
          return (item.name.toLowerCase().indexOf(filter.toLowerCase()) > -1  );
        });
      } else {
        this.companiesFilter = this.companies;
      }
}
changeCompany(value) {

  this.authLocal.changeCompany(value);
  
  this.activeModal.close();
}


  closeModal(){
    this.activeModal.close();
  }

  YesVerified(){
    this.activeModal.close(true);
  }
  changeCompanys(e: any, i:any ,company: any){

  console.log(e,'evento')
   
  if (e) {
    this.companySelect = company.id;

    this.companiesFilter.forEach((element, e) => {
    
    if (i !=e) {
      $('#companyChange' + e).prop('checked', false );
    }
  
    });
  } else {
    this.companySelect =null;
  }

   
  
  }
}

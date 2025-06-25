import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-asign-products-franchise',
  templateUrl: './asign-products-franchise.component.html',
  styleUrls: ['./asign-products-franchise.component.scss']
})
export class AsignProductsFranchiseComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, 
    private backend: BackendService, 
    private toast: ToastService,
    private translate: TranslateService,
    private loading: LoadingService) { }
  franchises: any[] = []
  franchisesSelected: any[] = [];

  @Input()
  subTitle: string;

  @Input()
  title: string;
  
  @Input()
  message: string;

  ngOnInit() {

    console.log( this.subTitle, this.title );

    this.backend.get('miwigo_franchise/all').pipe(take(1)).subscribe((franchises)=>{
      this.franchises = franchises;
    });
  }

  async submit(){
    await this.loading.showLoading();
    this.backend.post('miwigo_franchise/send_products', {
      companies: this.franchisesSelected
    }).pipe(take(1)).subscribe(()=>{
        this.loading.hideLoading();
        this.toast.displayWebsiteRelatedToast(this.message);
        this.activeModal.close();
    })
  }

  changeAll(value){
    if(value){
      this.franchisesSelected = this.franchises.map((franchise)=>{
        return franchise.id
      })
    }else {
      this.franchisesSelected = [];
    }
  }

  isChecked(value){
    return this.franchisesSelected.find(x => x === value) ? true : false
  }

  selectedFranchise(value, id){
    if(value){
      this.franchisesSelected.push(id);
    } else {
      const index = this.franchisesSelected.findIndex(x => x === id);
      this.franchisesSelected.splice(index, 1);
    }
  }
}

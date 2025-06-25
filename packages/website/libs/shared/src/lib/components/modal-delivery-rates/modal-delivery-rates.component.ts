import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Delivery } from '@optimroute/backend';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from '../../services/loading.service';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { DeliveryRateMessages } from '../../messages/delivery-rate/delivery-rate.message';

@Component({
  selector: 'easyroute-modal-delivery-rates',
  templateUrl: './modal-delivery-rates.component.html',
  styleUrls: ['./modal-delivery-rates.component.scss']
})
export class ModalDeliveryRatesComponent implements OnInit {

  filterForm: FormGroup;

  delivery: Delivery;

  delivery_messages: any;

  constructor(private fb: FormBuilder,
    private loading: LoadingService,
    private stateEasyrouteService: StateEasyrouteService,
    private translate: TranslateService,
    private toastService: ToastService,
    public activeModal: NgbActiveModal) { }

    ngOnInit() {
      this.load();
    }
  
    load(){
     
      this.validaciones(this.delivery);
  
    }
  
    validaciones( delivery : Delivery ) {
  
      this.filterForm = this.fb.group({
        name:[delivery.name, [Validators.maxLength(30), Validators.required]],
        order:[delivery.order,[Validators.required]],
        price:[delivery.price,[Validators.required]],
        minTime:[delivery.minTime,[Validators.required]],
        maxTime:[delivery.maxTime,[Validators.required]],
        isActive:[delivery.isActive,[Validators.required]],
  
      });
  
      let delivery_messages = new DeliveryRateMessages();
      this.delivery_messages = delivery_messages.getDeliveryRateMessages();
  
    }
  
    createFilter(){
      
      if (this.isFormInvalid()) {
        this.toastService.displayWebsiteRelatedToast('The zone is not valid'),
            this.translate.instant('GENERAL.ACCEPT');
      } else {
        
          this.loading.showLoading();
  
          this.stateEasyrouteService.updateDeliveryRates(this.filterForm.value).subscribe( (data: any) => {
            
            this.loading.hideLoading();
  
            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
              this.translate.instant('GENERAL.ACCEPT')
            );
  
              this.closeDialog([true, { ok: true }]);
           // this._router.navigate(['category-filter']);
  
          }, ( error )=>{
             
            this.loading.hideLoading();
            this.toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
            return;
  
          });
  
        
      }
  
    }
  
    isFormInvalid(): boolean {
      return !this.filterForm.valid;
    }
  
    closeDialog(value: any) {
      this.activeModal.close(value);
  }

}

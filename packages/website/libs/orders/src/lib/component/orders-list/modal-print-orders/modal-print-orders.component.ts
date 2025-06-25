import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StateEasyrouteService } from '../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'easyroute-modal-print-orders',
  templateUrl: './modal-print-orders.component.html',
  styleUrls: ['./modal-print-orders.component.scss']
})
export class ModalPrintOrdersComponent implements OnInit {

  message:any;
  fromApp: boolean;
  selected: boolean =false;

  resource= '';

  constructor(public activeModal: NgbActiveModal,
              private translate: TranslateService,
              private _toastService: ToastService,
              private stateEasyrouteService:StateEasyrouteService) { }

  ngOnInit() {
  }
  closeDialog() {
    this.activeModal.close();
  }


  onChangeShowActive(value: any) {

    switch (value) {
        case 'web':
            this.fromApp = false;
            this.resource = 'print_orders?fromApp=' + this.fromApp;
            this.selected= true;
            break;

        case 'app':
            this.fromApp = true;
            this.resource = 'print_orders?fromApp=' + this.fromApp;
            this.selected= true;
            break;
    
        default:
          this.resource = 'print_orders';
          this.selected= true;
            break;
    }
   
}
getPdfOrder(resounce: any) {
  this.stateEasyrouteService.getPdfOrderPrint(resounce).then( (resp: any) => {
      this.activeModal.close();

  }).catch( (error) => {
    this._toastService.displayWebsiteRelatedToast(
      this.translate.instant('ORDERS.NO_RECORD_FOUND'),
      this.translate.instant('GENERAL.ACCEPT'),
  );
  });
  

}

}

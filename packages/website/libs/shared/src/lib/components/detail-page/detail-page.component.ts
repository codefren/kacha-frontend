import { Component, OnInit, Input } from '@angular/core';
import { Orders } from '@optimroute/backend';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';
import { sliceMediaString } from '../../util-functions/string-format';



@Component({
  selector: 'easyroute-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {

  @Input()
  orders: any;

  orderDetailForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private _modalService: NgbModal,
      private translate: TranslateService
    ) { }

  ngOnInit() {
    
    // console.log( this.orders );
    this.setForm( this.orders );
    console.log(this.orders,'orders-deatails-shared');
  }

  setForm( order: Orders ) {

    this.orderDetailForm = this.fb.group({
      importOrder: new FormControl({ 
          value: order.ticketTotal > 0 ? order.ticketTotal.toFixed(2) + '€' : order.total.toFixed(2) + '€',  
          disabled: true  
      }),
      payState: new FormControl({ 
          value:  order.order_payment_status && order.order_payment_status.name ? 
              order.order_payment_status.name : '',  
          disabled: true 
      }),
      payMethod: new FormControl({ 
          value: order.last_order_payment && order.last_order_payment.order_payment_type ? 
              order.last_order_payment.order_payment_type.name : '',
          disabled: true 
      }),
      typeDelivery: new FormControl({ 
          value: order.company_preference_delivery ? order.company_preference_delivery.name : '',
          disabled: true 
      }),
      priceDelivery: new FormControl({ 
          value: order.company_preference_delivery ? order.company_preference_delivery.price + '€'  : '',
          disabled: true 
      }),
      prepaid: new FormControl({
          value: order.prepaidAmount.toFixed(2) + '€' || (0).toFixed(2) + '€',
          disabled: true
      }),
      userAddress: new FormControl({
        value: order.user_address ?  order.user_address.address : '',
        disabled: true
      }),
      province: new FormControl({
        value: order.user_address ? order.user_address.province : '',
        disabled: true
      }),
      postalCode: new FormControl({
        value: order.user_address ? order.user_address.postalCode: '',
        disabled: true
      }),
      buildingName: new FormControl({
        value: order.user_address ? order.user_address.buildingName : '',
        disabled: true
      }),
      buildingFloor: new FormControl({
        value: order.user_address ? order.user_address.buildingFloor : '',
        disabled: true
      }),
      doorName: new FormControl({
        value: order.user_address ? order.user_address.doorName : '',
        disabled: true
      }),
      phone: new FormControl({
        value: order.user_address ? order.user_address.phone : '',
        disabled: true 
      }),
      quantityBuyWithoutMinimun: new FormControl({
        value: order.quantityBuyWithoutMinimun ? order.quantityBuyWithoutMinimun.toFixed(2) + '€' : 
          (0).toFixed(2) + '€',
        disabled: true 
      }),
      extra: new FormControl({
        value: this.translate.instant('ORDERS.ORDERS_DETAIL.ORDER_NO_EXEDED'),
        disabled: true
      }) 
    });
  }

  calculateTotal(): Array<string> {
    
    let total = this.orders.ticketTotal ? this.orders.ticketTotal : this.orders.total ;


    total += this.orders.current_zone_id && this.orders.current_zone_id > 0
      && this.orders.zone_delivery != null ? +this.orders.zone_delivery.price :
      this.orders.company_preference_delivery != null ? +this.orders.company_preference_delivery.price : 0;

    const reload = this.orders.quantityBuyWithoutMinimun > 0 ? this.orders.quantityBuyWithoutMinimun : 0;

    total += reload;

    /* if (total > 0) {
      return Math.round(total * 100) / 100;

    } else {

      return 0;
      
    } */
    
    // console.log({ result, quatity: this.orders.quantityBuyWithoutMinimun });
    
    return total.toFixed(2).split('.');
  }

  modalTicket(data: any) {

    const modal = this._modalService.open(TicketModalComponent, {
        size: 'sm',
        backdrop: 'static',
        backdropClass: 'customBackdrop',
        windowClass: 'modal-Ticket-detalis',
        centered: true,
    });
    
    modal.componentInstance.data = data;
}
sliceString( text: string ) {
  return sliceMediaString( text, 45, '(min-width: 960px)' );
}
}

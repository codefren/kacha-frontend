import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-products-modal-product-price-confirm',
  templateUrl: './products-modal-product-price-confirm.component.html',
  styleUrls: ['./products-modal-product-price-confirm.component.scss']
})
export class ProductsModalProductPriceConfirmComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}

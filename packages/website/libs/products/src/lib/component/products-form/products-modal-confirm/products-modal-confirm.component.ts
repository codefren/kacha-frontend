import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-products-modal-confirm',
  templateUrl: './products-modal-confirm.component.html',
  styleUrls: ['./products-modal-confirm.component.scss']
})
export class ProductsModalConfirmComponent implements OnInit {

  title: string;
  message: string;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}

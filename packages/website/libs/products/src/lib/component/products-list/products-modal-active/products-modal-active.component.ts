import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-products-modal-active',
  templateUrl: './products-modal-active.component.html',
  styleUrls: ['./products-modal-active.component.scss']
})
export class ProductsModalActiveComponent implements OnInit {
  @Input() data: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}

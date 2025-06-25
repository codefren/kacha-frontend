import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-category-activate',
  templateUrl: './modal-category-activate.component.html',
  styleUrls: ['./modal-category-activate.component.scss']
})
export class ModalCategoryActivateComponent implements OnInit {

  @Input() data: any;
  SubCategory: any

  constructor( public activeModal: NgbActiveModal) { }

  ngOnInit() {}

}

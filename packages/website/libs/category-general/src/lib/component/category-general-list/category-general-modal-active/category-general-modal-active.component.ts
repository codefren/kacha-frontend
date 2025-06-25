import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-category-general-modal-active',
  templateUrl: './category-general-modal-active.component.html',
  styleUrls: ['./category-general-modal-active.component.scss']
})
export class CategoryGeneralModalActiveComponent implements OnInit {

  @Input() data: any;
  SubCategory: any

  constructor( public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}

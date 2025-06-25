import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-category-list-modal-active',
  templateUrl: './category-list-modal-active.component.html',
  styleUrls: ['./category-list-modal-active.component.scss']
})
export class CategoryListModalActiveComponent implements OnInit {
  @Input() data: any;
  SubCategory: any

  constructor( public activeModal: NgbActiveModal) { }

  ngOnInit() {}


}

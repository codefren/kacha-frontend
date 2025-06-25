import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-filters-start',
  templateUrl: './modal-filters-start.component.html',
  styleUrls: ['./modal-filters-start.component.scss']
})
export class ModalFiltersStartComponent implements OnInit {

  @ViewChild('showActive', { static: false }) showActive: ElementRef<HTMLElement>;
 
  filter: any = {
    showActive: ''
  };

  constructor(

    public activeModal: NgbActiveModal,
   
  ) { }

  ngOnInit() {
    this.filter;
  }

  closeDialog() {

    this.activeModal.close(this.filter);
  }

  clearSearch() {

    this.filter.showActive = true;
  
    this.closeDialog();
  }

  ChangeFilter(value: any) {

    this.filter.showActive = value;

    this.closeDialog();

  }

}

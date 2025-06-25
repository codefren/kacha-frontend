import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-check-cost',
  templateUrl: './modal-check-cost.component.html',
  styleUrls: ['./modal-check-cost.component.scss']
})
export class ModalCheckCostComponent implements OnInit {

  title: any = '';

  Subtitle: any = '';
  
  message: any = '';

  accept: string = '';

  cssStyle: string = 'btn btn-primary mr-2'

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  close(){
    this.activeModal.close(false);

  }

  donwloadFilter(){
    this.activeModal.close(true);
  }

}

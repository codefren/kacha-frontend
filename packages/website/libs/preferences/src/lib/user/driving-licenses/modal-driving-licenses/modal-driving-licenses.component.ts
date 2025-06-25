import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-driving-licenses',
  templateUrl: './modal-driving-licenses.component.html',
  styleUrls: ['./modal-driving-licenses.component.scss']
})
export class ModalDrivingLicensesComponent implements OnInit {

  data: any;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  
  }

  close(){
    this.activeModal.close(false);
  }

}

import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-finish-assignate',
  templateUrl: './finish-assignate.component.html',
  styleUrls: ['./finish-assignate.component.scss']
})
export class FinishAssignateComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {

  }

  close(){
    this.activeModal.close();
  }

}

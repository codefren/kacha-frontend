import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-confirm-create-franchise',
  templateUrl: './confirm-create-franchise.component.html',
  styleUrls: ['./confirm-create-franchise.component.scss']
})  
export class ConfirmCreateFranchiseComponent implements OnInit {

  @Input() data: any;

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

}

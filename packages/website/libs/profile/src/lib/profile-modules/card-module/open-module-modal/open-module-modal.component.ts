import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-open-module-modal',
  templateUrl: './open-module-modal.component.html',
  styleUrls: ['./open-module-modal.component.scss']
})
export class OpenModuleModalComponent implements OnInit {
  
  @Input() data: any;
  @Input() company: any;

  
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {

  }

}

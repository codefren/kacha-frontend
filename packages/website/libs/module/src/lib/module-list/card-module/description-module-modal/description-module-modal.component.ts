import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-description-module-modal',
  templateUrl: './description-module-modal.component.html',
  styleUrls: ['./description-module-modal.component.scss']
})
export class DescriptionModuleModalComponent implements OnInit {

  @Input() data: any;
  @Input() company: any;

  
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {

  }

}

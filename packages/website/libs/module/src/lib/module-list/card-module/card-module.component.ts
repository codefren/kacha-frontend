import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DescriptionModuleModalComponent } from './description-module-modal/description-module-modal.component';

@Component({
  selector: 'easyroute-card-module',
  templateUrl: './card-module.component.html',
  styleUrls: ['./card-module.component.scss']
})
export class CardModuleComponent implements OnInit {

  readMore: boolean = false;
  countCaracter: boolean = false;
  @Input('cardModule')  module: any;
  @Input('company') company: any;
  @Output() openModal: EventEmitter<any> = new EventEmitter();

  constructor(
    private _modalService: NgbModal
  ) { }

  ngOnInit() {
    if(this.module.description.length > 150){
      this.countCaracter = true;
    }
  }

  openModalModules( module: any ) {
    return this.openModal.emit( module );
  }

}

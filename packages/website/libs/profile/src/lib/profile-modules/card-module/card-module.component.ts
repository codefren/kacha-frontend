import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { OpenModuleModalComponent } from './open-module-modal/open-module-modal.component';

@Component({
  selector: 'easyroute-card-module',
  templateUrl: './card-module.component.html',
  styleUrls: ['./card-module.component.scss']
})
export class CardModuleComponent implements OnInit {

  readMore: boolean = false;

  countCaracter: boolean = false;

  @Input('cardModule') 
  module: any;

  @Input('company')
  company: any;

  @Output() 
  openModal: EventEmitter<any> = new EventEmitter();

  constructor(
    private _modalService: NgbModal,
  ) {} 

  ngOnInit() {

    if(this.module.description.length > 214){
      this.countCaracter = true;
    }
  }

  openModalModules( module: any ) {
    return this.openModal.emit( module );
  }

  openModuleModalModules( datos: any) {

    const modal = this._modalService.open(OpenModuleModalComponent, {
        backdrop: 'static',
        backdropClass: 'customBackdrop',
        centered: true,
        size: 'md'
    });
  
    modal.componentInstance.data = datos;
    modal.componentInstance.company = this.company;

    modal.result.then(
      (result) => {
        if(result){
         this.openModalModules(datos)
        }
      },
      (reason) => {
         
      },
  );


  
  }
}

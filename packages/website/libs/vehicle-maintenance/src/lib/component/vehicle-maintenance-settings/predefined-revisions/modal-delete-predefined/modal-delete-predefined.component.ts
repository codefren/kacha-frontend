import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-delete-predefined',
  templateUrl: './modal-delete-predefined.component.html',
  styleUrls: ['./modal-delete-predefined.component.scss']
})
export class ModalDeletePredefinedComponent implements OnInit {

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

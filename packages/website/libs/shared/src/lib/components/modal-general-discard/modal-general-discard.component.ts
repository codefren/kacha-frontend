import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-general-discard',
  templateUrl: './modal-general-discard.component.html',
  styleUrls: ['./modal-general-discard.component.scss']
})
export class ModalGeneralDiscardComponent implements OnInit {

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

import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-general-download',
  templateUrl: './modal-general-download.component.html',
  styleUrls: ['./modal-general-download.component.scss']
})
export class ModalGeneralDownloadComponent implements OnInit {

  selectDownload : any = 'pdf';
  title: any = '';
  message: any = '';
  etiqueta: any = '';
  pdf = true;


  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  close() {

    this.activeModal.close(false);

  }

  submit(){
    this.activeModal.close(this.selectDownload);
  }


}

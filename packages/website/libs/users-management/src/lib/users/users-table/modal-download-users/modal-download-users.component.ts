import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-download-users',
  templateUrl: './modal-download-users.component.html',
  styleUrls: ['./modal-download-users.component.scss']
})
export class ModalDownloadUsersComponent implements OnInit {

  selectDownload : any = 'pdf';

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

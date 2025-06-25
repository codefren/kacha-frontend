import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-novelty',
  templateUrl: './modal-novelty.component.html',
  styleUrls: ['./modal-novelty.component.scss']
})
export class ModalNoveltyComponent implements OnInit {

  title: any = '';
  
  message: any = '';

  accept: string = '';

  cssStyle: string = 'btn btn-primary mr-2';

  videoLoaded: any;

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  cloModalBtn(){
    this.activeModal.close(null);
  }

  close(){
    this.activeModal.close(false);

  }

  donwloadFilter(){
    this.activeModal.close(true);
  }

}

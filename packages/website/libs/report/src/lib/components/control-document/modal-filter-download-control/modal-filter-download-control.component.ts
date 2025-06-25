import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-filter-download-control',
  templateUrl: './modal-filter-download-control.component.html',
  styleUrls: ['./modal-filter-download-control.component.scss']
})
export class ModalFilterDownloadControlComponent implements OnInit {

  filterSelect : any ='';

  filter ={
    sumary:'',
    comparative:'',
    delay: '',
    outRange: '',
    refueling:'',
    unvisitedClient:'',
    offRoutevisits:'',
  }


  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }
  changeSelecter(value: any){
  
    this.filterSelect = value;

  }

  close(){
    this.activeModal.close(false);

  }

  donwloadFilter(){
    this.activeModal.close(this.filter);
  }

}

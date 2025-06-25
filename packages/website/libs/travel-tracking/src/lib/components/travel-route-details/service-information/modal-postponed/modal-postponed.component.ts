import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '@optimroute/backend';
import * as moment from 'moment-timezone';


@Component({
  selector: 'easyroute-modal-postponed',
  templateUrl: './modal-postponed.component.html',
  styleUrls: ['./modal-postponed.component.scss']
})
export class ModalPostponedComponent implements OnInit {

  data: any;
  
  ExpenseTypeForm: FormGroup;

  actions: any;

  providerList: any;

  concepList: any;

  showProvidersType: boolean = true;

  showProviders: boolean = true;

  showConcept: boolean = true;

  providersType: any;

  imageLoaded:any;

  img: any;

  constructor( 
    private backend: BackendService,
    private sanitizer: DomSanitizer,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    if (this.data && this.data.urlFile ) {
      return this.backend.getIMG('route_planning_route_delivery_movement/postponed/' + this.data.urlFile).then((data: string)=>{

    
        this.img = data;
  
        this.imageLoaded = this.sanitizer.bypassSecurityTrustUrl(data);
  
        
      })
    }
  }
  
 
  dateFormat(date:any){
    if (date) {
        return moment(date).format('HH:mm');
        
    } else {
         return '----'
    }
  }

  close(){
    this.activeModal.close(false);

  }

  deleteForm(){
    console.log('para eliminar')
  }

}

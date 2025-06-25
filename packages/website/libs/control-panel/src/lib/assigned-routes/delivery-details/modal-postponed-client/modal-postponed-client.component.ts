import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'easyroute-modal-postponed-client',
  templateUrl: './modal-postponed-client.component.html',
  styleUrls: ['./modal-postponed-client.component.scss']
})
export class ModalPostponedClientComponent implements OnInit {

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

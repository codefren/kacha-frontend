import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { dateToObject, getToday, LoadingService, objectToString, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var init_plugins;
declare var $;

@Component({
  selector: 'easyroute-visits-planning',
  templateUrl: './visits-planning.component.html',
  styleUrls: ['./visits-planning.component.scss']
})
export class VisitsPlanningComponent implements OnInit {

  date: NgbDateStruct = dateToObject(getToday());
  commercials: any = [];
  commercialsSelected: any = [];
  constructor(private loading: LoadingService,
    private backend: BackendService,
    private toast: ToastService,
    private changeDetector: ChangeDetectorRef,
    public activeModal: NgbActiveModal
    ) { }

  ngOnInit() {
    this.load();
  }

  load(){
    this.loadCommercials();
    
  }

  close(value){
    this.activeModal.close(value);
  }
  async submit(){
    if(!this.haveCommercial()){
      return;
    }
    await this.loading.showLoading();
    this.commercialsSelected = $('#commercials').multiselect().val();
    this.backend.post('delivery_point/commercial/visit', {
      users: this.commercialsSelected,
      date: objectToString( this.date) 
    }).pipe(take(1)).subscribe((data)=>{
      this.loading.hideLoading();
      this.close(data);
    }, error => {
      this.loading.hideLoading();
      this.toast.displayHTTPErrorToast(error.status, error.error.error);
    });
  }


  async loadCommercials(){
    await this.loading.showLoading();
    this.backend.get('users_salesman').pipe(take(1)).subscribe(({data})=>{
      this.commercials = data;
      this.changeDetector.detectChanges();
      this.loading.hideLoading();
      init_plugins();
    }, error =>{
      this.toast.displayHTTPErrorToast(error.status, error.error.error);
      this.loading.hideLoading();
    })
  }

  haveCommercial(){
    this.commercialsSelected = $('#commercials').multiselect().val();

    return this.commercialsSelected && this.commercialsSelected.length > 0 ? true : false;
  }

  changeZones(element: any){
    this.commercials = element.multiselect().val();
    
  }

} 

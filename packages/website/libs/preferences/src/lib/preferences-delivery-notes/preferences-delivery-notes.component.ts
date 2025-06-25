import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService, secondsToDayTimeAsString } from '@optimroute/shared';
import { DeliveryModalConfirmationComponent } from 'libs/shared/src/lib/components/delivery-modal-confirmation/delivery-modal-confirmation.component';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { dayTimeAsStringToSeconds } from '../../../../shared/src/lib/util-functions/day-time-to-seconds';

@Component({
  selector: 'easyroute-preferences-delivery-notes',
  templateUrl: './preferences-delivery-notes.component.html',
  styleUrls: ['./preferences-delivery-notes.component.scss']
})
export class PreferencesDeliveryNotesComponent implements OnInit {

  companyPreferenceALbaran: any ={
    activateSendDeliveryNotes: '',
    timeSendDeliveryNotes: 0,
    activateSendDeliveryNotesEvery: '',
    timeSendDeliveryNotesEvery:0,
    activateAutomaticDeliveryNotesAssignedRoute:'',
    shareCompanyInformation: ''
  };

  deliveryNotesLines = [];

  show: boolean = true;

  @Input('showSharedInformation') showSharedInformation: boolean = false;

  constructor(private backend: BackendService,
    private toast: ToastService,
    private loading: LoadingService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.load();
    this.getDeliveryAutomatically();
  }

  getDeliveryAutomatically(){

    this.loading.showLoading();

    this.show= false;

    this.backend.get('company_preference_delivery_note').pipe(take(1)).subscribe(({data})=>{

      this.loading.hideLoading();

      this.companyPreferenceALbaran = data;

      this.show= true;

      
      this.changeDetectorRef.detectChanges();

    }, error => {
      this.loading.hideLoading();

      this.show= true;

      this.toast.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  async load(){
    await this.loading.showLoading();
    this.backend.get('preference_delivery_note_line').pipe(take(1)).subscribe(({data})=>{
      this.loading.hideLoading();
      this.deliveryNotesLines = data;
      this.changeDetectorRef.detectChanges();
    }, error => {
      this.loading.hideLoading();
      this.toast.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  async addLine(){
    let line = {
      color: '#000000',
      description: '',
      order: this.deliveryNotesLines.length + 1,
      highlight: false
    }
    await this.loading.showLoading();
    this.backend.post('preference_delivery_note_line', line).pipe(take(1)).subscribe((data)=>{
      this.loading.hideLoading();
      this.load();
    }, error =>{
      this.toast.displayHTTPErrorToast(error.status, error.error.error)
    })
  }


  handleChange( field: string, value: string, line: any) {
    
    if ( field === 'order' ) {

  
     line.order = value;
    
    } else if ( field === 'description' ) {
      
      line.description = value;
     
    } else if ( field === 'color' ) {
      
      line.color = value;
      
    }

    this.updateLine(line);
  }

  updateLine(line: any){
    this.backend.put('preference_delivery_note_line/' + line.id, line).pipe(take(1)).subscribe((data)=>{
      this.loading.hideLoading();
      this.load();
    }, error =>{
      this.toast.displayHTTPErrorToast(error.status, error.error.error)
    })
  }

  highlightActive(value, line){
    line.highlight = value;
    this.updateLine(line);
  }


  deleteLine( line ) {
    
    const modal = this.modalService.open( DeliveryModalConfirmationComponent, { 
      centered: true,
      backdrop: 'static'
    });
    modal.componentInstance.title = "Eliminar";
    modal.componentInstance.message = "¿Está seguro de eliminar?";
    

    modal.result.then(async ( result : boolean ) => {
      
      if ( result ) {

        await this.loading.showLoading();
        this.backend.delete('preference_delivery_note_line/' + line.id).pipe(take(1)).subscribe(()=>{
          this.loading.hideLoading();
          this.load();
        }, error => {
          this.toast.displayHTTPErrorToast(error.status, error.error.error);
          this.loading.hideLoading();
        })
      }

      
    });
  }


  showNUmber(number: number){
    
    return Math.floor(number / 60);

}
   showTime(number: number){
    
    return secondsToDayTimeAsString(number);

}

   addOthers(value, data: any, name:string){
        
    switch (name) {

        case "timeSendDeliveryNotes":

            data.timeSendDeliveryNotes = dayTimeAsStringToSeconds(
              value,
          );

            break;

        case "timeSendDeliveryNotesEvery":

            data.timeSendDeliveryNotesEvery = Number(value * 60)

            break;

        default:
            break;
    }

    
    this.updateTime(data);

  }

  //update time

  updateTime(data: any){

    console.log(data, 'updateTime')

    this.backend.post('company_preference_delivery_note', data).pipe(take(1)).subscribe(({data})=>{
      // this.loading.hideLoading();
      this.companyPreferenceALbaran = data;
      
       this.toast.displayWebsiteRelatedToast(
        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
        this.translate.instant('GENERAL.ACCEPT'),
    );
       this.changeDetectorRef.detectChanges();
     }, (error) => {

      this.loading.hideLoading();
      
      this.toast.displayHTTPErrorToast( error.status, error.error.error );
     });
  }

  /* funcion change toogle and ckeckbox radio */

  changeCompanyPreferencealabaran(name :string, event){
  
    this.companyPreferenceALbaran[name] = event;

    let data ={

      activateSendDeliveryNotes: this.companyPreferenceALbaran.activateSendDeliveryNotes ? this.companyPreferenceALbaran.activateSendDeliveryNotes: false,

      timeSendDeliveryNotes: this.companyPreferenceALbaran.timeSendDeliveryNotes ? this.companyPreferenceALbaran.timeSendDeliveryNotes: 0,

      activateSendDeliveryNotesEvery: this.companyPreferenceALbaran.activateSendDeliveryNotesEvery ?this.companyPreferenceALbaran.activateSendDeliveryNotesEvery :false,

      timeSendDeliveryNotesEvery: this.companyPreferenceALbaran.timeSendDeliveryNotesEvery ? this.companyPreferenceALbaran.timeSendDeliveryNotesEvery: 0,

      activateAutomaticDeliveryNotesAssignedRoute: this.companyPreferenceALbaran.activateAutomaticDeliveryNotesAssignedRoute ? this.companyPreferenceALbaran.activateAutomaticDeliveryNotesAssignedRoute: false,

      shareCompanyInformation: this.companyPreferenceALbaran.shareCompanyInformation ? this.companyPreferenceALbaran.shareCompanyInformation : false

    }

    console.log(data, 'data')
    
    this.backend.post('company_preference_delivery_note', data).pipe(take(1)).subscribe(({data})=>{
      
      console.log(data, 'data changeCompanyPreferencealabaran')

      this.companyPreferenceALbaran = data;

       this.toast.displayWebsiteRelatedToast(
        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
        this.translate.instant('GENERAL.ACCEPT'),
    );
       this.changeDetectorRef.detectChanges();
     }, (error) => {
      this.loading.hideLoading();

      this.toast.displayHTTPErrorToast( error.status, error.error.error );
     });
    
   }

}

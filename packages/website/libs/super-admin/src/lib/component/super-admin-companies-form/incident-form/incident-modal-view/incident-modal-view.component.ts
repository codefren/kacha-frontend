import { secondsToDayTimeAsString } from '@optimroute/shared';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Incident } from '../../../../../../../backend/src/lib/types/incident.type';
import { LoadingService } from '../../../../../../../shared/src/lib/services/loading.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { StateEasyrouteService } from '../../../../../../../state-easyroute/src/lib/state-easyroute.service';
declare var $: any;
declare function init_plugins();
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { IncidentMessages } from '../../../../../../../shared/src/lib/messages/incident/incident.message';
import { dayTimeAsStringToSeconds } from '../../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { IncidentModalConfirmComponent } from '../incident-modal-confirm/incident-modal-confirm.component';
import { ProductsImage } from '../../../../../../../backend/src/lib/types/product-image.type';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'easyroute-incident-modal-view',
  templateUrl: './incident-modal-view.component.html',
  styleUrls: ['./incident-modal-view.component.scss']
})
export class IncidentModalViewComponent implements OnInit {

  incidentForm:FormGroup;

  incidentMessages: any;

  incident: Incident;

  showCode: boolean = true;

  companyId: number;

  IncientView:Incident;

  date: string;

  time: any;

  requestFrom: any [];

  loadingCategory: string = 'success';

  productImages: any = [];

  overFlowImg: boolean = true;

  imageError: string = '';

  showEdit: boolean = true;
  
  
  constructor(
    private fb: FormBuilder,
    private loading: LoadingService,
    private _modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _toastService: ToastService,
    private _translate: TranslateService,
    private changeDetect: ChangeDetectorRef,
    private stateEasyrouteService: StateEasyrouteService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      init_plugins();
  }, 1000);
 this.load();

 
}


load(){

  this.productImages = this.IncientView.images;
  
  this.validaciones(this.IncientView);

}

validaciones(incidents: Incident) {
  
  this.date =  moment(new Date().toISOString()).tz('Europe/Madrid').format('DD/MM/YYYY');
      
  this.time = moment().tz('Europe/Madrid').format('HH:mm');

  this.showEdit = this.IncientView.solved ;

  this.incidentForm = this.fb.group({
      companyId: [ incidents.companyId ],
      code: [ incidents.code,[Validators.max(30)] ],
      date: [ {value: this.date, disabled: true}, [Validators.required] ],
      time: [ {value: incidents.time ? secondsToDayTimeAsString(incidents.time) : secondsToDayTimeAsString(0), disabled: true}, [Validators.required] ],
      clientName: [ incidents.clientName, [Validators.required, Validators.minLength(2),Validators.maxLength(100)] ],
      contactTypeId: [ incidents.contactTypeId ? incidents.contactTypeId: '', [Validators.required] ],
      title: [ incidents.title,[Validators.required, Validators.minLength(2),Validators.maxLength(100)]],
      description: [ incidents.description, [Validators.required, Validators.minLength(2),Validators.maxLength(1000)] ],
      outScheduleTime: [ {value: incidents.outScheduleTime , disabled: true} ],
      duration: [ { value : incidents.duration ? secondsToDayTimeAsString(incidents.duration)
        : secondsToDayTimeAsString(0),  disabled:this.showEdit} ],
      solved: [ {value: incidents.solved, disabled:this.showEdit} ],
      incidentSolution:[incidents.incidentSolution],
      images:[]
    
  });
  
  let incidentMessages = new IncidentMessages();

  this.incidentMessages = incidentMessages.getIncidentMessages();

  this.getRequestFrom();

  this.changeSolved(incidents.solved);
}

public dateIncident(date:any) {
  return moment(date).format('DD/MM/YYYY');
}

getTime(time: number){
 return secondsToDayTimeAsString(time);
}

contactTypeId(){

  let contactType = this.requestFrom.find( x => x.id ===this.IncientView.contactTypeId);
   return contactType.name ;
}


searchIncidentCode(){
  
  this.showCode = false;

  $("#tooltip").tooltip('hide');


  setTimeout(() => {
      this.stateEasyrouteService
      .getIncidentAutocompleteCode(this.companyId)
      .subscribe(
          (data: any) => {
             this.incidentForm
             .get('code')
             .setValue(data.code);
             this.incidentForm.get('code').updateValueAndValidity();

             this.showCode = true;

             this.changeDetect.detectChanges();

             this.setTimeoutFuntion();
          },
          (error) => {
              this.showCode = true;
              this._toastService.displayHTTPErrorToast(
                  error.status,
                  error.error.error,
              );
          },
      );
  }, 500);

}

setTimeoutFuntion() {
  setTimeout(() => {
      init_plugins();
  }, 500);
}

getRequestFrom() {

  this.loadingCategory = 'loading';

  setTimeout(() => {
    this.stateEasyrouteService.getRequestFrom().subscribe(
      (data: any) => {
        this.requestFrom = data.data;
        this.loadingCategory = 'success';
        this.changeDetect.detectChanges();
        this.loading.hideLoading();
    
      },
      (error) => {
        this.loadingCategory = 'error';
        this.loading.hideLoading();

        this._toastService.displayHTTPErrorToast(
          error.status,
          error.error.error,
        );
      },
    );
  }, 1000);
}


createIncident(){

  const formValues = this.incidentForm.value;


  formValues.time = dayTimeAsStringToSeconds(
    this.incidentForm.get('time').value,
  );
  formValues.duration = dayTimeAsStringToSeconds(
    this.incidentForm.get('duration').value,
  );
  formValues.date =  moment(new Date().toISOString()).tz('Europe/Madrid').format('YYYY-MM-DD');

  if (
    this.incidentForm.invalid
) {
    this._toastService.displayHTTPErrorToast('Aviso;', 'El usuario no es valido');
} else {
     
        this.stateEasyrouteService.updateIncident(this.IncientView.id, formValues ).subscribe(
            (data: any) => {
                this._toastService.displayWebsiteRelatedToast(
                    this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                    this._translate.instant('GENERAL.ACCEPT'),
                );

                this.activeModal.close(true)
            },
            (error) => {
                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    
}
}



_handleReaderLoaded(reader: string) {
        
  if (this.IncientView.companyId > 0) {
      let data = {
          companyIncidentId: this.IncientView.companyId,
          image: reader,
          isActive: this.overFlowImg,
      };

      this.stateEasyrouteService.createIncidentImg(data).subscribe(
          (data: any) => {
              this._toastService.displayWebsiteRelatedToast(
                  this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
              );
              this.productImages.push(data.data);
              this.ngOnInit();
          },
          (error) => {
              this._toastService.displayHTTPErrorToast(
                  error.status,
                  error.error.error,
              );
          },
      );
  } else {
      let productImage = {
          id: Date.now(),
          image: reader,
          isActive: true,
          overFlow: this.overFlowImg,
          main: false
      };

      this.productImages.push(productImage);

      this.IncientView.images = this.productImages;


      this.changeDetect.detectChanges();
  }
}

selectMainImage(event: any){

  // cuando es editar 
  if (this.IncientView.companyId > 0) {

      let value : any = this.IncientView.images.find((x :any) => x.id === event.index);


      let sendMaind = {
          main: event.main
      }

      this.stateEasyrouteService.UpdateImgIncident(sendMaind, value.id).subscribe(
          (data: any) => {
              this._toastService.displayWebsiteRelatedToast(
                  this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
              );
              //this.ngOnInit();
              this.productImages = this.productImages.map(( item: ProductsImage ) => {
      
                  if (  item.id === data.id ) {
  
                    item.main = data.main;
                  }
                  
                  return item;
                });
                this.IncientView.images = this.productImages;

                this.changeDetect.detectChanges();
    
          },
          (error) => {
              this._toastService.displayHTTPErrorToast(
                  error.status,
                  error.error.error,
              );
          },
      );
      
  } else {

      const datos = this.productImages.find((x: any) => x.main == true);


      // cuando almenos uno tiene un main true lo cambia a false
      if (datos) {

            this.productImages = this.productImages.map(( item: ProductsImage ) => {
      
              if (  item.main === true ) {
                item.main = false;
              }
              
              return item;
            });
          

          this.changeDetect.detectChanges();
          
      };

      // cambia el valor seleccionado el main a true
      this.productImages = this.productImages.map(( item: ProductsImage ) => {
      
          if (  item.id === event.index ) {

            item.main = event.main;
          }
          
          return item;
        });

          this.IncientView.images = this.productImages;

          this.changeDetect.detectChanges();


  }
 
}

deleteProductImage(productImageId: number, nameImage: string) {
  if (this.IncientView.companyId > 0) {
      const modal = this._modalService.open(IncidentModalConfirmComponent, {
          // size:'sm',
          centered: true,
          backdrop: 'static',
      });
      modal.componentInstance.title = this._translate.instant(
          'GENERAL.CONFIRM_REQUEST',
      );
      modal.componentInstance.message = this._translate.instant(
          'GENERAL.DELETE_IMAGE_INCIDENT',
      );
      modal.result.then(
          (result) => {
              if (result) {
                  this.stateEasyrouteService
                      .deleteImgIncident(productImageId)
                      .subscribe(
                          (data: any) => {
                            this.productImages = this.productImages.filter(
                              (x: any) => x.id !== productImageId,
                          );
                    
                          this.IncientView.images = this.productImages;
                              //this.ngOnInit();
                          },
                          (error) => {
                              this._toastService.displayHTTPErrorToast(
                                  error.status,
                                  error.error.error,
                              );
                          },
                      );
              }
          },
          (reason) => {
              this._toastService.displayHTTPErrorToast(
                  reason.status,
                  reason.error.error,
              );
          },
      );
  } else {
      this.productImages = this.productImages.filter(
          (x: any) => x.id !== productImageId,
      );

      this.IncientView.images = this.productImages;

  }
}

changeSolved(event:any){

  if (event) {

    this.incidentForm.controls['solved'].setValue(event);

    this.incidentForm.controls['solved'].setValidators(
        Validators.required,
    );

    this.incidentForm.controls['duration'].setValidators(
      Validators.required,
    );

    this.incidentForm.controls['duration'].enable();
    
  
    this.incidentForm.controls['incidentSolution'].setValidators([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(1000)
    ]);
    this.incidentForm.controls['incidentSolution'].enable();

  } else {
 
    this.incidentForm.controls['solved'].setValue(event);
   
    this.incidentForm.controls['duration'].disable();
  

    this.incidentForm.controls['incidentSolution'].setValidators([
      Validators.minLength(2),
      Validators.maxLength(1000)
    ]);
    this.incidentForm.controls['incidentSolution'].disable();
  }
  
  this.incidentForm.get('duration').updateValueAndValidity();
  this.incidentForm.get('incidentSolution').updateValueAndValidity();
  this.incidentForm.get('solved').updateValueAndValidity();
}

}

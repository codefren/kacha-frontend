import { StateEasyrouteService } from './../../../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from './../../../../../../../../shared/src/lib/services/toast.service';
import { LoadingService } from './../../../../../../../../shared/src/lib/services/loading.service';
import { Incident } from './../../../../../../../../backend/src/lib/types/incident.type';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;
declare function init_plugins();
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IncidentMessages, dayTimeAsStringToSeconds } from '@optimroute/shared';
import { IncidentModalConfirmComponent } from '../incident-modal-confirm/incident-modal-confirm.component';
import { ProductsImage } from '@optimroute/backend';
@Component({
  selector: 'easyroute-modal-add-incident',
  templateUrl: './modal-add-incident.component.html',
  styleUrls: ['./modal-add-incident.component.scss']
})
export class ModalAddIncidentComponent implements OnInit {

  incidentForm:FormGroup;

  incidentMessages: any;

  incident: Incident;

  showCode: boolean = true;

  companyId: number;

  date: string;

  time: any;

  requestFrom: any [];

  loadingCategory: string = 'success';

  productImages: any = [];

  overFlowImg: boolean = false;

  imageError: string = '';

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
  
  this.incident = new Incident();

  this.validaciones(this.incident);
}

validaciones(incidents: Incident) {
  
  this.date =  moment(new Date().toISOString()).tz('Europe/Madrid').format('DD/MM/YYYY');
      
  this.time = moment().tz('Europe/Madrid').format('HH:mm');

  this.incidentForm = this.fb.group({
      companyId: [ this.companyId ],
      code: [ incidents.code,[Validators.maxLength(30)] ],
      date: [ {value: this.date, disabled: true}, [Validators.required] ],
      time: [this.time, [Validators.required] ],
      clientName: [ incidents.clientName, [Validators.required, Validators.minLength(2),Validators.maxLength(100)] ],
      contactTypeId: [ incidents.contactTypeId ? incidents.contactTypeId: '', [Validators.required] ],
      title: [ incidents.title,[Validators.required, Validators.minLength(2),Validators.maxLength(100)]],
      description: [ incidents.description, [Validators.required, Validators.minLength(2),Validators.maxLength(1000)] ],
      outScheduleTime: [ incidents.outScheduleTime ],
      duration: [ incidents.duration ? incidents.duration:''],
      solved: [ incidents.solved ? true : false ],
      incidentSolution:[ incidents.incidentSolution , [Validators.minLength(2),Validators.maxLength(1000)]],
      images:[]
    
  });
  
  let incidentMessages = new IncidentMessages();

  this.incidentMessages = incidentMessages.getIncidentMessages();
  this.getRequestFrom();
  this.changeSolved(incidents.solved ? incidents.solved: false);
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

  formValues.images= this.incident.images;

  formValues.time = dayTimeAsStringToSeconds(
    this.incidentForm.get('time').value,
  );
  formValues.duration = dayTimeAsStringToSeconds(
    this.incidentForm.get('duration').value,
  );
  formValues.date =  moment(new Date().toISOString()).tz('Europe/Madrid').format('YYYY-MM-DD');

  //this.activeModal.close(this.incidentForm.value);
  if (
    this.incidentForm.invalid
) {
    this._toastService.displayHTTPErrorToast('Aviso;', 'El usuario no es valido');
} else {
     
        this.stateEasyrouteService.createIncident(formValues).subscribe(
            (data: any) => {
                this._toastService.displayWebsiteRelatedToast(
                    this._translate.instant('GENERAL.REGISTRATION'),
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

deleteProductImage(productImageId: number, nameImage: string) {
  if (this.companyId > 0) {
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
                this.productImages = this.productImages.filter(
                  (x: any) => x.id !== productImageId,
              );
      
              this.incident.images = this.productImages;
                 /*  this.stateEasyrouteService
                      .destroyProductImage(productImageId)
                      .subscribe(
                          (data: any) => {
                              this.ngOnInit();
                          },
                          (error) => {
                              this._toastService.displayHTTPErrorToast(
                                  error.status,
                                  error.error.error,
                              );
                          },
                      ); */
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

      this.incident.images = this.productImages;

  }
}

_handleReaderLoaded(reader: string) {
      
if (this.incident.companyId > 0) {
    let data = {
        companyProductId: this.companyId,
        image: reader,
        overFlow: this.overFlowImg,
    };

    this.stateEasyrouteService.createProductImage(data).subscribe(
        (data: any) => {
            this._toastService.displayWebsiteRelatedToast(
                this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
            );
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

    this.incident.images = this.productImages;


    this.changeDetect.detectChanges();
}
}

selectMainImage(event: any){

// cuando es editar 
if (this.incident.companyId > 0) {

    let value : any = this.incident.images.find((x :any) => x.id === event.index);


    let sendMaind = {
        main: event.main
    }

    this.stateEasyrouteService.updateProductImageMain(sendMaind, value.id).subscribe(
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
              this.incident.images = this.productImages;

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

        this.incident.images = this.productImages;

        this.changeDetect.detectChanges();


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

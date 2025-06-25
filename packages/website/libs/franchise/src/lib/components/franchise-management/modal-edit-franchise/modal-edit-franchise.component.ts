import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Franchise } from '@optimroute/backend';
import { FranchiseMessages } from '@optimroute/shared';
import { ValidatePhone } from '../../../../../../shared/src/lib/validators/phone.validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidateCompanyId } from '../../../../../../shared/src/lib/validators/company-id.validator';
import { secondsToDayTimeAsString, dayTimeAsStringToSeconds } from '../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { StateEasyrouteService } from '../../../../../../state-easyroute/src/lib/state-easyroute.service';

import { TranslateService } from '@ngx-translate/core';
import { take, map } from 'rxjs/operators';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';

@Component({
  selector: 'easyroute-modal-edit-franchise',
  templateUrl: './modal-edit-franchise.component.html',
  styleUrls: ['./modal-edit-franchise.component.scss']
})
export class ModalEditFranchiseComponent implements OnInit {

  @Input() franchiseData:any;

  franchiseForm: FormGroup;

  franchiseMessages: any;

  franchiseImages: { 
    id: number,
    urlimage: string,
    image?: string
   }[] = [];

   franchise: Franchise;

   imageSelected: number;

   imageError: string = ''; 

  constructor(  private fb: FormBuilder,
                private loading: LoadingService,
                public activeModal: NgbActiveModal,
                private toastService: ToastService,
                private translate: TranslateService,
                private stateEasyrouteService: StateEasyrouteService,
                private _changeDetectorRef: ChangeDetectorRef  
              ) { }

  ngOnInit() {
    this.franchiseEdit();
  }
  franchiseEdit(){

    this.franchise = this.franchiseData;

    const franchise: Franchise = this.franchiseData; 


    let starttotalSeconds = +franchise.scheduleStart ? franchise.scheduleStart:0;

    starttotalSeconds %= 3600;

    let startminutes = Math.floor(starttotalSeconds / 60);

    let startseconds = starttotalSeconds % 60;

    let endtotalSeconds = +franchise.scheduleEnd? franchise.scheduleEnd:0;

    let endhours = Math.floor(endtotalSeconds / 3600);

    endtotalSeconds %= 3600;

    let endminutes = Math.floor(endtotalSeconds / 60);

    let endseconds = endtotalSeconds % 60;
    
    this.franchiseForm = this.fb.group({

    name: [ franchise.name, [ Validators.required ,Validators.minLength(1), Validators.maxLength(255)] ],

    nif: [ franchise.nif, [
      ValidateCompanyId(
        'España'
      ),
      Validators.required,
    ] ],
    streetAddress: [ franchise.streetAddress, 
      [ Validators.required, Validators.minLength(1),  Validators.maxLength(1000)]],
    phone: [
        franchise.phone,
         [   ValidatePhone(
             '' ? '' : 'España'
             ),
             Validators.required,
             Validators.minLength(2),
             Validators.maxLength(30)
         ],
     ],
   email: [ franchise.billingEmail, [ Validators.required, Validators.email ] ],
   responsableName: [ franchise.responsableName, 
    [ Validators.required, Validators.minLength(1), Validators.maxLength(255) ] ],
   scheduleStart: 
   [ franchise.scheduleStart ? secondsToDayTimeAsString(franchise.scheduleStart)
      : secondsToDayTimeAsString(0)],
   scheduleEnd: 
   [ franchise.scheduleEnd ? secondsToDayTimeAsString(franchise.scheduleEnd)
      : secondsToDayTimeAsString(86399)],
   activeInApp: [ franchise.activeInApp ],
   receiveProductsFromCompanyParent: [ franchise.receiveProductsFromCompanyParent ],
   productReceptionTimeFromCompanyParent: 
   [ franchise.productReceptionTimeFromCompanyParent ? secondsToDayTimeAsString(franchise.productReceptionTimeFromCompanyParent)
      : secondsToDayTimeAsString(0)],
      productReceptionEachTimeFromCompanyParent: 
   [ franchise.productReceptionEachTimeFromCompanyParent ? secondsToDayTimeAsString(franchise.productReceptionEachTimeFromCompanyParent)
      : secondsToDayTimeAsString(0)],
   images:['']
     
  });

  if(!franchise.receiveProductsFromCompanyParent){
    this.franchiseForm.get('productReceptionTimeFromCompanyParent').disable();
  }
  if(!franchise.receiveProductsFromCompanyParent){
    this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').disable();
  }
  this.franchiseForm.controls['scheduleStart'].setValidators([
    this.ValidatorWindowsStart.bind( this.franchiseForm )
  ]);

  this.franchiseForm.controls['scheduleEnd'].setValidators([
    this.ValidatorWindowsEnd.bind( this.franchiseForm )
  ]);
    const validationMessagesfranchiste = new FranchiseMessages();
    this.franchiseMessages = validationMessagesfranchiste.getFranchiseMessages();
  }

  ValidatorWindowsStart ( control: FormControl ): {  [s: string ]: boolean } {

    let formulario: any = this;

    if ( control.value === formulario.controls['scheduleEnd'].value ) {

      return {

        confirmar: true

      };
      
    } else if(  control.value > formulario.controls['scheduleEnd'].value){

      return {

        sutrast: true

      };
    }
    return null;
  }

  viewChange(){
    if(this.franchiseForm.value.receiveProductsFromCompanyParent === false){
      this.franchiseForm.get('productReceptionTimeFromCompanyParent').disable();
      this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').disable();
    } else {
      this.franchiseForm.get('productReceptionTimeFromCompanyParent').enable();
      this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').enable();
    }
    
  }
  ValidatorWindowsEnd ( control: FormControl ): {  [s: string ]: boolean } {
    let formulario: any = this;

    if ( control.value < formulario.controls['scheduleStart'].value ) {

      return {

        sutrast: true

      };
    } else if(control.value === formulario.controls['scheduleStart'].value){

      return {

        confirmar: true

      };
    }
    return null;
   
  }

  changetime(event: any ,name :string){
    
    if(event.target.value === ''){
      switch (name) {
        case "scheduleStart":
          this.franchiseForm.get('scheduleStart').setValue(secondsToDayTimeAsString(0));
          this.franchiseForm.get('scheduleStart').updateValueAndValidity();
          break;
          case "scheduleEnd":
            this.franchiseForm.get('scheduleEnd').setValue(secondsToDayTimeAsString(86399));
            this.franchiseForm.get('scheduleEnd').updateValueAndValidity();
          break;
          default:
        break;
      }
    } else {
      this.franchiseForm.get('scheduleStart').updateValueAndValidity();
      this.franchiseForm.get('scheduleEnd').updateValueAndValidity();
    }

  }
  fileChangeEvent( $event: any ,position: any){

    this.imageSelected = position;

    return this.loadImage64( $event );
  }

  loadImage64( e: any ) {

    this.imageError = '';

    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2000000;  // bytes
    const reader = new FileReader();
  
    let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    // console.log( file.type );
    // console.log( file.size );
    
    if ( file.size > maxSize ) {
      this.imageError = 'Tamaño máximo permitido ' + maxSize / 1000 / 1000 + 'Mb';  
      return;
    }

    if ( !allowedTypes.includes( file.type ) ) {
      this.imageError = 'Formatos permitidos ( JPG | PNG )';
      return;
    }

    reader.onload = this.validateSizeImg.bind( this );
    reader.readAsDataURL(file); 
  }

  validateSizeImg( $event: any ) {
    
    const reader = $event.target.result;
  
    return this._handleReaderLoaded( reader );
    
    /*
      // validacion de dimensiones retirar la linea completa return superior y 
      // el comentario si desea validar las mismas
    
      const image = new Image();
      const maxHeight = 500;
      const maxWidth = 500;

      image.src = reader;

      image.onload = ( rs ) => {
        const imgWidth = rs.currentTarget['width'];
        const imgHeight = rs.currentTarget['height'];

        if ( imgHeight > maxHeight || imgWidth > maxWidth ) {
          this.imageError = `Dimensiones máximas permitidas ${ maxHeight }px x ${ maxWidth }px`;
          return this._changeDetectorRef.detectChanges();
        } 
      
        return this._handleReaderLoaded( reader );
      } 
    */
  }

  _handleReaderLoaded( reader: string ) {
   
    let data = {  // new image
      id: this.imageSelected,
      image : reader,
      urlimage: reader,
    };

    if ( this.franchise.id > 0 || this.franchise.id !== null ) {
    
      if ( this.franchise.images.length > 0 ) {
        
        let found = this.franchise.images.find( ( image ) => image.id === this.imageSelected );

        data = {
          ...data,
          id:  this.imageSelected,
        }

        // si halla la imagen la actualiza y mapea
        if ( found ) {
        
         // this.loading.showLoading();

          this.stateEasyrouteService.updateCompanyImage( data, found.id )
            .pipe( take(1) )
            .subscribe(
              ( resp ) => { 
                this.franchise.images = this.franchise.images.map(( image ) => {      
                  if ( image.id === found.id ) {
                    return data;
                  }
      
                  return image;
                });

                this.toastService.displayWebsiteRelatedToast(
                  this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                  this.translate.instant('GENERAL.ACCEPT')
                );
                this.loading.hideLoading();
              },
              ( error ) => {
                this.loading.hideLoading();
                this.toastService.displayHTTPErrorToast(error.error);
              }
            )

        } else {
      
          // si no la halla la crea y concatena al arreglo actual
          const payload = {
            id: this.franchise.id,
            idCompany: this.franchise.id,
            image : reader,
            urlimage: reader
          }

         // this.loading.showLoading();

           this.stateEasyrouteService.createCompanyImage( payload )
            .pipe( take(1) )
            .subscribe( ( dataImage: any ) => {
              
              data = {
                id: dataImage.data.id,
                urlimage: dataImage.data.urlImage,
                image: dataImage.data.urlImage
              };
               
              this.franchiseImages = this.franchiseImages.concat([ data ]);              
              this.franchise.images = this.franchiseImages;
          
              this.toastService.displayWebsiteRelatedToast(
                this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                this.translate.instant('GENERAL.ACCEPT')
              );

              this.loading.hideLoading();
          }, 
          ( error )=>{

            this.toastService.displayHTTPErrorToast(error.error);
            this.loading.hideLoading();
          }); 
          
        }

      }  else {
     
        // si el usuario edita la compañia pero no tiene imagen

        const payload = {
          id: this.franchise.id,
          idCompany: this.franchise.id,
          image : reader,
          urlimage: reader
        }

       // this.loading.showLoading();

        this.stateEasyrouteService.createCompanyImage( payload )
          .pipe( take(1) )
          .subscribe( ( dataImage: any ) => {
            data = {
              id: dataImage.data.id,
              urlimage: dataImage.data.urlImage,
              image: dataImage.data.urlImage
            };

            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
              this.translate.instant('GENERAL.ACCEPT')
            );
          
            this.franchiseImages = this.franchiseImages.concat([ data ]);
            this.franchise.images = this.franchiseImages;
            
            this.loading.hideLoading();
          
          }, 
          ( error ) => {
  
            this.toastService.displayHTTPErrorToast(error.error);
            this.loading.hideLoading();      
        }); 

      }
     
    } else {

      // franquicia nueva sin imagenes almacenadas
      
      if ( this.franchiseImages.length > 0 ) {

        let found = this.franchiseImages.find( ( image ) => image.id === this.imageSelected )

        if ( found ) {

          // mapea si la imagen existe dentro del arreglo
          this.franchise.images = this.franchiseImages.map(( image ) => {      
            if ( image.id === found.id ) {
              return data;
            }

            return image;
          });

        } else {

          // añade el elemento si no existe la imagen en el arreglo
          // obtiene la posicion
          
          data = {
            ...data,
            id: this.franchiseImages.length + 1
          };

          this.franchiseImages = this.franchiseImages.concat([ data ]);
          this.franchise.images = this.franchiseImages;
        }

      } else {

        // si no hay imagenes
        data = {
          ...data,
          id: 1
        }

        this.franchiseImages = this.franchiseImages.concat([ data ]);
        this.franchise.images = this.franchiseImages
        
      }
      
    }
  }


  submit(){
    this.franchiseForm.get('images').setValue(this.franchise.images);
    this.franchiseForm.get('scheduleStart').setValue(dayTimeAsStringToSeconds(
      this.franchiseForm.value.scheduleStart,
    ));
    
    this.franchiseForm.get('scheduleEnd').setValue(dayTimeAsStringToSeconds(
      this.franchiseForm.value.scheduleEnd,
    ));

    this.franchiseForm.get('productReceptionTimeFromCompanyParent').setValue(dayTimeAsStringToSeconds(
      this.franchiseForm.value.productReceptionTimeFromCompanyParent,
    ));

    this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').setValue(dayTimeAsStringToSeconds(
      this.franchiseForm.value.productReceptionEachTimeFromCompanyParent,
    ));

    this.stateEasyrouteService.updateFranchise(this.franchiseData.id, this.franchiseForm.value).pipe( take(1) )
    .subscribe( (data: any) => {
      this.toastService.displayWebsiteRelatedToast(
       this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
       this.translate.instant('GENERAL.ACCEPT')
     );
     this.closeDialog(true);
 
     }, (error)=>{
      
       this.toastService.displayHTTPErrorToast( error.status, error.error.error )
   
     });


    
  }

  closeDialog(element: any){
    this.activeModal.close(element);
  }

}

import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Franchise, BackendService } from '@optimroute/backend';
import { FranchiseMessages, ValidateCompanyId, secondsToDayTimeAsString, ValidatePhone, LoadingService, ToastService, dayTimeAsStringToSeconds } from '@optimroute/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmCreateFranchiseComponent } from './confirm-create-franchise/confirm-create-franchise.component';
import { tap, take, map } from 'rxjs/operators';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'easyroute-create-franchise',
  templateUrl: './create-franchise.component.html',
  styleUrls: ['./create-franchise.component.scss']
})
export class CreateFranchiseComponent implements OnInit {

  franchiseForm: FormGroup;

  franchise: Franchise = new Franchise();

  @Output() changePage: EventEmitter<boolean> = new EventEmitter(); 


  franchiseImages: { 
    id: number,
    urlimage: string,
    image?: string
  }[] = [];

  imageSelected: number;

  franchiseMessages: any;

  imageError: string = '';

  constructor(
    private _fb: FormBuilder,
    private _modalService: NgbModal,
    private _changeDetectorRef: ChangeDetectorRef,
    private _backendService: BackendService,
    private _loadingService: LoadingService,
    private stateEasyrouteService: StateEasyrouteService,
    private _toastService: ToastService,
    private _translate: TranslateService
  ) { }

  ngOnInit() {

    this.franchiseForm = this._fb.group({
      name: [ this.franchise.name, [ Validators.required ] ],
      nif: [ this.franchise.nif, [ 
        Validators.required,  
        ValidateCompanyId(
          'España'
        ),
        Validators.required,
      ] ],
      streetAddress: [ this.franchise.streetAddress, [ Validators.required, Validators.minLength(4),  Validators.maxLength(1000) ] ],
      phone: [ this.franchise.phone,  
        [   
          ValidatePhone(
        '' ? '' : 'España'
        ),
        Validators.required
    ], ],
      email: [ this.franchise.billingEmail, [ Validators.required, Validators.email ] ],
      password: [ this.franchise.password, [ Validators.required, Validators.minLength(8) ] ],
      responsableName: [ this.franchise.responsableName, [ Validators.required ] ],
      scheduleStart: [ this.franchise.scheduleStart > 0 ? secondsToDayTimeAsString( this.franchise.scheduleStart )
        : secondsToDayTimeAsString(0) ],
      scheduleEnd: [ this.franchise.scheduleEnd > 0 ? secondsToDayTimeAsString( this.franchise.scheduleEnd ) 
        : secondsToDayTimeAsString(86399) ],
      activeInApp: [ this.franchise.activeInApp ],
      receiveProductsFromCompanyParent: [ this.franchise.receiveProductsFromCompanyParent ],
      productReceptionTimeFromCompanyParent: 
      [ this.franchise.productReceptionTimeFromCompanyParent ? secondsToDayTimeAsString(this.franchise.productReceptionTimeFromCompanyParent)
      : secondsToDayTimeAsString(0)],
      productReceptionEachTimeFromCompanyParent: 
      [ this.franchise.productReceptionEachTimeFromCompanyParent ? secondsToDayTimeAsString(this.franchise.productReceptionEachTimeFromCompanyParent)
      : secondsToDayTimeAsString(0)],
      images: [ [] ]
    });

    this.franchiseForm.get('productReceptionTimeFromCompanyParent').disable();

    this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').disable();

    this.franchiseForm.controls['scheduleStart'].setValidators([
      this.ValidatorWindowsStart.bind( this.franchiseForm )
    ]);
  
    this.franchiseForm.controls['scheduleEnd'].setValidators([
      this.ValidatorWindowsEnd.bind( this.franchiseForm )
    ]);

    this.franchiseMessages = new FranchiseMessages().getFranchiseMessages();
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

  submit() {
    
    this._loadingService.showLoading();

    this.getFranchiseModule().subscribe(
        ( data ) => {

          this._loadingService.hideLoading();

          const modal = this._modalService.open( ConfirmCreateFranchiseComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
          });
          
          modal.componentInstance.data = data;

          modal.result.then(
            ( resp: boolean ) => {
              if ( resp ) {
                this.franchiseForm.get('productReceptionTimeFromCompanyParent').setValue(dayTimeAsStringToSeconds(
                  this.franchiseForm.value.productReceptionTimeFromCompanyParent,
                ));
                this.franchiseForm.get('productReceptionEachTimeFromCompanyParent').setValue(dayTimeAsStringToSeconds(
                  this.franchiseForm.value.productReceptionEachTimeFromCompanyParent,
                ));
                return this.createFranchise( this.franchiseForm.value );
              }
            },
            ( reason ) => console.log( reason )
          );

        },
        ( error ) => { 
          this._loadingService.hideLoading();
          console.log( error );
        }
      )
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
  createFranchise( data: any ) {
    
    data = {
      ...data,
      scheduleStart: dayTimeAsStringToSeconds( this.franchiseForm.get('scheduleStart').value ),
      scheduleEnd: dayTimeAsStringToSeconds( this.franchiseForm.get('scheduleEnd').value ),
      phone: '+34' + data.phone,
      images: this.franchiseImages
    }

    this._loadingService.showLoading();

    this.stateEasyrouteService.createFranchise( data )
      .pipe( take(1) )
      .subscribe(
        ( resp ) => {

          this._loadingService.hideLoading();

          this._toastService.displayWebsiteRelatedToast(
            this._translate.instant('GENERAL.REGISTRATION'),
            this._translate.instant('GENERAL.ACCEPT')
          )

          this.changePage.emit( true );
        },
        ( error ) => {
          this._loadingService.hideLoading(); 
          this._toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      );
  }

  fileChangeEvent( $event: any, position: number ) {
    this.imageSelected = position;
    return this.loadImage64( $event );
  }

  loadImage64( e: any ) {

    this.imageError = '';
    
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 1000000;
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
    reader.readAsDataURL( file ); 
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
      };

    */
  }

  _handleReaderLoaded( reader: string ) {
   
    let data = {  // new image
      id: this.imageSelected,
      image : reader,
      urlimage: reader,
    };

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

        console.log('añade el elemento si no existe la imagen en el arreglo');
        
        // añade el elemento si no existe la imagen en el arreglo
        data = {
          ...data,
          id: this.franchiseImages.length + 1
        };

        this.franchiseImages = this.franchiseImages.concat([ data ]);
        this.franchise.images = this.franchiseImages;
      }

    } else {

      console.log('si no hay imagenes');

      // si no hay imagenes
      data = {
        ...data,
        id: 1
      }

      this.franchiseImages = this.franchiseImages.concat([ data ]);
      this.franchise.images = this.franchiseImages;

    }

    this._changeDetectorRef.detectChanges();
    console.log( this.franchise.images );
  }

  getFranchiseModule() {

    return this._backendService.get('module/2')
      .pipe( 
        take(1), 
        map( ({ data }) => ({
          price: data.price,
          iva: data.iva,
          individualFranchisePrice: data.individualFranchisePrice,
          individualFranchisePriceIva: data.individualFranchisePriceIva,
          name: data.name
        })),
      )
  }
}

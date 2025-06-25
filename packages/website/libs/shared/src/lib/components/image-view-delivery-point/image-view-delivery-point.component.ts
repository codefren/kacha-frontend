import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpandImageComponent } from '../expand-image/expand-image.component';

@Component({
  selector: 'easyroute-image-view-delivery-point',
  templateUrl: './image-view-delivery-point.component.html',
  styleUrls: ['./image-view-delivery-point.component.scss']
})
export class ImageViewDeliveryPointComponent implements OnInit {

  @Input('image')
  image: {  id: number, image: string, main: boolean, urlImage:string ,urlimage: string } | undefined;

  @Input('state')
  state: 'local' | 'server' = 'local'
  

  @Input('delete')
  delete: boolean = false;

  @Input('incient')
  incient: boolean = false;

  @Input('disabled')
  disabled: boolean = false; //desabilita el boton de adjuntar

  @Input('franchise')
  franchise: boolean = false;  // flag del estilo de franquicias por defecto en falso
  
  @Input ('index')
  index: number;

  @Output('error')
  error: EventEmitter<string> = new EventEmitter();

  @Output('updateImage')
  updateImage: EventEmitter<{
    id: number,
    image: string,
    main: boolean,
    urlImage?: string,
  }> = new EventEmitter();

  @Output('deleteImage')
  deleteImage: EventEmitter<{
    id: number,
    image: string,
    main: boolean,
    urlImage?: string,
  }> = new EventEmitter();

  @Output('changeMain')
  main : EventEmitter <{
    index: number,
    main: boolean

  }> =new EventEmitter();

  @ViewChild('fileImage', { static: false }) fileImage:ElementRef;


  constructor( private detectChanges: ChangeDetectorRef, 
    private dialog: NgbModal) { }

  ngOnInit() {
    console.log( this.image, 'image' ); 
  
  }

  handleFileChange( $event: any ) {
  
    this.error.emit('');

    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 1000000;
    const reader = new FileReader();

    let file = $event.dataTransfer ? $event.dataTransfer.files[0] : $event.target.files[0];

    if ( !file ) {
      return;
    }

    if ( file.size > maxSize ) {
      this.error.emit( 'Tamaño máximo permitido ' + maxSize / 1000 / 1000 + 'Mb' );  
      return;
    }

    if ( !allowedTypes.includes( file.type ) ) {
      this.error.emit('Formatos permitidos ( JPG | PNG )');
      return;
    }

    reader.onload = this.validateSizeImg.bind( this );
    reader.readAsDataURL( file );
    this.fileImage.nativeElement.value = '';
  }

  validateSizeImg( $event ) {

    const reader = $event.target.result;

    let data = {
      id: this.image ? this.image.id : null,
      image: reader,
      urlImage: reader,    
      main: false 
       
    };

    console.log( data, this.state );

    this.updateImage.emit( data );

    return this.detectChanges.detectChanges();
  }

  

  selectedMain(event: any, i: number){

    let data ={
      index: i,
      main: event
    }

    this.main.emit(data);
  }


  viewImage( $event, image){
    const dialogRef = this.dialog.open(
        ExpandImageComponent,
        {
            centered: true,
            backdrop: true,
            windowClass: 'expand-image'
        }
    );

    dialogRef.componentInstance.url = image.urlimage;
  }

    deleteImg( $event, image ) {
    this.deleteImage.emit( image );
  }

  donwload(image:any){
    
    let link= document.createElement('a');
    document.body.appendChild(link); //required in FF, optional for Chrome
    link.target = '_blank';
    let fileName = 'img';
    link.download = fileName;
    link.href = image;
    link.click();
  }

}

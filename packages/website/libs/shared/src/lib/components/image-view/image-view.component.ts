import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
declare var $: any;

@Component({
  selector: 'easyroute-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit {

  @Input('image')
  image: {  id: number, image: string, main: boolean } | undefined;

  @Input('state')
  state: 'local' | 'server' = 'local'
  

  @Input('delete')
  delete: boolean = false;

  @Input('incient')
  incient: boolean = false;

  @Input('disabled')
  disabled: boolean = false; //desabilita el boton de adjuntar

  @Input('promotion')
  promotion: boolean = false; //desabilita el el margin de los card cuando es promocion

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

  constructor(
    private detectChanges: ChangeDetectorRef, 
  ) { }

  ngOnInit() {
    
    console.log( this.promotion, 'image' );
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

  /*  
    Documentacion:

    validacion de dimensiones utilizar si se desea validarlas

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
    };

  */
}

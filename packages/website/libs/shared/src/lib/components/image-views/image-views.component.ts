import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { date } from 'ngx-custom-validators/src/app/date/validator';

@Component({
  selector: 'easyroute-image-views',
  templateUrl: './image-views.component.html',
  styleUrls: ['./image-views.component.scss']
})
export class ImageViewsComponent implements OnInit {

  @Input('images')
  images: { id: number, image: string }[];  // array de imagenes

  @Input('updateImage')
  updateImage: boolean = false;  // flag de actualizacion al servidor si es edicion pasar props en true

  @Input('franchise')
  franchise: boolean = false;  // flag del estilo de franquicias por defecto en falso

  // opcional: por defecto es 4 puede ser cambiado via props: [numberCards]="1"
  @Input('numberCards')
  numberCards: number = 4;
  

  // evento de actualizacion local de imagenes
  @Output()
  updateImageLocal: EventEmitter<{ 
    id: number, 
    image: string, 
    urlImage?: string 
  }[]> = new EventEmitter();   
  
  // evento de actualizacion remoto de imagenes
  @Output()
  updateImageServer: EventEmitter<{ 
    data: { id: number, image: string, urlImage?: string }, 
    id: number | null,
    method?: 'insert' | 'update'  
  }> = new EventEmitter(); 
 
  date: Date = new Date();

  imageSelected: number;
  
  imageError: string = '';

  cards: any[];

  constructor(
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // rellena los campos de las tarjetas
    this.cards = new Array( this.numberCards ).fill({});  
  }

  handleFileChange( $event: any,  position: number ) {
    
    this.imageError = '';
    this.imageSelected = position;

    console.log( this.imageSelected );

    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 1000000;
    const reader = new FileReader();

    let file = $event.dataTransfer ? $event.dataTransfer.files[0] : $event.target.files[0];

    if ( !file ) {
      return;
    }

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

  validateSizeImg( $event ) {

    const reader = $event.target.result;
    
    return this.handleImageRender( reader );

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
        
        return this.handleImageRender( reader );
      };

    */
  }
  handleImageRender( reader: string ) {
    
    let data = {
      id: this.imageSelected,
      image: reader,
      urlImage: reader
    };

    if ( !this.updateImage ) {
      
      // modificar el arreglo de forma local para la inserccion
      if ( this.images.length > 0 ) {
        
        let found = this.images.find(( image ) => image.id == this.imageSelected );

        if ( found ) {
          this.images = this.images.map(( image ) => {
            
            if ( image.id === found.id ) {
              return data;
            } 

            return image;
          });
        
        } else {  // si no halla en el arreglo se le suma 1

          data = { 
            ...data, 
            id: this.images.length + 1 
          };
        
          this.images = this.images.concat([ data ]);
        }

      } else {  // si no existen imagenes almacenadas

        data = { ...data, 
          id: this.images.length + 1 
        };
      
        this.images = this.images.concat([ data ]);
      }

      // emite el cambio local
      this.updateImageLocal.emit( this.images );
      
      return this.detectChanges.detectChanges();

    } else {
      
      // modifica el arreglo para enviar al servidor
      let found = this.images.find(( image ) => image.id === this.imageSelected );

      if ( found ) {
        return this.updateImageServer.emit({ 
          data,
          id: found.id, 
          method: 'update'
        });
      }
      
      return this.updateImageServer.emit({ 
        data, 
        id: null, 
        method: 'insert' 
      });
    }
  }
}

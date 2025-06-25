import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'easyroute-modal-view-pdf-delivery-notes',
  templateUrl: './modal-view-pdf-delivery-notes.component.html',
  styleUrls: ['./modal-view-pdf-delivery-notes.component.scss']
})
export class ModalViewPdfDeliveryNotesComponent implements OnInit {

  conunter: number = 1;

  routeId: any;
  
  imageLoaded:any;

  data: any;

  url: any;
  
  constructor(
    private backend: BackendService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {

    return this.backend.getpdfSheet(this.url).then((data: string)=>{

      

      console.log(data, 'data')
      this.data = data;

      this.imageLoaded = this.sanitizer.bypassSecurityTrustResourceUrl(data);


      
    })
  }

  donwload(){
    console.log('abrir descargar ticket');
  }
  downloadPdf(){
    console.log('descargar como pdf');
  }

  sumar(){
    this.conunter +=1;
  }

  restar(){
    this.conunter -=1;
  }

}

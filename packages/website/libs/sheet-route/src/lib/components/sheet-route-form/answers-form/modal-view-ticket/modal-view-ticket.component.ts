import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from '../../../../../../../../apps/easyroute/src/environments/environment';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { pipe } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'easyroute-modal-view-ticket',
  templateUrl: './modal-view-ticket.component.html',
  styleUrls: ['./modal-view-ticket.component.scss']
})
export class ModalViewTicketComponent implements OnInit {

  url: string = environment.apiUrl;

  img: string;

  imageLoaded:any;

  data: any;

  constructor(
    private backend: BackendService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    return this.backend.getIMG(this.img).then((data: string)=>{

      

      this.data = data;

      this.imageLoaded = this.sanitizer.bypassSecurityTrustUrl(data);


      
    })
    
  }
  donwload(){
    let date = new Date();

    let day = date.getDate();
   
    console.log('abrir descargar ticket');
    
    const a: any = document.createElement('a');

    a.href = this.data;

    a.download = 'ticket' + ' - ' + moment(date).format('hh:mm:ss a');

    document.body.appendChild(a);

    a.style = 'display: none';

    a.click();

    a.remove();
  }
  downloadPdf(){
    console.log('descargar como pdf');
    var win = window.open('', 'top=0,left=0,height=100%,width=auto, margin=0 ,auto;');
    win.document.write(`
    <html>
      <head>
        <title>Imprimir ticket combustibele</title>
        <style>
        //........Customized style.......
        .img{
          margin:0 auto;
        }
        </style>
      </head>
  <body >
  <img class="img" src="${this.data}" onload="window.print();window.close()" />
  </body>
    </html>`);
    win.focus();
   
   
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  //   popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Imprimir ticket combustibele</title>
          <style>
          //........Customized style.......
          .img{
            margin:0 auto;
          }
          </style>
        </head>
    <body >
    <img class="img" src="${this.data}" onload="window.print();window.close()" />
    </body>
      </html>`
    );
    popupWin.focus();
}
}

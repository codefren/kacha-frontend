import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'easyroute-modal-view-pdf-bills-general',
  templateUrl: './modal-view-pdf-bills-general.component.html',
  styleUrls: ['./modal-view-pdf-bills-general.component.scss']
})
export class ModalViewPdfBillsGeneralComponent implements OnInit {

  conunter: number = 1;

  routeId: any;
  
  imageLoaded:any;

  data: any;

  url: any;

  title : any;

  viewUrl : boolean = false;
  
  constructor(

    private sanitizer: DomSanitizer

  ) { }

  ngOnInit() {

    this.imageLoaded = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }




}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillInterface } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { LoadingService, ToastService } from '@optimroute/shared';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
declare function init_plugins();
declare var $: any;

import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'easyroute-bill-form',
  templateUrl: './bill-form.component.html',
  styleUrls: ['./bill-form.component.scss']
})
export class BillFormComponent implements OnInit {
  
  bill: BillInterface;
  moneySymbol = environment.MONEY_SYMBOL;
  table: any;

  showInfoDetail: boolean = true;

  imageLoaded:any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private translate: TranslateService,
    private stateEasyrouteService: StateEasyrouteService,
    public authLocal: AuthLocalService,
    private detectChanges: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer
    
  ) { }

  ngOnInit() {

    this.load();

  }

  load() {

    this.showInfoDetail = false;

    this.activatedRoute.params.subscribe(params => {
      
      this.stateEasyrouteService.getBill(params['bill_id']).subscribe(

        ({ data }: any) => {

          this.bill = data;

          this.imageLoaded = this.sanitizer.bypassSecurityTrustResourceUrl(this.bill.archiveUrl);

          this.showInfoDetail = true;

            if (data.id > 0) {
                  try{
                    this.detectChanges.detectChanges();
                    this.cargar();
                  } catch(e){
            
                  }
            
                }  
         
        },
        (error) => {

          this.showInfoDetail = true;

          this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        },
      );

    });
  }

  downloadElement(archivo: any): void {
    
    let link = document.createElement('a');
    document.body.appendChild(link); //required in FF, optional for Chrome
    link.target = '_blank';
    let fileName = 'img';
    link.download = fileName;
    link.href = archivo;
    link.click();
  }

  getDateSpanish( date: string ) {
    
    return moment( date ).format('DD/MM/YYYY');
  }


   cargar() {
    
    let url = environment.apiUrl + 'company_bill_authorization_dont_charge_datatables?companyBillId='+this.bill.id;
    
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

    let table = '#autorizedCharges';
    
    this.table = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        order: [0, 'desc'],
        lengthMenu: [10],
        
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        dom: `
            <"top-button-hide"><'vehicles table-responsive-md't>
            <'row reset'
                <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
            >
        `,
        buttons: [
            {
                extend: 'colvis',
                text: this.translate.instant('GENERAL.SHOW/HIDE'),
                columnText: function(dt, idx, title) {
                    return idx + 1 + ': ' + title;
                },
            },
        ],
        language: environment.DataTableEspaniol,
        ajax: {
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: tok,
            },
            error: (xhr, error, thrown) => {
                let html = '<div class="container" style="padding: 10px;">';
                html +=
                    '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                html +=
                    '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                html += '</div>';
    
                $('#companies_processing').html(html);
            },
        },
        columns: [
            {
                data: 'authorizingDate',
                className:'text-left',
                title: this.translate.instant('BILLS.DATE'),
                render: (data, type, row) => {
                   
                    return (
                        moment(data).format('DD/MM/YYYY')
                    );
                },
            },
            
            {
              data: 'authorizingName',
              className:'text-left',
              title: this.translate.instant('BILLS.AUTORIZED_BY'),
              render: (data, type, row) => {
                 let name = data;
                  
                      return (
                          '<span data-toggle="tooltip" data-placement="top" title="' +
                          data +
                          '">' +
                          name +
                          '</span>'
                      );
                  
              },
          },

          {
            data: 'user_driver',
            className:'text-left',
            title: this.translate.instant('BILLS.DRIVER'),
            render: (data, type, row) => {
                let name = data.name;
                let surname = data.surname;
                if (data == null || data == 0) {
                    return '<span class="text center" aria-hidden="true"> No disponible</span>';
                } else {
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        '">' +
                        data.name + '  ' + data.surname+
                        '</span>'
                    );
                }
            },
          }
            
            
        ],
    });
    
} 

returnsList(){
  this.router.navigateByUrl('bills');
}

formatEuro(quantity) {
  return new Intl.NumberFormat('de-DE', {
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }).format(quantity);

}

}

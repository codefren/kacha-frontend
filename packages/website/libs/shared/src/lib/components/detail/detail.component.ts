import { Component, OnInit } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'easyroute-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit {
  table: any;
  products: any = [];
  data: any;
  detailForm: FormGroup;
  
  constructor(
      private stateRoutePlanningService: StateRoutePlanningService,
      public dialogRef: NgbActiveModal,
      private _translate: TranslateService, 
      private fb: FormBuilder, 
    ) 
    { }

  ngOnInit() {
    
    this.validaciones(this.data);

    this.stateRoutePlanningService.getDeliveryPointDetailAssigned(this.data.routeId, this.data.id).pipe(take(1))
      .subscribe((data)=>{
        if (this.table) {
          this.table.clear();
        } 
        this.products = data.data;
        let table = '#details';
        this.table = $(table).DataTable({
          destroy: true,
          language: environment.DataTableEspaniol,
          stateSaveParams: function (settings, data) {
            data.search.search = "";
          },
          data: this.products,
          lengthMenu: [50, 100],
          dom: `
            <'row p-2'<'col-sm-6 col-12 d-flex flex-column justify-content-center select-personalize-datatable'l>
              <'col-sm-6 col-12 label-search d-flex flex-column justify-content-center'fr>
            >
            <'point table-responsive't>
            <'row reset'
              <'col-lg-5 col-md-12 col-12 d-flex flex-column justify-content-center align-items-cente align-items-lg-start align-items-md-center'i>
              <'col-lg-7 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-start align-items-md-center'p>
            >
          `,
          columns: [
            { data: 'codeProduct' },
            { data: 'name' },
            { data: 'quantity' },
            { data: 'measureQuantity',
              title: this._translate.instant('PRODUCTS.UD'),
              render: (data, type, row) => {
                  if (data == null || data == 0) {
                      return '<span class="text center" aria-hidden="true"> No disponible</span>';
                  } else {
                      return (
                          '<span data-toggle="tooltip" data-placement="top" title="' +
                          '">' +
                          data +
                          '</span>'
                      );
                  }
              },
            },
            { data: 'price',
              title: this._translate.instant('PRODUCTS.PRICE'),
              render: (data, type, row) => {
                return (
                    '<span>' + data + '€</span>'
                );
              }
            },
          ],
          buttons: [
            {
                extend: 'colvis',
                text: this._translate.instant('GENERAL.SHOW/HIDE'),
                columnText: function(dt, idx, title) {
                    return idx + 1 + ': ' + title;
                },
            },
          ],
        });
        $('easyroute-detail').find('#details_filter').html(`
          <div class="row p-0 justify-content-sm-end justify-content-center">
              <div class="input-group input-search" style="width: initial !important;">
                  <input id="search-modal" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
                  <span class="input-group-append">
                      <span class="input-group-text table-append">
                          <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                      </span>
                  </span>
              </div>
          </div>
        `);

        $('#search-modal').on( 'keyup', function () {
            $(table).DataTable().search( this.value ).draw();
        } );
        
        $('.dataTables_filter').removeAttr("class");
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  validaciones( description : any ) {

    this.detailForm = this.fb.group({
      dniDeliveryNote:[description.dniDeliveryNote],
      nameDeliveryNote:[description.nameDeliveryNote],
      deliveredBoxes:[description.deliveredBoxes],
      devolutionDeliveryNote: [description.devolutionDeliveryNote],
      extraBoxes:[description.extraBoxes],
      observation:[description.observation]
    });

  }

}

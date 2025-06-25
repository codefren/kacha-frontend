import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
import { environment } from '@optimroute/env/environment';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $;

@Component({
  selector: 'easyroute-modal-warning',
  templateUrl: './modal-warning.component.html',
  styleUrls: ['./modal-warning.component.scss']
})
export class ModalWarningComponent implements OnInit {
  data: any;
  table: any;
  movements: any = [];
  detailRouteForm: FormGroup;
  
  constructor(
    public dialogRef: NgbActiveModal,
    private stateRoutePlanningService: StateRoutePlanningService,
    private _translate: TranslateService,
    private fb: FormBuilder, 
  ) { }

  ngOnInit() {
    this.validaciones(this.data);

    this.stateRoutePlanningService.getDeliveryPointDetail(this.data.id)
      .subscribe((data) => {
        if (this.table) {
          this.table.clear();
        } 

        this.movements = data[0].route_planning_route_delivery_movement;
        let table = '#movements';
        this.table = $(table).DataTable({
          destroy: true,
          language: environment.DataTableEspaniol,
          data: this.movements,
          order: [3, 'asc'],
          stateSaveParams: function (settings, data) {
            data.search.search = "";
          },
          lengthMenu: [50, 100],
          dom: `
            <'row p-2'<'col-sm-6 col-12 d-flex flex-column justify-content-center select-personalize-datatable'l>
              <'col-sm-6 col-12 label-search d-flex flex-column justify-content-center'fr>
            >
            <'table-responsive't>
            <'row reset'
              <'col-lg-5 col-md-12 col-12 d-flex flex-column justify-content-center align-items-cente align-items-lg-start align-items-md-center'i>
              <'col-lg-7 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-start align-items-md-center'p>
            >
          `,
          columns: [
            { data: 'status_route_delivery_point.name' },
            {
              data: 'unavaible_client',
              render: (data, type, row)=>{
                return data && data.name ? data.name : '';
              }
            },
            {
              data: 'observationUnavailableClient',
              render: (data, type, row) => {
                return data && data ? data : '';
              }
            },
            {
              data: 'creationDate',
              render: (data, type, row) => {
                return data && data ? moment(data).format('DD-MM-YYYY HH:mm:ss') : '';
              }
            }
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
        $('easyroute-modal-warning').find('.label-search').html(`
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

    this.detailRouteForm = this.fb.group({
      name:[description.name],
      statuId:[description.status_route_delivery_point.name],
      address:[description.address]
    });
    
  }

}

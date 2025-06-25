import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $:any;
@Component({
  selector: 'easyroute-modal-general-warning',
  templateUrl: './modal-general-warning.component.html',
  styleUrls: ['./modal-general-warning.component.scss']
})
export class ModalGeneralWarningComponent implements OnInit {

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
        this.movements = data[0].route_planning_route_delivery_movement;
        let table = '#movementss';
        this.table = $(table).DataTable({
          destroy: true,
          language: environment.DataTableEspaniol,
          data: this.movements,
          stateSaveParams: function (settings, data) {
            data.search.search = "";
          },
          order: [3, 'asc'],
          lengthMenu: [50, 100],
          dom: `
              <'row p-0'
                  <'col-lg-8 col-12 d-flex flex-column justify-content-center align-items-center align-items-lg-start select-personalize-datatable'>
                  <'col-lg-4 col-12 label-search'fr>
              >
              <"top-button-hide"><'point no-scroll-x table-responsive't>
              <'row reset'
               
                <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center  align-items-md-center'p>
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
        $('.dataTables_filter').html(`
        <div class="form-group row pl-0 pr-0 justify-content-center"> 

              <div class="col-md-12 col-12 p-0">

                  <div class="d-flex flex-lg-row flex-column justify-content-center align-items-center align-items-lg-start">
                      
                    <div class="input-group  mr-xl-3 mr-3" style="width: 100% !important;">
  
                        <input id="search-modal" type="text" class="form-control search-general
                                pull-right input-personalize-datatable-travel input-travel-search" placeholder="Buscar" style="max-width: 100%; font-size: 15px !important;">
                        <span class="input-group-append input-group-appenda">
                            <span class="input-group-text input-group-text-general-travel table-append">
                                <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                            </span>
                        </span>
                    </div>

                  </div>
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

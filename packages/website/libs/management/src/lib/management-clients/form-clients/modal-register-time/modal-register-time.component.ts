import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import * as moment from 'moment';
declare var $:any;

@Component({
  selector: 'easyroute-modal-register-time',
  templateUrl: './modal-register-time.component.html',
  styleUrls: ['./modal-register-time.component.scss']
})
export class ModalRegisterTimeComponent implements OnInit {

  pointId: string;
  tableDeliveryPointMove: any;
  constructor(
    public activeModal: NgbActiveModal,
    public authLocal: AuthLocalService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.cargarDeliveryPointMovement()
  }

  close() {
    this.activeModal.close(false);
  }

  cargarDeliveryPointMovement() {

    let url =
      environment.apiUrl +
      'delivery_point_analysis_datatables/' +
      this.pointId;

    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#registerTime';

    this.tableDeliveryPointMove = $(table).DataTable({
      destroy: true,
      serverSide: true,
      processing: true,
      stateSave: true,
      cache: false,
      lengthMenu: [10],
      order: [0, 'desc'],
      stateSaveParams: function (settings, data) {
        data.search.search = '';
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
          columnText: function (dt, idx, title) {
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
          data: 'signatureTime',
          title: this.translate.instant('GENERAL.DATE'),
          render: (data, type, row) => {
            let name = data;

            return (
              '<span data-toggle="tooltip" data-placement="top" title="' +
              moment(data).format('DD/MM/YYYY') +
              '">' +
              moment(data).format('DD/MM/YYYY') +
              '</span>'
            );
          },
        },
        {
          data: 'signatureTime',
          sorteable: false,
          title: this.translate.instant('GENERAL.TIME'),
          render: (data, type, row) => {
            if (data == null || data == 0) {
              return '<span class="text center" aria-hidden="true"> No disponible</span>';
            } else {

              let ms =  moment(data).diff(row.driverArrivalTime);
              var d = moment.duration(ms);
              var s = Math.floor(d.asHours()) + moment.utc(ms).format("HH:mm:ss");
              return s;
            }
          },
        },
      ],
    });
  }

}

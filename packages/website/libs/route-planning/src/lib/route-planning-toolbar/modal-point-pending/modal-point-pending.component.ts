import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { environment } from '@optimroute/env/environment';
import { secondsToAbsoluteTime, secondsToDayTimeAsString } from '@optimroute/shared';
declare var $;
@Component({
  selector: 'easyroute-modal-point-pending',
  templateUrl: './modal-point-pending.component.html',
  styleUrls: ['./modal-point-pending.component.scss']
})
export class ModalPointPendingComponent implements OnInit {

  table: any;
  notAssigned: any = [];
  option: string = '1';
  showOnly = false;
  constructor(private authLocal: AuthLocalService,
    public activateModal: NgbActiveModal,
    private _translate: TranslateService) { }

  ngOnInit() {
    console.log(this.notAssigned);
    this.cargar();
  }

  cargar() {
    console.log(this.notAssigned);
    let table = '#pendings';

    this.table = $(table).DataTable({
      data: this.notAssigned,
      stateSaveParams: function (settings, data) {
        data.search.search = "";
      },
      drawCallback: (settings, json) => {
        setTimeout(() => {
          $('#pendings').DataTable().columns.adjust();
        }, 1);
      },
      lengthMenu: [10, 50, 100],
      scrollY: '50vh',
      scrollCollapse: true,
      language: environment.DataTableEspaniol,
      dom: `
            <'row'
                <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                <'col-sm-4 col-lg-2 col-12 label-search'f>
            >
            <'row p-0 reset'
            <'offset-sm-6 offset-lg-6 offset-5'>
            <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
            <"top-button-hide"><'table-responsive't>
            <'row reset'
                <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
            >
        `,
      buttons: [
        {
          extend: 'colvis',
          text: this._translate.instant('GENERAL.SHOW/HIDE'),
          columnText: function (dt, idx, title) {
            return title;
          },
        },
      ],
      columns: [
        {
          data: 'name',
          title: 'Cliente'
        },
        {
          data: 'zone',
          title: 'Ruta de reparto'
        },
        {
          data: 'deliveryWindowStart',
          title: 'Hora desde',
          render: (data, type, row) => {
            return (
              secondsToDayTimeAsString(data)
            );
          },
        },
        {
          data: 'deliveryWindowEnd',
          title: 'Hora hasta',
          render: (data, type, row) => {
            return (
              secondsToDayTimeAsString(data)
            )
          }
        }
      ],
    });
    $('.dataTables_filter').html(`
        <div class="row p-0 justify-content-sm-end justify-content-center">
            <div class="input-group">
                <input id="search" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
                <span class="input-group-append">
                    <span class="input-group-text table-append">
                        <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                    </span>
                </span>
            </div>
        </div>
    `);
    $('#search').on('keyup', function () {
      $(table)
        .DataTable()
        .search(this.value)
        .draw();
    });

    $('.dataTables_filter').removeAttr('class');
  }

  submit() {
    this.activateModal.close({
      option: this.option
    });
  }
}

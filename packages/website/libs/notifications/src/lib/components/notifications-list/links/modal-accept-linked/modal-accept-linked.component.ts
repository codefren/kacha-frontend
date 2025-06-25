import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ClientInterface, User } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { LoadingService, ToastService } from '@optimroute/shared';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';

declare var $: any;

@Component({
  selector: 'easyroute-modal-accept-linked',
  templateUrl: './modal-accept-linked.component.html',
  styleUrls: ['./modal-accept-linked.component.scss']
})
export class ModalAcceptLinkedComponent implements OnInit {

  userId: number;

  user: User;

  cssStyle: string = 'btn btn-primary btn-block'

  linkSelect: number = 0;

  table: any;
  client: ClientInterface = new ClientInterface();


  constructor(
    public activeModal: NgbActiveModal,
    private _toastService: ToastService,
    private _translate : TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
    private stateEasyrouteService: StateEasyrouteService,
    private loadingService: LoadingService,
    private authLocal: AuthLocalService,

  ) { }

  ngOnInit() {

    this.load();
  }

  load(){
    console.log(this.client)
    this.stateEasyrouteService.getUser( this.userId ).subscribe( (resp: any) => {

      this.user = resp.data;

    },(error)=>{

      this.loadingService.hideLoading();
      this._toastService.displayHTTPErrorToast(error.status, error.error.error);

    });

  }

  changeAcceptLink(event: number) {

    this.linkSelect = 1;

    if (event == 1) {

      try {

        this.changeDetectorRef.detectChanges();

        this.cargar();

      } catch (error) {

      }

    }

    this.changeDetectorRef.detectChanges();

  }

  cargar() {
    let url = environment.apiUrl + 'delivery_point_datatables';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#clientsModal';
    this.table = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        lengthMenu: [4, 100],
        stateSaveParams: function (settings, data) {
          data.search.search = "";
        },
        initComplete: function (settings, data) {
          settings.oClasses.sScrollBody = "";
        },
        dom: `
          <'row p-0'
            <'col-lg-12 col-12 label-search pr-xl-2 pl-xl-2'fr>
          >
          <'row p-0 reset'
              <'offset-sm-6 offset-lg-6 offset-5'>
              <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
          >
          <"top-button-hide"><'point table-responsive't>
          <'row reset'
            <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
          >
        `,
        buttons: [
          {
            extend: 'colvis',
            text: 'Mostrar/ocultar',
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

                $('#clientsModal').html(html);

                $('#refrescar').click(() => {
                    this.cargar();
                });
            },
        },
        columns: [
          {
            data: 'id',
            sortable: false,
            searchable: false,
            render: (data, type, row) => {
                let botones = '';

                botones +=
                `
                <div class="row reset justify-content-center">
                  <div class="round round-little text-center">
                    <input class="editar" type="radio" name="checkAddMeasure" id="${ data }"/>
                    <label style="top: 15px;" for="${ row.id }"></label>
                  </div>
                </div>
                `;
                return botones;
            },
          },
          {
            data: 'id',
            sortable: false,
            title: this._translate.instant('TRAVEL_TRACKING.CODE'),
            render: (data, type, row) => {
              let id = data;
              if (id.length > 30) {
                id = id.substr(0, 29) + '...';
              }
              return (
                '<span data-toggle="tooltip" data-placement="top" title="' +
                data +
                '">' +
                id +
                '</span>'
              );
            },
            className: 'text-left',
          },
          {
            data: 'name',
            sortable: false,
            className: 'text-left',
            title: this._translate.instant('GENERAL.NAME'),
            render: (data, type, row) => {
              let id = data;
              if (id.length > 20) {
                id = id.substr(0, 20) + '...';
              }
              return (
                '<span data-toggle="tooltip" data-placement="top" title="' +
                data +
                '">' +
                id +
                '</span>'
              );
            },
          },
          {
            data: 'address',
            sortable: false,
            className: 'text-left',
            title: this._translate.instant('TRAVEL_TRACKING.ADDRESS'),
            render: (data, type, row) => {
              let id = data;
              if (id.length > 20) {
                id = id.substr(0, 20) + '...';
              }
              return (
                '<span data-toggle="tooltip" data-placement="top" title="' +
                data +
                '">' +
                id +
                '</span>'
              );
            },
          },
        ]
    });

    $('.dataTables_filter').html(`
          <div class="input-group  mr-xl-3 mr-3 mt-2 mb-2">
          <input id="search" type="text" class="form-control search-general
                  pull-right input-personalize-datatable-travel input-travel-search" placeholder="Buscar" style="max-width: 100%; font-size: 15px !important;">
          <span class="input-group-append input-group-appenda">
              <span class="input-group-text input-group-text-general-travel table-append">
                  <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
              </span>
          </span>
      </div>
    `);


    $('#search').on( 'keyup', function () {
        $(table).DataTable().search( this.value ).draw();
    } );

    $('.dataTables_filter').removeAttr("class");

    setTimeout(() => {
        $('#clientsModal').DataTable().columns.adjust().draw();
    }, 1)

    this.editar('#clientsModal tbody', this.table);
  }

  editar(tbody: any, table: any, that = this) {
    $(tbody).on('click', '.editar', function() {
        let data = table.row($(this).parents('tr')).data();
        that.client = data;

        console.log(that.client)
    });
  }

  ngOnDestroy() {

    if (this.linkSelect == 1) {

      this.table.destroy();

    }

  }

  sendData(linkType?: any, deliveryPointId?: any ) {

    let data = {
        'linkType': linkType,
        'deliveryPointId': deliveryPointId
      };

    this.activeModal.close(data);
    /* switch (linkType) {
      case '1':

        data = {
          'linkType': linkType,
          'deliveryPointId': deliveryPointId
        }

        this.activeModal.close(data);

        break;

      case '2':

        data = {
          'linkType': linkType,
          'deliveryPointId': deliveryPointId
        }

        this.activeModal.close(data);

        break;

    } */

  }

}

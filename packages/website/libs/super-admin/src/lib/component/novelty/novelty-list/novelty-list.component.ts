import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../../apps/easyroute/src/environments/environment';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
declare var $: any;
import * as _ from 'lodash';
import * as moment from 'moment-timezone';

@Component({
  selector: 'easyroute-novelty-list',
  templateUrl: './novelty-list.component.html',
  styleUrls: ['./novelty-list.component.scss']
})
export class NoveltyListComponent implements OnInit {

  change: string = 'novelty';
  table: any;
  me: boolean;

  constructor(
    private _router: Router,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    
  ) { }

    ngOnInit() {
    this.Cargar();
    }

    Cargar() {    
        let url = environment.apiUrl + 'novelty_datatables';
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#novelty';
    
        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            lengthMenu: [30, 50, 100],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            order: [[ 0, "desc" ]],
            dom: `
                <'row'
                    <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                    <'col-sm-4 col-lg-2 col-12 label-search'f>
                >
                <'row p-0 reset'
                    <'offset-sm-6 offset-lg-6 offset-5'>
                    <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
                >
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
                  columnText: function(dt, idx, title) {
                      return title;
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
                    let html = '<div class="container" style="padding: 30px;">';
                    html +=
                        '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                    html +=
                        '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                    html += '</div>';
    
                    $('#companies_processing').html(html);
    
                    $('#refrescar').click(() => {
                        this.Cargar();
                    });
                },
            },
            columns: [
                {
                    data: 'id',
                    visible: false
                },
                { 
                 data: 'title',
                 title: this._translate.instant('WHATS_NEW.TITLE'),
                },
                {
                    data: 'descripcion',
                    title: this._translate.instant('WHATS_NEW.DESCRIPTION'),
                    render: (data, type, row) => {
                      let name = data;
                      if (name.length > 65) {
                          name = name.substr(0, 67) + '...';
                      }
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
                    data: 'url',
                    title: this._translate.instant('WHATS_NEW.URL'),
                    render: (data, type, row) => {
                        let name = data;
                        if (name.length > 50) {
                            name = name.substr(0, 49) + '...';
                        }
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
                    data: 'created_at',
                    title: this._translate.instant('WHATS_NEW.CREATION_DATE'),
                    render: (data, type, row) => {
                      return moment(new Date(data)).format('DD/MM/YYYY');
                  },
                },
               
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.ACTIONS'),
                    render: (data, type, row) => {
                        return `<span class="noveltyEditar point"> <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg"></i></span>`;
                    },
                },
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
            $(table).DataTable().search(this.value).draw();
        });
    
        $('.dataTables_filter').removeAttr('class');
    
        this.noveltyEditar('#novelty tbody', this.table);
   
    }
    isSalesman() {
      return this.authLocal.getRoles()
          ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
          : false;
    }
    
    noveltyEditar(tbody: any, table: any, that = this) {
      $(tbody).unbind();
    
      $(tbody).on('click', 'span.noveltyEditar', function() {
          let data = table.row($(this).parents('tr')).data();
          that._router.navigate(['super-admin/novelty', data.id]);
      });
    }

  changePage(name: string){
     
    switch (name) {
        case 'company':
            this.change = name;
            this._router.navigate(['/super-admin/company']);
            break;

            case 'user':
                this.change = name;
                this._router.navigate(['/super-admin/user']);
            break;

            case 'novelty':
                this.change = name;
                this._router.navigate(['/super-admin/novelty']);
                break;
                
            case 'invoice':
                this.change = name;
                this._router.navigate(['/super-admin/invoice']);
                break;

                case 'start':
                    this.change = name;
                    this._router.navigate(['/super-admin/start']);
                  break;
    
        default:
            break;
    }
}

}

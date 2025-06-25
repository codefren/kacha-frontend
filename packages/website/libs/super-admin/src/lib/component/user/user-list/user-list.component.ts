import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { StateUsersFacade } from '../../../../../../state-users/src/lib/+state/state-users.facade';
import { StateUsersService } from '../../../../../../state-users/src/lib/state-users.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { ProfileSettingsFacade } from '../../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { StateCompaniesService } from '../../../../../../state-companies/src/lib/state-companies.service';
import { environment } from '../../../../../../../apps/easyroute/src/environments/environment';
import { ModalFiltersComponent } from '../modal-filters/modal-filters.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Profile } from '../../../../../../backend/src/lib/types/profile.type';
declare var $: any;

@Component({
  selector: 'easyroute-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
change: string = 'user';
filter: any = {
  showActive: '',
  profileId: '',
  companyPartnerId:''
};
@Input() me: boolean;
selected: any = [];

timeInterval: any;
table: any;
profile: Profile;
unsubscribe$ = new Subject<void>();
  constructor(
    private _router: Router,
    private dialog: NgbModal,
    private translate: TranslateService,
    private authLocal: AuthLocalService,
    private facade: StateUsersFacade,
    private _translate: TranslateService,
    private router: Router,
    private userService: StateUsersService,
    private toast: ToastService,
    private loading: LoadingService,
    private profileSettingFacade: ProfileSettingsFacade,
    private companyService: StateCompaniesService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.filter.showActive = true;
        
    this.profileSettingFacade.profile$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((profile) => {
            this.profile = profile;
        });
    this.cargar();
    this.editar('#users tbody', this.table);
    this.inactive('#users tbody', this.table);
    this.active('#users tbody', this.table);
    this.details('#users tbody', this.table);
  }
  cargar() {
        
    this.selected = [];
    let url: any = '';

    if ( this.table ) {
     //   this.table.clear();
    }
    
    url = this.me
    ? environment.apiUrl + 'users_datatables?me=true&showActive=' + 
                            this.filter.showActive +
                            '&profileId=' +
                            this.filter.profileId +
                            '&companyPartnerId=' +
                            this.filter.companyPartnerId
    : environment.apiUrl + 'users_datatables?showActive=' + 
                            this.filter.showActive +
                            '&profileId=' +
                            this.filter.profileId +
                            '&companyPartnerId=' +
                            this.filter.companyPartnerId ;

                            console.log('dasdsadasdasdds', url);
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

    let table = '#users';

    this.table = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        lengthMenu: [50, 100],
        order: [[ 0, "desc" ]],
        /* dom: `
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
        `, */
        dom: `
            <'row'
                <'col-sm-5 col-md-5 col-xl-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                <'col-sm-4 col-md-5 col-xl-3 col-12 label-search'f>
                <'col-sm-3 col-md-2 col-xl-1 col-12'
                <'row p-0 justify-content-sm-end justify-content-center'B>
                >
            >
            <'row p-0 reset'
            <'offset-sm-6 offset-lg-6 offset-5'>
            <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
            <"top-button-hide"><t>
            <'row reset'
                <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
            >
        `,
        headerCallback: (thead, data, start, end, display) => {
            $('.buttons-collection').html('<i class="far fa-edit"></i>' + ' ' + this._translate.instant('GENERAL.SHOW/HIDE'))
        }, 
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
                
                $('#search').prop( 'disabled', true );
                
                setTimeout(function() {
                    $(".dataTables_processing").hide();
                }, 10);

                this.toast.displayHTTPErrorToast(xhr.responseJSON.code, xhr.responseJSON.error);

                let html = '<div class="container" style="padding: 10px;">';
                html +=
                    '<span class="text-orange">Ha ocurrido un error al procesar la informacion.</span> ';
                html +=
                    '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                html += '</div>';

                $('#companies_processing').html(html);

                $('#refrescar').click(() => {
                    this.cargar();
                });

            },
        },
        rowCallback: (row, data) => {
            if ($.inArray(data.id, this.selected) !== -1) {
                $(row).addClass('selected');
            }
        },
        columns: [
           {
                data: 'id',
                visible: false
            },
            {
                data: 'company.name',
                title: this._translate.instant('GENERAL.COMPANY'),
                render: (data, type, row) => {
                    let name = data;
                    if (name.length > 30) {
                        name = name.substr(0, 29) + '...';
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
            { data: 'nationalId', title: this._translate.instant('USERS.NATIONALID') },
            { data: 'email', title: this._translate.instant('USERS.EMAIL') },
            { data: 'name', title: this._translate.instant('USERS.NAME_USER') },
            { data: 'surname', title: this._translate.instant('USERS.SURNAME_USER') },
            { data: 'phone', title: this._translate.instant('GENERAL.PHONE_NUMBER') },
            { data: 'isActive',
                title: this._translate.instant('GENERAL.SUBSCRIPTION'),
                render: (data, type, row) => {
                    if (data) {
                        return (
                            '<div class="text-center">' +
                                '<button class="btn btn-default inactive warning text-center green' +
                                    '" >' +
                                    this._translate.instant('GENERAL.ACTIVATE') +
                                '</button> ' +
                            '</div>'
                        );
                        /* return (`
                          <div class="row reset justify-content-center">
                            <div class="round-new ">
                              <input type="checkbox" class="isActive" id="row_${ row.id }" checked="true" ${disabled} />
                              <label for="row_${ row.id }"></label>
                            </div>
                          </div>
                        `); */

                    } else {
                        return (
                            '<div class="text-center">' +
                                '<button class="btn btn-default active warning text-center gray' +
                                    '">' +
                                    this._translate.instant('GENERAL.ACTIVATE') +
                                '</button> ' +
                            '</div>'
                        );
                        /* return (`
                          <div class="row reset justify-content-center">
                            <div class="round-new ">
                              <input type="checkbox" class="isActive" id="row_${ row.id }" ${disabled} />
                              <label for="row_${ row.id }"></label>
                            </div>
                          </div>
                      `); */
                    }
                   /*  let status =
                        +data === 1
                            ? '<span class="text-success">' +
                                this.translate.instant('GENERAL.IS_ACTIVE') +
                                '</span>'
                            : '<span>' +
                                this.translate.instant('GENERAL.IS_INACTIVE') +
                                '</span>';
                    if (this.me) {
                        let option =
                            +data === 1
                                ? this.translate.instant('GENERAL.DEACTIVATE')
                                : this.translate.instant('GENERAL.ACTIVATE');
                        return +data === 1
                            ? '<button type="button" style="border-radius: 3px" class="btn btn-block button-active-usergreen btn-sm inactive">' +
                                    option +
                                    '</button>'
                            : '<button type="button" style="border-radius: 3px"  class="btn btn-block button-no-active-user btn-sm pl-4 pr-4 active">' +
                                    option +
                                    '</button>';
                    } else {
                        console.log('ultimo else');
                        return '<span>' + status + '</span>';
                    } */
                },
            },
            {
                data: 'profile',
                sortable: false,
                searchable: false,
                title: this._translate.instant('USERS.ROLE'),
                render: (data, type, row) => {
                    let datos = this.returnProfileString(data);
                    let name = datos;
                    if (name.length > 30) {
                        name = name.substr(0, 29) + '...';
                    }
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        datos +
                        '">' +
                        name +
                        '</span>'
                    );
                },
            },
            {
                data: 'user_type.name',
                title: this._translate.instant('USERS.USER_TYPE'),
                render: (data, type, row) => {

                    if (data && data != null) {

                        let name = data;
                        if (name.length > 30) {
                            name = name.substr(0, 29) + '...';
                        }
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="'+ data +'">' +
                            name +
                            '</span>'
                        );
                    } else {
                        return '<span>No disponible</span>';
                    }
                },
            },
            {
                data: 'last_login_at',
                title: this._translate.instant('USERS.LAST_CONNECTION'),
                render: (data, type, row) => {
                    if (data === null) {
                        return 'N/A';
                    } else {
                        return moment(data)
                            .locale('es')
                            .fromNow();
                    }
                },
            },
            {
                data: 'last_login_ip',
                visible: false,
                sortable: false,
                searchable: false,
                title: this._translate.instant('USERS.LAST_CONNECTION_IP'),
                render: (data, type, row) => {
                    if (data === null) {
                        return 'N/A';
                    } else {
                        return data;
                    }
                },
            },
            {
                data: null,
                sortable: false,
                searchable: false,
                title: this._translate.instant('GENERAL.ACTIONS'),
                render: (data, type, row) => {
                    let botones = '';
                    
                    botones += `<div class="d-flex justify-content-center backgroundColorRow">`;
                    
                     botones += `
                        <div class="text-center editar col-6">
                        <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                        </div>
                    `; 

                    botones += `
                        <div class="text-center details col-6">
                        <i class="fas fa-eye fa-2x point" style="color: #24397c;"></i>
                        </div>
                        
                    `;
                    
                    botones += `</div>`;
                    return botones;
                    /* let botones = '';

                    botones += `
                    <div class="text-center details col">
                    <i class="fas fa-eye point icon-eye-preparation"></i>
            </div>
                        
                    `; */
                    

                    return botones;
                },
            },
        ],
    });

    $('.dataTables_filter').html(`
        <div class="row p-0 justify-content-sm-end justify-content-center">
            <div class="input-group datatables-input-group-width mr-xl-2">
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

    $('.dataTables_filter').removeAttr("class");

    this.initEvents('#users tbody', this.table);

}

initEvents(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    window.clearInterval(this.timeInterval);
    this.editar(tbody, table);
    this.details(tbody, table);
    this.inactive(tbody, table);
    this.active(tbody, table);
   
}


editar(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    $(tbody).on('click', 'div.editar', function() {
        let data = table.row($(this).parents('tr')).data();
        that.editElement(data.id, data.id, data);
    });
}
details(tbody: any, table: any, that = this){
    $(tbody).on('click', 'div.details', function() {
        let data = table.row($(this).parents('tr')).data();
        console.log('driverts');
        that.detailElement(data.id, data.id, data);
        //that.editElement(data);
    });
   /*  $(tbody).unbind();
    $(tbody).on('click', 'div.driver', function() {
        let data = table.row($(this).parents('tr')).data();
        console.log('mando');
        that.detailElement(data.id, data.id, data);
    }); */
}
returnProfileString(profiles: any): string {
  let profile = [];
  profiles.forEach((element) => {
      profile.push(element.name);
  });
  return profile
      .map((element) => {
          return element;
      })
      .join(', ');
}
inactive(tbody: any, table: any, that = this) {
    $(tbody).on('click', '.inactive', function() {
        let data = table.row($(this).parents('tr')).data();

       // that.inactiveUser(data, null, data.profile);
    });
}

active(tbody: any, table: any, that = this) {
    // $(tbody).unbind();
    $(tbody).on('click', '.active', function() {
        let data = table.row($(this).parents('tr')).data();

        //that.activeUser(data, 0, data.profile);
    });
}

filterOpen(){
    const modal = this.dialog.open(ModalFiltersComponent, {
        size: 'xl',
        backdrop: 'static',
        windowClass: 'modal-left'
    });
    
    console.log('filter', this.filter)
    modal.componentInstance.filter = this.filter;

    modal.result.then(
        (data) => {
            if (data) {

                console.log('data', data)
                this.filter.showAll = data.showAll;
                this.filter.profileId = data.profileId;

                this.cargar();
            }
        },
        (reason) => {},
    );
}

detailElement(id: number, i: number, editUser: any): void {
    if (this.me) {
        this.router.navigate([`/super-admin/users/detail/${id}`]);
    } else {
        this.router.navigate([`/super-admin/users/detail/${id}`]);
    }
}
editElement(id: number, i: number, editUser: any): void {
  if (this.me) {
      this.router.navigate([`/super-admin/user/${id}`]);
  } else {
      this.router.navigate([`/super-admin/user/${id}`]);
  }
}
isValidateRol() {
    return this.authLocal.getRoles()
        ? this.authLocal
                .getRoles()
                .find((role) => role === 10 || role === 9 || role === 7) !== undefined
        : false;
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

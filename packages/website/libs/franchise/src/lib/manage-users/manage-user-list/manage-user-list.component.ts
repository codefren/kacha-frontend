import { Component, OnInit, Input, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User, Profile } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
//import { UserCreationDialogComponent } from './user-creation-dialog/user-creation-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { StateUsersFacade } from '@optimroute/state-users';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getDateMomentHours, ToastService, LoadingService } from '@optimroute/shared';
import { Router } from '@angular/router';
//import { UsersConfirmDialogComponent } from '../../../users-confirm-dialog/users-confirm-dialog.component';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { take, takeUntil } from 'rxjs/operators';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StateCompaniesService } from '@optimroute/state-companies';
import { UsersConfirmDialogComponent } from './users-confirm-dialog/users-confirm-dialog.component';
import { ModalFiltersComponent } from '../../modal-filters/modal-filters.component';

declare var $: any;

@Component({
  selector: 'easyroute-manage-user-list',
  templateUrl: './manage-user-list.component.html',
  styleUrls: ['./manage-user-list.component.scss']
})
export class ManageUserListComponent implements OnInit {

  @Input() me: boolean;

  countries: string[] = [];
  filteredCountries: Observable<string[]>;
  @Output() addUser = new EventEmitter<User>();

  @Output() editUser = new EventEmitter<[number, Partial<User>]>();

  @Output() deleteUser = new EventEmitter<string>();

  table: any;
  profile: Profile;
  unsubscribe$ = new Subject<void>();

  /* filter: any = {
      showAll: false,
      showActive: true,
      option: 1,
  }; */

  filter: any = {
      showActive: '',
      profileId: '',
      idCompany:''
  };

  selected: any = [];

  constructor( 
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
    private changeDetectorRef: ChangeDetectorRef) { }

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
      
  }

  ngOnDestroy() {
      console.log(this.table);
      this.table.destroy();
  }

  newAddition(): void {
      this.router.navigate(['/users-management/users/new']);
  }

  inactiveUser(user: User, i?: number, profiles: any = []) {
      let profileAccept =
          profiles &&
          profiles.length > 1 &&
          profiles.find((x) => +x.profileId === 6) === undefined
              ? true
              : profiles.length > 1 && profiles.find((x) => +x.profileId === 6)
              ? true
              : profiles.length === 1 && profiles.find((x) => +x.profileId !== 6)
              ? true
              : false;

      let title = 'USERS.DEACTIVATE_USER_QUESTION';
      let info = 'USERS.DEACTIVATE_USER_INFO';
      let buttonAccept = 'GENERAL.DEACTIVATE';

      if (
          this.profile &&
          this.profile.company &&
          this.profile.company.subscriptions &&
          this.profile.company.subscriptions.length > 0 &&
          profileAccept
      ) {
          this.loading.showLoading();
          this.companyService
              .costPlan()
              .pipe(take(1))
              .subscribe(
                  (data) => {
                      this.loading.hideLoading();
                      const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                          backdropClass: 'customBackdrop',
                          centered: true,
                          backdrop: 'static',
                      });
                      dialogRef.componentInstance.title = title;
                      dialogRef.componentInstance.user = user;
                      dialogRef.componentInstance.info = info;
                      dialogRef.componentInstance.buttonAccept = buttonAccept;
                      dialogRef.result
                          .then((resp) => {
                              if (resp) {
                                  this.loading.showLoading();
                                  this.userService
                                      .deactivate(user.id)
                                      .pipe(take(1))
                                      .subscribe(
                                          () => {
                                              this.loading.hideLoading();
                                              this.table.ajax.reload();
                                          },
                                          (error) => {
                                              this.loading.hideLoading();
                                              this.toast.displayHTTPErrorToast(
                                                  error.status,
                                                  error.error.error,
                                              );
                                          },
                                      );
                              }
                          })
                          .catch((error) => console.log(error));
                  },
                  (error) => {
                      this.loading.hideLoading();
                      this.toast.displayHTTPErrorToast(error.status, error.error.error);
                  },
              );
      } else {
          const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
              backdropClass: 'customBackdrop',
              centered: true,
              backdrop: 'static',
          });
          dialogRef.componentInstance.title = title;
          dialogRef.componentInstance.user = user;
          dialogRef.componentInstance.info = info;
          dialogRef.componentInstance.buttonAccept = buttonAccept;
          dialogRef.result
              .then((resp) => {
                  if (resp) {
                      this.loading.showLoading();
                      this.userService
                          .deactivate(user.id)
                          .pipe(take(1))
                          .subscribe(
                              () => {
                                  this.loading.hideLoading();
                                  this.table.ajax.reload();
                              },
                              (error) => {
                                  this.loading.hideLoading();
                                  this.toast.displayHTTPErrorToast(
                                      error.status,
                                      error.error.error,
                                  );
                              },
                          );
                  }
              })
              .catch((error) => console.log(error));
      }
  }

  activeUser(user: User, i?: number, profiles: any = []) {
      let profileAccept =
          profiles &&
          profiles.length > 1 &&
          profiles.find((x) => +x.profileId === 6) === undefined
              ? true
              : profiles.length > 1 && profiles.find((x) => +x.profileId === 6)
              ? true
              : profiles.length === 1 && profiles.find((x) => +x.profileId !== 6)
              ? true
              : false;

      let title = 'USERS.ACTIVATE_USER_QUESTION';
      let info = 'USERS.ACTIVATE_USER_INFO';
      let buttonAccept = 'GENERAL.ACTIVATE';

      if (
          this.profile &&
          this.profile.company &&
          this.profile.company.subscriptions &&
          this.profile.company.subscriptions.length > 0 &&
          profileAccept
      ) {
          this.loading.showLoading();
          this.companyService
              .costPlan()
              .pipe(take(1))
              .subscribe(
                  (data) => {
                      this.loading.hideLoading();
                      const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                          backdropClass: 'customBackdrop',
                          centered: true,
                          backdrop: 'static',
                      });
                      dialogRef.componentInstance.title = title;
                      dialogRef.componentInstance.user = user;
                      dialogRef.componentInstance.info = info;
                      dialogRef.componentInstance.buttonAccept = buttonAccept;
                      dialogRef.result
                          .then((resp) => {
                              if (resp) {
                                  this.loading.showLoading();
                                  this.userService
                                      .activate(user.id)
                                      .pipe(take(1))
                                      .subscribe(
                                          () => {
                                              this.loading.hideLoading();
                                              this.table.ajax.reload();
                                          },
                                          (error) => {
                                              this.loading.hideLoading();
                                              this.toast.displayHTTPErrorToast(
                                                  error.status,
                                                  error.error.error,
                                              );
                                          },
                                      );
                              }
                          })
                          .catch((error) => console.log(error));
                  },
                  (error) => {
                      this.loading.hideLoading();
                      this.toast.displayHTTPErrorToast(error.status, error.error.error);
                  },
              );
      } else {
          const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
              backdropClass: 'customBackdrop',
              centered: true,
              backdrop: 'static',
          });
          dialogRef.componentInstance.title = title;
          dialogRef.componentInstance.user = user;
          dialogRef.componentInstance.info = info;
          dialogRef.componentInstance.buttonAccept = buttonAccept;
          dialogRef.result
              .then((resp) => {
                  if (resp) {
                      this.loading.showLoading();
                      this.userService
                          .activate(user.id)
                          .pipe(take(1))
                          .subscribe(
                              () => {
                                  this.loading.hideLoading();
                                  this.table.ajax.reload();
                              },
                              (error) => {
                                  this.loading.hideLoading();
                                  this.toast.displayHTTPErrorToast(
                                      error.status,
                                      error.error.error,
                                  );
                              },
                          );
                  }
              })
              .catch((error) => console.log(error));
      }
  }

  editElement(id: number, i: number, editUser: any): void {
      if (this.me) {
          this.router.navigate([`/management/users/${id}/me/true`]);
      } else {
          this.router.navigate([`franchise/manage-users/${id}`]);
      }
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

  cargar() {

     
    this.selected = [];
    let url: any = '';

    if ( this.table ) {
        this.table.clear();
    }
    
    url = 
     environment.apiUrl + 'manage_user_datatables?showActive=' + 
                            this.filter.showActive +
                            '&profileId=' +
                            this.filter.profileId + 
                            '&idCompany=' +
                            this.filter.idCompany ;

      
     // let url = environment.apiUrl + 'manage_user_datatables';

      let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

      let table = '#manage_users';

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
          headerCallback: ( thead, data, start, end, display ) => {               
              $('.buttons-collection').html('<i class="far fa-edit"></i>'+ ' ' + this._translate.instant('GENERAL.SHOW/HIDE')) 
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
             /*  {
                  data: 'id',
                  orderable: false,
                  render: function(data, type, row) {
                      return '';
                  },
              }, */
              {
                  data: 'company.name',
                  title: this._translate.instant('GENERAL.STORE'),
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
                      let status =
                          +data === 1
                              ? '<span class="text-success">' +
                                  this.translate.instant('GENERAL.IS_ACTIVE') +
                                  '</span>'
                              : '<span>' +
                                  this.translate.instant('GENERAL.IS_INACTIVE') +
                                  '</span>';
                      if (!this.me) {
                          let option =
                              +data === 1
                                  ? this.translate.instant('GENERAL.ACTIVATE')
                                  : this.translate.instant('GENERAL.ACTIVATE');
                          return +data === 1
                              ? '<button type="button" style="border-radius: 3px" class="btn btn-block green btn-sm inactive">' +
                                      option +
                                      '</button>'
                              : '<button type="button" style="border-radius: 3px"  class="btn btn-block button-no-active-user btn-sm pl-4 pr-4 active">' +
                                      option +
                                      '</button>';
                      } else {
                          return '<span>' + status + '</span>';
                      }
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

                      botones += `
                          <div class="text-center editar">
                              <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                          </div>
                      `;

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

      $('#search').on( 'keyup', function () {
          $(table).DataTable().search( this.value ).draw();
      });
      
      $('.dataTables_filter').removeAttr("class");

      this.editar('#manage_users tbody', this.table);
      this.inactive('#manage_users tbody', this.table);
      this.active('#manage_users tbody', this.table);
  }

  editar(tbody: any, table: any, that = this) {
      $(tbody).unbind();
      $(tbody).on('click', 'div.editar', function() {
          let data = table.row($(this).parents('tr')).data();
          that.editElement(data.id, data.id, data);
      });
  }

  inactive(tbody: any, table: any, that = this) {
      $(tbody).on('click', 'button.inactive', function() {
          let data = table.row($(this).parents('tr')).data();

          that.inactiveUser(data, null, data.profile);
      });
  }

  active(tbody: any, table: any, that = this) {
      // $(tbody).unbind();
      $(tbody).on('click', 'button.active', function() {
          let data = table.row($(this).parents('tr')).data();

          that.activeUser(data, 0, data.profile);
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
                this.filter.idCompany = data.idCompany;

                this.cargar();
            }
        },
        (reason) => {},
    );
}


  isValidateRol() {
      console.log(this.authLocal
        .getRoles()
        .find((role) => role === 1 || role === 2) !== undefined);
      return this.authLocal.getRoles()
          ? this.authLocal
                  .getRoles()
                  .find((role) => role === 1 || role === 2) !== undefined
          : false;
  }

}

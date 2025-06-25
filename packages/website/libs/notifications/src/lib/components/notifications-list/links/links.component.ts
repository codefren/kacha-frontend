import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, Profile } from '@optimroute/backend';
import { ConfirmModalComponent, LoadingService, ModalCheckCostComponent, orderPhoneNumber, ToastService } from '@optimroute/shared';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { WebSocketService } from '../../../notifications.websocket';
import * as moment from 'moment';
import { environment } from '@optimroute/env/environment';
import { ModalDeclineLinkedComponent } from './modal-decline-linked/modal-decline-linked.component';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { ModalAcceptLinkedComponent } from './modal-accept-linked/modal-accept-linked.component';

declare var $: any;


@Component({
  selector: 'easyroute-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {

  tableLink: any;

  me: boolean;

  modalOptions: NgbModalOptions;

  profile: Profile;

  companyParentId: number;

  selectAll: boolean = false;

  selected: any = [];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private facadeProfile: ProfileSettingsFacade,
    private backend: BackendService,
    private detectChange: ChangeDetectorRef,
    private ws: WebSocketService,
    private _modalService: NgbModal,
    private loading: LoadingService,
    private toast: ToastService,
    private stateEasyrouteService:StateEasyrouteService,
  ) { }

  ngOnInit() {

    this.ws.connect();

    this.ws.sync.pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
        if (data && data.companyId) {
            this.tableLink.ajax.reload();
        }
    })

    this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
        if (loaded) {
            this.facadeProfile.profile$.pipe(take(1)).subscribe((data) => {
                this.profile = data;
                this.companyParentId = this.profile.company.companyParentId;
                this.detectChange.detectChanges();
                this.cargar();
            })
        }
    });
  }

  cargar() {

    let columns = [
        {
            data: 'id',
            sortable: false,
            searchable: false,
            buttons: false,
            render: (data, type, row) => {
                return (`
                    <div class="row justify-content-start backgroundColorRow">
                      <div class="round-notificacions round-little-notifications text-center">
                        <input type="checkbox" class="isActive" id="ck-${data}"  />
                        <label></label>
                      </div>
                    </div>
                `);
            }
        },
        {
            data: 'userEmail',
            className: "clickable",
            render: (data, type, row) => {
                let varStyle = row.read === false ? 'color-date-notification' : '';

                if (data === null) {
                    return (
                        '<div class="row justify-content-start view"><span>' + this._translate.instant('GENERAL.NOT_AVAILABLE') + '</span></div>'
                    );
                } else {
                    return '<div class="row justify-content-start view"><span class="' + varStyle + '" title="' + data + '">' + data + '</span></div>';
                }


            }
        },
        {
          data: 'userName',
          className: "clickable",
          render: (data, type, row) => {
              let varStyle = row.read === false ? 'color-date-notification' : '';

              if (data === null) {
                  return (
                      '<div class="row justify-content-start view"><span>' + this._translate.instant('GENERAL.NOT_AVAILABLE') + '</span></div>'
                  );
              } else {
                  return '<div class="row justify-content-start view"><span class="' + varStyle + '" title="' + data + '">' + data + '</span></div>';
              }


          }
        },
        {
          data: 'userPhone',
          className: "clickable",
          render: (data, type, row) => {
              let varStyle = row.read === false ? 'color-date-notification' : '';

              if (data === null) {
                  return (
                      '<div class="row justify-content-start view"><span>' + this._translate.instant('GENERAL.NOT_AVAILABLE') + '</span></div>'
                  );
              } else {

                  return '<div class="row justify-content-start view"><span class="' + varStyle + '">' + orderPhoneNumber( data ) + '</span></div>';

              }
          }
        },
        {
          data: 'linked',
          visible: true,
          className: 'dt-body-center',
          render: (data, type, row) => {
            console.log(data)
              if(data == null){

                return (
                  '<div class="row justify-content-start view"><span> Vinculación rechazada </span></div>'
                );

              } else {

                if (data == true) {

                  return (
                    '<div class="row justify-content-start view"><span> Vinculación aceptada </span></div>'
                  );

                } else {

                   return `<div class="row row-notification-link">

                           <div class="col-xl-6 col-12 p-xl-0">

                             <buttom class="btn btn-outline-primary btn-notice btn-block decline">Rechazar</buttom>

                           </div>

                           <div class="col-xl-6 col-12 p-xl-0">

                             <buttom class="btn btn-primary btn-block btn-update warning accept mt-xl-0 mt-2">Aceptar</buttom>

                           </div>

                          </div>
                         `;
                }
              }

          },
        },
        {
            data: 'notificationDate',
            visible: true,
            className: "clickable",
            render: (data, type, row) => {

            let varStyle = row.read === false ? 'color-date-notification' : '';

              if(data)
              {
                  return('<div class="row justify-content-end view"><span class="' + varStyle + '">' + this.dateLast(data) + '</span></div>')
              }else {
                  return (
                      '<div class="row justify-content-end view"><span>'+ this._translate.instant('GENERAL.NOT_AVAILABLE') +'</span></div>'
                  );
              }


            },
        }
    ]

    let isSalesman = this.isSalesman() && this.me == false;

    let url = environment.apiUrl + 'company_notification_link_datatables';

    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

    let table = '#notificationsLink';

    this.tableLink = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        order: [0, 'desc'],
        lengthMenu: [30, 50, 100],
        dom: `
          <'row'
              <'col-xl-6 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                  <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2'>
              >
              <'col-xl-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                  <'row'
                      <'col-sm-6 col-md-6 col-xl-3 col-5 dt-buttons-table-otro pb-0 pt-0'B>
                  >
              >
          >
          <"top-button-hide"><'table-responsive't>
          <'row reset'
              <'col-lg-5 col-md-5 col-xl-5 col-12 pl-3 pr-3 d-flex flex-column justify-content-center align-items-cente'i>
              <'col-lg-7 col-md-7 col-xl-7 col-12 pl-3 pr-3 d-flex flex-column justify-content-center align-items-lg-end align-items-sm-center'
                  <'row reset align-items-center'
                      <'col-sm-6 col-md-6 col-xl-6 col-6'l>
                      <'col-sm-6 col-md-6 col-xl-6 col-6'p>
                  >
              >
          >
      `,
        language: environment.DataTableEspaniol,
        ajax: {
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: tok,
            },
            error: (xhr, error, thrown) => {

                $("#button").hide();
                let html = '<div class="container" style="padding: 30px;">';
                html +=
                    '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
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
            $(row).addClass('point');
        },
        columns: columns
    });
    $('#searchLink').on('keyup', function () {
        $(table)
            .DataTable()
            .search(this.value)
            .draw();
    });
    $('.dataTables_filter').removeAttr('class');

    $('.buttonDom').html(`
        <div class="row p-0 justify-content-sm-end justify-content-center">
            <div class="input-group">
                <div class="col-md-4 col-4 text-right mt-selected pr-1 pt-1">
                    <div class="round round-little p-0">
                        <input type="checkbox" class="checkboxExample1" id="checkboxExample1">
                        <label for="checkboxExample1" class="m-0"></label>
                    </div>
                </div>
                <div class="col-md-4 col-4 text-right p-0 pl-2">
                  <button class="btn btn-filter deleted" id="deleted" title="Borrar" disabled>
                    <img class="icons-notification" src="assets/icons/optimmanage/basura.svg">
                </button>
                </div>
                <div class="col-md-4 col-4 text-right">
                    <button class="btn btn-filter mark" id="mark" disabled title="Marcar como leido">
                      <img class="icons-notification" src="assets/icons/optimmanage/leido.svg">
                    </button>
                </div>
            </div>
        </div>
    `);

    $('.checkboxExample1').change((event) => {
        this.selectAll = event.target.checked;
        this.selectAllFunc();
        if (this.selected.length > 0) {
            $(".deleted").prop('disabled', false);
            $(".mark").prop('disabled', false);
        } else {
            $(".deleted").prop('disabled', true);
            $(".mark").prop('disabled', true);
        }
    });

    $('.deleted').click(() => {
        this.deleteNotifications();
    });

    $('.mark').click(() => {
        this.SendRead();
    });

    this.initEvents('#notificationsLink tbody', this.tableLink);
  }

  initEvents(tbody: any, table: any, that = this) {
    this.select(tbody, table);
    this.rowClick(tbody, table);
    this.decline(tbody, table);
    this.accept(tbody, table);
  }

  rowClick(tbody, table: any, that = this) {
      $(tbody).on('click', '.clickable', function () {
          var data = table.row($(this).parents('tr')).data();

          if (data.read === false) {
              that.updateToRead(data.id);
          }
      });
  }

  decline(tbody: any, table: any, that = this) {
    $(tbody).on('click', '.decline', function() {
        let data = table.row($(this).parents('tr')).data();
        that.openModalDecline(data.objectsId);
    });
  }

  openModalDecline(objectsId: any) {

    const modal = this._modalService.open(ModalDeclineLinkedComponent, {

      backdropClass: 'modal-backdrop-ticket',

      centered: true,

      windowClass:'modal-cost',

      size:'md',

      backdrop: 'static'

    });

    modal.componentInstance.cssStyle = 'btn btn-red-general';

    modal.result.then((result) => {

      if (result) {

        this.deleteClient(objectsId);

      }

    }, (reason) => {

      this.toast.displayHTTPErrorToast(reason.status, reason.error.error);

    });

  }

  deleteClient( clientId: number ){

    this.loading.showLoading();
    this.stateEasyrouteService.deleteLinked(clientId).subscribe( (data: any) => {
      this.loading.hideLoading();
      this.toast.displayWebsiteRelatedToast(
        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
        this._translate.instant('GENERAL.ACCEPT')
      );

      this.tableLink.ajax.reload();

      }, (error)=>{
        this.loading.hideLoading();
        this.toast.displayHTTPErrorToast(error.status, error.error.error);
      });
  }

  accept(tbody: any, table: any, that = this) {
    $(tbody).on('click', '.accept', function() {
        let data = table.row($(this).parents('tr')).data();
        that.openModalAccept(data);
    });
  }

  openModalAccept(dataSend: any) {

    const modal = this._modalService.open(ModalAcceptLinkedComponent, {

      backdropClass: 'modal-backdrop-ticket',

      centered: true,

      size: 'lg',

      windowClass: 'modal-link-notification',

      backdrop: 'static'

    });

    modal.componentInstance.userId = dataSend.objectsId;

    modal.result.then((result) => {

      console.log(result);

      if (result) {

        if (result.linkType = 1 && result.deliveryPointId > 0) {

          let data = {
            deliveryPointId: result.deliveryPointId
          }
          this.updateLicked(dataSend.id, dataSend.objectsId, data);

        }

        if (result.linkType = 2 && result.deliveryPointId == 0) {

            //this.Router.navigate([`/management/clients/new`]);

        }

      }

    }, (reason) => {

      this.toast.displayHTTPErrorToast(reason.status, reason.error.error);

    });

  }

  updateLicked(id:number, userId: number, data:any){

    this.loading.showLoading();

    console.log(data);

   this.stateEasyrouteService.updateLinked(userId, data).subscribe( (dataReturn: any) => {

      this.updateToRead(id);

      this.loading.hideLoading();
      this.toast.displayWebsiteRelatedToast(
        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
        this._translate.instant('GENERAL.ACCEPT')
      );

      this.tableLink.ajax.reload();
      this.detectChange.detectChanges();

    }, (error)=> {
        this.loading.hideLoading();
        this.toast.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  /* createDeliveryPonintLinked(clientId: number){

    this.loading.showLoading();

    this.stateEasyrouteService.createDeliveryPonintLinked(clientId).subscribe( (dataValue: any) => {

      this.loading.hideLoading();
      this.toast.displayWebsiteRelatedToast(
        this._translate.instant('CONFIGURATIONS.REGISTRATION'),
        this._translate.instant('GENERAL.ACCEPT')
      );

      }, (error)=>{
        this.loading.hideLoading();
        this.toast.displayHTTPErrorToast(error.status, error.error.error)
      });

  } */

  isSalesman() {
      return this.authLocal.getRoles()
          ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
          : false;
  }

  select(tbody: any, table: any, that = this) {
      $(tbody).on('click', '.backgroundColorRow', function () {
          that.selectAll = true;
          let data = table.row($(this).parents('tr')).data();
          that.selectAll = true;
          var index = that.selected.findIndex(x => x === data.id);

          if (index === -1) {

            that.selected.push(data.id);

            $('#ck-' + data.id).prop('checked', true);

            $(this).parent().parent().addClass('selected');

            if(that.tableLink.rows()[0].length == that.selected.length) {

                $('#checkboxExample1').prop('checked', that.selectAll).addClass('checked');

                $('#checkboxExample1').prop('checked', that.selectAll).addClass('checked');
            }

          } else {

              that.selectAll = false;

              that.selected.splice(index, 1);

              $('#ck-' + data.id).prop('checked', false);

              $(this).parent().parent().removeClass('selected');

              $('.checkboxExample1').prop('checked', that.selectAll).removeAttr('checked');

          }

          that.tableLink.rows()[0].forEach((element) => {

              $(".deleted").prop('disabled', that.selected.length > 0 ? false : true);
              $(".mark").prop('disabled', that.selected.length > 0 ? false : true);

              if (that.selected.find(x => +x.id === +  that.tableLink.row(element).data().id) === undefined) {
                  that.selectAll = false;
              }
          });

          that.detectChange.detectChanges();
      });
  }

  async updateToRead(id: number) {

      await this.loading.showLoading();
      await this.backend.put('company_notification/' + id).toPromise();

      this.tableLink.ajax.reload();
      this.loading.hideLoading();

  }

  deleteNotifications() {

      const modal = this._modalService.open(ModalCheckCostComponent, {
        backdropClass: 'modal-backdrop-ticket',

        centered: true,

        windowClass:'modal-cost',

        size:'md'
    });

    modal.componentInstance.title = this._translate.instant('GENERAL.DELETE');

    modal.componentInstance.message = this._translate.instant('PREFERENCES.NOTIFICATIONS.DELETE_MESSAGE');

    modal.componentInstance.accept =  this._translate.instant('GENERAL.YES_DELETE');

    modal.componentInstance.cssStyle = 'btn btn-red-general';


    modal.result.then(async (data) => {
        if (data) {

            await this.loading.showLoading();
            this.backend.post('company_notification_delete', {
                id: this.selected,
                companyId: this.profile.company.id
            }).pipe(take(1)).subscribe(() => {
                this.selected = [];
                $('.checkboxExample1').prop('checked', false).removeAttr('checked');
                this.selectAll = false;
                this.tableLink.ajax.reload();
                this.detectChange.detectChanges();
                this.loading.hideLoading();
            }, error => {
                this.loading.hideLoading();
                this.toast.displayHTTPErrorToast(error.status, error.error.error);
            });
        }

    })
  }

  async SendRead() {

      await this.loading.showLoading();
      this.backend.post('company_notification_mark_not_read', {
          id: this.selected,
          companyId: this.profile.company.id
      }).pipe(take(1)).subscribe(() => {
          this.selected = [];
          $('.checkboxExample1').prop('checked', false).removeAttr('checked');
          this.selectAll = false;
          this.tableLink.ajax.reload();
          this.detectChange.detectChanges();
          this.loading.hideLoading();
      }, error => {

          this.loading.hideLoading();
          this.toast.displayHTTPErrorToast(error.status, error.error.error);
      });
  }

  round(tbody: any, table: any, that = this) {
      $(tbody).on('change', '.round', function () {

          that.selectAllFunc();
      })
  }

  selectAllFunc() {
      this.tableLink.rows()[0].forEach((element) => {

          let data = this.tableLink.row(element).data();
          var index = this.selected.findIndex(x => x === data.id);

          if (this.selectAll) {

              var x = this.selected.filter(x => x == data.id);

              if (x.length == 0) {

                  this.selected.push(data.id);

                  $('#ck-' + data.id).prop('checked', true);

                  $(this.tableLink.row(element).node()).addClass('selected');
              }

          } else {

              $('#ck-' + data.id).prop('checked', false);

              $(this.tableLink.row(element).node()).removeClass('selected');

              this.selected.splice(index, 1);

              this.selected = [];

          }

          this.detectChange.detectChanges();
      });
  }


  refrestTable(){
    this.tableLink.ajax.reload();
    this.detectChange.detectChanges();
  }

  public dateLast(date: string) {

    moment.locale(this._translate.getDefaultLang());

    let dateNow = moment().format('DD/MM/YYYY');

    let currentDate  =  moment(date).format('DD/MM/YYYY');

    if (dateNow > currentDate) {

        return moment(date).format('DD MMM');

    } else {

       return moment(date).format('HH:mm');

    }

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.ws.sync.next({});
    this.ws.desconnect();
    this.tableLink.destroy();
  }

}

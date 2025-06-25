import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, Profile } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { ConfirmModalComponent, LoadingService, ModalCheckCostComponent, ToastService } from '@optimroute/shared';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { WebSocketService } from '../../../notifications.websocket';
import { Router } from '@angular/router';
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'easyroute-notices-details',
  templateUrl: './notices-details.component.html',
  styleUrls: ['./notices-details.component.scss']
})
export class NoticesDetailsComponent implements OnInit {

  tableNotificationsNotice: any;

  me: boolean;

  modalOptions: NgbModalOptions;

  profile: Profile;

  companyParentId: number;

  selectAll: boolean = false;

  selected: any = [];

  private unsubscribe$ = new Subject<void>();

  botones: boolean = false;

  notificationId: any;

  typeListPolpoo: any [] =[];

  showFilter : boolean = false;

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
    private Router: Router,
  ) { }

  ngOnInit() {
    
    this.ws.connect();

    this.ws.sync.pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
        if (data && data.companyId) {
           this.tableNotificationsNotice.ajax.reload();
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
            data: 'notification_type',
            className: "clickable",
            
            render: (data, type, row) => {
                let varStyle = row.read === false ? 'color-date-notification' : '';
               
                  if (data && data.length > 60) {

                      return '<div class="row justify-content-start view"><span class="' + varStyle + '">' + data.name.slice(0, 60) + '... ' + row.titleExpiration + ' </span></div>'

                  } else if (data === null) {
                      return (
                          '<div class="row justify-content-start view"><span>' + this._translate.instant('GENERAL.NOT_AVAILABLE') + '</span></div>'
                      );
                  } else {
                      return '<div class="row justify-content-start view"><span class="' + varStyle + '" title="' + data.name + '">' + data.name + ' ' + row.titleExpiration + '</span></div>';
                  }

            }
        },
        {
            data: 'description',
            className: "clickable",
    
            render: (data, type, row) => {
                
                let varStyle = row.read === false ? 'color-date-notification' : '';
                
                if( data && data.length > 100){

                  return '<div class="row justify-content-start view"><span class="' + varStyle + '" title="'+ data +'">' + data.slice(0,100) + '... </span></div>' 

                }else if(data === null) {

                  return  '<div class="row justify-content-start view"><span>'+ this._translate.instant('GENERAL.NOT_AVAILABLE') +'</span></div>';

                } else {

                  return '<div class="row justify-content-start view"><span class="' + varStyle + '" title="'+ data +'">' + data + '</span></div>' ;

                }

            }
        },
        {
            data: 'notificationDate',
            visible: true,
            className: "clickable",
            render: (data, type, row) => {

                /* moment(data).format('HH:mm') */
            let varStyle = row.read === false ? 'color-date-notification' : '';

              if(data)
              {
                  return('<div class="row justify-content-end view"><span class="' + varStyle + '">' + this.dateLast(data)+ '</span></div>')
              }else {
                  return (
                      '<div class="row justify-content-end view"><span>'+ this._translate.instant('GENERAL.NOT_AVAILABLE') +'</span></div>'
                  );
              }


            },
        },
    ]

    let isSalesman = this.isSalesman() && this.me == false;

    let url = environment.apiUrl + 'company_notification_notice_datatables';
  
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

    let table = '#notificationsNotice';

    this.tableNotificationsNotice = $(table).DataTable({
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
          <'row p-0 reset'
          <'offset-sm-6 offset-lg-6 offset-5'>
          <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
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
    $('#searchNotice').on('keyup', function () {
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

    this.initEvents('#notificationsNotice tbody', this.tableNotificationsNotice);
  }

  initEvents(tbody: any, table: any, that = this) {
      this.select(tbody, table);
      this.rowClick(tbody, table);
  }
  
  rowClick(tbody, table: any, that = this) {
      $(tbody).on('click', '.clickable', function () {
          var data = table.row($(this).parents('tr')).data();
  
          if (data.read === false) {
              that.updateToRead(data.id, data);
          } else {
              that.openDetailsNotifications(data.id, data);
          }
      });
  }

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

            if(that.tableNotificationsNotice.rows()[0].length == that.selected.length) {
  
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
  
          that.tableNotificationsNotice.rows()[0].forEach((element) => {
  
              $(".deleted").prop('disabled', that.selected.length > 0 ? false : true);
              $(".mark").prop('disabled', that.selected.length > 0 ? false : true);
  
              if (that.selected.find(x => +x.id === +  that.tableNotificationsNotice.row(element).data().id) === undefined) {
                  that.selectAll = false;
              }
          });
  
          that.detectChange.detectChanges();
      });
  }

  async updateToRead(id: number, data: any) {
  
      await this.loading.showLoading();
      await this.backend.put('company_notification/' + id).toPromise();
      this.openDetailsNotifications(id, data);
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
                this.tableNotificationsNotice.ajax.reload();
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
          this.tableNotificationsNotice.ajax.reload();
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
      this.tableNotificationsNotice.rows()[0].forEach((element) => {
  
          let data = this.tableNotificationsNotice.row(element).data();
          var index = this.selected.findIndex(x => x === data.id);
  
          if (this.selectAll) {
  
              var x = this.selected.filter(x => x == data.id);
  
              if (x.length == 0) {
  
                  this.selected.push(data.id);
  
                  $('#ck-' + data.id).prop('checked', true);
  
                  $(this.tableNotificationsNotice.row(element).node()).addClass('selected');
              }
  
          } else {
  
              $('#ck-' + data.id).prop('checked', false);
  
              $(this.tableNotificationsNotice.row(element).node()).removeClass('selected');
  
              this.selected.splice(index, 1);
  
              this.selected = [];
  
          }
  
          this.detectChange.detectChanges();
      });
  }
  
  openDetailsNotifications(id: number, data: any) {
  
    switch (data.redirect) {
      case 'maintenance':
        this.Router.navigate([`/management-logistics/vehicles/${data.objectsId}/maintenance`]);
        
        break;
      
      case 'carnets':

        this.Router.navigate([`/management/users/${data.objectsId}/me/true/carnets`]);

        break;
  
      default:
        this.Router.navigate(['notifications', id]);
        
        break;
    }
    
  }

  refrestTable(){
    this.tableNotificationsNotice.ajax.reload();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.ws.sync.next({});
    this.ws.desconnect();
    this.tableNotificationsNotice.destroy();
  }

  changeFilter(event: any){
  
      let value = event.target.value;
  
      let id = event.target.id;
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

}

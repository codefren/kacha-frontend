import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from '../../../../../backend/src/lib/types/profile.type';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { Router } from '@angular/router';
import { environment } from '@optimroute/env/environment';
import { take, takeUntil } from 'rxjs/operators';
import { WebSocketService } from '../../notifications.websocket'
import { ConfirmModalComponent, LoadingService } from '@optimroute/shared';
import * as moment from 'moment';

import { Subject } from 'rxjs';
import { BackendService } from '@optimroute/backend';
declare var $: any;

@Component({
    selector: 'easyroute-notifications-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnDestroy {

    selectTap: string = 'polpoo';

    change = {
    
        polpoo: 'polpoo',
        link: 'link',
        notices: 'notices',
        delete: 'delete',
        
    };

    table: any;

    me: boolean;

    modalOptions: NgbModalOptions;

    profile: Profile;

    companyParentId: number;

    selectAll: boolean = false;

    selected: any = [];

    private unsubscribe$ = new Subject<void>();

    botones: boolean = false;

    linksCount: number = 0;

    polpooNotificationsCount: number = 0

    noticesCount : number = 0;

    showCountNotification: boolean = false;

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

        this.showCountNotification = false;

        this.backend.get('quantity_pending_by_notifications').pipe(take(1)).subscribe((data) => {

            this.polpooNotificationsCount = data.unReadPolpooCount;

            this.linksCount = data.unReadLinkCount;

            this.noticesCount = data.unReadNoticeCount;

            this.showCountNotification = true;

            this.detectChange.detectChanges();
            

        })

        this.ws.sync.pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {

            
            if (data && data.companyId) {
                //this.table.ajax.reload();
                this.polpooNotificationsCount = data.unReadPolpooCount;

                this.linksCount = data.unReadLinkCount;
    
                this.noticesCount = data.unReadNoticeCount;

                try{

                    this.detectChange.detectChanges();

                }catch(e){

                }
            }
        })
        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {
                this.facadeProfile.profile$.pipe(take(1)).subscribe((data) => {
                    this.profile = data;
                    this.companyParentId = this.profile.company.companyParentId;
                    this.detectChange.detectChanges();
                    /* this.cargar(); */
                })
            }
        });
    }

    changePage(name: string) {
        
        this.selectTap = this.change[name];
    
        this.detectChange.detectChanges();
    }
    

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.ws.sync.next({});
        this.ws.desconnect();
       // this.table.destroy();
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

        let columns = [
            {
                data: 'id',
                sortable: false,
                searchable: false,
                buttons: false,
                render: (data, type, row) => {
                    return (`
                        <div class="row justify-content-center backgroundColorRow">
                          <div class="round round-little text-center">
                            <input type="checkbox" class="isActive" id="ck-${data}"  />
                            <label></label>
                          </div>
                        </div>
                    `);
                }
            },
            {
                data: 'notification_type',
                title: this._translate.instant('NOTIFICATIONS.NOTIFICATION_TYPE'),
                className: "clickable",
                render: (data, type, row) => {
                    let varStyle = row.read === false ? 'color-date-notification' : '';
                    
                    if (row.notificationTypeId === 5) {

                        return '<div class="row justify-content-center view"><span class="' + varStyle + '" title="' + data.name + '">¡' + data.name + '!</span></div>';

                    } else {
                        
                        if (data && data.length > 60) {

                            return '<div class="row justify-content-center view"><span class="' + varStyle + '">' + data.name.slice(0, 60) + '... ' + row.titleExpiration + ' </span></div>'

                        } else if (data === null) {
                            return (
                                '<div class="row justify-content-center view"><span>' + this._translate.instant('GENERAL.NOT_AVAILABLE') + '</span></div>'
                            );
                        } else {
                            return '<div class="row justify-content-center view"><span class="' + varStyle + '" title="' + data.name + '">' + data.name + ' ' + row.titleExpiration + '</span></div>';
                        }

                    }

                }
            },
            {
                data: 'description',
                title: this._translate.instant(
                    'NOTIFICATIONS.DESCRIPTION',
                ),
                className: "clickable",
                render: (data, type, row) => {
                    
                    let varStyle = row.read === false ? 'color-date-notification' : '';
                    
                    if (row.notificationTypeId === 5) {
    
                        return '<div class="row justify-content-center view"><span class="' + varStyle + '" title="' + row.notification_type.name + '">¡' + row.notification_type.name + '!&nbsp;</span> <span title="' + data + '">' + data + '</span></div>';
                    
                    } else {
    
                          if( data && data.length > 60){
    
                            return '<div class="row justify-content-center view"><span class="' + varStyle + '" title="'+ data +'">' + data.slice(0,60) + '... </span></div>' 
    
                          }else if(data === null) {
    
                            return  '<div class="row justify-content-center view"><span>'+ this._translate.instant('GENERAL.NOT_AVAILABLE') +'</span></div>';
    
                          } else {
    
                            return '<div class="row justify-content-center view"><span class="' + varStyle + '" title="'+ data +'">' + data + '</span></div>' ;
    
                          }
                    }
                    
                }
            },
            {
                data: 'notificationDate',
                title: this._translate.instant(
                    'NOTIFICATIONS.NOTIFICATION_DATE',
                ),
                visible: true,
                className: "clickable",
                render: (data, type, row) => {

                let varStyle = row.read === false ? 'color-date-notification' : '';

                  if(data)
                  {
                      return('<div class="row justify-content-center view"><span class="' + varStyle + '">' + moment(data).format('DD/MM/YYYY')+ '</span></div>')
                  }else {
                      return (
                          '<div class="row justify-content-center view"><span>'+ this._translate.instant('GENERAL.NOT_AVAILABLE') +'</span></div>'
                      );
                  }


                },
            },
            /*  {
                 data: 'deleted',
                 title: this._translate.instant(
                     'NOTIFICATIONS.DELETE',
                 ),
                 render: ( data, type, row ) => {
                   
                   if ( data ) {
                     return (`
                       <div class="justify-content-center row reset">
                         <span>Si</span>
                       </div>
                     `);
                   }
     
                   return (`
                     <div class="justify-content-center row reset">
                         <span> No</span>
                     </div> 
                   `);
                 }
               }, */
            {
                data: 'id',
                title: '',
                visible: true,
                className: "clickable",
                render: (data, type, row) => {
                    return (`
                        <div class="row justify-content-center view">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                      `);
                },
            }
        ]

        let isSalesman = this.isSalesman() && this.me == false;
        let url = environment.apiUrl + 'company_notification_datatables';
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#notifications';
        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            order: [0, 'desc'],
            //lengthMenu: [30, 50, 100],
            dom: `
                <'row'
                    <'col-sm-5 col-md-2 col-xl-1 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                    <'col-sm-3 col-md-7 col-xl-9 col-12'
                        <'row p-0 reset d-flex flex-column justify-content-start align-items-center align-items-sm-start pl-2'
                            <'buttonDom'>
                        >
                    >
                    <'col-sm-4 col-md-3 col-xl-2 col-12 label-search'f>
                >
                <'row p-0 reset'
                  <'offset-sm-6 offset-lg-6 offset-5'>
                  <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
                >
                <"top-button-hide"><t>
                <'row reset'
                    <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                    <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
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



        this.initEvents('#notifications tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        this.select(tbody, table);
        /* this.read(tbody, table); */
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


            } else {

                that.selectAll = false;

                that.selected.splice(index, 1);

                $('#ck-' + data.id).prop('checked', false);

                $(this).parent().parent().removeClass('selected');

                $('.checkboxExample1').prop('checked', that.selectAll).removeAttr('checked');

            }

            that.table.rows()[0].forEach((element) => {

                $(".deleted").prop('disabled', that.selected.length > 0 ? false : true);
                $(".mark").prop('disabled', that.selected.length > 0 ? false : true);

                if (that.selected.find(x => +x.id === +  that.table.row(element).data().id) === undefined) {
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

        const modal = this._modalService.open(ConfirmModalComponent, {
            size: 'xs',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        modal.componentInstance.message = this._translate.instant('PREFERENCES.NOTIFICATIONS.DELETE_MESSAGE');

        modal.result.then(async (data) => {
            if (data) {

                await this.loading.showLoading();
                this.backend.post('company_notification_delete', {
                    id: this.selected,
                    companyId: this.profile.company.id
                }).pipe(take(1)).subscribe(() => {
                    this.selected = [];
                    this.selectAll = false;
                    this.table.ajax.reload();
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
            this.selectAll = false;
            this.table.ajax.reload();
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
        this.table.rows()[0].forEach((element) => {

            let data = this.table.row(element).data();
            var index = this.selected.findIndex(x => x === data.id);

            if (this.selectAll) {

                var x = this.selected.filter(x => x == data.id);

                if (x.length == 0) {

                    this.selected.push(data.id);

                    $('#ck-' + data.id).prop('checked', true);

                    $(this.table.row(element).node()).addClass('selected');
                }

            } else {

                $('#ck-' + data.id).prop('checked', false);

                $(this.table.row(element).node()).removeClass('selected');

                this.selected.splice(index, 1);

                this.selected = [];

            }

            this.detectChange.detectChanges();
        });
    }

    openDetailsNotifications(id: number, data: any) {

        if (data.notificationTypeId == 12) {

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

            
        } else {

            this.Router.navigate(['notifications', id]);
        }
    }

    openSetting() {

        //this.Router.navigate(['notifications/settings']);

       this.Router.navigateByUrl('/preferences?option=notification');

    }

}

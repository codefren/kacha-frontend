import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Novelty } from '../../../../../backend/src/lib/types/novelty.type';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { NoveltyMessages } from '../../../../../shared/src/lib/messages/novelty/novelty.message';
import { StateRoutePlanningService } from '../../../../../state-route-planning/src/lib/state-route-planning.service';
import { environment } from '@optimroute/env/environment';
import { take, takeUntil } from 'rxjs/operators';
import { BackendService } from '@optimroute/backend';
import { dateToDDMMYYY, downloadFile, secondsToAbsoluteTime } from '@optimroute/shared';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
declare var $: any;
import * as moment from 'moment-timezone';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPostponedClientComponent } from './modal-postponed-client/modal-postponed-client.component';
import { Subject } from 'rxjs';
@Component({
    selector: 'easyroute-delivery-details',
    templateUrl: './delivery-details.component.html',
    styleUrls: ['./delivery-details.component.scss'],
})
export class DeliveryDetailsComponent implements OnInit {
    data: any;
    detailForm: FormGroup;
    table: any;
    tableBill: any;
    products: any = [];
    devolution: any =[];
    redirecPage: boolean = false;
    deliveryNotes = [];
    deliveryNoteId: number;
    deliveryNoteSelected: any;
    showisMultiDeliveryNote: boolean = false;
    valorations: any = [];
    tabOption = 1;

    scroll: number = 0;
    subscribe: any;
    redirect: boolean = false;
    idReturns: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public authLocal: AuthLocalService,
        private _toastService: ToastService,
        private _translate: TranslateService,
        private _activatedRoute: ActivatedRoute,
        private stateRoutePlanningService: StateRoutePlanningService,
        private detectChange: ChangeDetectorRef,
        private backend: BackendService,
        private loadingService: LoadingService,
        private _modalService: NgbModal,
    ) { }

    ngOnInit() {
        this.tabOption = 1;
        this.load(); 
    }
    load() {
        this._activatedRoute.params.subscribe((params) => {
    
            this.idReturns = params['redirect'];
    
    
            if (params['id'] !== 'new') {
                this.stateRoutePlanningService
                    .getDeliveryPointDetailAssignedDetaild(params['id'])
                    .subscribe(
                        (resp: any) => {
                            this.data = resp[0];
                            this.valorations = resp[0].valorationItem;
                          
                            this.validaciones(this.data);
                            try {
                                this.detectChange.detectChanges();
                                this.cargarBillnoPayment();
                                this.cargarDevolution();
                                if (!this.data.isMultiDeliveryNote) {
                                    this.cargar();
                                   
                                    //this.cargarBillnoPayment();
                                } else {
                                    /* this.cargarBillnoPayment(); */
                                }
                            } catch (e) {}
                        },
                        (error) => {
                            this._toastService.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );
                        },
                    );
            } else {
                this.validaciones(this.data);
            }
        });
        this.url();
    }

    url() {
        this._activatedRoute.url.pipe(take(1)).subscribe((url) => {
            if (url[0].path !== 'history') {
                this.redirecPage = true;
            } else {
                this.redirecPage = false;
            }
        });
    }

    changeTab(value) {
        this.tabOption = value;
        if (value === 1) {
            this.detectChange.detectChanges();
            this.cargarBillnoPayment();
            if (!this.data.isMultiDeliveryNote) {
                this.cargar();
                //this.cargarBillnoPayment();
            } else {
                /* this.cargarBillnoPayment(); */
            }
        }
    }

    validaciones(description: any) {
        if (this.data && !this.data.isMultiDeliveryNote) {
            this.detailForm = this.fb.group({
                deliveryNoteCode: [description.deliveryNoteCode],
                dniDeliveryNote: [description.dniDeliveryNote],
                nameDeliveryNote: [description.nameDeliveryNote],
                deliveredBoxes: [description.deliveredBoxes],
                devolutionDeliveryNote: [description.devolutionDeliveryNote],
                extraBoxes: [description.extraBoxes],
                observation: [description.observation],
                name: [description.delivery_point.name],
                nif: [description.delivery_point.nif],
                deliveryOrderCode:[description.deliveryOrderCode, [Validators.required]]
            });
        } else {
            this.detailForm = this.fb.group({
                deliveredBoxes: [description.deliveredBoxes],
                devolutionDeliveryNote: [description.devolutionDeliveryNote],
                extraBoxes: [description.extraBoxes],
                observation: [description.observation],
                name: [description.delivery_point.name],
                nif: [description.delivery_point.nif],
                nameDeliveryNote: [],
                dniDeliveryNote: [],
                deliveryNoteOrderCode:['', [Validators.required]]
            });

            this.deliveryNotes = this.data.deliveryNotes;

            this.deliveryNoteId = this.data.deliveryNotes[0].id;

            this.cargar();
            this.cargarBillnoPayment();
        }
    }

    changeDeliveryNote(id) {
        this.deliveryNoteId = id;
        this.cargar();
        // llamar al nuevo backend
    }

    download() {
        this.backend
            .get('route_planning/delivery_point_detail_json/' + this.data.id)
            .pipe(take(1))
            .subscribe((data) => {
                let json = JSON.stringify(data);
                downloadFile(json, `routes_${dateToDDMMYYY(new Date())}.json`);
            });
    }
    print() {
        //localhost/optimroute-api/public/api/route_planning/delivery_note/1
        http: return this.backend.getPDF(
            'route_planning/delivery_note/' + this.deliveryNoteId,
        );
    }

    printMulti() {
        return this.backend.getPDF(
            'route_planning/delivery_note/route/' +
                this.data.routeId +
                '/delivery_point/' +
                this.data.id,
        );
    }

    cargar() {
        //this.backend.

        const url = !this.data.isMultiDeliveryNote
            ? 'route_planning/route/assigned/' +
              this.data.routeId +
              '/delivery_point/' +
              this.data.id
            : 'route_planning/delivery_note_detail/' + this.deliveryNoteId;

        this.backend
            .get(url)
            .pipe(take(1))
            .subscribe((data) => {
                if (this.table) {
                    this.table.clear();
                }

                this.products = this.data.isMultiDeliveryNote
                    ? data.data && data.data.products
                        ? data.data.products
                        : []
                    : data.data;
                if (this.data.isMultiDeliveryNote) {
                    this.deliveryNoteSelected = data.data;
                    this.showisMultiDeliveryNote = true;

                    this.detailForm.get('dniDeliveryNote').setValue(this.deliveryNoteSelected.dniDeliveryNote);
                    this.detailForm.get('nameDeliveryNote').setValue(this.deliveryNoteSelected.nameDeliveryNote);
                    this.detailForm.get('deliveryNoteOrderCode').setValue(this.deliveryNoteSelected.deliveryNoteOrderCode);
                }

                let table = '#details_assigned';
                this.table = $(table).DataTable({
                    destroy: true,
                    stateSave: false,
                    language: environment.DataTableEspaniol,
                    data: this.products,
                    ordering: false,
                    lengthMenu: [20],
                    dom: `
                        <"top-button-hide"><'point no-scroll-x table-responsive't>
                        <'row reset'
                        <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
                        >
                    `,
                    columns: [
                        {
                            data: 'codeProduct',
                        },
                        {
                            data: 'name',
                        },
                        {
                            data: 'quantity',
                        },
                        {
                            data: 'measure',
                            title: this._translate.instant('PRODUCTS.U_MEASURE'),
                            render: (data, type, row) => {
                                if (data == null || data == 0) {
                                    return '<span class="text center" aria-hidden="true"> No disponible</span>';
                                } else {
                                    return (
                                        '<span data-toggle="tooltip" data-placement="top" title="' +
                                        '">' +
                                        data +
                                        '</span>'
                                    );
                                }
                            },
                        },
                        {
                            data: 'measureQuantity',
                            title: this._translate.instant('PRODUCTS.UD'),
                            render: (data, type, row) => {
                                if (data == null) {
                                    return '<span class="text center" aria-hidden="true"> No disponible</span>';
                                } else {
                                    return (
                                        '<span data-toggle="tooltip" data-placement="top" title="' +
                                        '">' +
                                        data +
                                        '</span>'
                                    );
                                }
                            },
                        },
                        {
                            data: 'price',
                            title: this._translate.instant('PRODUCTS.PRICE'),
                            render: (data, type, row) => {
                                return '<span>' + data + '€</span>';
                            },
                        },
                        {
                            data: 'delivered',
                            visible: this.showisMultiDeliveryNote,
                            title: this._translate.instant('DELIVERY_POINTS.STATE'),
                            render: (data, type, row) => {
                                if (data) {
                                    return (
                                        '<span>' +
                                        this._translate.instant(
                                            'DELIVERY_POINTS.DELIVERED',
                                        ) +
                                        '</span>'
                                    );
                                } else {
                                    return (
                                        '<span>' +
                                        this._translate.instant(
                                            'DELIVERY_POINTS.UNDELIVERED',
                                        ) +
                                        '</span>'
                                    );
                                }
                            },
                        },
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
                $('easyroute-delivery-details').find('#details_filter').html(`
                    <div class="row p-0 justify-content-sm-end justify-content-center">
                        <div class="input-group input-search" style="width: initial !important;">
                            <input id="search-modal" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
                            <span class="input-group-append">
                                <span class="input-group-text table-append">
                                    <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                                </span>
                            </span>
                        </div>
                    </div>
                `);

                $('#search-modal').on('keyup', function() {
                    $(table)
                        .DataTable()
                        .search(this.value)
                        .draw();
                });

                $('.dataTables_filter').removeAttr('class');
            });
    }

    cargarDevolution() {

        const url ='route_planning/list_devolution/' + this.data.id;

        this.backend.get(url)
            .pipe(take(1))
            .subscribe(({data}) => {

                if (this.table) {
                    this.table.clear();
                }

                this.devolution = this.data.isMultiDeliveryNote ? (data ? data : []) : data;

                let table = '#details_devolution';
                this.table = $(table).DataTable({
                    destroy: true,
                    stateSave: false,
                    language: environment.DataTableEspaniol,
                    data: this.devolution,
                    ordering: false,
                    lengthMenu: [20],
                    dom: `
                        <"top-button-hide"><'point no-scroll-x table-responsive't>
                        <'row reset'
                        <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
                        >
                    `,
                       
                    columns: [
                        {
                            data: 'nameProduct',
                        },
                        {
                            data: 'quantityProduct',
                        },
                       

                    ],
                    buttons: [
                        {
                            extend: 'colvis',
                            text: this._translate.instant('GENERAL.SHOW/HIDE'),
                            columnText: function (dt, idx, title) {
                                return idx + 1 + ': ' + title;
                            },
                        },
                    ],
                });
                $('easyroute-delivery-details').find('#details_filter').html(`
                    <div class="row p-0 justify-content-sm-end justify-content-center">
                        <div class="input-group input-search" style="width: initial !important;">
                            <input id="search-modal" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
                            <span class="input-group-append">
                                <span class="input-group-text table-append">
                                    <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                                </span>
                            </span>
                        </div>
                    </div>
                `);

                $('#search-modal').on('keyup', function () {
                    $(table)
                        .DataTable()
                        .search(this.value)
                        .draw();
                });

                $('.dataTables_filter').removeAttr('class');
            });
    }


    countValoration() {
        let value = 0;

        this.valorations.forEach((element) => {
            if (element.valoration) {
                value += 1;
            }
        });

        return value;
        /* this.valorations.reduce */
    }

    showValoration(id) {
        return this.valorations.find((x) => +x.id === +id).valoration;
    }

    cargarBillnoPayment() {

        let url =
            environment.apiUrl +
            'company_bill_authorization_dont_charge_datatables?routePlanningRouteDeliveryPointId=' +
            this.data.id;

        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

        let tableBill = '#listBill';

        this.tableBill = $(tableBill).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: false,
            cache: false,
            order: [0, 'desc'],
            lengthMenu: [10],

            stateSaveParams: function(settings, data) {
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
                    text: this._translate.instant('GENERAL.SHOW/HIDE'),
                    columnText: function(dt, idx, title) {
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
                    data: 'company_bill.code',
                    title: this._translate.instant('PRODUCTS.CODE'),
                    render: (data, type, row) => {
                        let code = data.code;
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true"> No disponible</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                data +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'user_driver',
                    title: this._translate.instant('BILLS.DRIVER'),
                    render: (data, type, row) => {
                        let name = data.name;
                        let surname = data.surname;
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true"> No disponible</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                data.name +
                                '  ' +
                                data.surname +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'authorizingName',
                    title: this._translate.instant('BILLS.AUTORIZED_BY'),
                    render: (data, type, row) => {
                        let name = data;

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
                    data: 'authorizingDate',
                    title: this._translate.instant('BILLS.DATE'),
                    render: (data, type, row) => {
                        return moment(data).format('DD/MM/YYYY');
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.DOWNLOAD'),
                    render: (data, type, row) => {
                        return `<span class="downloadBill point"> <img class="icons-datatable point" src="assets/icons/optimmanage/download-outline.svg"></span>`;
                    },
                },
            ],
        });
        this.downloadBill('#listBill tbody', this.tableBill);
    }
    downloadBill(tbody: any, table: any, that = this) {
        $(tbody).unbind();

        $(tbody).on('click', 'span.downloadBill', function() {
            let data = table.row($(this).parents('tr')).data();
            that.downloadElement(data);
        });
    }

    downloadElement(archivo: any): void {
        let link = document.createElement('a');
        document.body.appendChild(link); //required in FF, optional for Chrome
        link.target = '_blank';
        let fileName = 'pdf';
        link.download = fileName;
        link.href = archivo.company_bill.archiveUrl;
        link.click();
    }

    save(){
     
        
        this.loadingService.showLoading();
    
        this.stateRoutePlanningService.updateDeliveryNoteOrderCode(this.deliveryNoteSelected.id, 
            {
                deliveryNoteOrderCode: this.detailForm.value.deliveryNoteOrderCode
            }).pipe( take(1) ).subscribe( (data: any) => {
    
          this.loadingService.hideLoading();

          this.cargar();
    
          this._toastService.displayWebsiteRelatedToast(
            this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
            this._translate.instant('GENERAL.ACCEPT'),
          );
    
        }, (error)=>{
            this.loadingService.hideLoading();
            this._toastService.displayHTTPErrorToast(error.status, error.error.error);
        });
    }

    saveNotMultiple(){
     
        
        this.loadingService.showLoading();
    
        this.stateRoutePlanningService.updateDeliveryOrderCode(this.data.id, 
            {
                deliveryOrderCode: this.detailForm.value.deliveryOrderCode
            }).pipe( take(1) ).subscribe( (data: any) => {

    
          this.loadingService.hideLoading();

    
          this._toastService.displayWebsiteRelatedToast(
            this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
            this._translate.instant('GENERAL.ACCEPT'),
          );
    
        }, (error)=>{
            this.loadingService.hideLoading();
            this._toastService.displayHTTPErrorToast(error.status, error.error.error);
        });
    }

    openModalPosponet(dataShow: any){
    
        
    const modal = this._modalService.open( ModalPostponedClientComponent, {
      
      backdropClass: 'modal-backdrop-ticket',
  
      centered: true,
  
      windowClass:'modal-view-posponet',
  
      size:'mg'
  
    });

    modal.componentInstance.data = dataShow;
    }

  

   
      moveToLeft(){

        this.scroll = this.scroll - 300 <= 0 ? 0 : this.scroll - 300;

        
        $( "#scroller" ).scrollLeft( this.scroll );
      }
      moveToRight(){

        var scroll = $("#scroller" ).get(0).scrollWidth;

      

        this.scroll = this.scroll + 300 >= scroll ? scroll : this.scroll + 300;

 
        
        $( "#scroller" ).scrollLeft( this.scroll );
        
        
      }

      dateFormat(date:any){
        if (date) {
            return moment(date).format('HH:mm');
            
        } else {
             return '--:--'
        }
      }

      showSecons(date:any){
        if (date) {
            return secondsToAbsoluteTime(date, true);
        } else {
            return '- -min'
        }
      }

      rediretcTo(){
        
        if ( this.idReturns ) {
            this.router.navigate([`management/clients/analysis/${ this.idReturns }`]);

        } else {
            this.router.navigate([`/control-panel/assigned`]);
            
        }
      
      }
}

import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { LoadingService, ToastService } from '@optimroute/shared';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
import { take } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import { ModalPostponedComponent } from './modal-postponed/modal-postponed.component';

declare var $: any;


@Component({
  selector: 'easyroute-service-information',
  templateUrl: './service-information.component.html',
  styleUrls: ['./service-information.component.scss']
})
export class ServiceInformationComponent implements OnInit, OnChanges {
  
  @Input() dataDetail: any;

  detailForm: FormGroup;

  scroll: number = 0;

  table: any;
  devolution: any =[];

  tableBill: any;

  valorations: any = [];


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
  }

  ngOnChanges() {

    this.load();

  }

  load() {
    if (this.dataDetail) {

      this.valorations = this.dataDetail.valorationItem;

      this.validaciones(this.dataDetail);

    }  else {
      this.validaciones(this.dataDetail);
    }

  }

  validaciones(description: any) {

    if (this.dataDetail && !this.dataDetail.isMultiDeliveryNote) {
        console.log('this.dataDetail',description);
        this.detailForm = this.fb.group({
            deliveryNoteCode: [description.deliveryNoteCode],
            dniDeliveryNote: [description.dniDeliveryNote],
            nameDeliveryNote: [description.nameDeliveryNote],
            deliveredBoxes: [description.deliveredBoxes],
            devolutionBoxes: [description.devolutionBoxes],
            devolutionDeliveryNote: [description.devolutionDeliveryNote],
            extraBoxes: [description.extraBoxes],
            observation: [description.observation ? description.observation : 'No hay observaciones'],
            name: [description.name],
            nif: [description.nif],
            deliveryOrderCode: [description.deliveryOrderCode, [Validators.required]]
        });
    } else {
        this.detailForm = this.fb.group({
            deliveredBoxes: [description.deliveredBoxes],
            devolutionDeliveryNote: [description.devolutionDeliveryNote],
            extraBoxes: [description.extraBoxes],
            devolutionBoxes: [description.devolutionBoxes],
            observation: [description.observation ? description.observation : 'No hay observaciones'],
            name: [description.name],
            nif: [description.nif],
            nameDeliveryNote: [],
            dniDeliveryNote: [],
            deliveryNoteOrderCode:['', [Validators.required]]
        });
    }

    try {
      this.detectChange.detectChanges();

      this.moveALL();

      this.cargarDevolution();

      //this.cargarBillnoPayment();

    } catch (e) {

      this._toastService.displayHTTPErrorToast(1000, e.message);
      
    }

  }

  openModalPosponet(dataShow: any){
    const modal = this._modalService.open( ModalPostponedComponent, {
      backdropClass: 'modal-backdrop-ticket',
      centered: true,
      windowClass:'modal-view-posponet',
      size:'mg'
    });

    modal.componentInstance.data = dataShow;
  }

  /* moveToLeft(){

    this.scroll = this.scroll - 300 <= 0 ? 0 : this.scroll - 300;

    
    $( "#scroller" ).scrollLeft( this.scroll );
  }

  moveToRight(){
    var scroll = $("#scroller" ).get(0).scrollWidth;

    this.scroll = this.scroll + 300 >= scroll ? scroll : this.scroll + 300;
    
    $( "#scroller" ).scrollLeft( this.scroll );
  } */

  dateFormat(date:any){
    if (date) {
        return moment(date).format('HH:mm');
        
    } else {
         return '--:--'
    }
  }

  cargarDevolution() {

    const url ='route_planning/list_devolution/' + this.dataDetail.id;

    this.backend.get(url)
    .pipe(take(1))
    .subscribe(({data}) => {

        if (this.table) {
            this.table.clear();
        }

        this.devolution = this.dataDetail.isMultiDeliveryNote ? (data ? data : []) : data;

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

  /* cargarBillnoPayment() {

    let url = environment.apiUrl +
        'company_bill_authorization_dont_charge_datatables?routePlanningRouteDeliveryPointId=' +
        this.dataDetail.id;

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
            <"top-button-hide"><'vehicles table-responsive't>
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
              data: 'company_bill.billPaymentStatusId',
              title: this._translate.instant('SHEET_ROUTE.CONDITION'),
               render: (data, type, row) => {
                    if (data == 2) {

                      return '<span class="text center" aria-hidden="true"> Cobrada </span>';

                    } else {

                      return '<span class="text center" aria-hidden="true"> No cobrada </span>';

                    }
                },
            },
            {
                data: 'user_driver',
                title: this._translate.instant('BILLS.DRIVER'),
                render: (data, type, row) => {
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
                render: (data, type, row) => {
                    return `<span class="downloadBill point"> <img class="icons-datatable point" src="assets/icons/External_Link.svg"></span>`;
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
  } */
  
  countValoration() {
    let value = 0;

    this.valorations.forEach((element) => {
        if (element.valoration) {
            value += 1;
        }
    });

    return value;
  }

  showValoration(id: any) {
    return this.valorations.find((x: any) => +x.id === +id).valoration;
  }

  moveALL() {

    if (this.dataDetail && this.dataDetail.route_planning_route_delivery_movement 
        && this.dataDetail.route_planning_route_delivery_movement.length > 0) {
        
        const slider: any = document.querySelector('.items');

        let isDown = false;
    
        let startX :  any;
    
        let scrollLeft : any;

        slider.addEventListener('mousedown', (e: any) => {

            isDown = true;
    
            slider.classList.add('active');
    
            startX = e.pageX - slider.offsetLeft;
    
            scrollLeft = slider.scrollLeft;
    
        });
    
        slider.addEventListener('mouseleave', () => {
        
            isDown = false;
            
            slider.classList.remove('active');
        
        });
        
        slider.addEventListener('mouseup', () => {
        
            isDown = false;
            
            slider.classList.remove('active');
        
        });
        
        slider.addEventListener('mousemove', (e: any) => {
        
            isDown = true;
            
            if(!isDown) return;
            
            e.preventDefault();
            
            const x = e.pageX - slider.offsetLeft;
            
            const walk = (x - startX) * 3; //scroll-fast
            
            slider.scrollLeft = scrollLeft - walk;

        });

        slider.addEventListener("touchmove", (e: any) => {

            slider.style.overflowX = "auto";

        });

      /* slider.addEventListener("touchend", (e: any) => {

        slider.style.overflowX = "hidden";

      }); */


    }
  }

}

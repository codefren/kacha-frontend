import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { dateToDDMMYYY, downloadFile, LoadingService, ToastService } from '@optimroute/shared';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
import { take } from 'rxjs/operators';

declare var $: any;


@Component({
  selector: 'easyroute-delivery-note-detail',
  templateUrl: './delivery-note-detail.component.html',
  styleUrls: ['./delivery-note-detail.component.scss']
})
export class DeliveryNoteDetailComponent implements OnInit {

  @Input() dataDetail: any;

  detailAlbaranForm: FormGroup;

  deliveryNotes = [];
  deliveryNoteId: number;
  deliveryNoteSelected: any;

  table: any;
  products: any = [];
  showisMultiDeliveryNote: boolean = false;
  
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
//    console.log(this.dataDetail, '!dataDetail.isMultiDeliveryNote')
    if (this.dataDetail) {

      this.validaciones(this.dataDetail);

    }  else {
      this.validaciones(this.dataDetail);
    }

  }

  validaciones(description: any) {

    if (this.dataDetail && !this.dataDetail.isMultiDeliveryNote) {
        this.detailAlbaranForm = this.fb.group({
            countAlbaran: [description.deliveryNoteCode ? 1 : ''],
            deliveryNoteCode: [description.deliveryNoteCode],
            dniDeliveryNote: [description.dniDeliveryNote],
            nameDeliveryNote: [description.nameDeliveryNote],
            deliveredBoxes: [description.deliveredBoxes],
            devolutionDeliveryNote: [description.devolutionDeliveryNote],
            extraBoxes: [description.extraBoxes],
            observation: [description.observation ? description.observation : 'No hay observaciones'],
            name: [description.name],
            nif: [description.nif],
            deliveryOrderCode: [description.deliveryOrderCode, [Validators.required]]
        });
    } else {
        console.log(description);
        this.detailAlbaranForm = this.fb.group({
            countAlbaran: [description.multiDeliveryNotes.length],
            deliveredBoxes: [description.deliveredBoxes],
            devolutionDeliveryNote: [description.devolutionDeliveryNote],
            extraBoxes: [description.extraBoxes],
            observation: [description.observation ? description.observation : 'No hay observaciones'],
            name: [description.name],
            nif: [description.nif],
            type: [description.isDevolution ? 'Recogida' : 'Entrega'],
            nameDeliveryNote: [],
            dniDeliveryNote: [],
            deliveryNoteOrderCode: ['', [Validators.required]]
        });

        if(this.dataDetail && this.dataDetail.multiDeliveryNotes && this.dataDetail.multiDeliveryNotes.length > 0){
            this.deliveryNotes = this.dataDetail.multiDeliveryNotes;
            this.deliveryNoteId = this.dataDetail.multiDeliveryNotes[0].id;
            this.cargar();
            
        }
        

       
    }

    try {
      this.detectChange.detectChanges();
      if (!this.dataDetail.isMultiDeliveryNote) {
        this.cargar();
      }

    } catch (e) {

      this._toastService.displayHTTPErrorToast(1000, e.message);
      
    }

  }

  download() {
    this.backend
        .get('route_planning/delivery_point_detail_json/' + this.dataDetail.id)
        .pipe(take(1))
        .subscribe((data) => {
            let json = JSON.stringify(data);
            downloadFile(json, `routes_${dateToDDMMYYY(new Date())}.json`);
        });
  }

  /* Albaran Simple */

  print() {
    return this.backend.getPDF(
      'route_planning/delivery_note/route/' +
        this.dataDetail.routeId +
        '/delivery_point/' +
        this.dataDetail.id,
    );
  }

  saveNotMultiple(){
        
    this.loadingService.showLoading();

    this.stateRoutePlanningService.updateDeliveryOrderCode(this.dataDetail.id, 
        {
            deliveryOrderCode: this.detailAlbaranForm.value.deliveryOrderCode
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


  /* Albaran multi */
  printMulti() {
    http: return this.backend.getPDF(
        'route_planning/delivery_note/' + this.deliveryNoteId,
    );
  }

  changeDeliveryNote(id) {
    this.deliveryNoteId = id;
    this.cargar();
  }

  save(){
    this.loadingService.showLoading();

    this.stateRoutePlanningService.updateDeliveryNoteOrderCode(this.deliveryNoteSelected.id, 
      {
          deliveryNoteOrderCode: this.detailAlbaranForm.value.deliveryNoteOrderCode
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

  cargar() {

    const url = !this.dataDetail.isMultiDeliveryNote
        ? 'route_planning/route/assigned/' +
          this.dataDetail.routeId +
          '/delivery_point/' +
          this.dataDetail.id
        : 'route_planning/delivery_note_detail/' + this.deliveryNoteId;

    this.backend
        .get(url)
        .pipe(take(1))
        .subscribe((data) => {
            if (this.table) {
                this.table.clear();
            }

            this.products = this.dataDetail.isMultiDeliveryNote
                ? data.data && data.data.products
                    ? data.data.products
                    : []
                : data.data;

            
            if (this.dataDetail.isMultiDeliveryNote) {
                this.deliveryNoteSelected = data.data;
                this.showisMultiDeliveryNote = true;

                this.detailAlbaranForm.controls['type'].setValue(data.data.isDevolution ? 'Recogida' : 'Entrega');

                this.detailAlbaranForm.get('dniDeliveryNote').setValue(this.deliveryNoteSelected.dniDeliveryNote);
                this.detailAlbaranForm.get('nameDeliveryNote').setValue(this.deliveryNoteSelected.nameDeliveryNote);
                this.detailAlbaranForm.get('deliveryNoteOrderCode').setValue(this.deliveryNoteSelected.deliveryNoteOrderCode);
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
                            return '<span>' + this.formatEuro(data) + '</span>';
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

  formatEuro(quantity) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(quantity);
  
  }


}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '@optimroute/backend';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../services/loading.service';
import * as _ from 'lodash';
import { MergeRecordMessages } from '../../messages/merge-record/merge-record.message';
import { environment } from '@optimroute/env/environment';
import { group } from 'console';

declare var $: any;

@Component({
  selector: 'easyroute-modal-general-merge-record',
  templateUrl: './modal-general-merge-record.component.html',
  styleUrls: ['./modal-general-merge-record.component.scss']
})
export class ModalGeneralMergeRecordComponent implements OnInit {

  dataClient: any = [];
  deliveryPointId: any = [];
 
  change = {
    createGrouping:"createGrouping",
    MergeWithExistingGroup:'MergeWithExistingGroup'
  };

  default ='createGrouping';

  mergeRecordForm: FormGroup;

  mergeRecord_messages: any;

  tableMerge: any;

  selectedMerge = [];

  constructor(
    private toastService: ToastService,
    private fb: FormBuilder,
    public dialogRef: NgbActiveModal,
    private backendService: BackendService,
    private detectChanges: ChangeDetectorRef,
    private _translate: TranslateService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.initForm(this.dataClient[0]);
  }

  initForm(data: any){

    this.mergeRecordForm = this.fb.group(
      {
        name: [data.name, [Validators.required]],
        phone: [data.phone, [Validators.required]],
        address: [data.address, [Validators.required]],
        zipCode: [data.zipCode, [Validators.required]],
        population: [data.population, [Validators.required]]
      },
    );
  
    this.mergeRecord_messages = new MergeRecordMessages().getMergeRecordMessages();

  }

  changePage(name: string){
     
    this.default = this.change[name];

    if (this.default == 'MergeWithExistingGroup' ) {

      /* setTimeout(()=>{
        this.cargar();
      }, 500); */

      try {
        this.detectChanges.detectChanges();
        this.cargar();
      } catch (error) {
        
      }

     
      
    }

  }

  closeDialog(value: any) {
    this.dialogRef.close(value);
  }

  changeSelect(data: any) {

    this.mergeRecordForm.get('name').setValue(data.name);
    this.mergeRecordForm.get('phone').setValue(data.phone);
    this.mergeRecordForm.get('address').setValue(data.address);
    this.mergeRecordForm.get('zipCode').setValue(data.zipCode);
    this.mergeRecordForm.get('population').setValue(data.population);

  }

  firstRegister(data:any){
    
    if (this.dataClient[0].id == data.id) {

      return true;
      
    }

    return false;
  }

  acceptCreateGroup() {

    let dataform = _.cloneDeep(this.mergeRecordForm.value);

    dataform['deliveryPointId'] = this.deliveryPointId;

    this.backendService.post('group_delivery_point', dataform)
    .pipe(take(1))
    .subscribe((data)=>{
  
      this.loadingService.hideLoading();

      this.toastService.displayWebsiteRelatedToast(
        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
      );

      this.detectChanges.detectChanges();

      this.closeDialog(true);

    }, error => {
      
      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });
  }

  cargar(){
    
    if (this.tableMerge) {
      this.tableMerge.state.clear();
    }
    
    let url = environment.apiUrl + 'group_delivery_point_datatables';
    let tok = 'Bearer ' + this.obtenerTokenLocalStorage();
    let DataTableEspa = environment.DataTableEspaniol;
    this.tableMerge = $('#merge_with_existing_group').DataTable({
      destroy: true,
      serverSide: true,
      processing: true,
      stateSave: true,
      cache: false,
      lengthMenu: [5, 100],
      scrollY: '45vh',
      stateSaveParams: function (settings, data) {
        data.search.search = "";
      },
      initComplete: function (settings, data) {
        settings.oClasses.sScrollBody = "";
      },
      drawCallback: (settings, json) => {
        setTimeout(() => {
          $('#merge_with_existing_group').DataTable().columns.adjust();
        }, 1);
      },
      dom: `
            <'row'
                <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'>
                <'col-sm-4 col-lg-2 col-12 label-search'>
            >
            <'row p-0 reset'
                <'offset-sm-6 offset-lg-6 offset-5'>
                <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
            >
            <"top-button-hide"><'table-responsive't>
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
      language: DataTableEspa,
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

          $('#clients_processing').html(html);

          $('#refrescar').click(() => {
            this.cargar();
          });
        },
      },
      rowCallback: (row, data) => {
        if ($.inArray(data.id, this.selectedMerge) !== -1) {
          $(row).addClass('selected');
          setTimeout(()=>{
            $('#ckgroup-' + data.id.replace(' ', '-')).prop('checked', true);
          }, 900);
        }
        $(row).addClass('point');
      },
      columns: [
        {
          data: 'id',
          sortable: false,
          searchable: false,
          buttons: false,
          render: (data, type, row) => {

            return (`
                <div class="row justify-content-center backgroundColorRow">
                  <div class="round round-little-move text-center">
                    <input type="checkbox"  id="ckgroup-${data}"/>
                    <label></label>
                  </div>
                </div>
            `);
          }
        },
        {
          data: 'id',
          sortable: false,
        },
        {
          data: 'name',
          sortable: false,
          className: 'text-left',
          title: this._translate.instant('GENERAL.NAME'),
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
        },
        {
          data: 'address',
          sortable: false,
          className: 'text-left',
          title: this._translate.instant('TRAVEL_TRACKING.ADDRESS'),
          render: (data, type, row) => {
            let id = data;
            if (id.length > 150) {
              id = id.substr(0, 149) + '...';
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
    })

    $('#search-modal').on('keyup', function () {
      $('#merge_with_existing_group').DataTable().search(this.value).draw();
    });
    
    $('.dataTables_filter').removeAttr("class");

    this.initEventsGroup('#merge_with_existing_group tbody', this.tableMerge);
  }

  initEventsGroup(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    this.selectGroup(tbody, table);
  }

  selectGroup(tbody: any, table: any, that = this) {
    
    $(tbody).on('click', 'tr', function () {

      let data = table.row($(this)).data();

      let id = data.id.replace(' ', '-');

      var index = $.inArray(data.id, that.selectedMerge);

      if (index === -1) {

        if (that.selectedMerge.length > 0) {

          $('#merge_with_existing_group tbody tr.selected').toggleClass('selected');

          $('#ckgroup-' + that.selectedMerge[0].replace(' ', '-')).prop('checked', false);

          that.selectedMerge = [];
        }

        $('#ckgroup-' + id).prop('checked', true);

        that.selectedMerge.push(data.id);

      } else {

        $('#ckgroup-' + id).prop('checked', false);

        that.selectedMerge.splice(index, 1);

      }

      $(this).toggleClass('selected');

      console.log(that.selectedMerge);

      that.detectChanges.detectChanges();

    });
  }

  acceptExistingGroup() {
    
    this.backendService.put('group_delivery_point/delivery_point', {
      deliveryPointId: this.deliveryPointId,
      groupId: this.selectedMerge[0]
    })
    .pipe(take(1))
    .subscribe((data)=>{
  
      this.loadingService.hideLoading();

      this.toastService.displayWebsiteRelatedToast(
        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
      );

      this.detectChanges.detectChanges();

      this.closeDialog(true);

    }, error => {
      
      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });
    
  }

  obtenerTokenLocalStorage() {
    return localStorage.getItem('token');
  }

}

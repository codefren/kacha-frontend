import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

declare var $: any;


@Component({
  selector: 'easyroute-modal-move-client',
  templateUrl: './modal-move-client.component.html',
  styleUrls: ['./modal-move-client.component.scss']
})
export class ModalMoveClientComponent implements OnInit {
  
  change = {
    moveAnotherGroup:"moveAnotherGroup",
    doesNotBelongToGroup:'doesNotBelongToGroup'
  };

  default ='moveAnotherGroup';

  table: any;

  selectedGroup = [];
  deliveryPointId: any = [];
  fatherGroupId: any;

  constructor(
    public dialogRef: NgbActiveModal,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private detectChanges: ChangeDetectorRef,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private toastService: ToastService,
  ) { }
  

  ngOnInit() {

    setTimeout(()=>{
        this.cargar();
    }, 1);

  }

  cargar(){
    if (this.table) {
      this.table.state.clear();
    }
    
    let url = environment.apiUrl + 'group_delivery_point_datatables?fatherGroupId=' + this.fatherGroupId;
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let DataTableEspa = environment.DataTableEspaniol;
    this.table = $('#delivery_points_move').DataTable({
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
          $('#delivery_points_move').DataTable().columns.adjust();
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
        if ($.inArray(data.id, this.selectedGroup) !== -1) {
          $(row).addClass('selected');
          setTimeout(()=>{
            $('#ck-' + data.id.replace(' ', '-')).prop('checked', true);
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
                    <input type="checkbox"  id="ck-${data}"/>
                    <label></label>
                  </div>
                </div>
            `);
        }
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
            if (id.length > 29) {
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
      ]
    })

    $('#search-modal').on('keyup', function () {
      $('#delivery_points_move').DataTable().search(this.value).draw();
    });
    
    $('.dataTables_filter').removeAttr("class");

    this.initEventsPoints('#delivery_points_move tbody', this.table);
  }

  initEventsPoints(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    this.selectPoints(tbody, table);
  }

  selectPoints(tbody: any, table: any, that = this) {
    
    $(tbody).on('click', 'tr', function () {

      let data = table.row($(this)).data();

      let id = data.id.replace(' ', '-');

      var index = $.inArray(data.id, that.selectedGroup);

      if (index === -1) {

        if (that.selectedGroup.length > 0) {

          $('#delivery_points_move tbody tr.selected').toggleClass('selected');

          $('#ck-' + that.selectedGroup[0].replace(' ', '-')).prop('checked', false);

          that.selectedGroup = [];
        }

        $('#ck-' + id).prop('checked', true);

        that.selectedGroup.push(data.id);

      } else {

        $('#ck-' + id).prop('checked', false);

        that.selectedGroup.splice(index, 1);

      }

      $(this).toggleClass('selected');

      console.log(that.selectedGroup);

      that.detectChanges.detectChanges();

    });
  }


  closeDialog(value) {
    this.dialogRef.close(value);
  }

  changePage(name: string){
    this.default = this.change[name];

    if (this.default === 'moveAnotherGroup') {
      
      try {
        this.detectChanges.detectChanges();
        this.cargar();
        
      } catch (error) {
        
      }
      
    }
  }

  moveCliente(){
    
    this.backendService.put('group_delivery_point/delivery_point', {
      deliveryPointId: this.deliveryPointId,
      groupId: this.selectedGroup[0]
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

  separateClient(){
    this.backendService.delete('group_delivery_point/delivery_point/'+this.deliveryPointId[0])
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

}

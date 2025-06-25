import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from 'libs/auth-local/src/index';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '@optimroute/shared';
import { MyNoteService } from '../../../my-note.service';
import { take } from 'rxjs/operators';
declare var $;
@Component({
  selector: 'lib-shared-my-note',
  templateUrl: './shared-note.component.html',
  styleUrls: ['./shared-note.component.scss']
})
export class SharedNoteComponent implements OnInit, OnDestroy {

  constructor(public activeModal: NgbActiveModal,
    private authLocal: AuthLocalService,
    private _loading: LoadingService,
    private noteService: MyNoteService,
    private _translate: TranslateService) { 
      
    }
    table: any;
    @Input() selected: any = [];
    @Input() idNote: number = 0;

  ngOnInit() {
    this.cargar();
  }

  ngOnDestroy() {
    this.table.destroy();
  }

  cargar() {

    let url = environment.apiUrl + 'users_salesman_datatables';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    this.table = $('#salesman').DataTable({
      destroy: true,
      serverSide: true,
      processing: false,
      stateSave: true,
      cache: false,
      lengthMenu: false,
      dom: '<"row"<"col-lg-12"f>><"table-responsive"t>p',
      language: environment.DataTableEspaniol,
      stateSaveParams: function (settings, data) {
        data.search.search = "";
      },
      select: {
        style:  'multi'
      },
      ajax: {
          method: 'GET',
          url: url,
          headers: {
              'Content-Type': 'application/json',
              Authorization: tok,
          },
          error: (xhr, error, thrown) => {
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
      columns: [
        { data: 'id', title: 'Id' },
        { 
          data: 'name',
          title: this._translate.instant('GENERAL.NAME'),
          render: (data, type, row)=>{
            return '<label>' + row.name + ' ' + row.surname + '</label>';
          }
        },
        {
            data: null,
            sortable: false,
            searchable: false,
            title: this._translate.instant('GENERAL.SELECT'),
            render: (data, type, row) => {
               
              if (this.selected.find(x => x.id === row.id)) {
                
                return (`
                  <button class="btn editar">
                    <i class="fas fa-times"></i>
                  </button>
                `);
                
              } else {

                return (`
                  <button class="btn editar">
                    <i class="fas fa-check"></i>
                  </button>
                `);
              }

            },
        },
      ],
      order: [1, "asc"]
    });
    this.editar('#salesman tbody', this.table);
  }

  editar(tbody: any, table: any, that = this) {
  
    $(tbody).on('click', 'button.editar', function() {
         
      let data = table.row($(this).parents('tr')).data();
      if (that.selected.find(x => x.id === data.id)) {

        let companyNoteShare = that.selected.filter(x => x.id === data.id).map(y => { 
          return {
            userId: y.id
          }
        });

        that.selected = that.selected.filter(x => x.id !== data.id);

        if (that.idNote > 0) {
          that.deleteFromNote(companyNoteShare, that.idNote);
          
        }
      } else {
        if (that.idNote > 0) {
          that.addUserShareNote([{ userId: data.id }], that.idNote);
        }
        that.selected.push(data);  
      }
      
      
      that.table.ajax.reload();
   
    });
  }
  
  closemodal(){
  
    this.activeModal.close(this.selected);
  }


  deleteFromNote(companyNoteShare: any, id: number) {
    this._loading.showLoading();
    this.noteService.deleteUserShareNote({companyNoteShare}, id).pipe(take(1)).subscribe((data) => {
      this._loading.hideLoading();
    });
  }

  addUserShareNote(companyNoteShare: any, id: number) {
    this._loading.showLoading();
    this.noteService.addUserShareNote({companyNoteShare}, id).pipe(take(1)).subscribe((data) => {
      this._loading.hideLoading();
    });
  }

}

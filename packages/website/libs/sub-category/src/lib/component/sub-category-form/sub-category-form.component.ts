import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubCategoryInterface, CategoryInterface } from '@optimroute/backend';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService, LoadingService, CategoryMessages } from '@optimroute/shared';
import { AuthLocalService } from '@optimroute/auth-local';
import { environment } from '@optimroute/env/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditSubCategoryComponent } from './modal-edit-sub-category/modal-edit-sub-category.component';
declare var $: any;

@Component({
  selector: 'easyroute-sub-category-form',
  templateUrl: './sub-category-form.component.html',
  styleUrls: ['./sub-category-form.component.scss']
})
export class SubCategoryFormComponent implements OnInit {

  data: any;

  titleTranslate: string;

  subCategoryForm: FormGroup;

  subCategory: SubCategoryInterface;

  category: CategoryInterface[];

  sub_category_messages: any;

  loadingCategory: string = 'success';

  toggleSubcategory: boolean = true;

  me: boolean;

  table: any;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private stateEasyrouteService: StateEasyrouteService,
    private toastService: ToastService,
    private translate: TranslateService,
    private loading: LoadingService,
    private _modalService: NgbModal,
    private authLocal: AuthLocalService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this._activatedRoute.params.subscribe(params => {

      this.loading.showLoading();

      if (params['sub_category_id'] !== 'new') {


        this.stateEasyrouteService.getSubcategoryIndex(params['sub_category_id']).subscribe(
          (data: any) => {
            this.loading.hideLoading();
            this.subCategory = data.data;
            this.validaciones(this.subCategory);

          },
          (error) => {
            this.loading.hideLoading();

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          },
        );



      } else {

        this.subCategory = new SubCategoryInterface();
        this.validaciones(this.subCategory);
      }

    });
  }

  validaciones(subCategory: SubCategoryInterface) {

    this.subCategoryForm = this.fb.group({
      categoryId: [subCategory.categoryId ? subCategory.categoryId : '', [Validators.required]],
      code: [subCategory.code, [Validators.maxLength(30)]],
      name: [subCategory.name, [Validators.required]],
      isActive: [subCategory.isActive, [Validators.required]],
    });

    let sub_category_messages = new CategoryMessages();
    this.sub_category_messages = sub_category_messages.getCategoryMessages();

    this.getcategory();
  }



  isFormInvalid(): boolean {
    return !this.subCategoryForm.valid;
  }

  getcategory() {

    this.loadingCategory = 'loading';

    setTimeout(() => {
      this.stateEasyrouteService.getCategorysByCopmpany().subscribe(
        (data: any) => {
          this.category = data.data;
          this.loadingCategory = 'success';
          this.changeDetectorRef.detectChanges();
          this.cargar();
          this.loading.hideLoading();
        },
        (error) => {
          this.loadingCategory = 'error';
          this.loading.hideLoading();

          this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
        },
      );
    }, 1000);
  }

  changeActive() {

    if (this.subCategory.isActive == true) {

      this.subCategory.isActive = false;

      this.subCategoryForm.controls['isActive'].setValue(this.subCategory.isActive);

    } else if (this.subCategory.isActive == false) {

      this.subCategory.isActive = true;

      this.subCategoryForm.controls['isActive'].setValue(this.subCategory.isActive);

    }

  }

  createUpdateSubCategory() {

    if (this.isFormInvalid()) {
      this.toastService.displayWebsiteRelatedToast('The zone is not valid'),
        this.translate.instant('GENERAL.ACCEPT');
    } else {
      if (this.subCategory.id && this.subCategory.id > 0) {

        this.loading.showLoading();

        this.stateEasyrouteService.updateSubCategory(this.subCategory.id, this.subCategoryForm.value).subscribe((data: any) => {

          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this.translate.instant('GENERAL.ACCEPT')
          );
          this._router.navigate(['sub-category']);

        }, (error) => {

          this.loading.hideLoading();
          this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
          return;

        });

      } else {

        this.loading.showLoading();

        this.stateEasyrouteService.registerSubCategory(this.subCategoryForm.value).subscribe((data: any) => {

          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('CONFIGURATIONS.REGISTRATION'),
            this.translate.instant('GENERAL.ACCEPT')
          );

          this._router.navigate(['sub-category']);
          /* this.closeDialog([true, { ok: true }]); */

        }, (error) => {

          this.loading.hideLoading();

          this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
          return;

        });
      }
    }

  }

  cargar() {
    console.log('paso por aqui', this.subCategory);
    let url =
      environment.apiUrl +
      'filter_datatables?categoryId=' +
      this.subCategory.categoryId +
      '&subCategoryId=' +
      this.subCategory.id;

    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

    let table = '#filterSubCategory';

    this.table = $(table).DataTable({
      destroy: true,
      language: environment.DataTableEspaniol,
      serverSide: false,
      processing: true,
      stateSave: false,
      cache: false,
      searching: false,
      paging: false,
      stateSaveParams: function (settings, data) {
        data.search.search = "";
        //$('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
      },
      initComplete: function (settings, data) {
        settings.oClasses.sScrollBody = "";
        // $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');

      },
      /*  scrollY: '7vw',
       scrollX: true, */
      bLengthChange: false,
      dom: `
              <'row'<'offset-1 col-sm-6 col-12 d-flex flex-column justify-content-center select-personalize-datatable'l>
                  <'col-md-5 col-12 label-search'f>
              >
              <'table-responsive't>
              <'row'<'col-sm-12 col-12 d-flex flex-column justify-content-center'p>>
          `,

      headerCallback: () => {
        $('.buttons-collection').html('<i class="far fa-edit"></i>' + ' ' + this.translate.instant('GENERAL.SHOW/HIDE'))
      },
      buttons: [
        {
          extend: 'colvis',
          text: this.translate.instant('GENERAL.SHOW/HIDE'),
          columnText: function (dt, idx, title) {
            return title;
          },
        },
      ],
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
        {
          data: 'code',
          title: this.translate.instant('CONFIGURATIONS.CODE'),
          render: (data, type, row) => {
            if (data == null || data == 0) {
              return '<span class="text center" aria-hidden="true"> No disponible</span>';
            } else {
              return (
                '<span class="color-span-table" data-toggle="tooltip" data-placement="top" title="' +
                '">' +
                data +
                '</span>'
              );
            }
          },
        },
        {
          data: 'name',
          title: this.translate.instant('CONFIGURATIONS.NAME'),
          render: (data, type, row) => {
            let name = data;
            if (name.length > 30) {
              name = name.substr(0, 29) + '...';
            }
            return (
              '<span class="color-span-table" data-toggle="tooltip" data-placement="top" title="' +
              data +
              '">' +
              name +
              '</span>'
            );
          },
        },
        {
          data: null,
          sortable: false,
          searchable: false,
          title: this.translate.instant('GENERAL.ACTIONS'),
          render: (data, type, row) => {
            let botones = '<div class="text-center">';

            botones += `
                            <span class="editFilter m-1" title="Editar filtro vinculado">
                              <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                            </span>
                        `;

            if (data.id > 0) {

              botones +=
                '<button class="btn delete" title="Eliminar filtro vinculado"><i class="far fa-times-circle point icon-delect"></i></button>';
            }



            botones += '</div>';

            return botones;
          },
        },

      ],
      order: [1, 'asc'],
    });

    /* $('#filterSubCategory').wrap('<div class="scroll-category" />'); */
    this.delete('#filterSubCategory tbody', this.table);
    this.editFilter('#filterSubCategory tbody', this.table);


  }

  delete(tbody: any, table: any, that = this) {
    $(tbody).unbind();

    $(tbody).on('click', 'button.delete', function () {
      let data = table.row($(this).parents('tr')).data();

      that.deleteFilter(data.id);

    });
  }

  editFilter(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'span.editFilter', function () {
      let data = table.row($(this).parents('tr')).data();
      that.openFormEditFilter(data.id, this, data);
      console.log(data, 'datos para editar');
    });
  }

  openFormEditFilter(filterId: number, element: any, filter: any) {

    const modal = this._modalService.open(ModalEditSubCategoryComponent, {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true,
    });

    modal.componentInstance.data = filter;

    modal.result.then(
      (result) => {
        if (result) {
          this.table.ajax.reload();
          /*                if (this.subCategory.id > 0) {
                          try{
                            this.changeDetectorRef.detectChanges();
                            this.cargar();
                          } catch(e){
                    
                          }
                    
                        } */
        } else {
          element.checked = !element.checked;
        }
      },
      (reason) => {
        this.toastService.displayHTTPErrorToast(reason.status, reason.error.error);
      },
    );
  }


  deleteFilter(filterId: number) {

    this.loading.showLoading();

    this.stateEasyrouteService.deleteFilter(filterId).subscribe((data: any) => {

      this.loading.hideLoading();

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
        this.translate.instant('GENERAL.ACCEPT')
      );
      this.table.ajax.reload();

    }, (error) => {

      this.loading.hideLoading();
      this.toastService.displayHTTPErrorToast(
        error.status,
        error.error.error,
      );
      return;

    });
  }

  isSalesman() {
    return this.authLocal.getRoles()
      ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
      : false;
  }

  showToggleSubcategory() {

    this.toggleSubcategory = !this.toggleSubcategory;
    if (this.subCategory.id > 0) {
      try {
        this.changeDetectorRef.detectChanges();
        this.cargar();
      } catch (e) {

      }

    }
  }

}

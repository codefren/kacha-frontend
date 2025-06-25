import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryInterface } from '@optimroute/backend';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryMessages } from '@optimroute/shared';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@optimroute/env/environment';
declare var $: any;
import * as _ from 'lodash';
import { take } from 'rxjs/operators';


@Component({
  selector: 'easyroute-category-general-form',
  templateUrl: './category-general-form.component.html',
  styleUrls: ['./category-general-form.component.scss']
})
export class CategoryGeneralFormComponent implements OnInit {

  table: any;
  me: boolean;
  data:any;
  titleTranslate: string;
  categoryForm: FormGroup;
  category: CategoryInterface;
  category_messages: any;
  showSubcategory: boolean ;
  subCategories: boolean = true;
  categoryImages: { 
    id: number,
    urlimage: string,
    image: string
  }[] = [];
  cardImageBase64: string;

  constructor(

      private fb: FormBuilder,
      private stateEasyrouteService: StateEasyrouteService,
      private authLocal: AuthLocalService,
      private loading: LoadingService,
      private toastService: ToastService,
      private translate: TranslateService,
      private _router: Router,
      private _activatedRoute: ActivatedRoute,
      private changeDetectorRef: ChangeDetectorRef,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.validaciones(this.data.category);

    this.category = this.data.category;

    this.category.images = this.data.category.images;

    if (this.data.category.id > 0) {
      try{
        this.changeDetectorRef.detectChanges();
        this.cargar();
      } catch(e){

      }

    }  


  }

  validaciones( measure : CategoryInterface ) {

    this.categoryForm = this.fb.group({
      code:[measure.code, [Validators.required,Validators.maxLength(30)]],
      name:[measure.name,[Validators.required]],
      isActive:[measure.isActive, [Validators.required]],
      images:[measure.images]
    });

    let category_messages = new CategoryMessages();
    this.category_messages = category_messages.getCategoryMessages();
  }

  cargar() {
    console.log( this.data.category.id ,'cargar del formularios');
    let isSalesman = this.isSalesman() && this.me == false;
    let url =
          environment.apiUrl +
          'sub_category_datatables?categoryId=' +
          this.data.category.id;
      
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    
    let table = '#subcategory';

    this.table = $(table).DataTable({
        destroy: true,
        language: environment.DataTableEspaniol,
        serverSide: false,
        processing: true,
        stateSave: false,
        cache: false,
        searching: false,
        paging:false,
        stateSaveParams: function (settings, data) {
          data.search.search = "";
      },
        scrollY: '7vw',
        scrollCollapse: true,
        bLengthChange: false ,
        dom: `
        <'row'<'offset-1 col-sm-6 col-12 d-flex flex-column justify-content-center select-personalize-datatable'l>
            <'col-md-5 col-12 label-search'fr>
        >
        <t>
        <'row'<'col-sm-12 col-12 d-flex flex-column justify-content-center'p>>
      `,
        buttons: [
          {
              extend: 'colvis',
              text: this.translate.instant('GENERAL.SHOW/HIDE'),
              columnText: function(dt, idx, title) {
                  return idx + 1 + ': ' + title;
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
                            '<span data-toggle="tooltip" data-placement="top" title="' +
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
                        '<span data-toggle="tooltip" data-placement="top" title="' +
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
                    return `<span class="delete point" title="eliminar subcategoria vinculada"><i class="fas fa-trash editar"></i></span>`;
                },
            },
        ],
        order: [1, 'asc'],
    });
  
    this.delete('#subcategory tbody', this.table);
  
}

  delete(tbody: any, table: any, that = this) {
    $(tbody).unbind();

    $(tbody).on('click', 'span.delete', function() {
        let data = table.row($(this).parents('tr')).data();

        that.deleteSubCategory(data.id);
    });
}


  deleteSubCategory(subCategoryId: number){
  
this.loading.showLoading();

  this.stateEasyrouteService.deleteSubCategory(subCategoryId).subscribe( (data: any) => {
          
    this.loading.hideLoading();

    this.toastService.displayWebsiteRelatedToast(
      this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
      this.translate.instant('GENERAL.ACCEPT')
    );
    this.table.ajax.reload();


  }, ( error )=>{
     
    this.loading.hideLoading();
    this.toastService.displayHTTPErrorToast(
        error.status,
        error.error.error,
    );
    return;

  });
}

  closeDialog(value: any) {
  this.activeModal.close(value);
}

  isFormInvalid(): boolean {
  return !this.categoryForm.valid;
}

  createCategory(){
  let dataform = _.cloneDeep(this.categoryForm.value);

  dataform.images = dataform.images ?  dataform.images : [];

  if (this.isFormInvalid()) {
    this.toastService.displayWebsiteRelatedToast('The zone is not valid'),
        this.translate.instant('GENERAL.ACCEPT');
  } else {
    if (this.data.category.id && this.data.category.id > 0) {
          
      this.loading.showLoading();
      this.stateEasyrouteService.updateCategoryGeneral(this.data.category.id, dataform).subscribe( (data: any) => {

        this.loading.hideLoading();

        this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this.translate.instant('GENERAL.ACCEPT'),
        );

        this.closeDialog([true, { ok: true }]);


      }, ( error )=>{
        
        this.loading.hideLoading();
        this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
        );
        return;
      }
    );

    } else {

      this.loading.showLoading();

      this.stateEasyrouteService.registerCategoryGeneral(dataform).subscribe( (data: any) => {

        this.loading.hideLoading();

        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('CONFIGURATIONS.REGISTRATION'),
          this.translate.instant('GENERAL.ACCEPT')
        );

        this.closeDialog([true, { ok: true }]);
    
    
      }, (error)=>{
        
        this.loading.hideLoading();
        this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
        );
        return;
      }
      ); 
    }
  }

}

  changeActive() {

  if ( this.data.category.isActive == true ) {

    this.data.category.isActive = false;

    this.categoryForm.controls['isActive'].setValue( this.data.category.isActive );


  } else if ( this.data.category.isActive == false  ) {

    this.data.category.isActive = true;

    this.categoryForm.controls['isActive'].setValue( this.data.category.isActive );

  }

}

  isSalesman() {
  return this.authLocal.getRoles()
      ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
      : false;
}

  fileChangeEvent( $event: any){

  return this.loadImage64( $event );
}

  loadImage64( e: any ) {

 let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

  let pattern = /image-*/;

  let reader = new FileReader();

  if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
  }

  reader.onload = this._handleReaderLoaded.bind(this);
  
  reader.readAsDataURL(file); 
}

  _handleReaderLoaded(e: any) {
 
  let reader = e.target.result

  this.cardImageBase64 = reader;

  let data = {  // new image
    id:this.category.id,
    image : reader,
    urlimage: reader,
  };

  if ( this.category.id > 0 && this.category.id !== null ) {
  

    if (this.category.images.length >0) {
       
      this.stateEasyrouteService.updateCompanyCategoryImage(this.category.images[0].id, data,)
      .pipe( take(1) )
      .subscribe(
        ( resp ) => { 
          this.categoryImages =[]; //limpiar variable cuando sea arreglo quitar para que siempre sea 1 sola
          this.category.images =[]; ///limpiar variable cuando sea arreglo quitar
         
         let result = {
            id: resp.data.id,
            urlimage: resp.data.urlImage,
            image: resp.data.urlImage
          }

            this.categoryImages = this.categoryImages.concat([ result ]);              
            this.category.images = this.categoryImages; 

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
            this.translate.instant('GENERAL.ACCEPT')
          );
          this.loading.hideLoading();
        },
        ( error ) => {
          this.loading.hideLoading();
          this.toastService.displayHTTPErrorToast(error.error);
        }
      )
    } else { 
  
      let payload = {  // new image

        categoryId: this.category.id,

        image : reader

      };
      this.categoryImages =[]; //limpiar variable si llega hacer un arreglo se quita

      this.category.images =[]; //limpiar variable si llega hacer un arreglo se quita

      this.stateEasyrouteService.createCompanyCategoryImage( payload )
            .pipe( take(1) )
            .subscribe( ( dataImage: any ) => {
             let response = {
                id: dataImage.data.id,
                urlimage: dataImage.data.urlImage,
                image: dataImage.data.urlImage
              };
               
              this.categoryImages = this.categoryImages.concat([ response ]);              
              this.category.images = this.categoryImages; 
          
              this.toastService.displayWebsiteRelatedToast(
                this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                this.translate.instant('GENERAL.ACCEPT')
              );

              this.loading.hideLoading();
          }, 
          ( error )=>{

            this.toastService.displayHTTPErrorToast(error.error);
            this.loading.hideLoading();
          }); 
    }
   
  } else {
    //cuando es nuevo con el formulario
    this.categoryImages =[];

    this.category.images =[];

    this.categoryImages.push(data);

    this.category.images = this.categoryImages;

    this.categoryForm.get('images').setValue(  this.category.images );

  }
}





}

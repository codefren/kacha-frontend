import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { CategoryInterface } from '@optimroute/backend';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { CategoryMessages, ProductModalImgInfoComponent } from '@optimroute/shared';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
declare var $: any;
import * as _ from 'lodash';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { environment } from '../../../../../../apps/easyroute/src/environments/environment';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditSubCategoryComponent } from './modal-edit-sub-category/modal-edit-sub-category.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare function init_plugins();

@Component({
  selector: 'easyroute-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  table: any;
  me: boolean;
  data:  any ;
  titleTranslate: string;
  categoryForm: FormGroup;
  category: CategoryInterface;
  categoryImages: { 
    id: number,
    urlimage: string,
    image: string
  }[] = [];
  svgImages: { 
    id: number,
    urlimage: string,
    image: string
  }[] = [];
  category_messages: any;
  showSubcategory: boolean;
  cardImageBase64: string;
  cardSvgBase64: string;
  subCategories: boolean = true;
  imageError: string = '';
  toggleCategory: boolean = false

  date = new Date();

  list: boolean  = false;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private authLocal: AuthLocalService,
    private loading: LoadingService,
    private stateEasyrouteService: StateEasyrouteService,
    private _modalService: NgbModal,
    private toastService: ToastService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private rendered2: Renderer2
   ) { }

  ngOnInit() {
   
     setTimeout(() => {
      init_plugins();
    }, 1000); 
    this.load(); 
  }

  load(){
    this._activatedRoute.params.subscribe( params => {

      if ( params['category_id'] !== 'new' ) {

        this.loading.showLoading();

        this.stateEasyrouteService.getCategory(params['category_id']).subscribe(
            (data: any) => {
                this.category = data.data;
                this.setImagesArray( data.data.images );
                this.validaciones(this.category);
                this.showToggleCategory();
               /*  if (this.category.id > 0) {
                  try{
                    this.changeDetectorRef.detectChanges();
                    this.cargar();
                  } catch(e){
            
                  }
            
                }   */
                this.loading.hideLoading();
            },
            (error) => {
                this.loading.hideLoading();

                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );

       

      }  else {
        this.category =  new CategoryInterface()
        this.validaciones(this.category);
        this.showToggleCategory();
      }
      
    });
  }

  validaciones( measure : CategoryInterface ) {

    this.categoryForm = this.fb.group({
      code:[measure.code, [Validators.maxLength(30)]],
      name:[measure.name,[Validators.required]],
      isActive:[measure.isActive, [Validators.required]],
      highlight: [measure.highlight],
      valoration:[measure.valoration],
      images:[[]],
      list: [[]]
    });

    let category_messages = new CategoryMessages();
    this.category_messages = category_messages.getCategoryMessages();
    
  }

  cargar() {
    let isSalesman = this.isSalesman() && this.me == false;
    let url =
          environment.apiUrl +
          'sub_category_datatables?categoryId=' +
          this.category.id;
      
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
        initComplete : function (settings, data) {
            settings.oClasses.sScrollBody="";
         /*  $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll'); */
         
        },
        
        /* scrollY: '14vw',
        scrollX: true,  */
       // scrollCollapse: true,
        bLengthChange: false ,
        dom: `
        <'row'<'offset-1 col-sm-6 col-12 d-flex flex-column justify-content-center select-personalize-datatable'l>
            <'col-md-5 col-12 label-search'f>
        >
        <'table-responsive't>
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
                      <span class="editSubcategory m-1" title="Editar subcategoria vinculada">
                        <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                      </span>
                  `;

                  if (data.id > 0) {
                     
                      botones +=
                      '<button class="btn delete" title="Eliminar subcategoria vinculada"><i class="far fa-times-circle point icon-delect"></i></button>';
                  }

                  

                  botones += '</div>';

                  return botones;
              },
            },
        ],
        
        order: [1, 'asc'],
    });
    $('#subcategory').wrap('<div class="scroll-category" />');
    this.delete('#subcategory tbody', this.table);
    this.editSubcategory('#subcategory tbody', this.table);
  
  }

  delete(tbody: any, table: any, that = this) {
    $(tbody).unbind();

    $(tbody).on('click', 'button.delete', function() {
        let data = table.row($(this).parents('tr')).data();

        that.deleteSubCategory(data.id);
    });
  }

  editSubcategory(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'span.editSubcategory', function() {
        let data = table.row($(this).parents('tr')).data();
        that.openFormEditSubcategory(data.id, this, data);
    });
}

openFormEditSubcategory(filterId: number, element: any, subCategory: any) {
   
  const modal = this._modalService.open(ModalEditSubCategoryComponent, {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true,
  });

  modal.componentInstance.data = subCategory;

  modal.result.then(
      (result) => {
          if (result) {
            this.table.ajax.reload();
            /*  if (this.category.id > 0) {
              try{
                this.changeDetectorRef.detectChanges();
                this.cargar();
              } catch(e){
        
              }
        
            }   */
          } else {
              element.checked = !element.checked;
          }
      },
      (reason) => {
         this.toastService.displayHTTPErrorToast(reason.status, reason.error.error);
      },
  );
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


  isFormInvalid(): boolean {
    return !this.categoryForm.valid;
  }
  
  createCategory(){
   
    let dataform = _.cloneDeep(this.categoryForm.value);

    // si es foto se sube jpg, png 
     if ( !this.list ) { 
      dataform.images = dataform.images ?  dataform.images : [];

    } else {  // sino agregar las imagenes + svg  
      dataform.images = dataform.list ? dataform.list.concat( dataform.images || [] ) : [];  
    
    } 

    delete dataform.list;
    
    if (this.isFormInvalid()) {

      this.toastService.displayWebsiteRelatedToast('The zone is not valid'),
      this.translate.instant('GENERAL.ACCEPT');

    } else {

      if (this.category.id && this.category.id > 0) {
            
        this.loading.showLoading();
        this.stateEasyrouteService.updateByCompany(this.category.id, dataform).subscribe( (data: any) => {
  
          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
              this.translate.instant('GENERAL.ACCEPT'),
          );
          this._router.navigate(['category']);


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

        this.stateEasyrouteService.registerByCompany(dataform).subscribe( (data: any) => {

          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('CONFIGURATIONS.REGISTRATION'),
            this.translate.instant('GENERAL.ACCEPT')
          );
          this._router.navigate(['category']);
          //this.closeDialog([true, { ok: true }]);
      
      
        }, ( error ) => {
          
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

  fileChangeEvent( $event: any){
    return this.loadImage64( $event );
  }

  loadImage64( e: any ) {

    this.imageError = '';
    
    const allowedTypes = ['image/jpeg', 'image/png'];
    const allowedTypesList = ['image/svg+xml']
    const reader = new FileReader();
    const maxSize = 1000000;
    
    let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    console.log( file.type );

    if ( file.size > maxSize ) {
      this.imageError = 'Tamaño máximo permitido ' + maxSize / 1000 / 1000 + 'Mb';
      return;
    }

    if ( !this.list ) {  // validacion por listado
      
      if ( !allowedTypes.includes( file.type ) ) {
        return this.imageError = 'Formatos permitidos ( JPG | PNG )';
      }

    } else {
      
      if ( !allowedTypesList.includes( file.type ) ) {
        return this.imageError = 'Formatos permitidos ( SVG )';
      }
    }

    reader.onload = this._handleReaderLoaded.bind(this);
    
    reader.readAsDataURL(file); 
  }

  _handleReaderLoaded(e: any) {
   
    let reader: string = e.target.result;
    
    let data = {  // new image
      id: this.category.id,
      image : reader,
      urlimage: reader,
    };
  
    if ( this.list ) {  // listado

      this.cardSvgBase64 = reader;
      this.saveSvg( data, reader );

    } else { // foto

      this.cardImageBase64 = reader;
      this.savePhoto( data, reader );
    }

    /* console.log({ 
      svg: this.cardSvgBase64, 
      image: this.cardImageBase64, 
      imageList: this.category.list,
      imageFoto: this.category.images
    }); */
  }

  savePhoto( data: { id: number, image: string, urlimage: string, list?: boolean }, reader?: string ) {
    
    if ( this.category.id > 0 && this.category.id !== null ) {
    
      if ( this.category.images.length > 0 ) {
         
        this.stateEasyrouteService.updateCompanyCategoryImage(this.category.images[0].id, data,)
        .pipe( take(1) )
        .subscribe(
          ( resp ) => { 
            
            this.categoryImages = []; //limpiar variable cuando sea arreglo quitar para que siempre sea 1 sola
            this.category.images = []; ///limpiar variable cuando sea arreglo quitar
           
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

        this.categoryImages = []; //limpiar variable si llega hacer un arreglo se quita
        this.category.images = []; //limpiar variable si llega hacer un arreglo se quita

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
            ( error ) => {
  
              this.toastService.displayHTTPErrorToast(error.error);
              this.loading.hideLoading();
            }); 
      }
     
    } else {
      //cuando es nuevo con el formulario
      this.categoryImages = [];
      
      this.category.images = [];

      this.categoryImages.push(data);

      this.category.images = this.categoryImages;

      this.categoryForm.get('images').setValue(  this.category.images );

      this.changeDetectorRef.detectChanges();

    }
  }

  saveSvg( data: { id: number, image: string, urlimage: string, list?: boolean }, reader: string ) {
    
    data.list = this.list;

    delete data.urlimage;

    if ( this.category.id && this.category.id > 0 ) {
      
      if ( this.category.list.length > 0 ) {

        this.stateEasyrouteService.updateCompanyCategoryImage( this.category.list[0].id, data )
        .pipe( take(1) )
        .subscribe(
          ( resp ) => { 
            
            // se limpian los arrays
            this.svgImages = [];  
            this.category.list = []; 
           
            let result = {
              id: resp.data.id,
              urlimage: resp.data.urlImage,
              image: resp.data.urlImage,
              list: this.list
            }

            this.svgImages = this.svgImages.concat([ result ]);              
            this.category.list = this.svgImages; 

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
          image : reader,
          list: this.list
        };

        this.stateEasyrouteService.createCompanyCategoryImage( payload )
              .pipe( take(1) )
              .subscribe( ( dataImage: any ) => {
               let response = {
                  id: dataImage.data.id,
                  urlimage: dataImage.data.urlImage,
                  image: dataImage.data.urlImage,
                  list: this.list
                };
                 
                this.svgImages = this.svgImages.concat([ response ]);              
                this.category.list = this.svgImages; 
            
                this.toastService.displayWebsiteRelatedToast(
                  this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                  this.translate.instant('GENERAL.ACCEPT')
                );
  
                this.loading.hideLoading();
            }, 
            ( error ) => {
  
              this.toastService.displayHTTPErrorToast(error.error);
              this.loading.hideLoading();
            });
      }

    } else {

      //cuando es nuevo con el formulario
      this.svgImages = [];
  
      this.category.list = [];
  
      this.svgImages.push( data );
  
      this.category.list = this.svgImages;
  
      this.categoryForm.get('list').setValue(  this.category.list );
  
      this.changeDetectorRef.detectChanges();
    }
  }

  changeActive() {

    if ( this.category.isActive == true ) {
  
      this.category.isActive = false;
  
      this.categoryForm.controls['isActive'].setValue( this.category.isActive );

  
    } else if ( this.category.isActive == false  ) {
  
      this.category.isActive = true;
  
      this.categoryForm.controls['isActive'].setValue( this.category.isActive );
  
    }
  
  }

  changeHighlight(){
    if ( this.category.highlight == true ) {
  
      this.category.highlight = false;
  
      this.categoryForm.controls['highlight'].setValue( this.category.highlight );

  
    } else if ( this.category.highlight == false  ) {
  
      this.category.highlight = true;

      this.categoryForm.controls['highlight'].setValue( this.category.highlight );
  
    }
  }

  isSalesman() {
    return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
        : false;
  }

  showToggleCategory(){
     
    this.toggleCategory = !this.toggleCategory;
    if (this.category.id > 0) {
      try{
        this.changeDetectorRef.detectChanges();
        this.cargar();
      } catch(e){

      }

    }  
}

  showModalImgInfo() {
    
    const modal = this._modalService.open( ProductModalImgInfoComponent, {
        centered: true,
        backdrop: 'static',        
    });

    
    if ( this.list ) {
      modal.componentInstance.title = this.translate.instant('PRODUCTS.HOW_SVG');
      modal.componentInstance.type = 'list';

    } else {
      modal.componentInstance.type = 'categories';

    }
  }

  changeList( value: boolean ) {
    this.list = value;
    this.imageError = '';
  }

  convertToSafeUrl( base64: string ) {
    return this.sanitizer.bypassSecurityTrustResourceUrl( base64 );
  }


  setImagesArray( images: Array<{ id: number, urlimage: string, image: string, list: boolean }> ) {
    
    this.category.list = [];
    this.category.images = [];
    images.forEach(( image ) => {

      // se agigna una ternaria para controlar los datos de llegada
      image.urlimage = image.urlimage ? image.urlimage : image.image;
      
      if ( image.list ) {
        return this.category.list.push( image );
      }

      return this.category.images.push( image );
    });

    console.log({ list: this.category.list, images: this.category.images });
  }
}

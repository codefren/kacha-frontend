import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@optimroute/shared';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';

@Component({
  selector: 'easyroute-modal-filters',
  templateUrl: './modal-filters.component.html',
  styleUrls: ['./modal-filters.component.scss']
})
export class ModalFiltersComponent implements OnInit {

  @ViewChild('categoryId', { static: false }) categoryId: ElementRef<HTMLElement>;
  @ViewChild('subCategoryId', { static: false }) subCategoryId: ElementRef<HTMLElement>;
  
  loading: string = 'success';
  loadingSubcategory: string = 'success';

  category: any = [];
  subCategories: any = [];

  filter: any = {
    categoryId: '',
    subCategoryId: '',
    image: '',
  };

  constructor(
    public activeModal: NgbActiveModal,
    private stateEasyrouteService: StateEasyrouteService,
    private _toastService: ToastService,
    private changeDetect: ChangeDetectorRef,
    private rendered2: Renderer2,
  ) { }

  ngOnInit() {
    this.getCategory();
  }

  getCategory(){

    this.loading = 'loading';
  
    setTimeout( () => {

      this.stateEasyrouteService.getCategorys().subscribe(
          (data:any) => {
            this.category = data.data;
            
            if(this.filter.categoryId > 0){
              this.getSubcategory(this.filter.categoryId);
            }

            this.loading = 'success';
        },(error)=> {
          this.loading = 'error';
  
          this._toastService.displayHTTPErrorToast( 
            error.status, 
            error.error.error 
          );
        }
      );
    }, 500 );

  }
 
  getSubcategory(categoryId: string = '', changeEvent = false){

    if ( categoryId.length == 0 ) {
      this.subCategories = [];
      return this.changeDetect.detectChanges();
    }
    
    this.loadingSubcategory = 'loading';

    setTimeout( () => {
      
      this.stateEasyrouteService.getSubcategory(parseInt( categoryId )).subscribe(
        (data:any) => {

          this.subCategories = data.data;
  
          this.loadingSubcategory = 'success';
  
        },(error)=> {
          this.loadingSubcategory = 'error';

          this._toastService.displayHTTPErrorToast( 
            error.status, 
            error.error.error 
          );
        
          }
      );

    }, 1000 );

  }

  ChangeFilter(event: any) {
    
    let value = event.target.value;

    console.log('value', value)

    switch ( event.target.id ) {
      case "image":
        this.filter.image = event.target.checked
        console.log('image', event.target.id)
        break;
          
      case "categoryId": 
        this.subCategories = [];
        this.filter.subCategoryId = '';

        if ( value > 0 ) {
          this.getSubcategory(value);
        } 

        this.filter.categoryId = value;

        console.log('categoryId', event.target.id)

        break;
      
      default:
        this.filter.subCategoryId = value;
        break;
    }
  
  }

  clearSearch() {
    this.rendered2.setProperty( this.categoryId.nativeElement, 'value', '' );
    
    if  (this.subCategories.length > 0) {
      this.rendered2.setProperty( this.subCategoryId.nativeElement, 'value', '' );
    }

    this.filter = {
      categoryId: '',
      subCategoryId: '',
      image: '',
    };

    this.closeDialog();
  }

  closeDialog() {
    
    this.activeModal.close(this.filter);

  }

}

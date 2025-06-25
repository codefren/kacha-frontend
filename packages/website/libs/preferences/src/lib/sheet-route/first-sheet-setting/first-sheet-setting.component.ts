import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { ModalFormFieldComponent } from '../modal-form-field/modal-form-field.component';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-first-sheet-setting',
  templateUrl: './first-sheet-setting.component.html',
  styleUrls: ['./first-sheet-setting.component.scss']
})
export class FirstSheetSettingComponent implements OnInit {

  @Input() routeSheet: any;
  @Output('routeSheets')
  routeSheets: EventEmitter<any> = new EventEmitter();

  table: any;
  
  showForm: any=[];

  constructor( 
    private _modalService: NgbModal,
    private toastService: ToastService,
    private _translate: TranslateService,
    private loadingService: LoadingService,
    private backendService: BackendService,
    private detectChanges: ChangeDetectorRef
    ) { }

  ngOnInit() {
  }

  ngOnChanges() {

    this.showForm =[];
    
   if(this.routeSheet && this.routeSheet.formStructure){

    this.filterData(this.routeSheet.formStructure.routeSheetType);

   };
   
  }

  filterData(data: any){

    let datas = data.find((x: any) => x.id === 1);

    this.table = datas;

    // para dibujar las opciones que se veram en el formulario

    datas.formStructure.forEach(element => {

    let show ={
      id:element.id,
      name: element.name,
      isActive: element && element.preference && element.preference.isActive ? element && element.preference && element.preference.isActive: false
    };

    this.showForm.push(show);

      
    });
  
    this.detectChanges.detectChanges();

  }

  openModalForm(data:any){
    
    const modal = this._modalService.open(ModalFormFieldComponent, {
    
      backdropClass: 'modal-backdrop-ticket',

      windowClass:'modal-view-Roadmap',
  
      size:'md'
  
    });
    modal.componentInstance.data = data;

     modal.result.then(
        (data) => {
            
        },
        (reason) => {},
    ); 

  }

  changeGeneral(Event: any,){

    let data ={

      activateInitialRouteSheet : Event
    
    };

    this.backendService.post('route_sheet_company_preference', data).pipe(take(1)).subscribe((data)=>{

      this.routeSheets.emit(data.data );

      this.loadingService.hideLoading();

      this.toastService.displayWebsiteRelatedToast(
        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
    );

    }, error => {
      
      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

 
  updateStateActive(Event: any, FormId: number ,i: any){


    this.showForm[i].isActive = Event;

    this.loadingService.showLoading();

    let sent ={
    
        routeSheetTypeId: this.table.id,
        formStructureId: FormId,
        isActive : Event
    
    }

    this.backendService.post('route_sheet_company_preference_manage_item', sent).pipe(take(1)).subscribe((data)=>{


      this.routeSheets.emit(data.data );

      this.loadingService.hideLoading();

      this.toastService.displayWebsiteRelatedToast(
        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
    );

  
    }, error => {
      
      this.loadingService.hideLoading();


      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

}

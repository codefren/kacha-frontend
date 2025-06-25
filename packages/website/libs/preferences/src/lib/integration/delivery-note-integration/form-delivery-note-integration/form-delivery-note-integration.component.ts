import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from 'libs/backend/src/lib/backend.service';
import { IntegrationDeliveryNote } from 'libs/backend/src/lib/types/integration-delivery-note.type';
import { IntegrationPreferences } from 'libs/backend/src/lib/types/integration-preferences.type';
import { IntegrationPreferencesMessages } from 'libs/shared/src/lib/messages/integration-preferences/integration.message';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-form-delivery-note-integration',
  templateUrl: './form-delivery-note-integration.component.html',
  styleUrls: ['./form-delivery-note-integration.component.scss']
})
export class FormDeliveryNoteIntegrationComponent implements OnInit {

  @Input() integrationId: any;

  @Output('showDatas')

  showDatas: EventEmitter<any> = new EventEmitter();

  dataForm: FormGroup;

  dataMessages: any;

  dataIntegration: IntegrationDeliveryNote;


  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastService: ToastService,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    console.log(this.integrationId, 'id si es crear o editar');

    if (this.integrationId !== 'new') {

      this.loadingService.showLoading();

      console.log('editar');

      this.backendService.get('company_preference_integration_delivery_note/' + this.integrationId).pipe(take(1)).subscribe(({data})=>{
  
        this.dataIntegration = data;
  
        this.validaciones(this.dataIntegration);
       
        this.loadingService.hideLoading();
  
        this.changeDetectorRef.detectChanges();
  
      }, error => {
  
        this.loadingService.hideLoading();
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
  
      });
      
    } else {

      console.log('crear');

      this.dataIntegration =  new IntegrationPreferences();

      this.validaciones(this.dataIntegration);

      this.changeDetectorRef.detectChanges();
      
    }

    
  }

  validaciones( data : IntegrationDeliveryNote ) {

    this.dataForm = this.fb.group({

      templateName:[ data.templateName, [Validators.required, Validators.maxLength(255)]],

      readTo:[data.readTo,[Validators.required, Validators.min(1)]],

      deliveryPointId:[ data.deliveryPointId, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      deliveryNoteCode:[ data.deliveryNoteCode, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      code:[ data.code, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      name:[ data.name, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      quantity:[ data.quantity, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      price:[ data.price, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      taxPercent:[ data.taxPercent ,[Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      measure:[ data.measure, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      deliveryNoteObservation:[ data.deliveryNoteObservation,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      promptPayDiscountPercent:[ data.promptPayDiscountPercent,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      discountPercent:[ data.discountPercent,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      grossMass:[ data.grossMass,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      netMass:[ data.netMass,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      observation:[ data.observation,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      lotCode:[ data.lotCode,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

    });

    let dataMessages = new IntegrationPreferencesMessages();

    this.dataMessages = dataMessages.getIntegrationPreferencesMessages();
    
  }

  returnsListIntegration(){
    console.log('volver a notificaciones');
    let data ={
      showData :'list',
      update:false
    }
    
    this.showDatas.emit( data );
  }

  submit(){
    console.log(this.dataForm.value, 'value form');

    if (this.integrationId && this.integrationId > 0) {
            
      this.loadingService.showLoading();

      this.backendService.put('company_preference_integration_delivery_note/' + this.integrationId, this.dataForm.value).pipe(take(1)).subscribe( (data: any) => {

        this.loadingService.hideLoading();

        this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this.translate.instant('GENERAL.ACCEPT'),
        );

        let send ={
          showData :'list',
          update:true
        }
        
        this.showDatas.emit( send );
        
      }, ( error )=>{
        
        this.loadingService.hideLoading();
        this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
        );
        return;
      }
    );

    } else {

      this.loadingService.showLoading();

      this.backendService.post('company_preference_integration_delivery_note', this.dataForm.value).pipe(take(1)).subscribe( (data: any) => {

        this.loadingService.hideLoading();

        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('CONFIGURATIONS.REGISTRATION'),
          this.translate.instant('GENERAL.ACCEPT')
        );
        
        let send ={
          showData :'list',
          update:true
        }
        
        this.showDatas.emit( send );
    
      }, ( error ) => {
        
        this.loadingService.hideLoading();
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

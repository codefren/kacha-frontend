import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from 'libs/backend/src/lib/backend.service';
import { IntegrationPreferences } from 'libs/backend/src/lib/types/integration-preferences.type';
import { IntegrationPreferencesMessages } from 'libs/shared/src/lib/messages/integration-preferences/integration.message';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-form-integration',
  templateUrl: './form-integration.component.html',
  styleUrls: ['./form-integration.component.scss']
})
export class FormIntegrationComponent implements OnInit {

  @Input() integrationId: any;

  @Output('showDatas')

  showDatas: EventEmitter<any> = new EventEmitter();

  dataForm: FormGroup;

  dataMessages: any;

  dataIntegration: IntegrationPreferences;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastService: ToastService,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    if (this.integrationId !== 'new') {

      console.log('editar');

      this.loadingService.showLoading();

      this.backendService.get('company_preference_integration_route/' + this.integrationId).pipe(take(1)).subscribe(({data})=>{

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

  validaciones( data : IntegrationPreferences ) {

    this.dataForm = this.fb.group({

      templateName:[ data.templateName, [Validators.required, Validators.maxLength(255)]],

      readTo:[data.readTo,[Validators.required, Validators.min(1)]],

      deliveryPointId:[ data.deliveryPointId, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      name:[ data.name, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      address:[ data.address, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      deliveryZoneId:[ data.deliveryZoneId, [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      population:[ data.population ,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      postalCode:[ data.postalCode, [Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      deliveryWindowStart:[ data.deliveryWindowStart,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      deliveryWindowEnd:[ data.deliveryWindowEnd,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      phoneNumnber:[ data.phoneNumnber,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      email:[ data.email,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      demand:[ data.demand,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      volumetric:[ data.volumetric,[Validators.maxLength(10), Validators.pattern(/^[A-Z]+$/i)]],

      deliveryNotes:[ data.deliveryNotes,[Validators.maxLength(10),  Validators.pattern(/^[A-Z]+$/i)]],

      orderNumber:[ data.orderNumber,[Validators.maxLength(10),  Validators.pattern(/^[A-Z]+$/i)]],

      concatenateAddress:[ data.concatenateAddress],

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

    if (this.integrationId && this.integrationId > 0) {

      this.loadingService.showLoading();

      this.backendService.put('company_preference_integration_route/' + this.integrationId, this.dataForm.value).pipe(take(1)).subscribe( (data: any) => {

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

      this.backendService.post('company_preference_integration_route', this.dataForm.value).pipe(take(1)).subscribe( (data: any) => {

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

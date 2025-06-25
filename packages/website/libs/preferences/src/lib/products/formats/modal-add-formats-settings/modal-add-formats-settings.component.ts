import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from 'libs/backend/src/lib/backend.service';
import { MeasureInterface } from 'libs/backend/src/lib/types/measure.type';
import { MeasureMessages } from 'libs/shared/src/lib/messages/measure/measure.messages';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';
import { take } from 'rxjs/operators';
declare function init_plugins();
@Component({
  selector: 'easyroute-modal-add-formats-settings',
  templateUrl: './modal-add-formats-settings.component.html',
  styleUrls: ['./modal-add-formats-settings.component.scss']
})
export class ModalAddFormatsSettingsComponent implements OnInit {

  title: '';

  id: any;

  data: any;
    
  measure: MeasureInterface;

  measureForm: FormGroup;

  measure_messages: any;

  titleTranslate: string;


  constructor(
    private fb: FormBuilder,
    private loading: LoadingService,
    private backendService:BackendService,
    private _translate: TranslateService,
    private _toastService: ToastService,
    public dialogRef: NgbActiveModal,
   
  ) { }

  ngOnInit() {
    setTimeout(()=>{
        init_plugins();
    }, 1000);  
    
    this.load();
}

load(){
    

    if (this.id !== 'new' ) {

    this.loading.showLoading();

    this.backendService.get('measure/' + this.id).subscribe(
        (data: any) => {
            this.measure = data.data;
            this.validaciones(this.measure);
            
            this.loading.hideLoading();
        },
        (error) => {
            this.loading.hideLoading();

            this._toastService.displayHTTPErrorToast(error.status, error.error.error);
        },
    );

    }  else {
    this.measure =  new MeasureInterface()
    this.validaciones(this.measure);
    }
      
    
}

async validaciones(measure: MeasureInterface) {
    this.measureForm = this.fb.group({
        name: [
            measure.name,
            [Validators.required, Validators.maxLength(100), Validators.minLength(2)],
        ],
        code: [
            measure.code,
            [Validators.maxLength(30), Validators.minLength(1)],
        ],
        isActive: [measure.isActive, [Validators.required]],
        allowFloatQuantity: [ measure.allowFloatQuantity || false ],
        activateEquivalentAmount: [measure.activateEquivalentAmount],
        equivalentAmount: [measure.equivalentAmount ?  measure.equivalentAmount : 0]
    });

    let measure_messages = new MeasureMessages();
    this.measure_messages = measure_messages.getMeasureMessages();
}

isFormInvalid(): boolean {
    return !this.measureForm.valid;
}

createMeasure() {

    if (this.isFormInvalid()) {
        this._toastService.displayWebsiteRelatedToast('The measure is not valid'),
            this._translate.instant('GENERAL.ACCEPT');
    } else {
        if (this.measure.id && this.measure.id > 0) {
            this.loading.showLoading();
            this.backendService
                .put('measure/'+ this.measure.id, this.measureForm.value).pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.loading.hideLoading();

                        this._toastService.displayWebsiteRelatedToast(
                            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                            this._translate.instant('GENERAL.ACCEPT'),
                        );
                        this.dialogRef.close(true);

                    },
                    (error) => {
                        this.loading.hideLoading();
                        this._toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );

                        return;
                    },
                );
        } else {
            this.loading.showLoading();

            this.backendService.post('measure', this.measureForm.value).pipe(take(1)).subscribe(
                (data: any) => {
                    this.loading.hideLoading();

                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.REGISTRATION'),
                        this._translate.instant('GENERAL.ACCEPT'),
                    );
                    this.dialogRef.close(true);
                },
                (error) => {
                    this.loading.hideLoading();
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );

                    return;
                },
            );
        }
    }
}

changeActive() {
    if (this.data.measure.isActive == true) {
        this.data.measure.isActive = false;

        this.measureForm.controls['isActive'].setValue(this.data.measure.isActive);
    } else if (this.data.measure.isActive == false) {
        this.data.measure.isActive = true;

        this.measureForm.controls['isActive'].setValue(this.data.measure.isActive);
    }
}

close(value: any) {
  this.dialogRef.close(value);
}

}

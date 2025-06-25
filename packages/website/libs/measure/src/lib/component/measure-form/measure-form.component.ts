import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MeasureService } from '../../measure.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService, ToastService, MeasureMessages } from '@optimroute/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MeasureInterface } from '@optimroute/backend';
declare function init_plugins();

@Component({
    selector: 'lib-measure-form',
    templateUrl: './measure-form.component.html',
    styleUrls: ['./measure-form.component.scss'],
})

export class MeasureFormComponent implements OnInit {
    data: any;
    
    measure: MeasureInterface;
    measureForm: FormGroup;
    measure_messages: any;

    titleTranslate: string;

    constructor(
        private fb: FormBuilder,
        private loading: LoadingService,
        private _measureService: MeasureService,
        private _translate: TranslateService,
        private _toastService: ToastService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        setTimeout(()=>{
            init_plugins();
        }, 1000);  
        
        this.load();
    }

    load(){
        this._activatedRoute.params.subscribe( params => {
    
          if ( params['measure_id'] !== 'new' ) {
    
            this.loading.showLoading();
    
            this._measureService.getMeasure(params['measure_id']).subscribe(
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
          
        });
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
            activateEquivalentAmount: [measure.activateEquivalentAmount ],
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
                this._measureService
                    .updateMeasure(this.measure.id, this.measureForm.value)
                    .subscribe(
                        (data: any) => {
                            this.loading.hideLoading();

                            this._toastService.displayWebsiteRelatedToast(
                                this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                                this._translate.instant('GENERAL.ACCEPT'),
                            );
                            this._router.navigate(['measure']);

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

                this._measureService.registerMeasure(this.measureForm.value).subscribe(
                    (data: any) => {
                        this.loading.hideLoading();

                        this._toastService.displayWebsiteRelatedToast(
                            this._translate.instant('GENERAL.REGISTRATION'),
                            this._translate.instant('GENERAL.ACCEPT'),
                        );
                        this._router.navigate(['measure']);
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
}

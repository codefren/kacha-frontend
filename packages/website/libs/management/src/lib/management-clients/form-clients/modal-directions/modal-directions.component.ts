import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { DirectionsMessages, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-directions',
  templateUrl: './modal-directions.component.html',
  styleUrls: ['./modal-directions.component.scss']
})
export class ModalDirectionsComponent implements OnInit {


  form: FormGroup;
  direction: any = {
    id: '',
    deliveryPointId: '',
    address: '',
    coordinatesLatitude: '',
    coordinatesLongitude: '',
    postalCode: '',
    province: ''
  };
  directions_messages: any;
  showAddress: boolean = true;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private detectChanges: ChangeDetectorRef,
    private backend: BackendService,
    private translate: TranslateService,
    private toastService: ToastService) { }

  ngOnInit() {

    this.form = this.fb.group(
      {
        id: [this.direction.id],
        deliveryPointId: [this.direction.deliveryPointId ? this.direction.deliveryPointId : 0, [Validators.required]],
        address: [this.direction.address, [Validators.required]],
        coordinatesLatitude: [this.direction.coordinatesLatitude, [Validators.required, Validators.pattern('^-?[0-9]{1,3}(?:.[0-9]{0,14})?$')]],
        coordinatesLongitude: [this.direction.coordinatesLongitude, [Validators.required, Validators.pattern('^-?[0-9]{1,3}(?:.[0-9]{0,14})?$')]],
        postalCode: [this.direction.postalCode],
        province: [this.direction.province]
      }
    );

    this.directions_messages = new DirectionsMessages().getDirectionsMessages();
  }


  close(){
    this.activeModal.close(false);
  }

  submit (){
    this.activeModal.close({data: this.form.value });
  }


  searchAddress() {
    let addressData = this.form.get('address').value;
    this.showAddress = false;

    setTimeout(() => {
        if (addressData) {
            this.backend
                .get('delivery_point_search_address?address=' + addressData)
                .subscribe(
                    (response) => {
                        this.form.controls['address'].setValue(
                            response[0].address,
                        );
                        this.form.controls['coordinatesLatitude'].setValue(
                            (+response[0].coordinates.latitude).toPrecision(15),
                        );
                        this.form.controls['coordinatesLongitude'].setValue(
                            (+response[0].coordinates.longitude).toPrecision(15),
                        );
                        this.form.updateValueAndValidity();
                        this.showAddress = true;
                        this.detectChanges.detectChanges();


                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.error.code,
                            error.error,
                        );
                        this.showAddress = true;
                        this.detectChanges.detectChanges();
                    },
                );
        } else {
            this.detectChanges.detectChanges();
            this.toastService.displayWebsiteRelatedToast('Debe indicar la dirección.'),
            this.translate.instant('GENERAL.ACCEPT');
        }
    }, 500);
  }

}

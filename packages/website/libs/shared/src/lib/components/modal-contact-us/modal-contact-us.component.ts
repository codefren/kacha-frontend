import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '@optimroute/backend';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'easyroute-modal-contact-us',
    templateUrl: './modal-contact-us.component.html',
    styleUrls: ['./modal-contact-us.component.scss']
})
export class ModalContactUsComponent implements OnInit {

    data: any;
    form: FormGroup;
    typeForm = 1;
    constructor(public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private backend: BackendService,
        private loading: LoadingService,
        private toast: ToastService) { }

    ngOnInit() {
        console.log(this.data);
        this.load();
    }

    close() {
        this.activeModal.close({})
        this.form.reset();
    }


    load() {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(30)]],
            companyName: ['', [Validators.required, Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]],

        });
    }

    sendContact() {
        this.loading.showLoading();
        this.backend.post('contact_plan', {
            ...this.form.value,
            type: this.typeForm
        }).pipe(take(1)).subscribe(() => {
            this.close();
            this.loading.hideLoading();
        }, error => {
            this.toast.displayHTTPErrorToast(error.status, error.error.error);
            this.close();
        });


    }

}

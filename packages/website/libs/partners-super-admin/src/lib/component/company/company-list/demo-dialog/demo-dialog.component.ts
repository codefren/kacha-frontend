import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { dateToObject, getToday, objectToString } from '../../../../../../../shared/src/lib/util-functions/date-format';
import { CompanyMessages } from 'libs/shared/src/lib/messages/company/company.message';

@Component({
  selector: 'easyroute-demo-dialog',
  templateUrl: './demo-dialog.component.html',
  styleUrls: ['./demo-dialog.component.scss']
})
export class DemoDialogComponent implements OnInit {

  dateNow: NgbDateStruct = dateToObject(getToday());
  formDemo: FormGroup;
  startDemoDate: any;
  endDemoDate: any;
  company_messages: any;
  data: any;
  startDateSeleccionado: NgbDate;
  buttonDisabled: boolean = true;

  constructor(
    public activeModal: NgbActiveModal, 
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
}

initForm() {
    this.formDemo = this.fb.group({
        startDemoDate: [
            this.startDemoDate ? this.startDemoDate : '',
            [Validators.required],
        ],
        endDemoDate: [
            this.endDemoDate ? this.endDemoDate : '',
            [Validators.required, this.startDemoDateConfirmar.bind(this)],
        ],
    });

    this.formDemo.updateValueAndValidity();
    this.formDemo.controls['endDemoDate'].disable();

    if (this.startDemoDate) {
        this.startDateSelect(this.startDemoDate);
    }

    let company_messages = new CompanyMessages();
    this.company_messages = company_messages.getCompanyMessages();
}

startDemoDateConfirmar(group: AbstractControl) {
    let startDemoDate = objectToString(group.root.value.startDemoDate);
    let endDemoDate = objectToString(group.value);

    if (endDemoDate < startDemoDate) {
        return {
            confirmar: true,
        };
    }

    return null;
}

startDateSelect(event: any) {
    this.startDateSeleccionado = event;

    this.formDemo.controls['endDemoDate'].enable();

    this.buttonDisabled = false;
}

}

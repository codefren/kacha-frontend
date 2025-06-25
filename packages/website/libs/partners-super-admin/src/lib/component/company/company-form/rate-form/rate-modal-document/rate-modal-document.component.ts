import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { CustomDatepickerI18n, Language, MomentDateFormatter, dateToObject, getToday } from '@optimroute/shared';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'easyroute-rate-modal-document',
  templateUrl: './rate-modal-document.component.html',
  styleUrls: ['./rate-modal-document.component.scss'],
  providers: [
    Language,
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
],
})
export class RateModalDocumentComponent implements OnInit {

  form: FormGroup;
  title: string;

  document: any = {
    id: '',
    companyId: '',
    name: '',
    date: '',
    document: ''
  };

  document_messages: any;

  min: NgbDateStruct = dateToObject(getToday());

  fileData: File = null;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {

    this.validaciones();
    
  }

  validaciones() {
    if (this.document.id > 0 ) {
      this.document.date = dateToObject(this.document.date ? this.document.date : getToday() );
    } else {
      this.document.date = dateToObject(getToday())
    }

    this.form = this.fb.group(
      {
        id: [this.document.id],
        companyId: [this.document.companyId, [Validators.required]],
        name: [this.document.name, [Validators.required, Validators.minLength(2)]],
        date: [this.document.date, [Validators.required]],
        document: [this.document.urlDocumento, [Validators.required]],
      }
    ); 

    if(this.document && this.document.id && this.document.id > 0){
      this.form.controls['document'].clearValidators();
      this.form.updateValueAndValidity();
    }

  }

  close(){
    this.activeModal.close(false);
  }

  submit (){

    let dateValue = moment(`${this.form.value.date.year}-${this.form.value.date.month.toString().padStart(2, '0')}-${this.form.value.date.day.toString().padStart(2, '0')}`).format('YYYY-MM-DD');
   
    let documentData: FormData = new FormData();
    documentData.append('companyId', this.document.companyId);
    documentData.append('name', this.form.value.name );
    documentData.append('date', dateValue );
    if(this.fileData){
      documentData.append('document', this.fileData, this.fileData.name);
    }
    

    if (this.document.id > 0) {
      documentData.append('id', this.document.id);
      documentData.append('_method', 'put' );
    }


    console.log(documentData)
    this.activeModal.close(documentData);
  }

  fileChange(archivo: File){
    
    this.fileData = archivo;
    console.log(this.fileData, 'file data');

  }

}

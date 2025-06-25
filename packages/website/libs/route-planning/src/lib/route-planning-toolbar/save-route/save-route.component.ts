import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionMessages, dateToObject, getToday, objectToString } from '@optimroute/shared';

@Component({
  selector: 'easyroute-save-route',
  templateUrl: './save-route.component.html',
  styleUrls: ['./save-route.component.scss'],
})

export class SaveRouteComponent implements OnInit {

  min: NgbDateStruct = dateToObject(getToday());
  dateSearch: string;
  sessionForm: FormGroup;
  session_messages: any;

  constructor(
      public activeModal: NgbActiveModal,
      private fb: FormBuilder,
      ) { }

  ngOnInit() {
    this.dateSearch = moment(objectToString(this.min)).format('DD/MM/YYYY')
    this.initForm();
  }

  initForm() {
   
     this.sessionForm = this.fb.group({
        name: ['', 
          [
            Validators.required, 
            Validators.minLength(2), 
            Validators.maxLength(50)
          ]
        ],
        description: ['',
          [
            Validators.required, 
            Validators.minLength(10), 
            Validators.maxLength(1000)
          ]
        ],
        savedDate: ['',
          [
            Validators.required
          ]
        ],
     });

     let session_messages = new SessionMessages();
     this.session_messages = session_messages.getSessionMessages();
  }

}

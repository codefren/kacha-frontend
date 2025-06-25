import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { take } from 'rxjs/operators';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SessionMessages, dateToObject, getToday 
} from '@optimroute/shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'select-date',
    templateUrl: './select-date.component.html',
    styleUrls: ['./select-date.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SelectDateComponent implements OnInit {
    date: NgbDateStruct;

    dateAssignate: string;
    min: NgbDateStruct = dateToObject(getToday());
    data: any
    formDemo: FormGroup;
    session_messages: any;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private preferecesFacade: PreferencesFacade
        ) { }
    

    ngOnInit() {
        this.initForm();

        this.preferecesFacade.preferences$.pipe((take(1))).subscribe((data) => {

            data.controlPanel.assignedNextDay

            let date = this.dateAssignate ? this.dateAssignate : data.controlPanel.assignedNextDay ? new Date( new Date().getTime() +  1*24*60*60*1000).toISOString() : new Date().toISOString();
            this.date = dateToObject(date);

        })
    }

    initForm() {
        this.formDemo = this.fb.group({
            start: ['',
             [
               Validators.required
             ]
           ],
        });
   
        let session_messages = new SessionMessages();
        this.session_messages = session_messages.getSessionMessages();
     }

    
}

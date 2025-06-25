import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationMessages } from '../../messages/notifications/notifications.messages';


@Component({
  selector: 'easyroute-moda-send-notification',
  templateUrl: './moda-send-notification.component.html',
  styleUrls: ['./moda-send-notification.component.scss']
})
export class ModaSendNotificationComponent implements OnInit {

    
  form: FormGroup;

  title: string;
  message: string;

  send: any = {
    email:''
  };

  notificationMessages: any;


  fileData: File = null;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {

    this.validaciones();
    
  }

  validaciones() {
   
    this.form = this.fb.group(
      {
       // id: [this.send.id],
        email: [this.send.email, [Validators.required, Validators.email]],
      }
    ); 

    let notificationMessages = new NotificationMessages();

    this.notificationMessages = notificationMessages.getValidationMessages();


  }

  close(){
    this.activeModal.close(false);
  }

  submit (){

    this.activeModal.close(this.form.value);
  }

}

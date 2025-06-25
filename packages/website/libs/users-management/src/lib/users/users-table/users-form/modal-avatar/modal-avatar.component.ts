import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-avatar',
  templateUrl: './modal-avatar.component.html',
  styleUrls: ['./modal-avatar.component.scss']
})
export class ModalAvatarComponent implements OnInit {

  avatarForm: FormGroup;

  avatarImg: string = '';

  imgLoad: any;
  
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {

    this.avatarImg = this.imgLoad;
  }


  close(){
    this.activeModal.close([false, null]);
  }

  changeAvatar(event: string){

    this.avatarImg = event;

  }

  submit(){
    
    this.activeModal.close([true, this.avatarImg]);

  }

}

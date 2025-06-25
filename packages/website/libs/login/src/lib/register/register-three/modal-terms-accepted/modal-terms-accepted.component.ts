import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'easyroute-modal-terms-accepted',
  templateUrl: './modal-terms-accepted.component.html',
  styleUrls: ['./modal-terms-accepted.component.scss']
})
export class ModalTermsAcceptedComponent implements OnInit {
  
  img: string;

  constructor(
    public dialogRef: NgbActiveModal,
    private _translate: TranslateService) {
      this.img = 'url(assets/images/background/fondo-login.png)';
    }

  ngOnInit() {
  }

  cancelTerms() {
    this.dialogRef.close();
  }

}

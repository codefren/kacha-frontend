import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'easyroute-modal-promotion-img-info',
  templateUrl: './modal-promotion-img-info.component.html',
  styleUrls: ['./modal-promotion-img-info.component.scss']
})
export class ModalPromotionImgInfoComponent implements OnInit {

  @Input()
  title;
  
  message: false;

  @Input()
  type: 'showPromotionCountDown' |'showPromotionHomes' | 'showPromotionHome' | 'showPromotionTopCategoryList' | 'showPromotionBetweenProducts'| 'list' = 'showPromotionCountDown';

  constructor( 
    public activeModal: NgbActiveModal,
    private translate: TranslateService) { }

  ngOnInit() {
  }

}

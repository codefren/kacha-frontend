import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'easyroute-product-modal-img-info',
  templateUrl: './product-modal-img-info.component.html',
  styleUrls: ['./product-modal-img-info.component.scss']
})
export class ProductModalImgInfoComponent implements OnInit {

  @Input()
  title: string = this.translate.instant('PRODUCTS.HOW_IMAGE');
  
  message: false;

  @Input()
  type: 'products' | 'promotion' | 'categories' | 'list' = 'products';

  constructor(
    public activeModal: NgbActiveModal,
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

}

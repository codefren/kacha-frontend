import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { StateRoutePlanningService } from '../../../../../../state-route-planning/src/lib/state-route-planning.service';

@Component({
  selector: 'easyroute-modal-end-routes',
  templateUrl: './modal-end-routes.component.html',
  styleUrls: ['./modal-end-routes.component.scss']
})
export class ModalEndRoutesComponent implements OnInit {

  routeName: any;

  constructor(
    public dialogRef: NgbActiveModal,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private detectChanges: ChangeDetectorRef,
    private routingPlanning: StateRoutePlanningService,
  ) { }

  ngOnInit() {
  }

  close(value: any) {
    this.dialogRef.close(value);
  }

}

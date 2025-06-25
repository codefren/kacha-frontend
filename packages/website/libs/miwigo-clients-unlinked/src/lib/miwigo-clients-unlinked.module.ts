import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiwigoClientsUnlinkedListComponent } from './component/miwigo-clients-unlinked-list/miwigo-clients-unlinked-list.component';
import { MiwigoClientsUnlinkedFormComponent } from './component/miwigo-clients-unlinked-form/miwigo-clients-unlinked-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModalDeliveryPointsComponent } from './component/miwigo-clients-unlinked-form/modal-delivery-points/modal-delivery-points.component';
import { ModalConfirmationDeleteLinkedComponent } from './component/miwigo-clients-unlinked-form/modal-confirmation-delete-linked/modal-confirmation-delete-linked.component';
import { ModalConfirmationUpdateLinkedComponent } from './component/miwigo-clients-unlinked-form/modal-confirmation-update-linked/modal-confirmation-update-linked.component';
import { ModalConfirmationCreateDeliveryPointComponent } from './component/miwigo-clients-unlinked-form/modal-confirmation-create-delivery-point/modal-confirmation-create-delivery-point.component';

@NgModule({
    imports:[
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
          path: '',
          component: MiwigoClientsUnlinkedListComponent
      },
      {
        path: ':miwigo-unlinked',
        component: MiwigoClientsUnlinkedFormComponent
      }
    ]),
    TranslateModule.forChild()
],
    declarations: [MiwigoClientsUnlinkedListComponent, MiwigoClientsUnlinkedFormComponent, ModalDeliveryPointsComponent, ModalConfirmationDeleteLinkedComponent, ModalConfirmationUpdateLinkedComponent, ModalConfirmationCreateDeliveryPointComponent],
   // exports:[MiwigoClientsUnlinkedListComponent, MiwigoClientsUnlinkedFormComponent, ModalDeliveryPointsComponent],
    entryComponents:[MiwigoClientsUnlinkedListComponent, MiwigoClientsUnlinkedFormComponent, ModalDeliveryPointsComponent,ModalConfirmationDeleteLinkedComponent, ModalConfirmationUpdateLinkedComponent, ModalConfirmationCreateDeliveryPointComponent]
})
export class MiwigoClientsUnlinkedModule {}

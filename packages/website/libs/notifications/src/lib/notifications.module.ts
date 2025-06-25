import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsListComponent } from './components/notifications-list/notifications-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WebSocketService } from './notifications.websocket';
import { NotificationsListDeletedComponent } from './components/notifications-list-deleted/notifications-list-deleted.component';
import { NotificationsDetailsComponent } from './components/notifications-details/notifications-details.component';
import { NoticesComponent } from './components/notifications-setting/notices/notices.component';
import { PolpooNotificationsComponent } from './components/notifications-list/polpoo-notifications/polpoo-notifications.component';
import { LinksComponent } from './components/notifications-list/links/links.component';
import { NoticesDetailsComponent } from './components/notifications-list/notices-details/notices-details.component';
import { ModalDeclineLinkedComponent } from './components/notifications-list/links/modal-decline-linked/modal-decline-linked.component';
import { ModalAcceptLinkedComponent } from './components/notifications-list/links/modal-accept-linked/modal-accept-linked.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forChild([
          {
            path: '',
            component: NotificationsListComponent,
          },
          {
            path: 'delected',
            component: NotificationsListDeletedComponent,
          },
          {
            path: ':notificactions_id',
            component: NotificationsDetailsComponent,
          },
          {
            path: 'delected/:notificactions_id',
            component: NotificationsDetailsComponent, data: { delected: true }
          },
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
      NotificationsListComponent, 
      NotificationsListDeletedComponent, 
      NotificationsDetailsComponent, 
      NoticesComponent, 
      PolpooNotificationsComponent, 
      LinksComponent, 
      NoticesDetailsComponent, 
      ModalDeclineLinkedComponent, 
      ModalAcceptLinkedComponent
    ],
    providers:[WebSocketService],
    entryComponents: [
      ModalDeclineLinkedComponent,
      ModalAcceptLinkedComponent
    ]
})
export class NotificationsModule {}

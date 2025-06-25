import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ChatPageComponent } from './components/chat-page/chat-page.component';
import { ChatTalksComponent } from './components/chat-talks/chat-talks.component';
import { SharedModule } from '@optimroute/shared';
import { FilterStateModule } from '../../../filter-state/src/lib/filter-state.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgbModule,
        FormsModule,
        FilterStateModule,
        ReactiveFormsModule,
        RouterModule.forChild([
          {
            path: '',
            component: ChatPageComponent,
          }
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [ChatListComponent, ChatPageComponent, ChatTalksComponent],
    entryComponents: [ChatListComponent, ChatPageComponent, ChatTalksComponent]
})
export class ChatModule {}

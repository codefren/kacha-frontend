import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '@optimroute/shared';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModalHelpComponent } from './modal-help/modal-help.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalNoveltyComponent } from './modal-novelty/modal-novelty.component';
@NgModule({
    declarations: [
        HomeComponent, 
        ModalHelpComponent, 
        ModalNoveltyComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        NgbModule,
        RouterModule.forChild([{ path: '', pathMatch: 'full', component: HomeComponent }]),
        TranslateModule.forChild(),
    ],
    entryComponents: [
        ModalHelpComponent,
        ModalNoveltyComponent
    ]
})
export class HomeModule {}

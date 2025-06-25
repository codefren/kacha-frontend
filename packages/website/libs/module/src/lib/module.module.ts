import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModuleListComponent } from './module-list/module-list.component';
import { CardModuleComponent } from './module-list/card-module/card-module.component';
import { DescriptionModuleModalComponent } from './module-list/card-module/description-module-modal/description-module-modal.component';
import { ModalModulesComponent } from 'libs/shared/src/lib/components/modal-modules/modal-modules.component';
import { SharedModule } from '@optimroute/shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//import { ProfileModule } from '../../../../libs/profile/src/lib/profile.module'

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgbModule,
        RouterModule.forChild([
            {
                path: '',
                component: ModuleListComponent,
            },
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        ModuleListComponent,
        CardModuleComponent,
        DescriptionModuleModalComponent,
    ],
    entryComponents: [
        ModalModulesComponent,
        DescriptionModuleModalComponent,
    ]
})

export class ModuleModule {}

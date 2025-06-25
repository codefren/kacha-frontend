import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@optimroute/shared';
import { TranslateModule } from '@ngx-translate/core';
import { StateProfileSettingsModule } from '@optimroute/state-profile-settings';
import { ProfileMenuModule } from '../../../../apps/easyroute/src/app/layout/profile-menu/profile-menu.module';
@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        StateProfileSettingsModule,
       /*  RouterModule.forChild([{ path: '', pathMatch: 'full', component: HelpComponent }]), */
        TranslateModule.forChild(),
    ],
    declarations: [],
    exports: [],
    entryComponents: []
})
export class HelpModule {}

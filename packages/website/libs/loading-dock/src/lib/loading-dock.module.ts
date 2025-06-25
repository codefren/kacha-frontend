import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingDockListComponent } from './components/loading-dock-list/loading-dock-list.component';
import { LoadingDockFormComponent } from './components/loading-dock-form/loading-dock-form.component';
import { SharedModule } from '@optimroute/shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterStateModule } from '@easyroute/filter-state';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModalForceFinishedComponent } from './components/loading-dock-modal/modal-force-finished/modal-force-finished.component';
import { DouwloadPackageComponent } from './components/loading-dock-form/douwload-package/douwload-package.component';
import { LoadePackageComponent } from './components/loading-dock-form/loade-package/loade-package.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgbModule,
        FilterStateModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: LoadingDockListComponent,

            },
            {
                path: ':id',
                component: LoadingDockFormComponent,
            },
            
            { path: '**', redirectTo: 'loading-dock', pathMatch: 'full' },
            
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        LoadingDockListComponent, 
        LoadingDockFormComponent,  
        ModalForceFinishedComponent,  
        DouwloadPackageComponent, LoadePackageComponent
    ],
    entryComponents:[
        ModalForceFinishedComponent
        
    ]
})
export class LoadingDockModule {}

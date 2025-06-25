import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyProfileFormComponent } from './component/company-profile-form/company-profile-form.component';
import { GenericInformationComponent } from './component/company-profile-form/generic-information/generic-information.component';
import { ExerciseComponent } from './component/company-profile-form/exercise/exercise.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NgxMaskModule.forChild(),
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: CompanyProfileFormComponent,
            }
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        CompanyProfileFormComponent, 
        GenericInformationComponent, 
        ExerciseComponent],
})
export class CompanyProfileModule {}

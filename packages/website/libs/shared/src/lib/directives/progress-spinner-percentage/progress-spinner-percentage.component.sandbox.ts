import { sandboxOf } from 'angular-playground';
import { ProgressSpinnerPercentageDirective } from './progress-spinner-percentage.directive';
import { MatProgressSpinnerModule, MatSliderModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

const sandboxConfig = {
    declarations: [ProgressSpinnerPercentageDirective],
    imports: [MatProgressSpinnerModule, MatSliderModule, FormsModule],
};

export default sandboxOf(ProgressSpinnerPercentageDirective, sandboxConfig).add('default', {
    template:
        '<mat-progress-spinner [diameter]="100" [appProgressSpinnerPercentage]="value"\
              mode="determinate"\
              color="primary"\
              [value]="value"\
            >\
            </mat-progress-spinner>\
            <mat-slider [(ngModel)]="value"></mat-slider>',
    context: {
        value: 20,
    },
});

import { sandboxOf } from 'angular-playground';
import { ColorFilterDirective } from './color-filter.directive';

export default sandboxOf(ColorFilterDirective)
    .add('green', {
        template: `
            <div appColorFilter="green"
                style="border-radius: 250px;width: 250px;height: 250px;">
            </div>`,
    })
    .add('blue', {
        template: `
            <div appColorFilter="blue"
                style="border-radius: 250px;width: 250px;height: 250px;">
            </div>`,
    })
    .add('custom', {
        template: `
            <div appColorFilter="#0f8a9f"
                style="border-radius: 250px;width: 250px;height: 250px;">
            </div>`,
    });

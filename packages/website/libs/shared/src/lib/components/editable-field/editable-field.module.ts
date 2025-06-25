import { NgModule } from '@angular/core';
import { EditableFieldComponent } from './editable-field.component';
import { EditableFieldPopoverComponent } from './editable-field-popover/editable-field-popover.component';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { CustomMaterialModule } from '../../material.module';

@NgModule({
    imports: [CustomMaterialModule, SatPopoverModule],
    declarations: [EditableFieldComponent, EditableFieldPopoverComponent],
    exports: [EditableFieldComponent, EditableFieldPopoverComponent, SatPopoverModule],
})
export class EditableFieldModule {}

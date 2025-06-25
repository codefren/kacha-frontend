import { NgModule } from '@angular/core';
import { SideMenuComponent } from './side-menu.component';
import { VerticalInkBarComponent } from './vertical-ink-bar/vertical-ink-bar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from '../../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [FlexLayoutModule, RouterModule, CustomMaterialModule, CommonModule],
    declarations: [SideMenuComponent, VerticalInkBarComponent],
    exports: [SideMenuComponent, VerticalInkBarComponent],
})
export class SideMenuModule {}

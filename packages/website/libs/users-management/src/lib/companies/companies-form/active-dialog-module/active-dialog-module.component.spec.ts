import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveDialogModuleComponent } from './active-dialog-module.component';

describe('ActiveDialogModuleComponent', () => {
    let component: ActiveDialogModuleComponent;
    let fixture: ComponentFixture<ActiveDialogModuleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ActiveDialogModuleComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActiveDialogModuleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

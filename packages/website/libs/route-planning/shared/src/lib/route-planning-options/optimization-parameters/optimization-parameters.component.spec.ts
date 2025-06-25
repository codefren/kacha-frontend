import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationParametersComponent } from './optimization-parameters.component';

describe('OptimizationParametersComponent', () => {
    let component: OptimizationParametersComponent;
    let fixture: ComponentFixture<OptimizationParametersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OptimizationParametersComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptimizationParametersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

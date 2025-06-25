import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDeliveryPointComponent } from './edit-delivery-point.component';

describe('EditDeliveryPointComponent', () => {
    let component: EditDeliveryPointComponent;
    let fixture: ComponentFixture<EditDeliveryPointComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditDeliveryPointComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditDeliveryPointComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

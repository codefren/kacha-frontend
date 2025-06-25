import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreationDialogComponent } from './user-creation-dialog.component';

describe('UserCreationDialogComponent', () => {
    let component: UserCreationDialogComponent;
    let fixture: ComponentFixture<UserCreationDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserCreationDialogComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserCreationDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

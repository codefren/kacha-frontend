import { async, TestBed } from '@angular/core/testing';
import { AuthLocalModule } from './auth-local.module';

describe('AuthLocalModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AuthLocalModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(AuthLocalModule).toBeDefined();
    });
});

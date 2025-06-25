import { async, TestBed } from '@angular/core/testing';
import { MyOrdersModule } from './my-orders.module';

describe('MyOrdersModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MyOrdersModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(MyOrdersModule).toBeDefined();
    });
});

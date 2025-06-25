import { async, TestBed } from '@angular/core/testing';
import { OrdersModule } from './orders.module';

describe('OrdersModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [OrdersModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(OrdersModule).toBeDefined();
    });
});

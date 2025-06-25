import { async, TestBed } from '@angular/core/testing';
import { ChatModule } from './chat.module';

describe('ChatModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ChatModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(ChatModule).toBeDefined();
    });
});

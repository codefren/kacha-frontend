import { async, TestBed } from '@angular/core/testing';
import { MiwigoClientsUnlinkedModule } from './miwigo-clients-unlinked.module';

describe('MiwigoClientsUnlinkedModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MiwigoClientsUnlinkedModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(MiwigoClientsUnlinkedModule).toBeDefined();
    });
});

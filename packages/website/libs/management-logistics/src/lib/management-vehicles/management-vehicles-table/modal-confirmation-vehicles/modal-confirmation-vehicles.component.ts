import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VehiclesFacade } from '../../../../../../state-vehicles/src/lib/+state/vehicles.facade';

@Component({
    selector: 'easyroute-modal-confirmation-vehicles',
    templateUrl: './modal-confirmation-vehicles.component.html',
    styleUrls: ['./modal-confirmation-vehicles.component.scss'],
})
export class ModalConfirmationVehiclesComponent implements OnInit {
    @Input() id;
    @Input() name: string;
    buttonAccept: string;

    constructor(
        public activeModal: NgbActiveModal,
        private vehiclesFacade: VehiclesFacade,
    ) {}

    ngOnInit() {}

    closeModal(value: boolean) {
        this.activeModal.close([value]);
    }
}

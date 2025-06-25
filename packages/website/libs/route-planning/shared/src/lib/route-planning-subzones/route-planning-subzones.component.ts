import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { RoutePlanningFacade } from '@optimroute/state-route-planning';
import { map, take } from 'rxjs/operators';

@Component({
    selector: 'easyroute-route-planning-subzones',
    templateUrl: './route-planning-subzones.component.html',
    styleUrls: ['./route-planning-subzones.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoutePlanningSubzonesComponent implements OnInit {
    @Input() zoneId: number;
    @Input() subZones: any[];
    @Input() isOptimized: boolean = false;

    async removeSubzone(subZoneId: number) {

        const preferences = await this.preferencesFacade.optimizationPreferences$.pipe(take(1)).toPromise();
        this.facade.removeFromMultiZone(this.zoneId, subZoneId, preferences.createSession.autoEvaluateOnCharge);
    }
    trackById(index, item) {
        return item.id;
    }
    constructor(
        private facade: RoutePlanningFacade, 
        private preferencesFacade: PreferencesFacade,
        private keyValuePipe: KeyValuePipe,
        private _modalService: NgbModal) {}

    ngOnInit() {
    }

    splitAll(){

        const modal = this._modalService.open(ConfirmModalComponent, {
            size: 'xs',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        modal.componentInstance.message = '¿Seguro que quieres separar todas las rutas?'

        modal.result.then(async (data) => {
            if (data) {
                const preferences = await this.preferencesFacade.optimizationPreferences$.pipe(take(1)).toPromise();
                const zones = this.keyValuePipe.transform(this.subZones).map( x => x.key);
                this.facade.removeAllFromMultiZone(this.zoneId, zones, preferences.createSession.autoEvaluateOnCharge);
            }
        });
        
    }
}

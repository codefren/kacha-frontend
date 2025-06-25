import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'easyroute-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
})

export class HelpComponent implements OnInit {

    constructor(private facadeProfile: ProfileSettingsFacade) {}
    
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // this.facadeProfile.loadAll();
    }
    buscar(event: any){

    }
}

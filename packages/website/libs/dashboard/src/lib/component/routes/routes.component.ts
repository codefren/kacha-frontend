import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, ViewRef } from '@angular/core';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'easyroute-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit, OnDestroy {

  
  @Input() date: any;
  @Input() updateNumber: number;
  showCosts: boolean = false;
  unsubscribe$ = new Subject<void>();

  constructor(private preferencesFacade: PreferencesFacade, 
    private detectChanges: ChangeDetectorRef) { }

  ngOnInit() {

    this.preferencesFacade.loadDashboardPreferences();
    this.preferencesFacade.loaded$.pipe(take(2)).subscribe(async (load)=>{
      if(load){
        this.preferencesFacade.dashboard$.pipe(takeUntil(this.unsubscribe$)).subscribe((data)=>{
      
          try {
            this.showCosts = data.showCosts;
            this.detectChanges.detectChanges(); 
          } catch (error) {
            
          }
        });
        
      }
    });    
  }

  ngOnDestroy() {
    this.unsubscribe$.complete();
    this.unsubscribe$.next();
 
  }
}

import { Injectable } from '@angular/core';
import { Vehicle, BackendService } from '@optimroute/backend';

@Injectable({
    providedIn: 'root',
})
export class StateVehiclesService {
    
    loadVehicles() {
        return this.backendService.get('vehicle');
    }

    addVehicle(v: Vehicle) {
        //console.log(v);
        return this.backendService.post('vehicle', v);
    }

    updateVehicle(id: number, vehicle: Partial<Vehicle>) {
        return this.backendService.put('vehicle/' + id, vehicle);
    }

    deleteVehicle(id: number) {
        return this.backendService.delete('vehicle/' + id);
    }

    loadFuelByExcel (file: any){
        return this.backendService.postFile('cost_load_fuel_by_excel ', file );
    }

    loadRentingByExcel (file: any){
        return this.backendService.postFile('vehicle_cost_reting_by_excel ', file );
    }

    loadCostSalaryByExcel (file: any){
        return this.backendService.postFile('cost_user_salary_by_excel ', file );
    }

    loadCostRentingByExcel (file: any){
        return this.backendService.postFile('cost_vehicle_renting_by_excel ', file );
    }

    constructor(private backendService: BackendService) {}

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BackendService } from './backend.service';

@NgModule({
    imports: [CommonModule, HttpClientModule],
    providers: [BackendService],
})
export class BackendModule {}

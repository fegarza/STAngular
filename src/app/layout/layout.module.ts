import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { MatSliderModule, MatTabsModule } from '@angular/material';
 @NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MatSliderModule,
    MatTabsModule,
     

  ],
   
})
export class LayoutModule { }

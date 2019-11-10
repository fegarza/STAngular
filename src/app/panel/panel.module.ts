import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelRoutingModule } from './panel-routing.module';
import { InicioComponent } from './components/inicio/inicio.component';
import { PanelComponent } from './components/panel/panel.component';
import { MaterialModule } from 'src/app/material/material.module';

/*
  SERVICES
*/
 

 
@NgModule({
  declarations: [InicioComponent, PanelComponent],
  imports: [
    CommonModule,
    PanelRoutingModule,
    MaterialModule
     
  ],
  providers: [
   
  ]
 
})
export class PanelModule { }

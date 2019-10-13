import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstudianteRoutingModule } from './estudiante-routing.module';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { EstudianteComponent } from './components/estudiante/estudiante.component';
import { AjustesComponent } from './components/ajustes/ajustes.component';
import { MaterialModule } from 'src/app/material/material.module';
 
@NgModule({
  declarations: [EstudiantesComponent, EstudianteComponent, AjustesComponent],
  imports: [
    CommonModule,
    EstudianteRoutingModule,
    MaterialModule
  ]
})
export class EstudianteModule { }

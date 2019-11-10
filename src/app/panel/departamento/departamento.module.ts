import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';

import { DepartamentoRoutingModule } from './departamento-routing.module';
import { DepartamentoComponent } from './components/departamento/departamento.component';
import { DepartamentosComponent } from './components/departamentos/departamentos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
@NgModule({
  declarations: [DepartamentoComponent, DepartamentosComponent],
  imports: [
    CommonModule,
    DepartamentoRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
    
  ]
})
export class DepartamentoModule { }

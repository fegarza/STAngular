import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';
import { PersonalesComponent } from './components/personales/personales.component';
import { PersonalComponent } from './components/personal/personal.component';
import { GrupoComponent } from './components/grupo/grupo.component';
import { MaterialModule } from 'src/app/material/material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 


@NgModule({
  declarations: [PersonalesComponent, PersonalComponent, GrupoComponent],
  imports: [
    PersonalRoutingModule,
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PersonalModule { }

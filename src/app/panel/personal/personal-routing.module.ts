import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalesComponent } from './components/personales/personales.component';
import { PersonalComponent } from './components/personal/personal.component';
import { RolGuard } from 'src/app/guards/rol.guard';
import { GrupoComponent } from './components/grupo/grupo.component';

const routes: Routes = [
  {path: '', component: PersonalesComponent, canActivate : [RolGuard], data: {roles: ['A', 'J', 'D', 'C']}},
  {path: ':id', component: PersonalComponent, canActivate : [RolGuard], data: {roles: ['A', 'J', 'D', 'T', 'C']}},
  {path: ':id/grupo', component: GrupoComponent, canActivate : [RolGuard], data: {roles: ['A', 'J', 'D', 'T', 'C']}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstudianteComponent } from './components/estudiante/estudiante.component';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { RolGuard } from 'src/app/guards/rol.guard';

const routes: Routes = [
  {path: '', component: EstudiantesComponent, canActivate : [RolGuard], data: {roles: ['A', 'J', 'D', 'C']}},
  {path: ':id', component: EstudianteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstudianteRoutingModule { }

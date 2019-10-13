import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelComponent } from './components/panel/panel.component'
import { InicioComponent } from './components/inicio/inicio.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: PanelComponent,
    children: [
      { path: '', component: InicioComponent },
      {
        path: 'personales',
        loadChildren: './personal/personal.module#PersonalModule'
      },
      {
        path: 'estudiantes',
        loadChildren: './estudiante/estudiante.module#EstudianteModule'
      },
      {
        path: 'departamentos',
        loadChildren: './departamento/departamento.module#DepartamentoModule'
      },
      {
        path: 'ajustes',
        loadChildren: './ajustes/ajustes.module#AjustesModule'
      }
    ],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }

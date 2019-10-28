import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DepartamentoComponent} from './components/departamento/departamento.component';
import {DepartamentosComponent} from './components/departamentos/departamentos.component';

const routes: Routes = [
  {path: '' , component: DepartamentosComponent},
  {path: ':id', component: DepartamentoComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartamentoRoutingModule { }

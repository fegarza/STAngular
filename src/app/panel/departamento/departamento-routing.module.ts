import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DepartamentoComponent} from './components/departamento/departamento.component';

const routes: Routes = [
  {path: '' , component: DepartamentoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartamentoRoutingModule { }

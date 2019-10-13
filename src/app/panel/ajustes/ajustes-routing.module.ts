import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjustesComponent } from './ajustes/ajustes.component';

const routes: Routes = [
  {path: '', component: AjustesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjustesRoutingModule { }

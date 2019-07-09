import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutsComponent } from './layouts/layouts.component';
import {InicioComponent} from './inicio/inicio.component';

const routes: Routes = [
  {path: '', component: InicioComponent}, 
  {path: 'layout', component: LayoutsComponent}   
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
}) 
export class AppRoutingModule { }

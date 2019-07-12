import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutsComponent } from './layouts/layouts.component';
import {InicioComponent} from './inicio/inicio.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {path: '', component: InicioComponent}, 
  {path: 'layout', component: LayoutsComponent},
  {path: 'login', component: LoginComponent}    
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
}) 
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutsComponent } from './layouts/layouts.component';
import {InicioComponent} from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { Error404Component } from './components/error404/error404.component';
import { PanelComponent } from './components/panel/panel.component';
import { PanelInicioComponent } from './components/panel-inicio/panel-inicio.component';
import { PanelAjustesComponent } from './components/panel-ajustes/panel-ajustes.component';
import { PanelDocumentosComponent } from './components/panel-documentos/panel-documentos.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PanelPersonalComponent } from './components/panel-personal/panel-personal.component';
import { PanelGrupoComponent } from './components/panel-grupo/panel-grupo.component';
 
//Guards
import {AuthGuard} from './guards/auth.guard';
import { PanelEstudianteComponent } from './components/panel-estudiante/panel-estudiante.component';

const routes: Routes = [
  {path: '', component: InicioComponent}, 
  {path: 'layout', component: LayoutsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: RegistroComponent},
  {
    path: 'panel', 
    component: PanelComponent,
    children: [
      {path: '', component : PanelInicioComponent},
      {path: 'ajustes', component: PanelAjustesComponent},
      {path: 'documentos', component: PanelDocumentosComponent},
      {path: 'personal/:id', component: PanelPersonalComponent},
      {path: 'grupo/:id', component: PanelGrupoComponent},
      {path: 'estudiante/:id', component: PanelEstudianteComponent},
    ],
    canActivate: [AuthGuard]
  },
  {path: '**', component: Error404Component}
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
}) 
export class AppRoutingModule { }

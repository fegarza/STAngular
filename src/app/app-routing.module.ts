import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { Error404Component } from './components/error404/error404.component';
import { RegistroComponent } from './components/registro/registro.component';

const routes: Routes = [
  {path: '', component: InicioComponent}, 
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'layout', loadChildren: './layout/layout.module#LayoutModule'},
  {
    path: 'panel',
    loadChildren: './panel/panel.module#PanelModule'
    
  },
  {path: '**', component: Error404Component}
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
    //RouterModule.forRoot(routes, {
      //enableTracing: true, // <-- debugging purposes only
      //preloadingStrategy: PreloadAllModules
    //})
  ],
  exports: [RouterModule]
}) 
export class AppRoutingModule { }

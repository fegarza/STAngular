/*
  Local Modules
*/
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
 import { GestureConfig } from '@angular/material';
/*
  External Modules
*/
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnimateOnScrollModule } from 'ng2-animate-on-scroll';


/*
  Components
*/
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { Error404Component } from './components/error404/error404.component';
import { AppComponent } from './app.component';
import { RegistroComponent } from './components/registro/registro.component';

/*
import { PanelComponent } from './components/panel-components/panel/panel.component';
import { PanelInicioComponent } from './components/panel-components/panel-inicio/panel-inicio.component';
import { PanelAjustesComponent } from './components/panel-components/panel-ajustes/panel-ajustes.component';
import { PanelDocumentosComponent } from './components/panel-components/panel-documentos/panel-documentos.component';
import { PanelPersonalComponent } from './components/panel-components/panel-personal/panel-personal.component';
import { PanelGrupoComponent } from './components/panel-components/panel-grupo/panel-grupo.component';
import { PanelEstudianteComponent } from './components/panel-components/panel-estudiante/panel-estudiante.component';
*/
/*
  Services
  */
 import { ConstantsService } from './services/constants.service';
 import { TokenInterceptorService } from './services/token-interceptor.service';
  //import { AuthService } from './services/auth-service.service';
/*

import { EstudianteService } from './services/estudiante.service';
import { PersonalService } from './services/personal.service';
import { GrupoService } from './services/grupo.service';
import { TituloService } from './services/titulo.service';
import { PersonalesComponent } from './components/panel-components/personales/personales.component';
import { EstudiantesComponent } from './components/panel-components/estudiantes/estudiantes.component';
import { GruposComponent } from './components/panel-components/grupos/grupos.component';
import { CanalizacionesComponent } from './components/panel-components/canalizaciones/canalizaciones.component';
import { AtencionService } from './services/atencion.service';
import { CanalizacionService } from './services/canalizacion.service';
 */

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    Error404Component,
    RegistroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AnimateOnScrollModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
    
  ],
  providers: [
    //AuthService,
    /*EstudianteService,
    PersonalService,
    GrupoService,
    TituloService,
    PersonalesComponent,
    EstudiantesComponent,
    GruposComponent,
    CanalizacionesComponent,
    AtencionService,
    CanalizacionService,*/
    
      {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig},
    
    ConstantsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}

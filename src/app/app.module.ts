/*
  Local Modules
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';


/*
  External Modules
*/
import { MaterialModule } from './material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AnimateOnScrollModule } from 'ng2-animate-on-scroll';



/*
  Components
*/
import { LayoutsComponent } from './layouts/layouts.component';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { Error404Component } from './components/error404/error404.component';
import { PanelComponent } from './components/panel/panel.component';
import { PanelInicioComponent } from './components/panel-inicio/panel-inicio.component';
import { PanelAjustesComponent } from './components/panel-ajustes/panel-ajustes.component';
import { PanelDocumentosComponent } from './components/panel-documentos/panel-documentos.component';
import { PanelAjustesCuentaComponent } from './components/panel-ajustes-cuenta/panel-ajustes-cuenta.component';
import { PanelAjustesGeneralComponent } from './components/panel-ajustes-general/panel-ajustes-general.component';
import { PanelAjustesClinicosComponent } from './components/panel-ajustes-clinicos/panel-ajustes-clinicos.component';
import { PanelPersonalComponent } from './components/panel-personal/panel-personal.component';
 import { PanelGrupoComponent } from './components/panel-grupo/panel-grupo.component';

/*
  Services
*/
import {AuthService} from './services/auth-service.service';
import { RegistroComponent } from './components/registro/registro.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { ConstantsService } from './services/constants.service';
import { EstudianteService } from './services/estudiante.service';
import { PanelEstudianteComponent } from './components/panel-estudiante/panel-estudiante.component';

 
@NgModule({
  declarations: [
    AppComponent,
    LayoutsComponent,
    InicioComponent,
    LoginComponent,
    Error404Component,
    PanelComponent,
    PanelInicioComponent,
    PanelAjustesComponent,
    PanelDocumentosComponent,
    PanelAjustesCuentaComponent,
    PanelAjustesGeneralComponent,
    PanelAjustesClinicosComponent,
    RegistroComponent,
    PanelPersonalComponent,
    PanelGrupoComponent,
    PanelEstudianteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AnimateOnScrollModule.forRoot(),
    HttpClientModule, 
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    AuthService,
    ConstantsService,
    EstudianteService,
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

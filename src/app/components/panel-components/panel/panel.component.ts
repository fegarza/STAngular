import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import {AuthService} from 'src/app/services/auth-service.service';
import { Usuario, Personal, Estudiante } from 'src/app/models/models';


@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.sass']
})


export class PanelComponent  {

  //Usuario datos
  public miUsuario : Usuario;
 
  //Menu
  public opc: string = "";
  public subOpc: string = "";
  public menuMovil: boolean = false;


  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    
    this.miUsuario = authService.traerUsuario();

    switch(this.router.url) {
      case '/panel':
        this.opc = "inicio";
        break;
      case '/panel/ajustes':
        this.opc = "ajustes";
        break;
      case '/panel/documentos':
        this.opc = "documentos";
        break;
    }

  }
  
  //Show panels
  showPerfil(){
    if(this.miUsuario.tipo == "E"){
      this.router.navigate(['/panel/estudiantes/'+localStorage.getItem("id")], { relativeTo: this.route });
    }else{
      this.router.navigate(['/panel/personales/'+localStorage.getItem("id")], { relativeTo: this.route });

    }
  }
  showMenu() {
    if(this.menuMovil){
      this.menuMovil = false;
    }else{
      this.menuMovil = true;
    }
  }
  showInicio() {
    this.router.navigate(['/panel'], { relativeTo: this.route });
  }
  showAjustes() {
    this.router.navigate(['ajustes'], { relativeTo: this.route });
    this.menuMovil = false;
  }
  showDocumentos() {
    this.router.navigate(['documentos'], { relativeTo: this.route });
    this.menuMovil = false;
  }
  showPersonal(){
   // this.router.navigate(['documentos'], { relativeTo: this.route });
    this.menuMovil = false;
  }

  //Tutores
  showTutorados(){

  }
  showAccionesTutoriales(){
    
  }


  //Logout
  cerrarSesion(){
    this.authService.salir();
    this.router.navigate(['/']);
  }

}

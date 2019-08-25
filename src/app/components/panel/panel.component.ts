import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
 
import {AuthService} from '../../services/auth-service.service';
import { Usuario } from '../../models/models';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.sass']
})
export class PanelComponent  {
  public miUsuario : Usuario;
  public students = [];
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


  

   
  showMenu() {
    if(this.menuMovil){
      this.menuMovil = false;
    }else{
      this.menuMovil = true;
    }
  }
  showInicio() {
    this.router.navigate(['/panel'], { relativeTo: this.route });
    this.menuMovil = false;
  }
  showAjustes() {
    this.router.navigate(['ajustes'], { relativeTo: this.route });
    this.menuMovil = false;
  }
  showDocumentos() {
    this.router.navigate(['documentos'], { relativeTo: this.route });
    this.menuMovil = false;
  }
  cerrarSesion(){
    localStorage.removeItem("token");
    this.router.navigate(['/']);
  }

}

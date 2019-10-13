import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.sass']
})
export class PanelComponent implements OnInit {

  public usuario : Usuario;
  //Menu
  public menuMovil: boolean = false;
  public menu : boolean = false;

  constructor(private router: Router, private authService: AuthService) 
  {
    this.usuario = authService.traerUsuario();
  }
  showMenu(){
    if(this.menuMovil){
      this.menuMovil = false;
    }else{
      this.menuMovil = true;
    }
  }
  cerrarSesion(){
    this.authService.salir();
    this.router.navigate(['/']);
  }

  mostrarMenu(){
    if(this.menu){
      this.menu = false;
    }else{
      this.menu = true;
    }
  }

  ngOnInit() {
  }
}

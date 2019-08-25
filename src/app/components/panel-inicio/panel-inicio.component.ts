import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { Usuario } from '../../models/models';

@Component({
  selector: 'app-panel-inicio',
  templateUrl: './panel-inicio.component.html',
  styleUrls: ['./panel-inicio.component.sass']
})
export class PanelInicioComponent implements OnInit {

  miUsuario : Usuario;
  constructor(authService: AuthService) { 
    this.miUsuario = authService.traerUsuario();
  }

  ngOnInit() {
  }

}

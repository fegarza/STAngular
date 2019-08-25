import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { Usuario } from '../../models/models';
import { AuthService } from 'src/app/services/auth-service.service';


@Component({
  selector: 'app-panel-ajustes',
  templateUrl: './panel-ajustes.component.html',
  styleUrls: ['./panel-ajustes.component.sass']
})
export class PanelAjustesComponent implements OnInit {

  estadosCiviles: string[] = [
    'Soltero',
    'Casado', 
    'Otro'
  ];
  tiposBeca: string[] = [
    'Federal',
    'Estatal',
    'Municipal',
    'Escolar',
    'Particular'
  ];
  gradosDeEstudio: string[] = [
    'Sin estudios',
    'Primaria',
    'Secundaria',
    'Preparatoria',
    'Licenciatura',
    'Posgrado',
    'Otro'
  ];
  dependenciasEconomica: string[] = [
    'Padre',
    'Madre',
    'Ambos',
    'Otro familiar',
    'Ninguno'
  ];

  settingsForm: FormGroup;

  miUsuario: Usuario;
  constructor(authService : AuthService) { 
    this.miUsuario = authService.traerUsuario();
  }

  ngOnInit() {
    this.settingsForm = this.createFormGroup();
  }

  createFormGroup(){
    return new FormGroup({
      email : new FormControl('', Validators.email),
      password : new FormControl()
    });
  }
  onSubmit(){
    
  }

}

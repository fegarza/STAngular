import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth-service.service';
import Swal from 'sweetalert2';
import { Usuario, Estudiante } from '../../models/models';
import { EstudianteService } from 'src/app/services/estudiante.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.sass']
})
export class RegistroComponent implements OnInit {
  
  registroForm: FormGroup;
  public nuevoEstudiante: Estudiante = new Estudiante();
  constructor(private estudianteService: EstudianteService) {
    this.registroForm = new FormGroup({
      numeroControl: new FormControl(),
      curp: new FormControl(),
      correo: new FormControl(),
      clave: new FormControl()
    });
   }
 
  ngOnInit() {
    
  }

  onSubmit(){
    this.nuevoEstudiante.numeroDeControl = this.registroForm.controls.numeroControl.value;
    this.nuevoEstudiante.correo = this.registroForm.controls.correo.value;
     
    this.estudianteService.add( this.nuevoEstudiante)
    .subscribe(r => {
      if(r.code == 200){
        Swal.fire("Exito","¡Se ha registrado con exito!", "success");
      }else{
        Swal.fire("¡Algo salio mal!",r.mensaje, "error");

      }
    });
  }
}

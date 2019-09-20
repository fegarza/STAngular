import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { Usuario, Departamento, Cargo, Personal, Accion, Sesion, Titulo } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth-service.service';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { PersonalService } from 'src/app/services/personal.service';
import Swal from 'sweetalert2';
import { AccionService } from 'src/app/services/accion.service';
import { SesionService } from 'src/app/services/sesion.service';
import { TituloService } from 'src/app/services/titulo.service';


@Component({
  selector: 'app-panel-ajustes',
  templateUrl: './panel-ajustes.component.html',
  styleUrls: ['./panel-ajustes.component.sass']
})
export class PanelAjustesComponent implements OnInit {


  //Constantes
  cargos: Array<Cargo> = [
    {tipo : "C",  titulo : "Coordinador"},
    {tipo : "D",  titulo : "Jefe de departamento"},
    {tipo : "J",  titulo : "Jefe de tutorias"},
    {tipo : "T",  titulo : "Tutor"}
  ]
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

  //Formularios
  settingsForm: FormGroup;
  personalesForm: FormGroup;
  accionesForm: FormGroup;
  sesionesForm: FormGroup;

  //Propiedades
  miUsuario: Usuario;
  departamentos: Array<Departamento> = new Array<Departamento>();
  personales: Array<Personal> = new Array<Personal>();
  acciones: Array<Accion> = new Array<Accion>();
  titulos: Array<Titulo> = new Array<Titulo>();
  constructor(private tituloService: TituloService, private sesionService: SesionService,private accionesService: AccionService , private authService : AuthService, private departamentoServices: DepartamentoService, private personalService: PersonalService) { 
    this.miUsuario = authService.traerUsuario();
  }
  
 
  cargarAcciones(id){
    this.departamentoServices.showAcciones(id).subscribe(
        s => {
          this.acciones = s.data as Array<Accion>;
        }
    );
  }
  ngOnInit() {
    this.createFormsGroup();
    this.departamentoServices.showAll().subscribe(
      s => {
        this.departamentos = s.data as Array<Departamento>;
      }
    );
    this.personalService.showAllTec().subscribe(
      s => {
        this.personales = s.data as Array<Personal>;
      }
    );
    this.tituloService.showAll().subscribe(
      s => {
        this.titulos = s.data as Array<Titulo>;
      }
    );
  }

  createFormsGroup(){
    this.settingsForm = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.min(6)])
    });

    this.personalesForm = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.min(6)]),
      departamento: new FormControl('', [Validators.required]),
      cargo: new FormControl('', [Validators.required]),
      genero: new FormControl('', [Validators.required]),
      titulo: new FormControl('', [Validators.required]),
      cve :  new FormControl('', [Validators.required])
    });

    this.accionesForm = new FormGroup({
      titulo : new FormControl('', [Validators.required]),
      fecha : new FormControl('', [Validators.required]),
      contenido: new FormControl('', [Validators.required]),
      obligatorio: new FormControl('', [Validators.required]),
    });

    this.sesionesForm = new FormGroup({
      departamento : new FormControl('', [Validators.required]),
      accionTutorial : new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required])
     });
  }
  onSubmit(){
    
  }
  onSubmitPersonal(){
   console.log(this.personalesForm);
    if(this.personalesForm.valid){
      var personal: Personal = new Personal();
      personal.cargo = this.personalesForm.controls.cargo.value;
      personal.departamentoId = this.personalesForm.controls.departamento.value;
      personal.usuario = new Usuario();
      personal.usuario.genero = this.personalesForm.controls.genero.value
      personal.usuario.clave = this.personalesForm.controls.password.value
      personal.usuario.email = this.personalesForm.controls.email.value;
      personal.cve = this.personalesForm.controls.cve.value;
      personal.tituloId = this.personalesForm.controls.titulo.value;
      console.log(personal);
      this.personalService.add(personal).subscribe(r=>{
        if(r.code == 200){
          this.personalesForm.reset();
          Swal.fire(
            'Se ha insertado con exito',
            r.mensaje,
            'success'
          );
           this.personalService.showAllTec().subscribe(
            s => {
              this.personales = s.data as Array<Personal>;
            }
          );
        }else{
          Swal.fire(
            'Error',
            r.mensaje,
            'error'
          );
        }
      });
    }else{
      Swal.fire(
        'Error',
        'El formulario tiene errores',
        'error'
      );
    }
  }

  onSubmitAcciones(){
    var accion: Accion = new Accion();
    accion.titulo = this.accionesForm.controls.titulo.value;
    accion.contenido = this.accionesForm.controls.contenido.value;
    accion.fecha = this.accionesForm.controls.fecha.value;
    if( this.accionesForm.controls.obligatorio.value == "1"){
      accion.obligatorio = true;
    }else{
      accion.obligatorio = false;
    }
   
    accion.personalId = Number.parseInt(localStorage.getItem("id"));
    console.log(accion);
    this.accionesService.add(accion).subscribe(r=>{
      if(r.code==200){
        this.accionesForm.reset();
        Swal.fire(
          'Se ha insertado con exito',
          r.mensaje,
          'success'
        );
      }else{
        Swal.fire(
          'Error',
          r.mensaje,
          'error'
        );
      }
    });
  }
  onSubmitSesiones(){
    var sesion: Sesion = new Sesion();
    sesion.fecha = this.sesionesForm.controls.fecha.value;
    sesion.departamentoId = this.sesionesForm.controls.departamento.value;
    sesion.accionTutorialId = this.sesionesForm.controls.accionTutorial.value;
    this.sesionService.add(sesion).subscribe(r=>{
      if(r.code==200){
        this.sesionesForm.reset();
        this.cargarAcciones(sesion.departamentoId);
        Swal.fire(
          'Se ha insertado con exito',
          r.mensaje,
          'success'
        );
      }else{
        Swal.fire(
          'Error',
          r.mensaje,
          'error'
        );
      }
    });
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Personal, Departamento, Canalizacion, Sesion, Usuario, Titulo, Cargo, Accion } from '../../../../models/models';
import { MatTableDataSource, MatSort, PageEvent } from '@angular/material';
import { DepartamentoService } from '../../../../services/departamento.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { PersonalService } from 'src/app/services/personal.service';
import { TituloService } from 'src/app/services/titulo.service';

import Swal from 'sweetalert2';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.sass']
})
export class DepartamentoComponent implements OnInit {
  
  acciones: Array<Accion> = new Array<Accion>();

  //Formularios
  public personalesForm: FormGroup;
  sesionesForm: FormGroup;
  
  public loading: boolean = false;
  public formAlert: string = "none";
  //Departamento
  public id: number;
  private sub: any;
  public departamento : Departamento = new Departamento();
  public titulos: Array<Titulo> = new Array<Titulo>();

   //Constantes
   cargos: Array<Cargo> = [
    { tipo: "C", titulo: "Coordinador" },
    { tipo: "D", titulo: "Jefe de departamento" },
    { tipo: "J", titulo: "Jefe de tutorias" },
    { tipo: "T", titulo: "Tutor" }
  ]


  //DataTable de los personales
  personales: Array<Personal> = new Array<Personal>();
  personalesDataForm: Array<Personal> = new Array<Personal>();
  personalesDataSource = new MatTableDataSource(this.personales);
  personalesColumns: string[] = ['nombre', 'cargo', 'tutorados'];
  personalesLength = 100;
  personalesPageSize = 10;
  personalesPageSizeOptions: number[] = [10,20,30,40,50];
  
  //DataTable de las canalizaciones
  public canalizaciones: Array<Canalizacion> = new Array<Canalizacion>()
  canalizacionesDataSource = new MatTableDataSource(this.canalizaciones);
  canalizacionesColumns: string[] = ['tutor', 'estudiante', 'atencion', 'estatus'];
  canalizacionesLength = 100;
  canalizacionesPageSize = 10;
  canalizacionesPageSizeOptions: number[] = [10,20,30,40,50];

  // Sesiones
  public sesiones : Array<Sesion> = new Array<Sesion>();
  sesionesDataSource = new MatTableDataSource(this.sesiones);
  sesionesColumns: string[] = ['fecha', 'editar'];
  sesionesLength = 100;
  sesionesPageSize = 10;
  sesionesPageSizeOptions: number[] = [10,20,30,40,50];





 
  constructor(private sesionService: SesionService, private tituloService: TituloService, private route: ActivatedRoute, private departamentoService: DepartamentoService, private personalService: PersonalService ) 
  {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];  
    });
    this.departamentoService.get(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        this.departamento = r.data as Departamento;
      }
    });
    this.departamentoService.showPersonales(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        this.personales = r.data as Array<Personal>;
        this.personalesDataSource = new MatTableDataSource(this.personales);
      }
    });
    this.departamentoService.showCanalizaciones(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        this.canalizaciones = r.data as Array<Canalizacion>;
        this.canalizacionesDataSource = new MatTableDataSource(this.canalizaciones);
      }
    });
    this.departamentoService.showSesiones(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        this.sesiones = r.data as Array<Sesion>;
        this.sesionesDataSource = new MatTableDataSource(this.sesiones);
      }
    });
    this.personalService.showAllTec().subscribe(r => {
      if(r.code == 200){ 
        this.personalesDataForm = r.data as Array<Personal>;
      }else{
        console.log("error");
      }
    });
    this.tituloService.showAll().subscribe(
      s => {
        this.titulos = s.data as Array<Titulo>;
      }
    );
    this.departamentoService.showAcciones(this.id.toString()).subscribe(
      s => {
        this.acciones = s.data as Array<Accion>;
      }
    );
    
    
  }
  mostrarPersonales( event?:PageEvent ){
    this.departamentoService.getPagePersonales(this.id.toString(), event.pageSize, (event.pageIndex+1)).subscribe(r=>{
      if(r.code == 200){
        this.personales = r.data as Array<Personal>;
        this.personalesDataSource = new MatTableDataSource(this.personales);
      }
    });
    return event;
  }
  mostrarCanalizaciones( event?:PageEvent ){
    this.departamentoService.getPageCanalizaciones(this.id.toString(), event.pageSize, (event.pageIndex+1)).subscribe(r=>{
      if(r.code == 200){
        this.canalizaciones = r.data as Array<Canalizacion>;
        this.canalizacionesDataSource = new MatTableDataSource(this.canalizaciones);
      }
    });
    return event;
  }
  mostrarSesiones( event?:PageEvent ){
    this.departamentoService.getPageSesiones(this.id.toString(), event.pageSize, (event.pageIndex+1)).subscribe(r=>{
      if(r.code == 200){
        this.sesiones = r.data as Array<Sesion>;
        this.sesionesDataSource = new MatTableDataSource(this.sesiones);
      }
    });
    return event;
  }
  
  ngOnInit() {
    this.personalesForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.min(6)]),
      cargo: new FormControl('', [Validators.required]),
      genero: new FormControl('', [Validators.required]),
      titulo: new FormControl('', [Validators.required]),
      cve: new FormControl('', [Validators.required])
    });
    this.sesionesForm = new FormGroup({
      departamento: new FormControl('', [Validators.required]),
      accionTutorial: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required])
    });
  }
  onSubmitPersonal() {
    this.loading = true;
    if (this.personalesForm.valid) {
      var personal: Personal = new Personal();
      personal.cargo = this.personalesForm.controls.cargo.value;
      personal.departamentoId = this.id;
      personal.usuario = new Usuario();
      personal.usuario.genero = this.personalesForm.controls.genero.value
      personal.usuario.clave = this.personalesForm.controls.password.value
      personal.usuario.email = this.personalesForm.controls.email.value;
      personal.cve = this.personalesForm.controls.cve.value;
      personal.tituloId = this.personalesForm.controls.titulo.value;
      this.personalService.add(personal).subscribe(r => {
        if (r.code == 200) {
          this.loading = false;
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
          this.departamentoService.showPersonales(this.id.toString()).subscribe(v=>{
            if(v.code == 200){
              this.personales = v.data as Array<Personal>;
              this.personalesDataSource = new MatTableDataSource(this.personales);
            }
          });
          this.formAlert = 'none';
        } else {




        }
      });
    } else {
      this.loading = false;
      var cadena: string = "";
      Object.keys(this.personalesForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.personalesForm.get(key).errors;
        if (controlErrors) {
          Object.keys(controlErrors).forEach(keyError => {
            cadena += ('Key: ' + key + +'error: ' + keyError + ' value: ' + controlErrors[keyError] + "<br>");
          });
        }
      });
      Swal.fire(
        "error",
        cadena,
        'error'
      );
    }
  }

  onSubmitSesiones() {
    this.loading = true;
    var sesion: Sesion = new Sesion();
    sesion.fecha = this.sesionesForm.controls.fecha.value;
    sesion.departamentoId = this.id;
    sesion.accionTutorialId = this.sesionesForm.controls.accionTutorial.value;
    sesion.departamento = null;
    sesion.accionTutorial = null;
    sesion.departamento = null;
    this.sesionService.add(sesion).subscribe(r => {
      if (r.code == 200) {
        this.loading = false;
        this.sesionesForm.reset();
        this.departamentoService.showSesiones(this.id.toString()).subscribe(r=>{
          if(r.code == 200){
            this.sesiones = r.data as Array<Sesion>;
            this.sesionesDataSource = new MatTableDataSource(this.sesiones);
          }
        });
        Swal.fire(
          'Se ha insertado con exito',
          r.mensaje,
          'success'
        );
        
      } else {
        this.loading = false;
        var errores: Array<String> = r.data as Array<String>;
        var cadena: string = "";
        errores.forEach(e => {
          cadena += (e + '<br>')
        });
        Swal.fire(
          r.mensaje,
          cadena,
          'error'
        );
      }
    });
  }
 
}

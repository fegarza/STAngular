import { Component, OnInit, ViewChild } from '@angular/core';
import { Personal, Departamento, Canalizacion, Sesion, Usuario, Titulo, Cargo, Accion, Count, SesionIndividual } from '../../../../models/models';
import { MatTableDataSource, MatSort, PageEvent } from '@angular/material';
import { DepartamentoService } from '../../../../services/departamento.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { PersonalService } from 'src/app/services/personal.service';
import { TituloService } from 'src/app/services/titulo.service';
import Swal from 'sweetalert2';
import { SesionService } from 'src/app/services/sesion.service';
import { AccionService } from 'src/app/services/accion.service';
import { SesionIndividualService } from 'src/app/services/sesion-individual.service';
import { DatePipe } from '@angular/common'  // Import this
@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.sass'],
  providers: [DatePipe] // Add this
})
export class DepartamentoComponent implements OnInit {
  
  //Variables auxiliares
  public loading: boolean = false;
  public formAlert: string = "none";

  //Formularios
  public personalesForm: FormGroup;
  public sesionesForm: FormGroup;
  public sesionesIndividualesForm: FormGroup;
  public sesionesEditarForm: FormGroup;
  
  //Departamento
  public id: number;
  private sub: any;
  public departamento : Departamento = new Departamento();

  //Titulos del personal
  public titulos: Array<Titulo> = new Array<Titulo>();
  
  //acciones individuales
  accionesIndividuales: Array<Accion> = new Array<Accion>();
  acciones: Array<Accion> = new Array<Accion>();
  pageEvent: PageEvent;

   //acciones dattable
   todasAcciones: Array<Accion> = new Array<Accion>();
   accionLength: number = 100;
   accionesSource = new MatTableDataSource(this.todasAcciones);
   accionesColumns: string[] = ['visible', 'obligatorio', 'fecha','titulo', 'tipo'];

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
  sesionesColumns: string[] = ['accion','fecha','hora', 'visible', 'eliminar'];
  sesionesLength = 100;
  sesionesPageSize = 10;
  sesionesPageSizeOptions: number[] = [10,20,30,40,50];
  sesionSeleccionada: Sesion;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 30, 40, 50];
   // SesionesIndividuales
   public sesionesIndividuales : Array<SesionIndividual> = new Array<SesionIndividual>();
   sesionesIndividualesDataSource = new MatTableDataSource(this.sesionesIndividuales);
   sesionesIndividualesColumns: string[] = ['accion','fecha','hora', 'visible', 'eliminar'];
   sesionesIndividualesLength = 100;
   sesionesIndividualesPageSize = 10;
   sesionesIndividualesPageSizeOptions: number[] = [10,20,30,40,50];
   sesionIndividualesSeleccionada: SesionIndividual;
    

 
  constructor(
    private datePipe: DatePipe,
     private accionService: AccionService,
     private sesionService: SesionService, 
     private sesionIndividualService: SesionIndividualService, 
     private tituloService: TituloService, 
     private route: ActivatedRoute, 
     private departamentoService: DepartamentoService,
      private personalService: PersonalService ) 
  {
     
    //TODO LO DE ACCIONES TUTORIALES EN GENERAL
    this.accionService.count().subscribe(r=>{
      if(r.code == 200){
        var c = r.data as Count;
        this.accionLength = c.count;
      }
    });
    this.accionService.getPage(10,1).subscribe(r => {
      if (r.code == 200) {
        this.todasAcciones = r.data as Array<Accion>;
        this.accionesSource = new MatTableDataSource(this.todasAcciones);
        
      }
    });
    
    //TODOS LOS DATOS DEL DEPARTAMENTO
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
    this.departamentoService.countSesiones(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        var c = r.data as Count;
        this.sesionesLength = c.count;
      }
    });
    this.departamentoService.countSesionesIndividuales(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        var c = r.data as Count;
        this.sesionesIndividualesLength = c.count;
      }
    });
    this.departamentoService.countCanalizaciones(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        var c = r.data as Count;
        this.canalizacionesLength = c.count;
      }
    });
    this.departamentoService.countPersonales(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        var c = r.data as Count;
        this.personalesLength = c.count;
      }
    });
    this.departamentoService.showSesiones(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        this.sesiones = r.data as Array<Sesion>;
        this.sesionesDataSource = new MatTableDataSource(this.sesiones);
      }
    });
    this.departamentoService.showSesionesIndividuales(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        this.sesionesIndividuales = r.data as Array<SesionIndividual>;
        this.sesionesIndividualesDataSource = new MatTableDataSource(this.sesionesIndividuales);
      }
    });
    this.personalService.showAllTec().subscribe(r => {
      if(r.code == 200){ 
        this.personalesDataForm = r.data as Array<Personal>;
      }else{
        console.log("error");
      }
    });
    this.tituloService.showAll().subscribe(s => {
        this.titulos = s.data as Array<Titulo>;
    });
    this.departamentoService.showAcciones(this.id.toString()).subscribe(s => {
        this.acciones = s.data as Array<Accion>;
    });
    this.departamentoService.showAccionesIndividuales(this.id.toString()).subscribe(s => {
      this.accionesIndividuales = s.data as Array<Accion>;
      
  });
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
      accionTutorial: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
      tiempo: new FormControl('', [Validators.required]),
    });
    this.sesionesIndividualesForm = new FormGroup({
      accionTutorial: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
      tiempo: new FormControl('', [Validators.required]),
    });
    this.sesionesEditarForm = new FormGroup({
      fecha: new FormControl('', [Validators.required])
    });
    
    
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
  mostrarSesionesIndividuales( event?:PageEvent ){
    this.departamentoService.getPageSesionesIndividuales(this.id.toString(), event.pageSize, (event.pageIndex+1)).subscribe(r=>{
      if(r.code == 200){
        this.sesionesIndividuales = r.data as Array<SesionIndividual>;
        this.sesionesIndividualesDataSource = new MatTableDataSource(this.sesionesIndividuales);
      }
    });
    return event;
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

    if(this.sesionesForm.valid){
      this.loading = true;
      var fecha: Date = new Date(this.sesionesForm.controls.fecha.value);
      fecha.setHours( parseInt( this.sesionesForm.controls.tiempo.value.split(":")[0]), parseInt(this.sesionesForm.controls.tiempo.value.split(":")[1]),0,0);
      var sesion: Sesion = new Sesion();
      
      var day =  fecha.getUTCDate();
      var month =  fecha.getUTCMonth() + 1;
      var year = fecha.getFullYear();
      var hour = fecha.getHours();      
      var minute = fecha.getMinutes();  
      var second = fecha.getSeconds(); 


      //dd/MM/yyyy HH:mm tt
      //sesion.fecha =day+"/"+ month +"/"+ year +" "+ hour + ':' + minute; 
      sesion.fecha = this.datePipe.transform(fecha, 'MM/dd/yyyy HH:mm:ss');
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
          this.departamentoService.showAcciones(this.id.toString()).subscribe(
            s => {
              this.acciones = s.data as Array<Accion>;
            }
          );
          Swal.fire(
            'Se ha insertado con exito',
            r.mensaje,
            'success'
          );
          this.formAlert = 'none';
        } else {
          this.loading = false;
          Swal.fire(
            r.mensaje,
            "¡La fecha ya existe!",
            'error'
          );
        }
      });
    }else{
      Swal.fire(
        "Error en el formulario",
        "No se han llenado todos los campos",
        'error'
      );
    }


  
  }
  onSubmitSesionesIndividuales() {

    if(this.sesionesIndividualesForm.valid){
      this.loading = true;
       var fecha: Date = new Date(this.sesionesIndividualesForm.controls.fecha.value);
      fecha.setHours( parseInt( this.sesionesIndividualesForm.controls.tiempo.value.split(":")[0]), parseInt(this.sesionesIndividualesForm.controls.tiempo.value.split(":")[1]));
     // fecha.setMinutes( parseInt(this.sesionesForm.controls.tiempo.value.split(":")[1]));
      //console.log("Hora: "+ this.sesionesForm.controls.tiempo.value.split(":")[0]);
      //console.log("Minutos: "+ this.sesionesForm.controls.tiempo.value.split(":")[1]);
      //console.log("Sesion anterior");
      //console.log(fecha);
      var sesion: SesionIndividual = new SesionIndividual();
      sesion.fecha = this.datePipe.transform(fecha, 'MM/dd/yyyy HH:mm:ss');

      
      //console.log("Sesion asignada");
      //console.log(sesion.fecha);
      sesion.departamentoId = this.id;
      sesion.accionTutorialId = this.sesionesIndividualesForm.controls.accionTutorial.value;
      sesion.departamento = null;
      sesion.accionTutorial = null;
      sesion.departamento = null;
      this.sesionIndividualService.add(sesion).subscribe(r => {
        if (r.code == 200) {
          this.loading = false;
          this.sesionesIndividualesForm.reset();
          this.departamentoService.showSesionesIndividuales(this.id.toString()).subscribe(r=>{
            if(r.code == 200){
              this.sesionesIndividuales = r.data as Array<SesionIndividual>;
              this.sesionesIndividualesDataSource = new MatTableDataSource(this.sesionesIndividuales);
            }
          });
          this.departamentoService.showAccionesIndividuales(this.id.toString()).subscribe(
            s => {
              this.accionesIndividuales = s.data as Array<Accion>;
            }
          );
          Swal.fire(
            'Se ha insertado con exito',
            r.mensaje,
            'success'
          );
          this.formAlert = 'none';
        } else {
          this.loading = false;
          Swal.fire(
            r.mensaje,
            "¡La fecha ya existe!",
            'error'
          );
        }
      });
    }else{
      Swal.fire(
        "Error en el formulario",
        "No se han llenado todos los campos",
        'error'
      );
    }


  
  }
  eliminarSesion(id: number){
    this.sesionService.delete(id).subscribe(r=>{
      if(r.code == 200){
        this.departamentoService.showSesiones(this.id.toString()).subscribe(r=>{
          if(r.code == 200){
            this.sesiones = r.data as Array<Sesion>;
            this.sesionesDataSource = new MatTableDataSource(this.sesiones);
            this.departamentoService.showAcciones(this.id.toString()).subscribe(
              s => {
                this.acciones = s.data as Array<Accion>;
              }
            );
          }
        });
        Swal.fire(
          'Se ha eliminado con exito',
          r.mensaje,
          'success'
        );
      }else{
        Swal.fire(
          'No se puede eliminar la sesión',
         'Ya existen pases de listas en esta sesión',
          'error'
        );
      }
    });
  }
  eliminarSesionIndividual(id: number){
    this.sesionIndividualService.delete(id).subscribe(r=>{
      if(r.code == 200){
        this.departamentoService.showSesionesIndividuales(this.id.toString()).subscribe(r=>{
          if(r.code == 200){
            this.sesionesIndividuales = r.data as Array<SesionIndividual>;
            this.sesionesIndividualesDataSource = new MatTableDataSource(this.sesionesIndividuales);
            this.departamentoService.showAccionesIndividuales(this.id.toString()).subscribe(
              s => {
                this.accionesIndividuales = s.data as Array<Accion>;
              }
            );
          }
        });
        Swal.fire(
          'Se ha eliminado con exito',
          r.mensaje,
          'success'
        );
      }else{
        Swal.fire(
          'No se puede eliminar la sesión',
         'Ya existen pases de listas en esta sesión',
          'error'
        );
      }
    });
  }
  establecerSesion(id: number){
    this.sesiones.forEach(e => {
      if(e.id == id){
        this.sesionSeleccionada = e;
        var date = new Date(new Date(e.fecha).getTime())
        this.sesionesEditarForm.controls.fecha.setValue(date);
      }
    });
    this.formAlert='editarSesion';
    
  }
  editarSesion(values:any, id: any){
   
    var sesionTemp: Sesion ;
    this.loading = true;
    var count  = 1;
    sesionTemp =  this.sesiones.find(x => x.id == id);
    if(sesionTemp.visible){
      sesionTemp.visible = false;
    }else{
      sesionTemp.visible = true;
    }
     var sesion = new Sesion();
     sesion.id = sesionTemp.id;
     sesion.accionTutorialId = sesionTemp.accionTutorialId;
     sesion.departamentoId = this.id;
     sesion.fecha = sesionTemp.fecha;
     sesion.visible = sesionTemp.visible;
    this.sesionService.put(sesion).subscribe(r => {
      if (r.code == 200) {
        this.loading = false;
        Swal.fire(
          'Se ha actualizado con exito',
          r.mensaje,
          'success'
        );
        this.formAlert = 'none';
      } else {
        this.loading = false;
        Swal.fire(
          r.mensaje,
          "!Error!",
          'error'
        );
      }
    });
     
  }
  editarSesionIndividual(values:any, id: any){
    
     var sesionTemp: SesionIndividual ;
     this.loading = true;
     var count  = 1;
     sesionTemp =  this.sesionesIndividuales.find(x => x.id == id);
     if(sesionTemp.visible){
       sesionTemp.visible = false;
     }else{
       sesionTemp.visible = true;
     }
      var sesion = new SesionIndividual();
      sesion.id = sesionTemp.id;
      sesion.accionTutorialId = sesionTemp.accionTutorialId;
      sesion.departamentoId = this.id;
      sesion.fecha = sesionTemp.fecha;
      sesion.visible = sesionTemp.visible;
     this.sesionIndividualService.put(sesion).subscribe(r => {
       if (r.code == 200) {
         this.loading = false;
         Swal.fire(
           'Se ha actualizado con exito',
           r.mensaje,
           'success'
         );
         this.formAlert = 'none';
       } else {
         this.loading = false;
         Swal.fire(
           r.mensaje,
           "!Error!",
           'error'
         );
       }
     });
      
   }
  mostrarAcciones(event?:PageEvent) {
    this.accionService.getPage(event.pageSize, (event.pageIndex+1)).subscribe(r => {
      if (r.code == 200) {
        this.todasAcciones = r.data as Array<Accion>;
        this.accionesSource = new MatTableDataSource(this.todasAcciones);
      }
    });
    return event;
  }
  onSubmitEditarSesiones() {
    this.loading = true;
    var sesion: Sesion = new Sesion();
    sesion.id = this.sesionSeleccionada.id;
    sesion.fecha = this.sesionesEditarForm.controls.fecha.value;
    
    this.sesionService.put(sesion).subscribe(r => {
      if (r.code == 200) {
        this.loading = false;
        this.sesionesEditarForm.reset();
        this.departamentoService.showSesiones(this.id.toString()).subscribe(r=>{
          if(r.code == 200){
            this.sesiones = r.data as Array<Sesion>;
            this.sesionesDataSource = new MatTableDataSource(this.sesiones);
          }
        });
        Swal.fire(
          'Se ha actualizado con exito',
          r.mensaje,
          'success'
        );
        this.formAlert = 'none';
      } else {
        this.loading = false;
        Swal.fire(
          r.mensaje,
          "¡La fecha ya existe!",
          'error'
        );
      }
    });
  }
}

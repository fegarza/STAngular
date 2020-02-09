import { Component, OnInit, ViewChild } from '@angular/core';
import { GrupoService } from 'src/app/services/grupo.service';
import { Grupo, Sesion, Estudiante, Usuario, Canalizacion, SesionIndividual } from 'src/app/models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PersonalService } from 'src/app/services/personal.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CanalizacionService } from 'src/app/services/canalizacion.service';
import { PageEvent } from '@angular/material';
import { formatDate } from '@angular/common';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.sass']
})
export class GrupoComponent implements OnInit {

  //Traer el ID del  url
  public id: number;
  private sub: any;
  pageEvent: PageEvent;
  canalizacionesPageSize = 10;
  canalizacionesPageSizeOptions: number[] = [10,20,30,40,50];
  //Variables publicas
  public loading: boolean = false;
  public miGrupo: Grupo = new Grupo();
  public sesionesIndividuales: Array<SesionIndividual> = new Array<SesionIndividual>();
  public sesionIndividualSeleccionada: number = 0;
  public asistenciaIndividual :Array<Estudiante> = new Array<Estudiante>();

  public sesiones: Array<Sesion> = new Array<Sesion>();
  public seleccionado: boolean = false;
  public asistencia :Array<Estudiante> = new Array<Estudiante>();
  public sesionSeleccionada: number = 0;
  public usuario: Usuario = new Usuario();
  public canalizaciones: Array<Canalizacion>;
  public formAlert: string = "";
  //Tabla de canalizaciones
  canalizacionesSource = new MatTableDataSource(this.canalizaciones);
  canalizacionesColumns: string[] = ['fecha', 'estudiante', 'atencion','estatus', 'editar', 'eliminar', ];
  //Tabla
  dataSource = new MatTableDataSource(this.miGrupo.estudiantes);
  displayedColumns: string[] = ['nombre', 'numeroDeControl','semestre' ,'creditos', 'sesiones', 'sesionesIniciales', 'estatus'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  asistenciaSource = new MatTableDataSource(this.asistencia);
  asistenciaIndividualSource = new MatTableDataSource(this.asistencia);
  asistenciaColumns : string[] = ['presente', 'nombre', 'numeroDeControl'];
  asistenciaIndividualColumns : string[] = ['presente', 'nombre', 'numeroDeControl'];

  //Formularios
  sesionesForm: FormGroup;
  sesionesIndividualesForm: FormGroup;
  canalizacionForm: FormGroup;

  canalizacionSeleccionada: Canalizacion;
  establecerCanalizacion(id: number){
    
    this.canalizaciones.forEach(f => {
      if(f.id == id){
        this.canalizacionSeleccionada = f;
        this.canalizacionForm.controls.descripcion.setValue(f.descripcion);
        this.canalizacionForm.controls.estatus.setValue(f.estado);
        var date = new Date(new Date(f.fecha).getTime())
        this.canalizacionForm.controls.fecha.setValue(date);
      }
    });
    this.formAlert = "editarCanalizacion";
  }

  constructor(
    private datePipe: DatePipe,
    private estudianteService: EstudianteService,
    private canalizacionService:CanalizacionService,
    private router: Router, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private grupoService: GrupoService,
    private personalService : PersonalService) {
    this.sesionesForm = new FormGroup({
      sesion: new FormControl('', [Validators.required]),
    });
    this.sesionesIndividualesForm = new FormGroup({
      sesion: new FormControl('', [Validators.required]),
    });
    this.canalizacionForm = new FormGroup({
      estatus: new FormControl('', [Validators.required]),
       descripcion: new FormControl('' ),
      fecha: new FormControl('', [Validators.required]),
    });
   
  }
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.usuario = this.authService.traerUsuario();

    
    if(this.usuario.personal.cargo == "T"){
      if(this.usuario.personal.id != parseInt(this.id.toString())){
        this.router.navigate(['/panel']);
      }else{
        
        this.personalService.get(this.id.toString()).subscribe(
          r => {
            if(r.code == 202){
              this.personalService.showGrupo(this.id.toString()).subscribe(
                r => {
                  this.miGrupo = r.data as Grupo;
                   
                  this.dataSource = new MatTableDataSource(this.miGrupo.estudiantes);
                  this.grupoService.showSesiones(this.miGrupo.id.toString()).subscribe(r => {
                    if (r.code == 200) {
                      this.sesiones = r.data as Array<Sesion>;
                    } else {
                      console.log("error: ", r.data)
                    }
                  });
                  this.grupoService.showSesionesIndividuales(this.miGrupo.id.toString()).subscribe(r => {
                    if (r.code == 200) {
                      this.sesionesIndividuales = r.data as Array<SesionIndividual>;
                    } else {
                      console.log("error: ", r.data)
                    }
                  });
                  this.grupoService.showCanalizaciones(this.miGrupo.id.toString()).subscribe(r=>{
                    console.log("Se ejecuta canalizacion");
                    if(r.code == 200){
                      this.canalizaciones = r.data as Array<Canalizacion>;
                      this.canalizacionesSource = new MatTableDataSource(this.canalizaciones);
                    }
                  });
              });
            }else{
              this.router.navigate(['/404']);
            }
           
          });
         
      }
      
      
    }else{
      this.personalService.get(this.id.toString()).subscribe(
        r => {
          if(r.code == 202){
            this.personalService.showGrupo(this.id.toString()).subscribe(
              r => {
                this.miGrupo = r.data as Grupo;
                 
                this.dataSource = new MatTableDataSource(this.miGrupo.estudiantes);
                this.grupoService.showSesiones(this.miGrupo.id.toString()).subscribe(r => {
                  if (r.code == 200) {
                    this.sesiones = r.data as Array<Sesion>;
                  } else {
                    console.log("error: ", r.data)
                  }
                });
                this.grupoService.showSesionesIndividuales(this.miGrupo.id.toString()).subscribe(r => {
                  if (r.code == 200) {
                    this.sesionesIndividuales = r.data as Array<SesionIndividual>;
                  } else {
                    console.log("error: ", r.data)
                  }
                });
                this.grupoService.showCanalizaciones(this.miGrupo.id.toString()).subscribe(r=>{
                  if(r.code == 200){
                    this.canalizaciones = r.data as Array<Canalizacion>;
                    this.canalizacionesSource = new MatTableDataSource(this.canalizaciones);
                  }
                });
                
            });
          }else{
            this.router.navigate(['/404']);
          }
         
        });
    }

   

   

    
  }
  AsignarAsistencia(values:any, id: any){
    if(values.checked){
      console.log("-> se ha agregado asistencia a estudiante con el ID: " + id);
      this.asistencia.find(x => x.id == id).presente = true;
    }else{
      console.log("-> se ha quitado asistencia a estudiante con el ID: " + id);
      this.asistencia.find(x => x.id == id).presente = false;
    }
  }
  AsignarAsistenciaIndividual(values:any, id: any){
    if(values.checked){
      console.log("-> se ha agregado asistencia a estudiante con el ID: " + id);
      this.asistenciaIndividual.find(x => x.id == id).presente = true;
    }else{
      console.log("-> se ha quitado asistencia a estudiante con el ID: " + id);
      this.asistenciaIndividual.find(x => x.id == id).presente = false;
    }
  }
  cargarAsistencias(value) {
    this.sesionSeleccionada = value;
     this.grupoService.showAsistencias(this.miGrupo.id.toString(), value).subscribe(
      r => {
        if (r.code == 200) {
          this.asistencia = r.data as Array<Estudiante>;
          this.asistenciaSource = new MatTableDataSource(this.asistencia);
        }
      }
    );
  }
  cargarAsistenciasIndividuales(value) {
    this.sesionIndividualSeleccionada = value;
     this.grupoService.showAsistenciasIndividuales(this.miGrupo.id.toString(), value).subscribe(
      r => {
        if (r.code == 200) {
          this.asistenciaIndividual = r.data as Array<Estudiante>;
          this.asistenciaIndividualSource = new MatTableDataSource(this.asistenciaIndividual);
        }
      }
    );
  }


 
  generarReporte(){
    var doc = new jsPDF();   
   
   var estudiantesLista = [];
   this.miGrupo.estudiantes.forEach(e => {
     var n = [e.numeroDeControl, e.usuario.nombreCompleto, e.semestre, '________________', e.sesiones];
     estudiantesLista.push(n);
   });


    doc.autoTable({
       head: [['Numero de control', 'Nombre', 'Semestre', 'Firma', 'Sesiones']],
       body:  estudiantesLista,
       theme: 'grid'
   })
   
   
   
   doc.save('a4.pdf');
 }
 generarLista(){
  
  var s = this.sesiones.find(x => x.id == this.sesionSeleccionada);
  var doc = new jsPDF();
  var pageHeight= doc.internal.pageSize.height;   
  //header of pdf
  doc.setFontSize(18);
  doc.text('INSTITUTO TECNOLÓGICO DE NUEVO LAREDO', doc.internal.pageSize.width/2, 20, null, null, 'center');
  doc.setFontSize(16);
  doc.text(('DEPARTAMENTO DE ' + this.miGrupo.personal.departamento.titulo.toUpperCase()), doc.internal.pageSize.width/2, 30, null, null, 'center');
  doc.setFontSize(12);
  doc.text(('GRUPO DE TUTORÍAS: ' + this.miGrupo.personal.usuario.nombreCompleto.toUpperCase()),doc.internal.pageSize.width/2, 40, null, null, 'center');
  doc.setFontSize(12);
  doc.text(20, 50, "Fecha: " + this.datePipe.transform(s.fecha, "d/M/yyyy") + "  Hora: "+ this.datePipe.transform(s.fecha, "h:mm a") + "  Aula: "+ this.miGrupo.salon);
  
  //body

 var estudiantesLista = [];
 this.miGrupo.estudiantes.forEach(e => {
   var estado: string = "";
   if(e.estado == "A"){
    estado = "Activo";
   }else if(e.estado == "T"){
     estado = "Liberado"
   }
   var n = [e.numeroDeControl, e.usuario.nombreCompleto.toUpperCase(), e.semestre ,e.sesiones,e.estado];
   estudiantesLista.push(n);
 });
  

  doc.autoTable({
     head: [['Núm. Control', 'Nombre', 'Sem.',  'Asis.', 'Est.','Firma']],
     body:  estudiantesLista,
     theme: 'grid',
     styles : {fillColor: [0, 79, 122]},
     stylesDef : {fontSize : 8},
     columnStyles:  {
        0: { fillColor: [255, 255, 255], columnWidth: 27},
        1: { fillColor: [255, 255, 255], columnWidth: 80},
        2: { fillColor: [255, 255, 255], columnWidth: 12},
        3: { fillColor: [255, 255, 255], columnWidth: 12},
        4: { fillColor: [255, 255, 255], columnWidth: 12},
        5: { fillColor: [255, 255, 255]},
      },
      margin: {top: 60},
 })


 let finalY = doc.lastAutoTable.finalY; // posición y 
 doc.text(20, finalY+15, "ACTIVIDADES DE LA SESIÓN: " );
 var split = doc.splitTextToSize(s.accionTutorial.contenido,180)
 doc.text(20, finalY+20, split);
 //5pt height????
 var heightActividad = finalY+95;

 doc.text("Si algún estudiante no aparece en la lista, repórtelo para revisar su situación", doc.internal.pageSize.width/2, heightActividad+5, null, null, 'center');
 doc.text("________________________________________________", doc.internal.pageSize.width/2, heightActividad+15, null, null, 'center');
 doc.text(this.miGrupo.personal.usuario.nombreCompleto.toUpperCase(), doc.internal.pageSize.width/2, heightActividad+20, null, null, 'center');

 doc.save('Lista.pdf');
}
generarListaIndividual(){
  
   var s = this.sesionesIndividuales.find(x => x.id == this.sesionIndividualSeleccionada);
   var doc = new jsPDF();   
   //header of pdf
   doc.setFontSize(18);
   doc.text('INSTITUTO TECNOLÓGICO DE NUEVO LAREDO', doc.internal.pageSize.width/2, 20, null, null, 'center');
   doc.setFontSize(16);
   doc.text(('DEPARTAMENTO DE ' + this.miGrupo.personal.departamento.titulo.toUpperCase()), doc.internal.pageSize.width/2, 30, null, null, 'center');
   doc.setFontSize(12);
   doc.text(('GRUPO DE TUTORIAS: ' + this.miGrupo.personal.usuario.nombreCompleto.toUpperCase()),doc.internal.pageSize.width/2, 40, null, null, 'center');
   doc.setFontSize(12);
   doc.text(20, 50, "Fecha: " + this.datePipe.transform(s.fecha, "d/M/yyyy") + "  Hora: "+ this.datePipe.transform(s.fecha, "h:mm a") + "  Aula: "+ this.miGrupo.salon);
   
   //body

  var estudiantesLista = [];
  this.miGrupo.estudiantes.forEach(e => {
    var estado: string = "";
    if(e.estado == "A"){
     estado = "Activo";
    }else if(e.estado == "T"){
      estado = "Liberado"
    }
    var n = [e.numeroDeControl, e.usuario.nombreCompleto.toUpperCase(), e.semestre ,e.sesiones,e.estado];
    estudiantesLista.push(n);
  });
   

   doc.autoTable({
      head: [['Núm. Control', 'Nombre', 'Sem.',  'Asis.', 'Est.','Firma']],
      body:  estudiantesLista,
      theme: 'grid',
      styles : {fillColor: [0, 79, 122]},
      stylesDef : {fontSize : 8},
      columnStyles:  {
         0: { fillColor: [255, 255, 255], columnWidth: 27},
         1: { fillColor: [255, 255, 255], columnWidth: 80},
         2: { fillColor: [255, 255, 255], columnWidth: 12},
         3: { fillColor: [255, 255, 255], columnWidth: 12},
         4: { fillColor: [255, 255, 255], columnWidth: 12},
         5: { fillColor: [255, 255, 255]},
       },
       margin: {top: 60},
  })


  let finalY = doc.lastAutoTable.finalY; // posición y 
  doc.text(20, finalY+25, "ACTIVIDADES DE LA SESIÓN: " );
  doc.text(20, finalY+30, s.accionTutorial.contenido);
  var widthActividad = doc.getTextWidth(s.accionTutorial.contenido)+finalY+30;
  doc.text("Si algún estudiante no aparece en la lista, repórtelo para revisar su situación", doc.internal.pageSize.width/2, widthActividad+15, null, null, 'center');
  doc.text("__________________________________________________", doc.internal.pageSize.width/2, widthActividad+25, null, null, 'center');
  doc.text(this.miGrupo.personal.usuario.nombreCompleto.toUpperCase(), doc.internal.pageSize.width/2, widthActividad+35, null, null, 'center');
 
 
   
  doc.save('Lista.pdf');
}
 generarReporteSemestral(){
   var doc =new jsPDF('landscape');
   doc.setFontSize(12);
   doc.text("INSTITUTO TECNOLÓGICO DE NUEVO LAREDO", doc.internal.pageSize.width/2, 20, null, null, 'center');
   doc.text(("DEPARTAMENTO DE " +this.miGrupo.personal.departamento.titulo.toUpperCase()), doc.internal.pageSize.width/2, 28, null, null, 'center');
   doc.text("REPORTE DEL TUTOR",doc.internal.pageSize.width/2, 36, null, null, 'center');
   doc.text(("NOMBRE DEL TUTOR: " +this.miGrupo.personal.usuario.nombreCompleto.toUpperCase()), 20, 46);
   doc.text(("FECHA: " + (formatDate(new Date(), 'yyyy/MM/dd', 'en'))), 240, 46);
   doc.text(("PROGRAMA ACADÉMICO: " +this.miGrupo.personal.departamento.titulo.toUpperCase()), 20, 54)

       
   var estudiantesLista = [];
   this.miGrupo.estudiantes.forEach(e => {
     var estado: string = "";
     if(e.estado == "A"){
      estado = "Activo";
     }else if(e.estado == "T"){
       estado = "Liberado"
     }
     var n = [e.usuario.nombreCompleto.toUpperCase(), e.semestre, e.sesiones, e.sesionesIndividuales,e.sesionesIniciales,e.canalizaciones];
     estudiantesLista.push(n);
   });

   

   doc.autoTable({
     head: [[ 'Nombre', 'Sem.',  'Ses.', 'Ses. Indiv.','Ses. Inicial','Can.','Áreas de canalización']],
     body:  estudiantesLista,
     theme: 'grid',
     styles : {fillColor: [0, 79, 122]},
     stylesDef : {fontSize : 8},
     columnStyles:  {
        0: { fillColor: [255, 255, 255], columnWidth: 80},
        1: { fillColor: [255, 255, 255]},
        2: { fillColor: [255, 255, 255]},
        3: { fillColor: [255, 255, 255]},
        4: { fillColor: [255, 255, 255]},
        5: { fillColor: [255, 255, 255]},
        6: { fillColor: [255, 255, 255]},//Cómo obtengo las areas de canalizacion??
      },
      margin: {top: 60},
 })
 let finalY = doc.lastAutoTable.finalY + 20;
 var pageHeight= doc.internal.pageSize.height;
   //no hay suficientes tutorados registrados como para comprobar el funcionamiento del 2do if 
   //pero no debe haber problemo creo xdxd
   if (finalY >= pageHeight) {
     doc.addPage();
     finalY=30;
     doc.text("___________________________________________", doc.internal.pageSize.width/2, finalY, null, null, 'center');
     doc.text("Nombre y firma del tutor", doc.internal.pageSize.width/2, finalY+5,null,null,'center');
     doc.text("___________________________________________", 20, finalY+30);
     doc.text("Nombre y firma del Jefe de Departamento Académico", 20, finalY+40);
     doc.text("___________________________________________", 170, finalY+30);
     doc.text("Nombre y firma del Coordinador de Tutorías", 180, finalY+40);
   } 
   if (finalY+50 >= pageHeight) {
     doc.addPage();
     finalY=30;
     doc.text("___________________________________________", doc.internal.pageSize.width/2, finalY, null, null, 'center');
     doc.text("Nombre y firma del tutor", doc.internal.pageSize.width/2, finalY+5,null,null,'center');
     doc.text("___________________________________________", 20, finalY+30);
     doc.text("Nombre y firma del Jefe de Departamento Académico", 20, finalY+40);
     doc.text("___________________________________________", 170, finalY+30);
     doc.text("Nombre y firma del Coordinador de Tutorías", 180, finalY+40);
   }
   else {
     doc.text("___________________________________________", doc.internal.pageSize.width/2, finalY, null, null, 'center');
     doc.text("Nombre y firma del tutor", doc.internal.pageSize.width/2, finalY+5,null,null,'center');
     doc.text("___________________________________________", 20, finalY+30);
     doc.text("Nombre y firma del Jefe de Departamento Académico", 20, finalY+40);
     doc.text("___________________________________________", 170, finalY+30);
     doc.text("Nombre y firma del Coordinador de Tutorías", 180, finalY+40);
   }

 doc.save('Reporte.pdf');

}
  Canalizar() {
    Swal.fire({
      title: 'Canalizar',
      html:
        '<input id="swal-input1" class="swal2-input">' +
        '<input id="swal-input2" class="swal2-input">',
    });
  }
  Guardar(){
    var nuevaAsistencia: Array<Estudiante> = new Array<Estudiante>();
    this.asistencia.forEach(e => {
      if(e.presente){
        nuevaAsistencia.push(e)
      }
    });
    if(this.sesionSeleccionada != 0 ){
      this.grupoService.AgregarAsistencias(this.miGrupo.id.toString(), this.sesionSeleccionada.toString(), nuevaAsistencia)
      .subscribe(s=>{
        if(s.code == 200){
          Swal.fire(
            'Se ha pasado lista correctamente',
            'la lista de esta sesion ha sido actualizada' ,
            'success'
          );
        }else{

        }
      });
    }

  }
  GuardarIndividual(){
    var nuevaAsistencia: Array<Estudiante> = new Array<Estudiante>();
    this.asistenciaIndividual.forEach(e => {
      if(e.presente){
        nuevaAsistencia.push(e)
      }
    });
    if(this.sesionIndividualSeleccionada != 0 ){
      this.grupoService.AgregarAsistenciasIndividuales(this.miGrupo.id.toString(), this.sesionIndividualSeleccionada.toString(), nuevaAsistencia)
      .subscribe(s=>{
        if(s.code == 200){
          Swal.fire(
            'Se ha pasado lista correctamente',
            'la lista de esta sesion ha sido actualizada' ,
            'success'
          );
        }else{

        }
      });
    }

  }
  editarCanalizacion(){
    if(this.canalizacionForm.valid){
    this.canalizacionSeleccionada.descripcion = this.canalizacionForm.controls.descripcion.value;
    this.canalizacionSeleccionada.estado = this.canalizacionForm.controls.estatus.value;
    this.canalizacionSeleccionada.fecha = this.canalizacionForm.controls.fecha.value;
    
    this.canalizacionService.editar(this.canalizacionSeleccionada).subscribe(r=>{
      if(r.code == 200){
        Swal.fire("Exito","Se ha editado la canalizacion con exito", "success");
        this.formAlert = 'none';
        this.grupoService.showCanalizaciones(this.miGrupo.id.toString()).subscribe(r=>{
         // console.log("Se ejecuta canalizacion");
          if(r.code == 200){
            this.canalizaciones = r.data as Array<Canalizacion>;
            this.canalizacionesSource = new MatTableDataSource(this.canalizaciones);
          }else{
            Swal.fire("Error","No se han completado todos los datos", "error");
          }
        });
      }else{
        Swal.fire("Error","No se han completado todos los datos o se ha puesto una fecha que aún no existe", "error");
      }
    });
  }else{
    Swal.fire("Error","No se han completado todos los datos", "error");
  }
  }
  eliminarCanalizacion(id: number){
this.canalizaciones = new Array<Canalizacion>();
this.canalizacionesSource = new MatTableDataSource(this.canalizaciones);
    console.log(id);
    this.canalizacionService.eliminar(id).subscribe(r=>{
      if(r.code == 200){
        Swal.fire("Exito","Se ha eliminado la canalizacion con exito", "success");
        this.grupoService.showCanalizaciones(this.miGrupo.id.toString()).subscribe(r=>{
          if(r.code == 200){
            this.canalizaciones = r.data as Array<Canalizacion>;
            this.canalizacionesSource = new MatTableDataSource(this.canalizaciones);
          } 
        });
      } 
    }
    );
  }
  mostrarCanalizaciones( x){}




  public async asignarSesiones(numeroDeControl: string) {
    const { value: sesiones } = await Swal.fire({
      title: "Introduce la cantidad inicial de sesiones",
      input: "text",
      inputValue: "",
      showCancelButton: true,
      inputValidator: value => {
        if (!value) {
          return "el campo esta vacio!";
        }
      }
    });
    if (sesiones) {
      this.estudianteService
        .asignarSesiones(numeroDeControl, sesiones)
        .subscribe(r => {
          if (r.code == 200) {
            Swal.fire(
              "Se ha logrado cambiar las sesiones iniciales",
               "Exito",
              "success"
            );
            this.miGrupo.estudiantes.find(f => f.numeroDeControl == numeroDeControl).sesionesIniciales = sesiones;
          } else {
            Swal.fire("Ha ocurrido un error", r.mensaje, "error");
          }
        });
    }
  }
  public async asignarEstatus(numeroDeControl: string) {
    console.log("alo");
    var opciones: Map<string, string> = new Map();
     opciones.set("A", "Activo");
     opciones.set("E", "Egresado");
     opciones.set("T", "Terminado");
     
    const { value: estado } = await Swal.fire({
      title: 'Selecciona el nuevo estado',
      input: 'select',
      inputOptions: opciones,
      inputPlaceholder: 'Estados',
      showCancelButton: true
    });
 
     if(estado != null && estado != undefined){
       this.estudianteService.asignarEstado(numeroDeControl, estado).subscribe(r=>{
        if (r.code == 200) {
          Swal.fire(
            "Se ha logrado cambiar el estado del alumno",
             "Exito",
            "success"
          );
          this.miGrupo.estudiantes.find(f => f.numeroDeControl == numeroDeControl).estado = estado;
        } else {
          Swal.fire("Ha ocurrido un error", r.mensaje, "error");
        }
       });
     }
  }



  
}

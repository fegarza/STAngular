import { Component, OnInit, ViewChild } from '@angular/core';
import { GrupoService } from 'src/app/services/grupo.service';
import { Grupo, Sesion, Estudiante, Usuario, Canalizacion } from 'src/app/models/models';
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
 
@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.sass']
})
export class GrupoComponent implements OnInit {

  //Traer el ID del  url
  public id: number;
  private sub: any;

  //Variables publicas
  public miGrupo: Grupo = new Grupo();
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
  asistenciaColumns : string[] = ['presente', 'nombre', 'numeroDeControl'];

  //Formularios
  sesionesForm: FormGroup;
  canalizacionForm: FormGroup;

  canalizacionSeleccionada: Canalizacion;
  establecerCanalizacion(id: number){
    this.canalizaciones.forEach(f => {
      if(f.id == id){
        this.canalizacionSeleccionada = f;
        this.canalizacionForm.controls.descripcion.setValue(f.descripcion);
        this.canalizacionForm.controls.estatus.setValue(f.estado);

      }
    });
    this.formAlert = "editarCanalizacion";
  }

  constructor(private canalizacionService:CanalizacionService, private router: Router, private authService: AuthService, private route: ActivatedRoute, private grupoService: GrupoService, private personalService : PersonalService) {
    this.sesionesForm = new FormGroup({
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
    var doc = new jsPDF();   
    doc.setFontSize(18);
    doc.text(15, 20, 'INSTITUTO TECNOLOGICO DE NUEVO LAREDO');
    doc.setFontSize(16);
    doc.text(15, 33, ('DEPARTAMENTO DE ' + this.miGrupo.personal.departamento.titulo.toUpperCase()));
    doc.setFontSize(12);
    doc.text(15, 39, ('GRUPO DE TUTORIAS: ' + this.miGrupo.personal.usuario.nombreCompleto.toUpperCase()));
   var estudiantesLista = [];
   this.miGrupo.estudiantes.forEach(e => {
     var estado: string = "";
     if(e.estado == "A"){
      estado = "Activo";
     }else if(e.estado == "T"){
       estado = "Liberado"
     }
     var n = [e.numeroDeControl, e.usuario.nombreCompleto, e.semestre, e.sesiones, e.cantidadDeCreditos, estado];
     estudiantesLista.push(n);
   });


    doc.autoTable({
       head: [['Numero de control', 'Nombre', 'Semestre',  'Sesiones', 'Creditos', 'Estado']],
       body:  estudiantesLista,
       theme: 'grid',
       styles : {fillColor: [0, 79, 122]},
       columnStyles:  {
          0: { fillColor: [255, 255, 255]},
          1: { fillColor: [255, 255, 255]},
          2: { fillColor: [255, 255, 255]},
          3: { fillColor: [255, 255, 255]},
          4: { fillColor: [255, 255, 255]},
          5: { fillColor: [255, 255, 255]}
        },
        margin: {top: 45},
   })
   
   
   
   doc.save('a4.pdf');
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
          console.log("Se ejecuta canalizacion");
          if(r.code == 200){
            this.canalizaciones = r.data as Array<Canalizacion>;
            this.canalizacionesSource = new MatTableDataSource(this.canalizaciones);
          }else{
            Swal.fire("Error","No se han completado todos los datos", "error");
          }
        });
      }
    });
  }else{
    Swal.fire("Error","No se han completado todos los datos", "error");
  }
  }
  eliminarCanalizacion(id: number){
    this.canalizacionService.eliminar(id).subscribe(r=>{
      if(r.code == 200){
        Swal.fire("Exito","Se ha eliminado la canalizacion con exito", "success");
        this.formAlert = 'none';
        this.grupoService.showCanalizaciones(this.miGrupo.id.toString()).subscribe(r=>{
          console.log("Se ejecuta canalizacion");
          if(r.code == 200){
            this.canalizaciones = r.data as Array<Canalizacion>;
            this.canalizacionesSource = new MatTableDataSource(this.canalizaciones);
          }else{
            Swal.fire("Error","No se han completado todos los datos", "error");
          }
        });
      }
    }
    );
  }
}

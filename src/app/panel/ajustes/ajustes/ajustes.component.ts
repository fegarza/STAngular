import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Usuario, Departamento, Cargo, Personal, Accion, Sesion, Titulo } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth-service.service';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { PersonalService } from 'src/app/services/personal.service';
import Swal from 'sweetalert2';
import { AccionService } from 'src/app/services/accion.service';
import { SesionService } from 'src/app/services/sesion.service';
import { TituloService } from 'src/app/services/titulo.service';
import { EstudianteDatos, Archivo } from '../../../models/models';
import { EstudianteService } from '../../../services/estudiante.service';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { ArchivoService } from 'src/app/services/archivo.service';


@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.sass']
})
export class AjustesComponent implements OnInit {
  
  hide = true;
  public loading: boolean = false;
  public formAlert: string = "none";
  public accionSeleccionada: Accion;
  public archivoSeleccionado: Archivo;
  
  //Constantes
  cargos: Array<Cargo> = [
    { tipo: "C", titulo: "Coordinador" },
    { tipo: "D", titulo: "Jefe de departamento" },
    { tipo: "J", titulo: "Jefe de tutorias" },
    { tipo: "T", titulo: "Tutor" }
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
  accionesEditarForm: FormGroup;
  sesionesForm: FormGroup;
  archivosForm: FormGroup;
  archivosEditarForm: FormGroup;
  //Propiedades
  miUsuario: Usuario;
  departamentos: Array<Departamento> = new Array<Departamento>();
  personales: Array<Personal> = new Array<Personal>();
  acciones: Array<Accion> = new Array<Accion>();
  titulos: Array<Titulo> = new Array<Titulo>();

  //sesiones dataTable
  todasSesiones: Array<Sesion> = new Array<Sesion>();
  sesionesSource = new MatTableDataSource(this.todasSesiones);
  sesionesColumns: string[] = ['fecha', 'editar', 'eliminar'];


  //acciones dattable
  todasAcciones: Array<Accion> = new Array<Accion>();
  accionesSource = new MatTableDataSource(this.todasAcciones);
  accionesColumns: string[] = ['obligatorio', 'fecha', 'titulo', 'tipo','editar', 'eliminar'];

  //archivos datatable
  public archivos: Array<Archivo> = new Array<Archivo>();
  archivosSource = new MatTableDataSource(this.archivos);
  archivosColumns: string[] = ['titulo', 'editar', 'eliminar'];

  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 30, 40, 50];

  // MatPaginator Output
  pageEvent: PageEvent;

  public establecerAccion( id: number){
     this.todasAcciones.forEach( f => {if(f.id == id){
      this.accionSeleccionada = f;
      var fechaTemp = {
        year: 1999,
        month: 1,
        day: 2
      }
      //this.accionesEditarForm.controls.fecha. = fechaTemp;
     
      console.log("Accione seleccionada:");
      console.log(f);
    }});
  
    this.formAlert = 'editarAcciones';
  }
  public establecerArchivo( id: number){
    this.archivos.forEach( f => {if(f.id == id){
     this.archivoSeleccionado = f;
     console.log("Archivo seleccionado:");
     console.log(f);
   }});
  
   this.formAlert = 'editarArchivos';
 }
  constructor(private archivoService: ArchivoService, private accionService: AccionService, private estudianteService: EstudianteService, private tituloService: TituloService, private sesionService: SesionService, private accionesService: AccionService, private authService: AuthService, private departamentoServices: DepartamentoService, private personalService: PersonalService) {
    this.archivoService.showAll().subscribe(r => {
      if(r.code == 200){
        this.archivos = r.data as Array<Archivo>;
        this.archivosSource = new MatTableDataSource(this.archivos);
      }
    });
  }
  ngOnInit() {
    //Cargar datos del usuario
    this.miUsuario = this.authService.traerUsuario();
    //-> En caso de ser estudiante
    if (this.miUsuario.tipo == "E") {
      
      this.crearFormsDeEstudiantes(); 
      this.estudianteService.mostrarDatos(this.miUsuario.estudiante.numeroDeControl).subscribe(r => {
        if (r.code == 200) {
          this.miUsuario.estudiante.estudianteDatos = r.data as EstudianteDatos;
          /*
            -> DATOS PERSONALES
          */
          //Datpos personales
          this.settingsForm.controls.fechaNacimiento.setValue(this.miUsuario.estudiante.estudianteDatos.fechaNacimiento);
          this.settingsForm.controls.estadoDeNacimiento.setValue(this.miUsuario.estudiante.estudianteDatos.estadoNacimiento);
          this.settingsForm.controls.ciudadDeNacimiento.setValue(this.miUsuario.estudiante.estudianteDatos.ciudadNacimiento);
          this.settingsForm.controls.telefonoMovil.setValue(this.miUsuario.estudiante.estudianteDatos.telefonoMovil);
          //Domicilio
          this.settingsForm.controls.telefonoDomicilio.setValue(this.miUsuario.estudiante.estudianteDatos.telefonoDomicilio);
          this.settingsForm.controls.colonia.setValue(this.miUsuario.estudiante.estudianteDatos.coloniaDomicilio);
          this.settingsForm.controls.calle.setValue(this.miUsuario.estudiante.estudianteDatos.calleDomicilio);
          this.settingsForm.controls.numero.setValue(this.miUsuario.estudiante.estudianteDatos.numDomicilio);
          //Beca y seguro social
          this.settingsForm.controls.seguroSocial.setValue(this.miUsuario.estudiante.estudianteDatos.nss);
          this.settingsForm.controls.tipoDeBeca.setValue(this.miUsuario.estudiante.estudianteDatos.becadoPor);
          //Trabajo
          this.settingsForm.controls.nombreEmpresa.setValue(this.miUsuario.estudiante.estudianteDatos.empresa);
          this.settingsForm.controls.horario.setValue(this.miUsuario.estudiante.estudianteDatos.horario);
          //Estado civil
          this.settingsForm.controls.estadoCivil.setValue(this.miUsuario.estudiante.estudianteDatos.estadoCivil);
          this.settingsForm.controls.numeroDeHijos.setValue(this.miUsuario.estudiante.estudianteDatos.numeroHijos);
          this.settingsForm.controls.dependenciaEconomica.setValue(this.miUsuario.estudiante.estudianteDatos.cependenciaEconomica);
          //Datos del padre
          this.settingsForm.controls.padreGrado.setValue(this.miUsuario.estudiante.estudianteDatos.estudiosPadre);
          this.settingsForm.controls.padreTrabajo.setValue(this.miUsuario.estudiante.estudianteDatos.lugarTrabajoPadre);
          this.settingsForm.controls.padreNumero.setValue(this.miUsuario.estudiante.estudianteDatos.telefonoTrabajoPadre);
          //Datos de la madre
          this.settingsForm.controls.madreGrado.setValue(this.miUsuario.estudiante.estudianteDatos.estudiosMadre);
          this.settingsForm.controls.madreTrabajo.setValue(this.miUsuario.estudiante.estudianteDatos.lugarTrabajoMadre);
          this.settingsForm.controls.madreNumero.setValue(this.miUsuario.estudiante.estudianteDatos.telefonoTrabajoMadre);
          


        }
      });
    }
    //-> En caso de ser personal
    else {
      this.crearFormsDePersonales();
      this.accionService.showAll().subscribe(r => {
        if (r.code == 200) {
          this.todasAcciones = r.data as Array<Accion>;
          this.accionesSource = new MatTableDataSource(this.todasAcciones);
        }
      });
      this.sesionService.showAll().subscribe(r => {
        if (r.code == 200) {
          this.todasSesiones = r.data as Array<Sesion>;
          this.sesionesSource = new MatTableDataSource(this.todasSesiones);
        }
      });

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

  }




  /*
    POR PARTE DE LOS ESTUDIANTES
  */
  guardarEstudiante() {

    //Datos personales
    this.miUsuario.estudiante.estudianteDatos.fechaNacimiento = this.settingsForm.controls.fechaNacimiento.value;
    this.miUsuario.estudiante.estudianteDatos.estadoNacimiento = this.settingsForm.controls.estadoDeNacimiento.value;
    this.miUsuario.estudiante.estudianteDatos.ciudadNacimiento = this.settingsForm.controls.estadoDeNacimiento.value;
    this.miUsuario.estudiante.estudianteDatos.telefonoMovil = this.settingsForm.controls.telefonoMovil.value;
    //Domicilio
    this.miUsuario.estudiante.estudianteDatos.telefonoDomicilio = this.settingsForm.controls.telefonoDomicilio.value;
    this.miUsuario.estudiante.estudianteDatos.coloniaDomicilio = this.settingsForm.controls.colonia.value;
    this.miUsuario.estudiante.estudianteDatos.numDomicilio = this.settingsForm.controls.numero.value;
    this.miUsuario.estudiante.estudianteDatos.calleDomicilio = this.settingsForm.controls.calle.value;
    //Beca y seguro social
    this.miUsuario.estudiante.estudianteDatos.tieneBeca = this.settingsForm.controls.tieneBeca.value;
    this.miUsuario.estudiante.estudianteDatos.nss = this.settingsForm.controls.seguroSocial.value;
    this.miUsuario.estudiante.estudianteDatos.becadoPor = this.settingsForm.controls.tipoDeBeca.value;
    //Trabajo
    this.miUsuario.estudiante.estudianteDatos.trabaja = this.settingsForm.controls.tieneTrabajo.value;
    this.miUsuario.estudiante.estudianteDatos.empresa = this.settingsForm.controls.nombreEmpresa.value;
    this.miUsuario.estudiante.estudianteDatos.horario = this.settingsForm.controls.horario.value;
    //Estado civil
    this.miUsuario.estudiante.estudianteDatos.estadoCivil = this.settingsForm.controls.estadoCivil.value;
    this.miUsuario.estudiante.estudianteDatos.numeroHijos = this.settingsForm.controls.numeroDeHijos.value;
    this.miUsuario.estudiante.estudianteDatos.cependenciaEconomica = this.settingsForm.controls.dependenciaEconomica.value;
    //Datos del padre
    this.miUsuario.estudiante.estudianteDatos.padreVive = this.settingsForm.controls.padreVive.value;
    this.miUsuario.estudiante.estudianteDatos.estudiosPadre = this.settingsForm.controls.padreGrado.value;
    this.miUsuario.estudiante.estudianteDatos.lugarTrabajoPadre = this.settingsForm.controls.padreTrabajo.value;
    this.miUsuario.estudiante.estudianteDatos.telefonoTrabajoPadre = this.settingsForm.controls.padreNumero.value;
    //Datos de la madre
    this.miUsuario.estudiante.estudianteDatos.madreVive = this.settingsForm.controls.madreVive.value;
    this.miUsuario.estudiante.estudianteDatos.estudiosMadre = this.settingsForm.controls.madreGrado.value;
    this.miUsuario.estudiante.estudianteDatos.lugarTrabajoMadre = this.settingsForm.controls.madreTrabajo.value;
    this.miUsuario.estudiante.estudianteDatos.telefonoTrabajoMadre = this.settingsForm.controls.madreNumero.value;
    
    console.log("--> Estudiante datos");
    console.log( this.miUsuario.estudiante.estudianteDatos);
        this.estudianteService.guardarDatos(this.miUsuario.estudiante.estudianteDatos).subscribe(r => {
          if(r.code == 200){
            Swal.fire('Exito',"Se ha guardado con exito", "success");
          }else{
    
          }
        });
      

  }
  crearFormsDeEstudiantes() {
    this.settingsForm = new FormGroup({
      /*
        -> Datos personales
      */
      //Datos generales
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.min(6)]),
      fechaNacimiento: new FormControl(),
      estadoDeNacimiento: new FormControl(''),
      ciudadDeNacimiento: new FormControl(''),
      telefonoMovil: new FormControl(''),
      //Domicilio
      telefonoDomicilio: new FormControl(''),
      colonia: new FormControl(''),
      calle: new FormControl(''),
      numero: new FormControl(''),
      //Beca
      tieneBeca: new FormControl(''),
      seguroSocial: new FormControl(''),
      tipoDeBeca: new FormControl(''),
      //Trabajo
      tieneTrabajo: new FormControl(''),
      nombreEmpresa: new FormControl(''),
      horario: new FormControl(''),
      //Estado civil
      estadoCivil: new FormControl(''),
      numeroDeHijos: new FormControl(''),
      dependenciaEconomica: new FormControl(''),
      /*
        -> Datos clinicos
      */
      //Deficiencias sensiorales
      vista: new FormControl(''),
      oido: new FormControl(''),
      lenguaje: new FormControl(''),
      motriz: new FormControl(''),
      //PAdecimientos o deficiencias del sistema organico
      nervioso: new FormControl(''),
      circulatorio: new FormControl(''),
      digestivo: new FormControl(''),
      respiratorio: new FormControl(''),
      oseo: new FormControl(''),
      otros: new FormControl(''),
      //Lleva o ha llevado tratamiento psicologico o psiquiatrico
      haLlevadoTratamiento: new FormControl(''),
      tratamiento: new FormControl(''),
      //Tratamiento psicofisilogico
      hinchazon: new FormControl(''),
      doloresVientre: new FormControl(''),
      doloresCabeza: new FormControl(''),
      perdidaEquilibrio: new FormControl(''),
      fatiga: new FormControl(''),
      perdidaVista: new FormControl(''),
      dificultadParaDormir: new FormControl(''),
      pesadilla: new FormControl(''),
      pesadillaAQue: new FormControl(''),
      incontinencia: new FormControl(''),
      tartamudeos: new FormControl(''),
      miedos: new FormControl(''),
      /*
        ->Datos de el padre
      */
      padreVive: new FormControl(''),
      padreGrado: new FormControl(''),
      padreTrabajo: new FormControl(''),
      padreNumero: new FormControl(''),
      /*
        ->Datos de la madre
      */
      madreVive: new FormControl(''),
      madreGrado: new FormControl(''),
      madreTrabajo: new FormControl(''),
      madreNumero: new FormControl('')





    });
  }
  onSubmit() {
  }



  /*
    POR PARTE DE LOS PERSONALES
  */
  crearFormsDePersonales() {
    this.personalesForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.min(6)]),
      departamento: new FormControl('', [Validators.required]),
      cargo: new FormControl('', [Validators.required]),
      genero: new FormControl('', [Validators.required]),
      titulo: new FormControl('', [Validators.required]),
      cve: new FormControl('', [Validators.required])
    });

    this.accionesForm = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
      contenido: new FormControl('', [Validators.required]),
      obligatorio: new FormControl('', [Validators.required]),
      tipo: new FormControl('', [Validators.required])
    });
    this.accionesEditarForm = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
      contenido: new FormControl('', [Validators.required]),
      obligatorio: new FormControl('', [Validators.required]),
      tipo: new FormControl('', [Validators.required])
    });

    this.sesionesForm = new FormGroup({
      departamento: new FormControl('', [Validators.required]),
      accionTutorial: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required])
    });

    this.archivosForm = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', ),
      link: new FormControl('', ),
    });
    this.archivosEditarForm = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', ),
      link: new FormControl('', ),
    });
  }
  onSubmitPersonal() {
    this.loading = true;
    if (this.personalesForm.valid) {
      var personal: Personal = new Personal();
      personal.cargo = this.personalesForm.controls.cargo.value;
      personal.departamentoId = this.personalesForm.controls.departamento.value;
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
  onSubmitAcciones() {
    this.loading = true;
    var accion: Accion = new Accion();
    accion.titulo = this.accionesForm.controls.titulo.value;
    accion.contenido = this.accionesForm.controls.contenido.value;
    accion.fecha = this.accionesForm.controls.fecha.value;
    accion.tipo = this.accionesForm.controls.tipo.value;
    if (this.accionesForm.controls.obligatorio.value == "1") {
      accion.obligatorio = true;
    } else {
      accion.obligatorio = false;
    }
    accion.personalId = this.miUsuario.personal.id;
    this.accionesService.add(accion).subscribe(r => {
      if (r.code == 200) {
        this.accionesForm.reset();
        Swal.fire(
          'Se ha insertado con exito',
          r.mensaje,
          'success'
        );
        this.loading = false;
        this.formAlert = 'none';
        this.accionService.showAll().subscribe(r => {
          if (r.code == 200) {
            this.todasAcciones = r.data as Array<Accion>;
            this.accionesSource = new MatTableDataSource(this.todasAcciones);
          }
        });
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
  onSubmitSesiones() {
    this.loading = true;
    var sesion: Sesion = new Sesion();
    sesion.fecha = this.sesionesForm.controls.fecha.value;
    sesion.departamentoId = this.sesionesForm.controls.departamento.value;
    sesion.accionTutorialId = this.sesionesForm.controls.accionTutorial.value;
    sesion.departamento = null;
    sesion.accionTutorial = null;
    sesion.departamento = null;
    this.sesionService.add(sesion).subscribe(r => {
      if (r.code == 200) {
        this.loading = false;
        this.sesionesForm.reset();
        this.cargarAcciones(sesion.departamentoId);
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
  onSubmitArchivos() {
    this.loading = true;
    var acrhivo : Archivo = new Archivo();
    acrhivo.titulo = this.archivosForm.controls.titulo.value;
    acrhivo.descripcion = this.archivosForm.controls.descripcion.value;
    acrhivo.link = this.archivosForm.controls.link.value;

    this.archivoService.add(acrhivo).subscribe(r => {
      if(r.code == 200){
        Swal.fire(
          'Se ha insertado con exito',
          r.mensaje,
          'success'
        );
        this.archivoService.showAll().subscribe(r => {
          if(r.code == 200){
            this.archivos = r.data as Array<Archivo>;
            this.archivosSource = new MatTableDataSource(this.archivos);
          }
        });
        this.formAlert = 'none';
      }else{
        Swal.fire(
          r.mensaje,
          'no ha sido posible',
          'error'
        );
      }
      this.loading = false;
    })
  }
  cargarAcciones(id) {
    this.loading = true;
    if (id != null) {
      this.departamentoServices.showAcciones(id).subscribe(
        s => {
          this.acciones = s.data as Array<Accion>;
          this.loading = false;
        }
      );
    }

  }

  mostrarAcciones() {

  }
  editarAccion(){
    this.accionSeleccionada.titulo = this.accionesEditarForm.controls.titulo.value;
    this.accionSeleccionada.fecha = this.accionesEditarForm.controls.fecha.value;
    this.accionSeleccionada.obligatorio = this.accionesEditarForm.controls.obligatorio.value;
    this.accionSeleccionada.tipo = this.accionesEditarForm.controls.tipo.value;
    this.accionSeleccionada.contenido = this.accionesEditarForm.controls.contenido.value;
    if (this.accionesEditarForm.controls.obligatorio.value == "1") {
      this.accionSeleccionada.obligatorio = true;
    } else {
      this.accionSeleccionada.obligatorio = false;
    }
    this.accionService.editarAccion(this.accionSeleccionada).subscribe(r => {
      if(r.code == 200){
        this.todasAcciones.forEach( f => {if(f.id == this.accionSeleccionada.id){
          f = this.accionSeleccionada
        }});
        Swal.fire(
          'Se ha editado con exito con exito',
          r.mensaje,
          'success'
        );
        this.formAlert = 'none';
      }else{
        Swal.fire(
          r.mensaje,
          "Ya existe una accion tutorial para esa fecha",
          'error'
        );
      }
    });
    
  }
  editarArchivo(){
    
  }
  eliminarArchivo(id: number){
    this.archivoService.eliminar(id).subscribe(r => {
      if(r.code == 200){
        Swal.fire('exito', 'se ha eliminado con exito la accion tutorial', 'success');
        this.archivos = new Array<Archivo>();
        this.archivoService.showAll().subscribe(r => {
          if(r.code == 200){
            this.archivos = r.data as Array<Archivo>;
            this.archivosSource = new MatTableDataSource(this.archivos);
          }
        });
      }
    })
  }
  eliminarAccion(id: number){
    this.accionesService.eliminar(id).subscribe(r=>{
      if(r.code == 200){
        Swal.fire('exito', 'se ha eliminado con exito la accion tutorial', 'success');
        this.todasAcciones = new Array<Accion>();
        this.accionService.showAll().subscribe(r => {
          if (r.code == 200) {
            this.todasAcciones = r.data as Array<Accion>;
            this.accionesSource = new MatTableDataSource(this.todasAcciones);
          } 
        });
      }else{
        Swal.fire('Error', 'No se puede eliminar puesto que ya existen sesiones con esa accion tutorial', 'error');
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Usuario, Departamento, Cargo, Personal, Accion, Sesion, Titulo, Count } from 'src/app/models/models';
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
import { DatePipe } from '@angular/common'   
import {Sort} from '@angular/material/sort';

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
  accionLength: number = 100;
  accionesSource = new MatTableDataSource(this.todasAcciones);
  accionesColumns: string[] = ['visible', 'obligatorio', 'fecha', 'titulo', 'tipo', 'editar', 'eliminar'];
  accionesSort: Accion[];
  //archivos datatable
  public archivos: Array<Archivo> = new Array<Archivo>();
  archivosSource = new MatTableDataSource(this.archivos);
  public archivoLength: number = 100;
  archivosColumns: string[] = ['titulo', 'editar', 'eliminar'];

  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 30, 40, 50];

  // MatPaginator Output
  pageEvent: PageEvent;

  public establecerAccion(id: number) {
    this.todasAcciones.forEach(f => {
      if (f.id == id) {
        var date = new Date(new Date(f.fecha).getTime())
        this.accionesEditarForm.controls.titulo.setValue(f.titulo);
        this.accionesEditarForm.controls.contenido.setValue(f.contenido);
        this.accionesEditarForm.controls.tipo.setValue(f.tipo);
        this.accionesEditarForm.controls.activo.setValue(f.activo);
        this.accionesEditarForm.controls.obligatorio.setValue(f.obligatorio);
        this.accionesEditarForm.controls.fecha.setValue(date);
        this.accionSeleccionada = f;
      }
    });

    this.formAlert = 'editarAcciones';
  }
  public establecerArchivo(id: number) {
    this.archivos.forEach(f => {
      if (f.id == id) {
        this.archivoSeleccionado = f;
        this.archivosEditarForm.controls.titulo.setValue(f.titulo);
        this.archivosEditarForm.controls.descripcion.setValue(f.descripcion);
        this.archivosEditarForm.controls.link.setValue(f.link);
        console.log("Archivo seleccionado:");
        console.log(f);
      }
    });

    this.formAlert = 'editarArchivos';
  }
  constructor(
    private datePipe: DatePipe, 
    private archivoService: ArchivoService, private accionService: AccionService, private estudianteService: EstudianteService, private tituloService: TituloService, private sesionService: SesionService, private accionesService: AccionService, private authService: AuthService, private departamentoServices: DepartamentoService, private personalService: PersonalService) {
  }

  ngOnInit() {



    
  
    //Cargar datos del usuario
    this.miUsuario = this.authService.traerUsuario();
    //-> En caso de ser estudiante
    if (this.miUsuario.estudiante != null) {

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
          this.settingsForm.controls.tieneBeca.setValue(this.miUsuario.estudiante.estudianteDatos.tieneBeca);
          //Trabajo
          this.settingsForm.controls.nombreEmpresa.setValue(this.miUsuario.estudiante.estudianteDatos.empresa);
          this.settingsForm.controls.horario.setValue(this.miUsuario.estudiante.estudianteDatos.horario);
          this.settingsForm.controls.tieneTrabajo.setValue(this.miUsuario.estudiante.estudianteDatos.trabaja);
          //Estado civil
          this.settingsForm.controls.estadoCivil.setValue(this.miUsuario.estudiante.estudianteDatos.estadoCivil);
          this.settingsForm.controls.numeroDeHijos.setValue(this.miUsuario.estudiante.estudianteDatos.numeroHijos);
          this.settingsForm.controls.dependenciaEconomica.setValue(this.miUsuario.estudiante.estudianteDatos.cependenciaEconomica);
          //Deficiencias sensoriales o funcionales
          this.settingsForm.controls.vista.setValue(this.miUsuario.estudiante.estudianteDatos.prescripcionVista);
          this.settingsForm.controls.oido.setValue(this.miUsuario.estudiante.estudianteDatos.prescripcionOido);
          this.settingsForm.controls.lenguaje.setValue(this.miUsuario.estudiante.estudianteDatos.prescripcionLenguaje);
          this.settingsForm.controls.motriz.setValue(this.miUsuario.estudiante.estudianteDatos.prescripcionMotriz);
          //Padecimientos o deficiencias de sistema organico
          this.settingsForm.controls.nervioso.setValue(this.miUsuario.estudiante.estudianteDatos.prescripcionSistemaNervioso);
          this.settingsForm.controls.circulatorio.setValue(this.miUsuario.estudiante.estudianteDatos.prescripcionSistemaCirculatorio);
          this.settingsForm.controls.digestivo.setValue(this.miUsuario.estudiante.estudianteDatos.prescripcionSistemaDigestivo);
          this.settingsForm.controls.respiratorio.setValue(this.miUsuario.estudiante.estudianteDatos.prescripcionSistemaRespiratorio);
          this.settingsForm.controls.oseo.setValue(this.miUsuario.estudiante.estudianteDatos.prescripcionSistemaOseo);
          this.settingsForm.controls.otros.setValue(this.miUsuario.estudiante.estudianteDatos.prescripcionSistemaOtro);
          //Lleva o ha llevado tratamiendo psicologico o psiquiatrico
          this.settingsForm.controls.haLlevadoTratamiento.setValue(this.miUsuario.estudiante.estudianteDatos.tratamientoPsicologicoPsiquiatrico);
          this.settingsForm.controls.tratamiento.setValue(this.miUsuario.estudiante.estudianteDatos.tratamientoPsicologicoPsiquiatricoExplicacion);
          //Estado psicofisiologico
          this.settingsForm.controls.hinchazon.setValue(this.miUsuario.estudiante.estudianteDatos.manosPiesHinchados);
          this.settingsForm.controls.doloresVientre.setValue(this.miUsuario.estudiante.estudianteDatos.doloresVientre);
          this.settingsForm.controls.doloresCabeza.setValue(this.miUsuario.estudiante.estudianteDatos.doloresCabezaVomito);
          this.settingsForm.controls.perdidaEquilibrio.setValue(this.miUsuario.estudiante.estudianteDatos.perdidaEquilibrio);
          this.settingsForm.controls.fatiga.setValue(this.miUsuario.estudiante.estudianteDatos.fatigaAgotamiento );
          this.settingsForm.controls.perdidaVista.setValue(this.miUsuario.estudiante.estudianteDatos.perdidaVistaOido);
          this.settingsForm.controls.dificultadParaDormir.setValue(this.miUsuario.estudiante.estudianteDatos.dificultadDormir );
          this.settingsForm.controls.pesadilla.setValue(this.miUsuario.estudiante.estudianteDatos.pesadillasTerroresNocturnos );
          this.settingsForm.controls.pesadillaAQue.setValue(this.miUsuario.estudiante.estudianteDatos.pesadillasTerroresNocturnosAque );
          this.settingsForm.controls.incontinencia.setValue(this.miUsuario.estudiante.estudianteDatos.incontinencia );
          this.settingsForm.controls.tartamudeos.setValue(this.miUsuario.estudiante.estudianteDatos.tartamudeos);
          this.settingsForm.controls.miedos.setValue(this.miUsuario.estudiante.estudianteDatos.miedosIntensos);
          
          //Datos del padre
          this.settingsForm.controls.padreGrado.setValue(this.miUsuario.estudiante.estudianteDatos.estudiosPadre);
          this.settingsForm.controls.padreVive.setValue(this.miUsuario.estudiante.estudianteDatos.padreVive);
          this.settingsForm.controls.padreTrabajo.setValue(this.miUsuario.estudiante.estudianteDatos.lugarTrabajoPadre);
          this.settingsForm.controls.padreNumero.setValue(this.miUsuario.estudiante.estudianteDatos.telefonoTrabajoPadre);
          //Datos de la madre
          this.settingsForm.controls.madreGrado.setValue(this.miUsuario.estudiante.estudianteDatos.estudiosMadre);
          this.settingsForm.controls.madreVive.setValue(this.miUsuario.estudiante.estudianteDatos.madreVive);
          this.settingsForm.controls.madreTrabajo.setValue(this.miUsuario.estudiante.estudianteDatos.lugarTrabajoMadre);
          this.settingsForm.controls.madreNumero.setValue(this.miUsuario.estudiante.estudianteDatos.telefonoTrabajoMadre);
          


        }
      });
    }
    //-> En caso de ser personal
    else {
      this.accionService.count().subscribe(r=>{
        if(r.code == 200){
          var c = r.data as Count;
          this.accionLength = c.count;
        }
      });
      this.archivoService.count().subscribe(r=>{
        if(r.code == 200){
          var c = r.data as Count;
          this.archivoLength = c.count;
        }
      });
      this.archivoService.showAll().subscribe(r => {
        if (r.code == 200) {
          this.archivos = r.data as Array<Archivo>;
          this.archivosSource = new MatTableDataSource(this.archivos);
        }
      });
      this.crearFormsDePersonales();
      this.accionService.getPage(10,1).subscribe(r => {
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
    this.miUsuario.estudiante.estudianteDatos.ciudadNacimiento = this.settingsForm.controls.ciudadDeNacimiento.value;
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
    //DEFICIENCIAS SENSORIALES O FUNCIONALES
    this.miUsuario.estudiante.estudianteDatos.prescripcionVista = this.settingsForm.controls.vista.value;
    this.miUsuario.estudiante.estudianteDatos.prescripcionOido = this.settingsForm.controls.oido.value;
    this.miUsuario.estudiante.estudianteDatos.prescripcionLenguaje = this.settingsForm.controls.lenguaje.value;
    this.miUsuario.estudiante.estudianteDatos.prescripcionMotriz = this.settingsForm.controls.motriz.value;
    //Padecimientos o deficiencias de sistema organico
    this.miUsuario.estudiante.estudianteDatos.prescripcionSistemaNervioso = this.settingsForm.controls.nervioso.value;
    this.miUsuario.estudiante.estudianteDatos.prescripcionSistemaCirculatorio = this.settingsForm.controls.circulatorio.value;
    this.miUsuario.estudiante.estudianteDatos.prescripcionSistemaDigestivo = this.settingsForm.controls.digestivo.value;
    this.miUsuario.estudiante.estudianteDatos.prescripcionSistemaRespiratorio = this.settingsForm.controls.respiratorio.value;
    this.miUsuario.estudiante.estudianteDatos.prescripcionSistemaOseo = this.settingsForm.controls.oseo.value;
    this.miUsuario.estudiante.estudianteDatos.prescripcionSistemaOtro = this.settingsForm.controls.otros.value;
    //Leva o ha llevado tratamiento psicologico o psiquiatrico
    this.miUsuario.estudiante.estudianteDatos.tratamientoPsicologicoPsiquiatrico = this.settingsForm.controls.haLlevadoTratamiento.value;
    this.miUsuario.estudiante.estudianteDatos.tratamientoPsicologicoPsiquiatricoExplicacion = this.settingsForm.controls.tratamiento.value;
    //Estado psicofisico
    this.miUsuario.estudiante.estudianteDatos.manosPiesHinchados = this.settingsForm.controls.hinchazon.value;
    this.miUsuario.estudiante.estudianteDatos.doloresVientre = this.settingsForm.controls.doloresVientre.value;
    this.miUsuario.estudiante.estudianteDatos.doloresCabezaVomito = this.settingsForm.controls.doloresCabeza.value;
    this.miUsuario.estudiante.estudianteDatos.perdidaEquilibrio = this.settingsForm.controls.perdidaEquilibrio.value;
    this.miUsuario.estudiante.estudianteDatos.fatigaAgotamiento = this.settingsForm.controls.fatiga.value;
    this.miUsuario.estudiante.estudianteDatos.perdidaVistaOido = this.settingsForm.controls.perdidaVista.value;
    this.miUsuario.estudiante.estudianteDatos.dificultadDormir = this.settingsForm.controls.dificultadParaDormir.value;
    this.miUsuario.estudiante.estudianteDatos.pesadillasTerroresNocturnos = this.settingsForm.controls.pesadilla.value;
    this.miUsuario.estudiante.estudianteDatos.pesadillasTerroresNocturnosAque = this.settingsForm.controls.pesadillaAQue.value;
    this.miUsuario.estudiante.estudianteDatos.incontinencia = this.settingsForm.controls.incontinencia.value;
    this.miUsuario.estudiante.estudianteDatos.tartamudeos = this.settingsForm.controls.tartamudeos.value;
    this.miUsuario.estudiante.estudianteDatos.miedosIntensos = this.settingsForm.controls.miedos.value;
    

    console.log("--> Estudiante datos");
    console.log(this.miUsuario.estudiante.estudianteDatos);
    this.estudianteService.guardarDatos(this.miUsuario.estudiante.estudianteDatos).subscribe(r => {
      if (r.code == 200) {
        Swal.fire('Exito', "Se ha guardado con exito", "success");
      } else {

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
      activo: new FormControl('', [Validators.required]),
      tipo: new FormControl('', [Validators.required])
    });

    this.sesionesForm = new FormGroup({
      departamento: new FormControl('', [Validators.required]),
      accionTutorial: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required])
    });

    this.archivosForm = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl(''),
      link: new FormControl('', [Validators.required])
    });
    this.archivosEditarForm = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl(''),
      link: new FormControl('', [Validators.required])
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
          Swal.fire(
            'Error',
            r.mensaje,
            'error'
          );
          this.loading = false;


        }
      });
    } else {
      this.loading = false;
      var cadena: string = "";
      if (!this.personalesForm.controls.cve.valid) {
        cadena += "Debe seleccionar un personal<br>";
      }
      if (!this.personalesForm.controls.email.valid) {
        cadena += "Debe colocar un correo electronico valido<br>";
      }
      if (!this.personalesForm.controls.password.valid) {
        cadena += "La contraseña debe de ser de mínimo 6 caracteres<br>";
      }
      if (!this.personalesForm.controls.titulo.valid) {
        cadena += "Debe seleccionar un título profecional<br>";
      }
      if (!this.personalesForm.controls.departamento.valid) {
        cadena += "Debe seleccionar el departamento al que pertenece<br>";
      }
      if (!this.personalesForm.controls.cargo.valid) {
        cadena += "Debe seleccionar el cargo al cual va a emplear el empleado<br>";
      }
      if (!this.personalesForm.controls.genero.valid) {
        cadena += "Debe seleccionar el género del empleado<br>";
      }
      Swal.fire(
        "Errores en el formulario",
        cadena,
        'error'
      );
    }
  }
  onSubmitAcciones() {
    this.loading = true;
    if (this.accionesForm.valid) {
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
    } else {
      this.loading = false;
      var cadena: string = "";
      if (!this.accionesForm.controls.titulo.valid) {
        cadena += "Debe colocar el título de la cción tutorial<br>";
      }
      if (!this.accionesForm.controls.fecha.valid) {
        cadena += "Debe colocar la fecha<br>";
      }
      if (!this.accionesForm.controls.contenido.valid) {
        cadena += "Debe colocar el contenido<br>";
      }
      if (!this.accionesForm.controls.tipo.valid) {
        cadena += "Debe seleccionar el tipo<br>";
      }
      if (!this.accionesForm.controls.obligatorio.valid) {
        cadena += "Debe indicar si es obbligatoria<br>";
      }
      Swal.fire(
        "Errores en el formulario",
        cadena,
        'error'
      );

    }

  }
  onSubmitSesiones() {
    this.loading = true;
    if (this.sesionesForm.valid) {
      var sesion: Sesion = new Sesion();
      sesion.fecha = this.datePipe.transform(this.sesionesForm.controls.fecha.value, 'MM/dd/yyyy HH:mm:ss');

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
    } else {
      this.loading = false;
      var cadena: string = "";
      if (!this.sesionesForm.controls.departamento.valid) {
        cadena += "Debe seleccionar un departamento<br>";
      }
      if (!this.sesionesForm.controls.accionTutorial.valid) {
        cadena += "Debe seleccionar una acción tutorial<br>";
      }
      if (!this.sesionesForm.controls.fecha.valid) {
        cadena += "Debe seleccionar una fecha valida<br>";
      }
      Swal.fire(
        "Errores en el formulario",
        cadena,
        'error'
      );
    }

  }
  onSubmitArchivos() {
    this.loading = true;
    if (this.archivosForm.valid) {
      var acrhivo: Archivo = new Archivo();
      acrhivo.titulo = this.archivosForm.controls.titulo.value;
      acrhivo.descripcion = this.archivosForm.controls.descripcion.value;
      acrhivo.link = this.archivosForm.controls.link.value;

      this.archivoService.add(acrhivo).subscribe(r => {
        if (r.code == 200) {
          Swal.fire(
            'Se ha insertado con exito',
            r.mensaje,
            'success'
          );
          this.archivoService.showAll().subscribe(r => {
            if (r.code == 200) {
              this.archivos = r.data as Array<Archivo>;
              this.archivosSource = new MatTableDataSource(this.archivos);
            }
          });
          this.formAlert = 'none';
        } else {
          Swal.fire(
            r.mensaje,
            'no ha sido posible',
            'error'
          );
        }
        this.loading = false;
      })
    } else {
      this.loading = false;
      var cadena: string = "";
      if (!this.archivosForm.controls.titulo.valid) {
        cadena += "Debe colocar el título del archivo<br>";
      }
      if (!this.archivosForm.controls.link.valid) {
        cadena += "Debe colocar el link de enlace al arhcivo<br>";
      }
      Swal.fire(
        "Errores en el formulario",
        cadena,
        'error'
      );


    }

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

  mostrarAcciones(event?:PageEvent) {
    this.accionService.getPage(event.pageSize, (event.pageIndex+1)).subscribe(r => {
      if (r.code == 200) {
        this.todasAcciones = r.data as Array<Accion>;
        this.accionesSource = new MatTableDataSource(this.todasAcciones);
      }
    });
    return event;
  }
  editarAccion() {
    this.loading = true;
    if (this.accionesEditarForm.valid) {
      this.accionSeleccionada.titulo = this.accionesEditarForm.controls.titulo.value;
      this.accionSeleccionada.fecha = this.accionesEditarForm.controls.fecha.value;
      
     if(this.accionesEditarForm.controls.obligatorio.value == "true"){
      this.accionSeleccionada.obligatorio = true;
     }else{
      this.accionSeleccionada.obligatorio = false;
     }
     if( this.accionesEditarForm.controls.activo.value == "true"){
      this.accionSeleccionada.activo = true;
     }else{
      this.accionSeleccionada.activo = false;
     }
      
      
     
      this.accionSeleccionada.tipo = this.accionesEditarForm.controls.tipo.value;
      this.accionSeleccionada.contenido = this.accionesEditarForm.controls.contenido.value;
       
      this.accionService.editarAccion(this.accionSeleccionada).subscribe(r => {
        if (r.code == 200) {
          this.loading = false
          this.todasAcciones.forEach(f => {
            if (f.id == this.accionSeleccionada.id) {
              f = this.accionSeleccionada
            }
          });
          Swal.fire(
            'Se ha editado con exito con exito',
            r.mensaje,
            'success'
          );
          this.formAlert = 'none';
        } else {
          this.loading = false;
          Swal.fire(
            r.mensaje,
            "Ya existe una accion tutorial para esa fecha",
            'error'
          );
        }
      });

    }
    else {
      this.loading = false;
      var cadena: string = "";
      if (!this.accionesEditarForm.controls.titulo.valid) {
        cadena += "Debe colocar el título de la cción tutorial<br>";
      }
      if (!this.accionesEditarForm.controls.fecha.valid) {
        cadena += "Debe colocar la fecha<br>";
      }
      if (!this.accionesEditarForm.controls.contenido.valid) {
        cadena += "Debe colocar el contenido<br>";
      }
      if (!this.accionesEditarForm.controls.tipo.valid) {
        cadena += "Debe seleccionar el tipo<br>";
      }
      if (!this.accionesEditarForm.controls.obligatorio.valid) {
        cadena += "Debe indicar si es obbligatoria<br>";
      }
      if (!this.accionesEditarForm.controls.activo.valid) {
        cadena += "Debe indicar si va a ser visible la acción tutorial<br>";
      }
      Swal.fire(
        "Errores en el formulario",
        cadena,
        'error'
      );
    }

  }
  editarArchivo() {
    this.loading = true;
    if (this.archivosEditarForm.valid) {
      this.archivoSeleccionado.titulo = this.archivosEditarForm.controls.titulo.value;
      this.archivoSeleccionado.link = this.archivosEditarForm.controls.link.value;
      this.archivoSeleccionado.descripcion = this.archivosEditarForm.controls.descripcion.value;

      this.archivoService.editar(this.archivoSeleccionado).subscribe(r => {

        if (r.code == 200) {
          Swal.fire('exito', 'se ha editado con exito el archivo', 'success');
          this.archivoService.showAll().subscribe(r => {
            this.loading = false;
            if (r.code == 200) {

              this.archivos = r.data as Array<Archivo>;
              this.archivosSource = new MatTableDataSource(this.archivos);
            }
            this.formAlert = 'none';
          });
        }
      });
    } else {
      this.loading = false;
      var cadena: string = "";
      if (!this.archivosEditarForm.controls.titulo.valid) {
        cadena += "Debe colocar el título del archivo<br>";
      }
      if (!this.archivosEditarForm.controls.link.valid) {
        cadena += "Debe colocar el link de enlace al arhcivo<br>";
      }
      Swal.fire(
        "Errores en el formulario",
        cadena,
        'error'
      );
    }
  }
  eliminarArchivo(id: number) {
    this.archivoService.eliminar(id).subscribe(r => {
      if (r.code == 200) {
        Swal.fire('exito', 'se ha eliminado con exito la accion tutorial', 'success');

        this.archivoService.showAll().subscribe(r => {
          if (r.code == 200) {
            this.archivos = r.data as Array<Archivo>;
            this.archivosSource = new MatTableDataSource(this.archivos);
          } else {
            this.archivos = new Array<Archivo>();
            this.archivosSource = new MatTableDataSource(this.archivos);
          }
        });
      }
    })
  }
  eliminarAccion(id: number) {
    this.accionesService.eliminar(id).subscribe(r => {
      if (r.code == 200) {
        Swal.fire('exito', 'se ha eliminado con exito la accion tutorial', 'success');
        this.todasAcciones = new Array<Accion>();
        this.accionService.showAll().subscribe(r => {
          if (r.code == 200) {
            this.todasAcciones = r.data as Array<Accion>;
            this.accionesSource = new MatTableDataSource(this.todasAcciones);
          } else {
            this.todasAcciones = r.data as Array<Accion>;
            this.accionesSource = new MatTableDataSource(this.todasAcciones);
          }
        });
      } else {
        Swal.fire('Error', 'No se puede eliminar puesto que ya existen sesiones con esa accion tutorial', 'error');
      }
    });
  }

  //Sortear la tabla de acciones tutoriales
   sortAcciones(sort: Sort){
    const data = this.acciones.slice();
    if (!sort.active || sort.direction === '') {
      this.acciones = data;
      return;
    }

    this.accionesSort = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'titulo': return compare(a.titulo, b.titulo, isAsc);
        default: return 0;
      }
    });
  }
  
   
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
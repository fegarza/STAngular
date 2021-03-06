import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EstudianteService } from "src/app/services/estudiante.service";
import { SesionEspecialService } from "src/app/services/sesion-especial.service";

import { Estudiante, Grupo, Usuario, Atencion, Canalizacion, EstudianteDatos, Carrera, SesionEspecial } from "src/app/models/models";
import { GrupoService } from "src/app/services/grupo.service";
import Swal from "sweetalert2";
import { AuthService } from "src/app/services/auth-service.service";
import { AtencionService } from "src/app/services/atencion.service";
import { CanalizacionService } from "src/app/services/canalizacion.service";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { CarreraService } from 'src/app/services/carrera.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DatePipe } from '@angular/common'   

@Component({
  selector: "app-estudiante",
  templateUrl: "./estudiante.component.html",
  styleUrls: ["./estudiante.component.sass"]
})
export class EstudianteComponent implements OnInit {

  //Datos del estudiante
  private sub: any;
  public miEstudiante: Estudiante = new Estudiante();
  public miUsuario: Usuario = new Usuario();
  public permisoDeModificar = false;
  public sesionesTotales: number = 0;
  fotoLink: string;
  //Configuracion del formAlert
  public formAlert: string = "none";

  //Variables globales
  public canalizaciones: Array<Canalizacion> = new Array<Canalizacion>();
  public especiales: Array<SesionEspecial> = new Array<SesionEspecial>();

  //Forms
  estudianteForm: FormGroup;
  sesionEspecialForm: FormGroup;

  constructor(
    private datePipe: DatePipe, 
    private canalizacionService: CanalizacionService,
    private atencionService: AtencionService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private estudianteService: EstudianteService,
    private sesionEspecialService: SesionEspecialService,
    private grupoService: GrupoService,
    private router: Router,
    private carreraService: CarreraService,
    private usuarioService: UsuarioService
  ) {
    this.miEstudiante = new Estudiante();
    this.miUsuario = new Usuario();
    this.miUsuario.estudiante =  new Estudiante();;
    this.miEstudiante.estudianteDatos = new EstudianteDatos();
    this.miEstudiante.carrera = new Carrera();
    this.miEstudiante.grupo = new Grupo();
  }

  ngOnInit() {
    //Traer elID
    var id: string;
    this.sub = this.route.params.subscribe(params => {
      id = params["id"].toString();
    });
    
    //Traer al estudiante dado el ID
    this.estudianteService.get(id.toString()).subscribe(r => {
      if (r.code == 200) {
        this.miEstudiante = r.data as Estudiante;
        this.sesionesTotales = this.miEstudiante.sesiones + this.miEstudiante.sesionesIniciales + this.miEstudiante.sesionesEspeciales + this.miEstudiante.sesionesIndividuales;
        this.miUsuario = this.authService.traerUsuario();
       
        if(this.miUsuario.tipo == "E"){
          
            if(this.miUsuario.estudiante.numeroDeControl == this.miEstudiante.numeroDeControl){
             
            }else{
              Swal.fire("No tienes permiso para ver este estudiante", "Para más información consulta en centro de computo","error");
              this.router.navigate(['/panel']);
            }
        }
     
      } else {
        console.log("Error");
        Swal.fire("El estudiante solicitado no existe", "Probablemente no se ha registrado o simplemente no existe", "error");
        this.router.navigate(['/panel/estudiantes']);
      }
    });


    this.estudianteForm = new FormGroup({
      correo: new FormControl(this.miEstudiante.usuario.email, [Validators.required]),
      clave: new FormControl('', [Validators.required]),
    });
    this.sesionEspecialForm = new FormGroup({
      fecha: new FormControl('', [Validators.required]),
      observaciones: new FormControl('', [Validators.required])
    });


    this.estudianteService.mostrarCanalizaciones(id).subscribe(r => {
      if (r.code == 200) {
        this.canalizaciones = r.data as Array<Canalizacion>;
      }
    });
    this.estudianteService.mostrarSesionesEspeciales(id).subscribe(r => {
      if (r.code == 200) {
        this.especiales = r.data as Array<SesionEspecial>;
        console.log( this.especiales);
      }
    });

  }
  public cargarSesionesEspeciales() {
     //Traer elID
     var id: string;
     this.sub = this.route.params.subscribe(params => {
       id = params["id"].toString();
     });
    this.estudianteService.mostrarSesionesEspeciales(id).subscribe(r => {
      if (r.code == 200) {
        this.especiales = r.data as Array<SesionEspecial>;
        console.log( this.especiales);
      }
    });
  }
  public onSubmitEditarEstudiante() {
  }
  public onSubmitSesionEspecial() {
    var sesionEspecial: SesionEspecial = new SesionEspecial();
    sesionEspecial.estudianteId = this.miEstudiante.id;
    sesionEspecial.personalId =  this.miUsuario.personal.id;;
    sesionEspecial.fecha = this.datePipe.transform(this.sesionEspecialForm.controls.fecha.value, 'MM/dd/yyyy HH:mm:ss');
    sesionEspecial.comentarios = this.sesionEspecialForm.controls.observaciones.value;
    console.log(sesionEspecial);
    this.sesionEspecialService.add(sesionEspecial).subscribe(r => {
      if (r.code == 200) {
       this.cargarSesionesEspeciales();

        Swal.fire(
          "Se ha insertado la sesion especial con exito",
          "Ahora el alumno tiene una sesion individual más.",
          "success"
        );
          this.formAlert ="none";
      } else {
        Swal.fire("Ha ocurrido un error", r.mensaje, "error");
      }
    });
  }

  public traducirOpcion(id: number) {
    switch (id) {
      case 1:
        return "Sí, antes pero ya no"
        break;
      case 2:
        return "Muy frecuente"
        break;
      case 3:
        return "Frecuente"
        break;
      case 4:
        return "A veces"
        break;
      case 5:
        return "Nunca"
        break;
      default:
        return "Sin asignar"
        break;
    }
  }

  public async asignarSesiones() {
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
        .asignarSesiones(this.miEstudiante.numeroDeControl, sesiones)
        .subscribe(r => {
          if (r.code == 200) {
            Swal.fire(
              "Se ha logrado cambiar las sesiones iniciales",
              "Ahora el alumno: " +
              this.miEstudiante.usuario.nombreCompleto +
              " tiene " +
              sesiones +
              " sesiones iniciales",
              "success"
            );
            this.miEstudiante.sesionesIniciales = parseInt(sesiones);
            this.sesionesTotales = this.miEstudiante.sesiones + this.miEstudiante.sesionesIniciales;
          } else {
            Swal.fire("Ha ocurrido un error", r.mensaje, "error");
          }
        });
    }
  }

  public async asignarClave() {
    const { value: clave } = await Swal.fire({
      title: "Introduce tu nueva contraseña",
      input: "text",
      inputValue: "",
      showCancelButton: true,
      inputValidator: value => {
        if (!value) {
          return "el campo esta vacio!";
        }
      }
    });
    if (clave) {
      this.miEstudiante.usuario.clave = clave;
      this.usuarioService
        .editarClaveEstudiante(this.miEstudiante)
        .subscribe(r => {
          if (r.code == 200) {
            Swal.fire(
              "Se ha logrado cambiar la contraseña",
              "Ahora podrás acceder con tu nueva contraseña",
              "success"
            );
          } else {
            Swal.fire("Ha ocurrido un error", r.mensaje, "error");
          }
        });
    }
  }

  public canalizar() {
    var atenciones: Array<Atencion> = new Array<Atencion>();
    var opciones: Map<string, string> = new Map();
    this.atencionService.showAll().subscribe(
      r => {
        atenciones = r.data as Array<Atencion>;
        atenciones.map(g => {
          opciones.set(g.id.toString(), g.titulo);
        });

      },
      error => {
        console.log("ERROR");
      },
      async () => {
        var htmlstr: string =
          '<select type="select" class="swal2-select" id="selectId"> ';

        atenciones.forEach(r => {
          htmlstr += "<option value='" + r.id + "'>" + r.titulo + "</option>";
        });
        htmlstr += "</select>";
        htmlstr +=
          '<textarea  id="textarea" aria-label="Describe la canalizacion" class="swal2-textarea" style="display: flex;" placeholder="Describe la canalizacion"></textarea>';

        const { value: formValues } = await Swal.fire({
          title: "Area de atención",
          html: htmlstr,
          focusConfirm: false,
          preConfirm: () => {
            return [
              document.getElementById("selectId"),
              document.getElementById("textarea")
            ];
          }
        });

        if (formValues) {
          console.log(formValues);
          var canalizacion: Canalizacion = new Canalizacion();
          canalizacion.personalId = this.miUsuario.personal.id;
          canalizacion.atencionId = parseInt(formValues[0].value);
          canalizacion.estudianteId = this.miEstudiante.id;
          canalizacion.descripcion = formValues[1].value;
          console.log(canalizacion);
          this.canalizacionService.add(canalizacion).subscribe(r => {
            if (r.code == 200) {
              this.miEstudiante.canalizaciones += 1;

              Swal.fire(
                "Se ha creado una canalizacion",
                "Ahora el alumno: " +
                this.miEstudiante.usuario.nombreCompleto +
                " tiene " +
                this.miEstudiante.canalizaciones +
                " canalizaciones",
                "success"
              );
              this.estudianteService.mostrarCanalizaciones(this.miEstudiante.numeroDeControl).subscribe(r => {
                if (r.code == 200) {
                  this.canalizaciones = r.data as Array<Canalizacion>;
                }
              })

            } else {
              Swal.fire("Ha ocurrido un error", r.mensaje, "error");
            }
          });
        }
      }
    );
  }

  public asignarGrupo() {
    var grupos: Array<Grupo> = new Array<Grupo>();
    var opciones: Map<string, string> = new Map();
    this.grupoService.getAll().subscribe(
      r => {
        grupos = r.data as Array<Grupo>;
        if (grupos != null) {
          opciones.set("0", "Sin asignar");
          grupos.map(g => {
            opciones.set(g.id.toString(), g.personal.usuario.nombreCompleto);
          });
        }
        else {
          Swal.fire("No se han encontrado grupos", r.mensaje, "error");
        }
      },
      error => {
        console.log("ERROR");
      },
      async () => {
        if (grupos != null) {
          const { value: gId } = await Swal.fire({
            title: "Selecciona el grupo a asignar",
            input: "select",
            inputOptions: opciones,
            inputPlaceholder: "Selecciona el tutor",
            showCancelButton: true
          });
          console.log("se ha seleccionado el grupo id: " + gId);
          if (gId != undefined && gId != null) {
            this.estudianteService
              .asignarGrupo(this.miEstudiante.numeroDeControl, gId)
              .subscribe(r => {
                if (r.code == 200) {
                  this.miEstudiante.grupo.personal.usuario.nombreCompleto = opciones.get(gId);
                  Swal.fire(
                    "Se ha logrado cambiar el grupo",
                    "Ahora el alumno: " +
                    this.miEstudiante.usuario.nombreCompleto +
                    " pertenece al grupo de " +
                    opciones.get(gId),
                    "success"
                  );
                } else {
                  Swal.fire("Ha ocurrido un error", r.mensaje, "error");
                }
              });
          }
        }
      }
    );
  }

  public asignarCarrera() {
    var carreras: Array<Carrera> = new Array<Carrera>();
    var opciones: Map<string, string> = new Map();
    this.carreraService.getAll().subscribe(
      r => {
        carreras = r.data as Array<Carrera>;
        if (carreras != null) {
          carreras.map(g => {
            opciones.set(g.id.toString(), g.titulo);
          });
        }
        else {
          Swal.fire("No se han encontrado carreras", r.mensaje, "error");
        }
      },
      error => {
        console.log("ERROR");
      },
      async () => {
        if (carreras != null) {
          const { value: gId } = await Swal.fire({
            title: "Selecciona la carrera a asignar",
            input: "select",
            inputOptions: opciones,
            inputPlaceholder: "Selecciona la carrera",
            showCancelButton: true
          });
          console.log("se ha seleccionado la carrera con id: " + gId);
          if (gId != undefined && gId != null) {
            this.estudianteService
              .asignarCarrera(this.miEstudiante.numeroDeControl, gId)
              .subscribe(r => {
                if (r.code == 200) {
                  Swal.fire(
                    "Se ha logrado cambiar la carrera",
                    "Ahora el alumno: " +
                    this.miEstudiante.usuario.nombreCompleto +
                    " pertenece a la carrera de " +
                    opciones.get(gId),
                    "success"
                  );
                  this.miEstudiante.carrera.titulo = opciones.get(gId);
                } else {
                  Swal.fire("Ha ocurrido un error", r.mensaje, "error");
                }
              });
          }
        }
      }
    );
  }

  public editar() {
  }
  public crearSesionIndividual(){
      this.formAlert = "especial";
  }
  public eliminarSesionEspecial(id: number){

    this.sesionEspecialService.eliminar(id).subscribe(r => {
      if(r.code == 200){
        Swal.fire(
          "Exito",
          "Se ha borrado con exito la sesión individual",
          "success"
        );
        this.cargarSesionesEspeciales();
      }else{
        Swal.fire(
          "Error",
          "No se ha logrado borrar la sesion individual",
          "error"
        );
      }
    });
  }
}

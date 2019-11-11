import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EstudianteService } from "src/app/services/estudiante.service";
import { Estudiante,Grupo,Usuario,Atencion,Canalizacion} from "src/app/models/models";
import { GrupoService } from "src/app/services/grupo.service";
import Swal from "sweetalert2";
import { AuthService } from "src/app/services/auth-service.service";
import { AtencionService } from "src/app/services/atencion.service";
import { CanalizacionService } from "src/app/services/canalizacion.service";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from '@angular/router';
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
  
  //Configuracion del formAlert
  public formAlert: string = "none";

  //Variables globales
  public canalizaciones: Array<Canalizacion> = new Array<Canalizacion>();

  //Forms
  estudianteForm: FormGroup;

  constructor(
    private canalizacionService: CanalizacionService,
    private atencionService: AtencionService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private estudianteService: EstudianteService,
    private grupoService: GrupoService,
    private router: Router
  ) {}

  ngOnInit() {
    //Traer elID
    var id: string;
    this.sub = this.route.params.subscribe(params => {
      id = params["id"].toString();
    });

    //Traer al estudiante dado el ID
    this.estudianteService.get(id.toString()).subscribe(r => {
      console.log("-->Obteniendo alumno");
      if(r.code == 200){
        this.miEstudiante = r.data as Estudiante;
        this.sesionesTotales = this.miEstudiante.sesiones + this.miEstudiante.sesionesIniciales;
       
       
        console.log(this.miEstudiante)
      }else{
        console.log("Error");
        Swal.fire("El estudiante solicitado no existe", "Probablemente no se ha registrado o simplemente no existe", "error");
        this.router.navigate(['/panel/estudiantes']);
      }
     

    });
    this.miUsuario = this.authService.traerUsuario();
    console.log("-->Obteniendo usuario");
    console.log(this.miUsuario);

    this.estudianteForm = new  FormGroup({
      correo: new FormControl(this.miEstudiante.usuario.email, [Validators.required]),
      clave: new FormControl('', [Validators.required]),
    });
    this.estudianteService.mostrarCanalizaciones(id).subscribe(r => {
      if(r.code == 200){
        this.canalizaciones = r.data as Array<Canalizacion>;
      }
    });
     
  }
 

  public onSubmitEditarEstudiante(){

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
              "Se ha logrado cambiar el grupo",
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
              this.estudianteService.mostrarCanalizaciones(this.miEstudiante.numeroDeControl).subscribe(r =>{
                if(r.code == 200){
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

  public editar(){

  }
}

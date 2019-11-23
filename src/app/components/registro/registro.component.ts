import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth-service.service";
import Swal from "sweetalert2";
import { Usuario, Estudiante } from "../../models/models";
import { EstudianteService } from "src/app/services/estudiante.service";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.sass"]
})
export class RegistroComponent implements OnInit {
  public miEstudiante: Estudiante;
  public registroForm: FormGroup;
  public nuevoEstudiante: Estudiante = new Estudiante();
  public disponible: boolean = true;
  public loading: boolean = false;
  constructor(
    private estudianteService: EstudianteService,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = new FormGroup({
      numeroControl: new FormControl(),
      curp: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      clave: new FormControl('', [Validators.required, Validators.minLength(6)]),
      clave2: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.disponible) {
      this.loading = true;
      if (this.registroForm.valid) {
        this.disponible = false;

        this.nuevoEstudiante.numeroDeControl = this.registroForm.controls.numeroControl.value;
        this.nuevoEstudiante.usuario = new Usuario();
        this.nuevoEstudiante.usuario.email = this.registroForm.controls.email.value;
        this.nuevoEstudiante.curp = this.registroForm.controls.curp.value;
        this.nuevoEstudiante.usuario.clave = this.registroForm.controls.clave.value;
        this.estudianteService.add(this.nuevoEstudiante).subscribe(r => {
          this.disponible = true;
          if (r.code == 200) {
            this.miEstudiante = r.data as Estudiante;
            this.authService
              .entrar(this.nuevoEstudiante.usuario.email, this.nuevoEstudiante.usuario.clave)
              .subscribe(r => {
                if (r.code == 200) {
                  this.loading = false;
                  var usuario: Usuario = r.data as Usuario;
                  localStorage.setItem("usuario", JSON.stringify(usuario));
                  Swal.fire("Exito", "¡Se ha registrado con exito!", "success");
                  this.router.navigate(["/panel"]);
                } else {
                  this.loading = false;
                  Swal.fire(
                    r.mensaje.toLocaleUpperCase(),
                    "error al iniciar sesion",
                    "error"
                  );
                }
              });
          } else {
            this.loading = false;
            var ContenidoErrores: string = "";
            var errores: Array<string> = r.data as Array<string>;
            errores.forEach(element => {
              ContenidoErrores += element + "<br>";
            });
            Swal.fire(r.mensaje.toLocaleUpperCase(), ContenidoErrores, "error");
          }
        });
      } else {
        this.loading = false;
        var cadena: string = "";
        if (this.registroForm.controls.clave.value != this.registroForm.controls.clave2.value) {
          cadena += "Las contraseñas introducidas no concuerdan<br>";
        }
        if (!this.registroForm.controls.clave.valid) {
          cadena += "No se ha introducido la contraseña<br>";
        }
        if (!this.registroForm.controls.email.valid) {
          cadena += "El correo electrónico introducido no es válido<br>";
        }
        if (!this.registroForm.controls.curp.valid) {
          cadena += "No se ha introducido el CURP<br>";
        }
        Swal.fire("Error con el formulario", cadena, "error");
      }




    }
  }
}

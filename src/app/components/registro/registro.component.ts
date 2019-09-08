import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
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

  constructor(
    private estudianteService: EstudianteService,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = new FormGroup({
      numeroControl: new FormControl(),
      curp: new FormControl(),
      email: new FormControl(),
      clave: new FormControl()
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.disponible) {
      this.disponible = false;
      this.nuevoEstudiante.numeroDeControl = this.registroForm.controls.numeroControl.value;
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
                var usuario: Usuario = r.data as Usuario;
                localStorage.setItem("usuario", JSON.stringify(usuario));
                Swal.fire("Exito", "¡Se ha registrado con exito!", "success");
                localStorage.setItem("token", usuario.token);
                localStorage.setItem("id", this.authService.mostrarIdentificador(usuario.token));

                this.router.navigate(["/panel"]);
              } else {
                Swal.fire(
                  r.mensaje.toLocaleUpperCase(),
                  "error al iniciar sesion",
                  "error"
                );
              }
            });
        } else {
          var ContenidoErrores: string = "";
          var errores: Array<string> = r.data as Array<string>;
          errores.forEach(element => {
            ContenidoErrores += element + "<br>";
          });

          Swal.fire(r.mensaje.toLocaleUpperCase(), ContenidoErrores, "error");
        }
      });
    }
  }
}

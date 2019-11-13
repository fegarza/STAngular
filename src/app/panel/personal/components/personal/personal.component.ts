import { Component, OnInit } from '@angular/core';
import { Personal, Usuario, Cargo } from 'src/app/models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonalService } from 'src/app/services/personal.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.sass']
})
export class PersonalComponent implements OnInit {

  public id: number;
  private sub: any;
  public miPersonal: Personal = new Personal();
  public miUsuario: Usuario = new Usuario();
  public rango: string;
  public permisoDeModificar = false;
  public cargos: Array<Cargo> = [
    { tipo: "C", titulo: "Coordinador" },
    { tipo: "D", titulo: "Jefe de departamento" },
    { tipo: "J", titulo: "Jefe de tutorias" },
    { tipo: "T", titulo: "Tutor" }
  ];

  public formAlert = "none";

  //Forms
  cargoFormGroup: FormGroup;
  claveFormGroup: FormGroup;
  correoFormGroup: FormGroup;



  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private personalService: PersonalService,  private router: Router, private authService: AuthService) 
  {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];  
    });
    this.miUsuario = this.authService.traerUsuario();
    console.log("-->Trayendo usuario");
    console.log(this.miUsuario);

    if(this.miUsuario.personal.cargo == "T"){
      if(this.miUsuario.personal.id != parseInt(this.id.toString())){
        this.router.navigate(['/panel']);
      }else{
        this.personalService.get(this.id.toString()).subscribe(
          r => {
            if(r.code == 202){
              this.miPersonal = r.data as Personal;
              console.log("-->Trayendo personal");
              console.log(this.miPersonal);
            }else{
              this.router.navigate(['/404']);
            }
           
          });
      }
    }else{
      this.personalService.get(this.id.toString()).subscribe(
        r => {
          if(r.code == 202){
            this.miPersonal = r.data as Personal;
          }else{
            this.router.navigate(['/404']);
          }
         
        });
    }
    if(this.miUsuario.tipo == 'P'){
      if(
         this.miUsuario.personal.cargo == 'A' || 
         this.miUsuario.personal.cargo == 'J' || 
         this.miUsuario.personal.cargo == 'D' ){
        this.permisoDeModificar = true;
      }
    }
   }

  ngOnInit() {
    this.cargoFormGroup = new FormGroup({
      cargo: new FormControl('', [Validators.required]),
    });
    this.claveFormGroup = new FormGroup({
      clave: new FormControl('', [Validators.required, Validators.min(6)]),
    });
    this.correoFormGroup = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  cambiarClave(){
    this.formAlert = "clave";
  }
  onSubmitClave(){
    console.log("Cambiando clave...");
    if(this.claveFormGroup.controls.clave.valid){
      
      this.miPersonal.usuario.clave = this.claveFormGroup.controls.clave.value;
      this.usuarioService.editar(this.miPersonal.usuario).subscribe(r=> {
        if(r.code == 200){
          Swal.fire(
            'Se ha cambiado la clave correctamente',
            r.mensaje,
            'success'
          );
        }else{
          Swal.fire(
            'ha ocurrido un error',
            r.mensaje,
            'error'
          );
        }
      })
    }else{
      Swal.fire(
        'ha ocurrido un error',
        'La clave es muy corta',
        'error'
      );
    }
  }
  cambiarCargo()
  {
    this.formAlert = "cargo"; 
  }
  onSubmitCargo(){
    if(this.cargoFormGroup.controls.cargo.valid){
      this.personalService.asignarCargo(this.miPersonal.id, this.cargoFormGroup.controls.cargo.value).subscribe(r=> {
        if(r.code == 200){
          Swal.fire(
            'Se ha cambiado la cargo correctamente',
            r.mensaje,
            'success'
          );
        }else{
          Swal.fire(
            'ha ocurrido un error',
            r.mensaje,
            'error'
          );
        }
      })
    }
  }
  cambiarCorreo(){
    this.formAlert = "correo"; 
  }
  onSubmitCorreo(){
    
    if(this.correoFormGroup.controls.correo.valid){
      this.miPersonal.usuario.email = this.correoFormGroup.controls.correo.value;
      this.usuarioService.editar(this.miPersonal.usuario).subscribe(r=> {
        if(r.code == 200){
          Swal.fire(
            'Se ha cambiado el correo correctamente',
            r.mensaje,
            'success'
          );
        }else{
          Swal.fire(
            'ha ocurrido un error',
            r.mensaje,
            'error'
          );
        }
      })
    }else{
      Swal.fire(
        'Error',
        'El correo dado no es valido',
        'error'
      );
    }
  }
}

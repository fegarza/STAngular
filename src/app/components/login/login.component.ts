import { Component,  EventEmitter, Output } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth-service.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/models';
 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})


export class LoginComponent  {

  public loading: boolean = false;
  loginForm: FormGroup;

  @Output() public CloseEvent = new EventEmitter();

  constructor(private authService: AuthService, private router: Router) { 
    this.loginForm = new FormGroup({
      user: new FormControl(),
      password: new FormControl()
    });
  }

  Close(){
    this.CloseEvent.emit(false);
  }

  onSubmit(){
    this.loading = true;
    var miUsuario : Usuario;
    var miCode: number;
    var mensaje: string = "";
    var user = this.loginForm.controls.user.value;
    var pw = this.loginForm.controls.password.value;
    
    
    this.authService.entrar(user, pw).subscribe(
          r => {
            miCode = r.code;
            mensaje = r.mensaje;
            if (miCode == 200){
              this.loading = false;
              miUsuario = r.data as Usuario;
              if(miUsuario.estudiante == null){
                miUsuario.tipo = "P"
              }else{
                miUsuario.tipo = "E"
              }
              localStorage.setItem("usuario" , JSON.stringify(miUsuario)); 
              this.router.navigate(['/panel']);
            }else{
              this.loading = false;
               Swal.fire(
                'Acerca del error:',
                mensaje,
                 "error"
              )
            }
          },
    );
    

    
  }
}

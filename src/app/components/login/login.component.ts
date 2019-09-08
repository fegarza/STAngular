import { Component,  EventEmitter, Output } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth-service.service';
import Swal from 'sweetalert2';
import { Usuario, Estudiante, Personal } from '../../models/models';
 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})


export class LoginComponent  {

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
              miUsuario = r.data as Usuario;
              localStorage.setItem("token" , miUsuario.token);  
              localStorage.setItem("usuario" , JSON.stringify(miUsuario)); 
              localStorage.setItem("id", this.authService.mostrarIdentificador(miUsuario.token));
             this.router.navigate(['/panel']);
            }else{
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

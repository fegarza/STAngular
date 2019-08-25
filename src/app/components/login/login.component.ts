import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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


export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  @Output() public CloseEvent = new EventEmitter();

  constructor(private authService: AuthService, private router: Router) { 
     
    this.loginForm = this.CreateFormGroup();
  }

  Close(){
    this.CloseEvent.emit(false);
  }
  ngOnInit() {

  }

  CreateFormGroup(){
    return new FormGroup({
      user: new FormControl(),
      password: new FormControl()
    });
  }

  onSubmit(){

    var miUsuario: Usuario;
    var miCode: number;
    var mensaje: string = "";
    var user = this.loginForm.controls.user.value;
    var pw = this.loginForm.controls.password.value;
    
    
    this.authService.entrar(user, pw)
        .subscribe(
          r => {
            miCode = r.code;
            mensaje = r.mensaje;
            if (miCode == 200){
              miUsuario = r.data as Usuario;
              localStorage.setItem("token" , miUsuario.token);  
              localStorage.setItem("user", JSON.stringify(miUsuario));
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

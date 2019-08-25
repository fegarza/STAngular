import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Respuesta, IRespuesta } from '../models/respuesta';
import { Usuario } from '../models/models';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})



export class AuthService {

  
  constructor(private http: HttpClient,private constants: ConstantsService) {

  }


  traerToken() {
    return localStorage.getItem("token");
  }

  traerUsuario(){
    return JSON.parse(localStorage.getItem("user")) as Usuario;
  }

  comprobarToken(token: string) {
    const params2 = new HttpParams()
      .set('token', token);
    //const options = { params: params , headers :headers  };
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Usuario/type", { params: params2 });
  }

  entrar(user: string, pw: string) {
    const params = new HttpParams()
      .set('correo', user)
      .set('clave', pw);
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Usuario/Login", { params });
  }


}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';
import { Usuario, Estudiante, Personal } from '../models/models';
import { ConstantsService } from './constants.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})



export class AuthService {
  
  constructor(private http: HttpClient,private constants: ConstantsService) {

  }


  //TOKENS
  traerToken() {
    var token = localStorage.getItem("token");
    return token;
  }

  mostrarInformacionToken(token: string){
    console.log("-> Mostrando datos del tokenn");
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const expirationDate = helper.getTokenExpirationDate(token);
    const isExpired = helper.isTokenExpired(token);
    console.log("Token: " );
    console.log(decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
    console.log("Fecha de expiracion: "+ expirationDate );
    console.log("Esta expirado? : "+ isExpired );
  }

  mostrarTipo(): string{
    var token = localStorage.getItem("token");
    if(token != null){
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      return decodedToken["rol"];
    }else{
      return null;
    }
  }
  isEstudiante(): boolean{
    if(this.mostrarTipo() == "E"){
      return true;
    }else{
      return false;
    }
  }
  isAdmin(): boolean{
    if(this.mostrarTipo() == "A"){
      return true;
    }else{
      return false;
    }
  }
  isTutor(): boolean{
    if(this.mostrarTipo() == "T"){
      return true;
    }else{
      return false;
    }
  }
  isJefeTutor(): boolean{
    if(this.mostrarTipo() == "J"){
      return true;
    }else{
      return false;
    }
  }
  isJefeDepartamento(): boolean{
    if(this.mostrarTipo() == "D"){
      return true;
    }else{
      return false;
    }
  }

  
  mostrarIdentificador(token: string): string{
    if(localStorage.getItem("token") != null){
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      return decodedToken["identificador"];
    }else{
      return null;
    }
  }

  comprobarToken(token: string) {
    const params2 = new HttpParams()
      .set('token', token);
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Usuarios/type", { params: params2 });
  }
  
  traerUsuario() : Usuario{
    if(localStorage.getItem("usuario") != null){
      return JSON.parse(localStorage.getItem("usuario")) as Usuario;
    }else{
      return null;
    }
  }
 
  //LOGIN
  entrar(user: string, pw: string) {
    const params = new HttpParams()
                      .set('email', user)
                      .set('clave', pw);
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Usuarios/Login", { params });
  }

  //LOGOUT
  salir(){
    if(localStorage.getItem("usuario") != null){
      localStorage.removeItem("usuario");
      
    }
    if(localStorage.getItem("token") != null){
      localStorage.removeItem("token");
    }
    if(localStorage.getItem("id") != null){
      localStorage.removeItem("id");
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';
import { Usuario } from '../models/models';
import { ConstantsService } from './constants.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})



export class AuthService {
  
  constructor(private http: HttpClient,private constants: ConstantsService ) {

  }
  isAuthorized(allowedRoles: string[]): boolean {
    // check if the list of allowed roles is empty, if empty, authorize the user to access the page
    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }

    
    // get token from local storage or state management
   const token = this.traerUsuario().token;
  
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
  
  // check if it was decoded successfully, if not the token is not valid, deny access
    if (!decodedToken) {
      console.log('Invalid token');
      return false;
    }
  // check if the user roles is in the list of allowed roles, return true if allowed and false if not allowed
    return allowedRoles.includes(decodedToken['rol']);
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
  }
}

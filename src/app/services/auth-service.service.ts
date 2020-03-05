import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';
import { Usuario } from '../models/models';
import { ConstantsService } from './constants.service';
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable({
  providedIn: 'root'
})



export class AuthService {

  constructor(private http: HttpClient, private constants: ConstantsService) {
  }

  isAuthorized(allowedRoles: string[]): boolean {
    
    //Verifica si la lista de los roles autorizados esta vacia, si se encuentra vacia autoriza al usuario a acceder a la pag.
    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }
    // obtener el token del localstorage
    const token = this.traerUsuario().token;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);

    //verificar si se decodifico correctamente, si no lo saca
    if (!decodedToken) {
      console.log('Invalid token');
      return false;
    }
    // Checar si existe el rol
    return allowedRoles.includes(decodedToken['rol']);
  }

  mostrarInformacionToken(token: string) {
    
    console.log("-> Mostrando datos del tokenn");
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const expirationDate = helper.getTokenExpirationDate(token);
    const isExpired = helper.isTokenExpired(token);
    console.log("Token: ");
    console.log(decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
    console.log("Fecha de expiracion: " + expirationDate);
    console.log("Esta expirado? : " + isExpired);
    
  }

  comprobarToken(token: string) {
    const params2 = new HttpParams()
      .set('token', token);
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Usuarios/type", {
      params: params2
    });
  }

  traerUsuario(): Usuario {
    if (localStorage.getItem("usuario") != null) {
      return JSON.parse(localStorage.getItem("usuario")) as Usuario;
    } else {
      return null;
    }
  }
  
  entrar(user: string, pw: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    var miUser = new Usuario();
    miUser.email = user;
    miUser.clave = pw;
    return this.http.post < IRespuesta > (this.constants.apiUrl + "api/Usuarios/Login", JSON.stringify(miUser), {
      headers: headers
    });
  }
   
  salir() {
    if (localStorage.getItem("usuario") != null) {
      localStorage.removeItem("usuario");

    }
  }
  
}

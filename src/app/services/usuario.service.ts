import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';
import { ConstantsService } from './constants.service';
import { Usuario, Estudiante } from '../models/models';
 @Injectable({
   providedIn: 'root'
 })
 export class UsuarioService {

   constructor(private constants: ConstantsService, private http: HttpClient) {

   }

   editar(usuario: Usuario) {
     const headers = new HttpHeaders()
       .set('Content-Type', 'application/json')
       .set('Accept', 'application/json');
     return this.http.put < IRespuesta > (this.constants.apiUrl + "api/Usuarios/", JSON.stringify(usuario), {
       headers: headers
     });
   }
   
   editarClaveEstudiante(estudiante: Estudiante) {
     const headers = new HttpHeaders()
       .set('Content-Type', 'application/json')
       .set('Accept', 'application/json');
     var estudiante2: Estudiante = new Estudiante();
     estudiante2.numeroDeControl = estudiante.numeroDeControl;
     estudiante2.usuario.clave = estudiante.usuario.clave;
     estudiante2.usuario.id = estudiante.usuario.id;

     var miUsr: Usuario = JSON.parse(localStorage.getItem("usuario")) as Usuario;
     return this.http.put < IRespuesta > (this.constants.apiUrl + "api/Estudiantes/?token=" + miUsr.token, JSON.stringify(estudiante2), {
       headers: headers
     });

   }
   /*
     asignarCorreo(id: number, correo: string){
       var usuario : Usuario = new Usuario();
           
       usuario.id = id;
       usuario.email = correo;

      
       const headers = new HttpHeaders()
       .set('Content-Type', 'application/json')
       .set('Accept', 'application/json');    
        return this.http.put<IRespuesta>(this.constants.apiUrl + "api/Usuarios/",  JSON.stringify(usuario),   { headers: headers } );
      }
      asignarClave(id: number, clave: string){
       var usuario : Usuario = new Usuario();
           
       usuario.id = id;
       usuario.clave = clave;

      
       const headers = new HttpHeaders()
       .set('Content-Type', 'application/json')
       .set('Accept', 'application/json');    
        return this.http.put<IRespuesta>(this.constants.apiUrl + "api/Usuarios/",  JSON.stringify(usuario),   { headers: headers } );
      }
   */
 }

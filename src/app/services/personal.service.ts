import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';
import { ConstantsService } from './constants.service';
import { Personal } from '../models/models';
 
@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  constructor(private constants: ConstantsService,private http: HttpClient) {

  }
  get(id: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Personales/"+id );
   }
   getPage(cant: number, pag: number ){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Personales?cant="+cant+"&pag="+pag );
   }
   showAll(){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Personales/" );
   }
   showAllTec(){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Personales/Tec" );
   }
  showGrupo(id: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Personales/"+id+"/grupo" );
  }
    

   add(personal: Personal){
     const headers = new HttpHeaders()
     .set('Content-Type', 'application/json')
     .set('Accept', 'application/json');
    return this.http.post<IRespuesta>(this.constants.apiUrl + "api/Personales/",  JSON.stringify(personal),   { headers: headers } );
   }

   asignarCargo(id: number, cargo: string){
    var personal : Personal = new Personal();
    personal.cargo = cargo;
    personal.id = id;

   
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');    
     return this.http.put<IRespuesta>(this.constants.apiUrl + "api/Personales/",  JSON.stringify(personal),   { headers: headers } );
   }
   asignarDepartamento(id: number, departamento: number){
    var personal : Personal = new Personal();
    personal.departamentoId = departamento ;
    personal.id = id;

   
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');    
     return this.http.put<IRespuesta>(this.constants.apiUrl + "api/Personales/",  JSON.stringify(personal),   { headers: headers } );
   }
   asignarTitulo(id: number, tituloId: number){
    var personal : Personal = new Personal();
    personal.tituloId = tituloId ;
    personal.id = id;

   
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');    
     return this.http.put<IRespuesta>(this.constants.apiUrl + "api/Personales/",  JSON.stringify(personal),   { headers: headers } );
   }
   count() {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Personales/count" );
  }

}

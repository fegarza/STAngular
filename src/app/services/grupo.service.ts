import { Injectable } from '@angular/core';
import { IRespuesta } from '../models/respuesta';
import { ConstantsService } from './constants.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Estudiante } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor(private constants: ConstantsService, private http: HttpClient) {

  }
  getAll(){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Grupos/" );
  }
  get(id: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Grupos/"+id );
  }
  showSesiones(id: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Grupos/"+id+"/Sesiones" );
  }
  showAsistencias(id: string, sesionId: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Grupos/"+id+"/Sesiones/"+sesionId );

  }
  showCanalizaciones(id: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Grupos/"+id +"/Canalizaciones");
  }
  AgregarAsistencias(id: string, sesionId: string, estudiantes :Array<Estudiante>){
    const headers = new HttpHeaders()
     .set('Content-Type', 'application/json')
     .set('Accept', 'application/json');
    return this.http.post<IRespuesta>(this.constants.apiUrl + "api/Grupos/"+id+"/Sesiones/"+sesionId,  JSON.stringify(estudiantes),   { headers: headers } );
  }
}

import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';
import { Archivo } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

   
  constructor(private constants: ConstantsService,private http: HttpClient) {

  }

  showAll(){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/archivos/" );
  }
  add(archivo: Archivo){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
   return this.http.post<IRespuesta>(this.constants.apiUrl + "api/Archivos/",  JSON.stringify(archivo),   { headers: headers } );
  }
  eliminar(id: number){
    return this.http.delete<IRespuesta>(this.constants.apiUrl + "api/archivos/"+id );
  }
  editar(archivo: Archivo){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
   return this.http.put<IRespuesta>(this.constants.apiUrl + "api/Archivos/",  JSON.stringify(archivo),   { headers: headers } );
  }
  count() {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Archivos/count" );
  }
}

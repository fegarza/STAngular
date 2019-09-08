import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { Sesion } from '../models/models';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  constructor(private constants: ConstantsService,private http: HttpClient) {

  }
  add(sesion: Sesion){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
   return this.http.post<IRespuesta>(this.constants.apiUrl + "api/Sesiones/",  JSON.stringify(sesion),   { headers: headers } );
  }
  showAll(){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Sesiones/");
  }
}

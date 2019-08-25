import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';
import { Estudiante } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  constructor(private constants: ConstantsService,private http: HttpClient) {

  }

   get(numeroControl: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Estudiante/"+numeroControl );
   }

   add(miEstudiante: Estudiante){
     
      
     const headers = new HttpHeaders()
     .set('Content-Type', 'application/json')
     .set('Accept', 'application/json');
    return this.http.post<IRespuesta>(this.constants.apiUrl + "api/Estudiante/",  JSON.stringify(miEstudiante),   { headers: headers } );
   }

}

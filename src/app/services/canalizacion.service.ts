import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';
import { Canalizacion } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CanalizacionService {

  constructor(private constants: ConstantsService,private http: HttpClient) {

  }


  add(canalizacion: Canalizacion){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
   return this.http.post<IRespuesta>(this.constants.apiUrl + "api/Canalizaciones/",  JSON.stringify(canalizacion),   { headers: headers } );
  }

}

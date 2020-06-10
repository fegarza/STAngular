import { Injectable } from '@angular/core';
import { SesionEspecial } from '../models/models';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { IRespuesta } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class SesionEspecialService {
  
  constructor(private constants: ConstantsService, private http: HttpClient) {
  }
  
  add(sesionEspecial: SesionEspecial) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post < IRespuesta > (this.constants.apiUrl + "api/SesionesEspeciales/", JSON.stringify(sesionEspecial), {
      headers: headers
    });
  }
  eliminar(id: number) {
    return this.http.delete < IRespuesta > (this.constants.apiUrl + "api/SesionesEspeciales/" + id);
  }

}

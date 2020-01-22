import { Injectable } from '@angular/core';
import { IRespuesta } from '../models/respuesta';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  constructor(private constants: ConstantsService, private http: HttpClient) {

  }
  getAll(){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Carreras/" );
  }
}

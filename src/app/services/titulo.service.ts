import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { IRespuesta } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class TituloService {

  constructor(private constants: ConstantsService,private http: HttpClient) {

  }
  showAll(){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Titulos/" );
   }
}

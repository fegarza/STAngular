import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

   
  constructor(private constants: ConstantsService,private http: HttpClient) {

  }

  showAll(){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/archivos/" );
  }
}

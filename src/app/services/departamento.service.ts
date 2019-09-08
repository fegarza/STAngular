import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { IRespuesta } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  constructor(private constants: ConstantsService, private http: HttpClient) {

  }

  showAll(){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/" );
  }
  get(id: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/"+id );
  }


}

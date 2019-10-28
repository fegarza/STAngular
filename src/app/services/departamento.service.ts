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
  getPage(cant: number, pag: number ){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos?cant="+cant+"&pag="+pag );
   }
   getPagePersonales(id :string ,cant: number, pag: number ){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/"+id+"/Personales?cant="+cant+"&pag="+pag );
   }
  get(id: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/"+id );
  }
  showAcciones(id: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/"+id+"/AccionesTutoriales");
  }
  showPersonales(id: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/"+id+"/Personales");
  }
  showCanalizaciones(id: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/"+id+"/Canalizaciones");
  }



}

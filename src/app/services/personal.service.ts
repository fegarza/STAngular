import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';
import { ConstantsService } from './constants.service';
import { Personal } from '../models/models';
 
@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  constructor(private constants: ConstantsService,private http: HttpClient) {

  }
  get(id: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Personales/"+id );
   }
   getPage(cant: number, pag: number ){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Personales?cant="+cant+"&pag="+pag );
   }
   showAll(){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Personales/" );
   }
   showAllTec(){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Personales/Tec" );
   }
  showGrupo(id: string){
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Personales/"+id+"/grupo" );

  }
    

   add(personal: Personal){
     const headers = new HttpHeaders()
     .set('Content-Type', 'application/json')
     .set('Accept', 'application/json');
    return this.http.post<IRespuesta>(this.constants.apiUrl + "api/Personales/",  JSON.stringify(personal),   { headers: headers } );
   }
}

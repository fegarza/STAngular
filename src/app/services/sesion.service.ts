import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { Sesion } from '../models/models';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  constructor(private constants: ConstantsService, private http: HttpClient) {
  }

  showAll() {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Sesiones/");
  }
  add(sesion: Sesion) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    console.log(sesion);
    console.log(JSON.stringify(sesion));
    return this.http.post<IRespuesta>(this.constants.apiUrl + "api/Sesiones/", JSON.stringify(sesion), { headers: headers });
  }
  put(sesion: Sesion) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<IRespuesta>(this.constants.apiUrl + "api/Sesiones/", JSON.stringify(sesion), { headers: headers });
  }
  delete(id: number) {
    return this.http.delete<IRespuesta>(this.constants.apiUrl + "api/Sesiones/" + id.toString());
  }
  
}

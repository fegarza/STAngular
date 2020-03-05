import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { Accion } from '../models/models';
import { IRespuesta } from '../models/respuesta';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AccionService {

  constructor(private constants: ConstantsService, private http: HttpClient) {}
     
  showAll() {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Acciones/");
  }

  getPage(cant: number, pag: number) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Acciones/?cant=" + cant + "&pag=" + pag);
  }

  count() {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Acciones/count");
  }

  add(accionTutorial: Accion) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post < IRespuesta > (this.constants.apiUrl + "api/Acciones/", JSON.stringify(accionTutorial), {
      headers: headers
    });
  }
  
  editarAccion(accion: Accion) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put < IRespuesta > (this.constants.apiUrl + "api/Acciones/", JSON.stringify(accion), {
      headers: headers
    });
  }
  
  eliminar(id: number) {
    return this.http.delete < IRespuesta > (this.constants.apiUrl + "api/Acciones/" + id);
  }

}

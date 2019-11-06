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

  //Solo departamentos
  showAll() {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/");
  }
  getPage(cant: number, pag: number) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos?cant=" + cant + "&pag=" + pag);
  }
  get(id: string) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/" + id);
  }

  //Acciones tutoriales
  showAcciones(id: string) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/" + id + "/AccionesTutoriales");
  }

  //Personales
  showPersonales(id: string) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/" + id + "/Personales");
  }
  getPagePersonales(id: string, cant: number, pag: number) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/" + id + "/Personales?cant=" + cant + "&pag=" + pag);
  }
  //Canalizaciones
  showCanalizaciones(id: string) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/" + id + "/Canalizaciones");
  }
  getPageCanalizaciones(id: string, cant: number, pag: number) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/" + id + "/Canalizaciones?cant=" + cant + "&pag=" + pag);
  }

  //Sesiones
  showSesiones(id: string) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/" + id + "/Sesiones");
  }
  getPageSesiones(id: string, cant: number, pag: number) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Departamentos/" + id + "/Sesiones?cant=" + cant + "&pag=" + pag);
  }
}

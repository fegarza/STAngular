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

  //Solo departementos
  showAll() {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/");
  }
  getPage(cant: number, pag: number) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos?cant=" + cant + "&pag=" + pag);
  }
  get(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id);
  }

  //Acciones tutoriales de los departamentos
  showAcciones(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/AccionesTutoriales/Grupales");
  }
  showAccionesIndividuales(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/AccionesTutoriales/Individuales");
  }

  //Personales de los departamentos
  showPersonales(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/Personales");
  }
  getPagePersonales(id: string, cant: number, pag: number) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/Personales?cant=" + cant + "&pag=" + pag);
  }
  countPersonales(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/Personales/Count");
  }

  //Canalizaciones de los departamentos
  showCanalizaciones(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/Canalizaciones");
  }
  getPageCanalizaciones(id: string, cant: number, pag: number) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/Canalizaciones?cant=" + cant + "&pag=" + pag);
  }
  countCanalizaciones(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/Canalizaciones/Count");
  }

  //Sesiones
  showSesiones(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/Sesiones");
  }
  getPageSesiones(id: string, cant: number, pag: number) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/Sesiones?cant=" + cant + "&pag=" + pag);
  }
  countSesiones(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/Sesiones/Count");
  }
  showSesionesIndividuales(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/SesionesIndividuales");
  }
  getPageSesionesIndividuales(id: string, cant: number, pag: number) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/SesionesIndividuales?cant=" + cant + "&pag=" + pag);
  }
  countSesionesIndividuales(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Departamentos/" + id + "/SesionesIndividuales/Count");
  }


}

import { Injectable } from '@angular/core';
import { IRespuesta } from '../models/respuesta';
import { ConstantsService } from './constants.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Estudiante, Grupo } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor(private constants: ConstantsService, private http: HttpClient) {

  }

  getAll() {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Grupos/");
  }
  get(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Grupos/" + id);
  }
  getReporteSemestral(id: string, periodo: number, year: number) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Grupos/" + id+"/ReporteSemestral?periodo="+periodo+"&year="+year);
  }

  showSesiones(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Grupos/" + id + "/Sesiones");
  }
  showSesionesIndividuales(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Grupos/" + id + "/SesionesIndividuales");
  }
  showAsistencias(id: string, sesionId: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Grupos/" + id + "/Sesiones/" + sesionId);
  }
  showAsistenciasIndividuales(id: string, sesionId: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Grupos/" + id + "/SesionesIndividuales/" + sesionId);
  }
  showCanalizaciones(id: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Grupos/" + id + "/Canalizaciones");
  }
  AgregarAsistencias(id: string, sesionId: string, estudiantes: Array < Estudiante > ) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post < IRespuesta > (this.constants.apiUrl + "api/Grupos/" + id + "/Sesiones/" + sesionId, JSON.stringify(estudiantes), {
      headers: headers
    });
  }
  AgregarAsistenciasIndividuales(id: string, sesionId: string, estudiantes: Array < Estudiante > ) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post < IRespuesta > (this.constants.apiUrl + "api/Grupos/" + id + "/SesionesIndividuales/" + sesionId, JSON.stringify(estudiantes), {
      headers: headers
    });
  }
  editar(grupo: Grupo) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put < IRespuesta > (this.constants.apiUrl + "api/Grupos/", JSON.stringify(grupo), {
      headers: headers
    });
  }

}

import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { IRespuesta } from '../models/respuesta';
import { Estudiante, Grupo, EstudianteDatos } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  constructor(private constants: ConstantsService, private http: HttpClient) {

  }
  guardarDatos(datos: EstudianteDatos) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<IRespuesta>(this.constants.apiUrl + "api/Estudiantes/Datos", JSON.stringify(datos), { headers: headers });

  }
  mostrarDatos(numeroControl: string) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Estudiantes/" + numeroControl+"/Datos");
  }
  mostrarCanalizaciones(numeroControl: string) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Estudiantes/" + numeroControl+"/Canalizaciones");
  }
  get(numeroControl: string) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Estudiantes/" + numeroControl);
  }
  getPage(cant: number, pag: number) {
    return this.http.get<IRespuesta>(this.constants.apiUrl + "api/Estudiantes?cant=" + cant + "&pag=" + pag);
  }

  add(miEstudiante: Estudiante) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    var registro = {
      curp: miEstudiante.curp,
      numeroDeControl: miEstudiante.numeroDeControl,
      Usuario: {
        clave: miEstudiante.usuario.clave,
        email: miEstudiante.usuario.email
      }
    };
    return this.http.post<IRespuesta>(this.constants.apiUrl + "api/Estudiantes/", JSON.stringify(registro), { headers: headers });
  }

  asignarSesiones(numeroDeControl: string, sesiones: number) {
    var estudianteEditar: Estudiante = new Estudiante();

    estudianteEditar.numeroDeControl = numeroDeControl;
    estudianteEditar.sesionesIniciales = sesiones;


    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<IRespuesta>(this.constants.apiUrl + "api/Estudiantes/", JSON.stringify(estudianteEditar), { headers: headers });
  }
  asignarGrupo(numeroDeControl: string, grupoId: number) {
    var estudianteEditar: Estudiante = new Estudiante();

    estudianteEditar.numeroDeControl = numeroDeControl;
    estudianteEditar.grupoId = grupoId;


    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<IRespuesta>(this.constants.apiUrl + "api/Estudiantes/", JSON.stringify(estudianteEditar), { headers: headers });
  }

}

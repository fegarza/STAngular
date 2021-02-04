import { Injectable } from '@angular/core';
import { IRespuesta } from '../models/respuesta';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  
  constructor(private constants: ConstantsService, private http: HttpClient) {
  }

  getReporteSemestralGrupal(id: string, periodo: number, year: number) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Reporte/" + id+"/Grupo?periodo="+periodo+"&year="+year);
  }

  getReporteSemestralDepartamental(id: string, fechaInicial: string, fechaFinal: string) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Reporte/" + id+"/Departamento?id=" + id + "&fechaInicial=" + fechaInicial + "&fechaFinal=" + fechaFinal);
  }
  getReporteSemestralInstitucional( periodo: number, year: number) {
    return this.http.get < IRespuesta > (this.constants.apiUrl + "api/Reporte/Institucional/?periodo="+periodo+"&year="+year);
  }


}

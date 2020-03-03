import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  constructor() { }
  public readonly apiUrl: string = "http://core.itnuevolaredo.edu.mx/tutorias_api/";

  //public readonly apiUrl: string = "http://localhost:5000/";
  //public readonly apiUrl: string = "http://192.168.1.77:5000/";
  //public readonly apiUrl: string = "http://tecnld.ddns.net:5000/";
}



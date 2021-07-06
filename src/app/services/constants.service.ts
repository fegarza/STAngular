import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  constructor() {}
  //Direccion que apunta en produccion
  public readonly apiUrl: string = "https://apitutorias.nlaredo.tecnm.mx/";
  //Direcciones locales de prueba
   //public readonly apiUrl: string = "http://localhost:5000/";
  //public readonly apiUrl: string = "http://192.168.1.77:5000/";
  //public readonly apiUrl: string = "http://tecnld.ddns.net:5000/";
}

//ng build --prod --base-href=/tutorias/


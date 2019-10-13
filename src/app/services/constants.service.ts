import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  constructor() { }
  //public readonly apiUrl: string = "http://10.10.10.15/tutorias_api/";
  public readonly apiUrl: string = "http://tecapi.ddns.net:5000/";
}


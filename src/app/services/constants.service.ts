import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  constructor() { }
  public readonly apiUrl: string = "http://192.168.1.78/";
}

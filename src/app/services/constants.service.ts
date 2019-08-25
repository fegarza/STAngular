import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  constructor() { }
  public readonly apiUrl: string = "http://localhost:5000/";
}

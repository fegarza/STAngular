import { Component, OnInit } from '@angular/core';
import { Archivo } from '../../../models/models';
import { ArchivoService } from 'src/app/services/archivo.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.sass']
})
export class InicioComponent implements OnInit {

  public archivos: Array<Archivo> = new Array<Archivo>();
  constructor(private archivoService: ArchivoService){
    this.archivoService.showAll().subscribe(r => {
      if(r.code == 200){
        this.archivos =r.data as Array<Archivo>;
      }
    });
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { PageEvent, MatTableDataSource } from '@angular/material';
import { Estudiante } from 'src/app/models/models';
import { EstudianteService } from 'src/app/services/estudiante.service';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.sass']
})
export class EstudiantesComponent implements OnInit {

    estudiantes: Array<Estudiante> = new Array<Estudiante>();
    dataSource = new MatTableDataSource(this.estudiantes);
    displayedColumns: string[] = ['nombre', 'numeroDeControl', 'semestre', 'sesiones', 'tutor'];
    // MatPaginator Inputs
    length = 100;
    pageSize = 10;
    pageSizeOptions: number[] = [10,20,30,40,50];

    // MatPaginator Output
    pageEvent: PageEvent;

 

  constructor(private estudianteService: EstudianteService) 
  {
    this.estudianteService.getPage(10,1).subscribe(r=>{
      if(r.code == 200){
        this.estudiantes = r.data as Array<Estudiante>;
        this.dataSource = new MatTableDataSource(this.estudiantes);
      }
    });
  }

  ngOnInit() {
  }

  mostrarEstudiantes( event?:PageEvent ){
    this.estudianteService.getPage(event.pageSize, (event.pageIndex+1)).subscribe(r=>{
      if(r.code == 200){
        this.estudiantes = r.data as Array<Estudiante>;
        this.dataSource = new MatTableDataSource(this.estudiantes);
      }
    });
    return event;
  }

}

import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import {
  PageEvent,
  MatTableDataSource,
  MatSort,
  MatPaginator,
} from "@angular/material";
import { Estudiante, Count } from "src/app/models/models";
import { EstudianteService } from "src/app/services/estudiante.service";
import { Respuesta } from "src/app/models/respuesta";

@Component({
  selector: "app-estudiantes",
  templateUrl: "./estudiantes.component.html",
  styleUrls: ["./estudiantes.component.sass"],
})
export class EstudiantesComponent implements OnInit {
  estudiantes: Array<Estudiante> = new Array<Estudiante>();
  dataSource = new MatTableDataSource(this.estudiantes);
  displayedColumns: string[] = [
    "nombre",
    "numeroDeControl",
    "semestre",
    "sesiones",
    "creditos",
    "tutor",
  ];
  // MatPaginator Inputs
  length = 100;
  pageSize = 20;
  pageSizeOptions: number[] = [20, 30, 40, 50];
  numeroDeControl: string;
  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private estudianteService: EstudianteService) {
    this.estudianteService.count().subscribe((r) => {
      if (r.code == 200) {
        var c = r.data as Count;
        this.length = c.count;
      }
    });
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit() {
   this.estudianteService.getPage(20, 1).subscribe((r) => {
     if (r.code == 200) {
       this.estudiantes = r.data as Array<Estudiante>;
       this.dataSource = new MatTableDataSource(this.estudiantes);
       this.dataSource.sort = this.sort;
     }
   });
    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  mostrarEstudiantes(event?: PageEvent) {
    this.estudianteService
      .getPage(event.pageSize, event.pageIndex + 1)
      .subscribe((r) => {
        if (r.code == 200) {
          this.estudiantes = r.data as Array<Estudiante>;

        this.dataSource = new MatTableDataSource(this.estudiantes);
          this.dataSource.sort = this.sort;
        }
      });
    return event;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Personal, Departamento, Canalizacion } from '../../../../models/models';
import { MatTableDataSource, MatSort, PageEvent } from '@angular/material';
import { DepartamentoService } from '../../../../services/departamento.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.sass']
})
export class DepartamentoComponent implements OnInit {
  public id: number;
  private sub: any;
  personales: Array<Personal> = new Array<Personal>();
  dataSource = new MatTableDataSource(this.personales);
  displayedColumns: string[] = ['nombre', 'cargo', 'tutorados', 'departamento'];
  displayedColumns2: string[] = ['tutor', 'estudiante', 'atencion'];
  public departamento : Departamento = new Departamento();
  public canalizaciones: Array<Canalizacion> = new Array<Canalizacion>()
  dataSource2 = new MatTableDataSource(this.canalizaciones);
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [10,20,30,40,50];
 
  constructor(private route: ActivatedRoute, private departamentoService: DepartamentoService ) 
  {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];  
    });
    this.departamentoService.get(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        this.departamento = r.data as Departamento;
      }
    });
    this.departamentoService.showPersonales(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        this.personales = r.data as Array<Personal>;
        this.dataSource = new MatTableDataSource(this.personales);
      }
    });
    this.departamentoService.showCanalizaciones(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        this.canalizaciones = r.data as Array<Canalizacion>;
        this.dataSource2 = new MatTableDataSource(this.canalizaciones);
      }
    });
  }
  mostrarPersonales( event?:PageEvent ){
    this.departamentoService.getPagePersonales(this.id.toString(), event.pageSize, (event.pageIndex+1)).subscribe(r=>{
      if(r.code == 200){
        this.personales = r.data as Array<Personal>;
        this.dataSource = new MatTableDataSource(this.personales);
      }
    });
    return event;
  }
  
  ngOnInit() {
  }
 
}

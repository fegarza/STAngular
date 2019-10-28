import { Component, OnInit, ViewChild } from '@angular/core';
import { Departamento } from '../../../../models/models';
import { PageEvent, MatSort, MatTableDataSource } from '@angular/material';
import { DepartamentoService } from '../../../../services/departamento.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.sass']
})
export class DepartamentosComponent implements OnInit {


  departamentos: Array<Departamento> = new Array<Departamento>();
  dataSource = new MatTableDataSource(this.departamentos);
  displayedColumns: string[] = ['titulo'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [10,20,30,40,50];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private departamentoService: DepartamentoService) 
  {
    this.departamentoService.showAll().subscribe(r=>{
      if( r.code == 200){
        this.departamentos  = r.data as Array<Departamento>;
        this.dataSource = new MatTableDataSource(this.departamentos);
      }
    });
  }

  ngOnInit() {
  }

  mostrarDepartamentos( event?:PageEvent ){
    /*this.personalService.getPage(event.pageSize, (event.pageIndex+1)).subscribe(r=>{
      if(r.code == 200){
        this.personales = r.data as Array<Personal>;
        this.dataSource = new MatTableDataSource(this.personales);
      }
    });
    return event;*/
  }
}

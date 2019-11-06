import { Component, OnInit, ViewChild } from '@angular/core';
import { Personal, Departamento, Canalizacion, Sesion } from '../../../../models/models';
import { MatTableDataSource, MatSort, PageEvent } from '@angular/material';
import { DepartamentoService } from '../../../../services/departamento.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.sass']
})
export class DepartamentoComponent implements OnInit {
  

  //Departamento
  public id: number;
  private sub: any;
  public departamento : Departamento = new Departamento();
  
  //DataTable de los personales
  personales: Array<Personal> = new Array<Personal>();
  personalesDataSource = new MatTableDataSource(this.personales);
  personalesColumns: string[] = ['nombre', 'cargo', 'tutorados'];
  personalesLength = 100;
  personalesPageSize = 10;
  personalesPageSizeOptions: number[] = [10,20,30,40,50];
  
  //DataTable de las canalizaciones
  public canalizaciones: Array<Canalizacion> = new Array<Canalizacion>()
  canalizacionesDataSource = new MatTableDataSource(this.canalizaciones);
  canalizacionesColumns: string[] = ['tutor', 'estudiante', 'atencion'];
  canalizacionesLength = 100;
  canalizacionesPageSize = 10;
  canalizacionesPageSizeOptions: number[] = [10,20,30,40,50];
  // Sesiones
  public sesiones : Array<Sesion> = new Array<Sesion>();
  sesionesDataSource = new MatTableDataSource(this.sesiones);
  sesionesColumns: string[] = ['fecha', 'editar'];
  sesionesLength = 100;
  sesionesPageSize = 10;
  sesionesPageSizeOptions: number[] = [10,20,30,40,50];





 
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
        this.personalesDataSource = new MatTableDataSource(this.personales);
      }
    });
    this.departamentoService.showCanalizaciones(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        this.canalizaciones = r.data as Array<Canalizacion>;
        this.canalizacionesDataSource = new MatTableDataSource(this.canalizaciones);
      }
    });
    this.departamentoService.showSesiones(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        this.sesiones = r.data as Array<Sesion>;
        this.sesionesDataSource = new MatTableDataSource(this.sesiones);
      }
    });
  }
  mostrarPersonales( event?:PageEvent ){
    this.departamentoService.getPagePersonales(this.id.toString(), event.pageSize, (event.pageIndex+1)).subscribe(r=>{
      if(r.code == 200){
        this.personales = r.data as Array<Personal>;
        this.personalesDataSource = new MatTableDataSource(this.personales);
      }
    });
    return event;
  }
  mostrarCanalizaciones( event?:PageEvent ){
    this.departamentoService.getPageCanalizaciones(this.id.toString(), event.pageSize, (event.pageIndex+1)).subscribe(r=>{
      if(r.code == 200){
        this.canalizaciones = r.data as Array<Canalizacion>;
        this.canalizacionesDataSource = new MatTableDataSource(this.canalizaciones);
      }
    });
    return event;
  }
  mostrarSesiones( event?:PageEvent ){
    this.departamentoService.getPageSesiones(this.id.toString(), event.pageSize, (event.pageIndex+1)).subscribe(r=>{
      if(r.code == 200){
        this.sesiones = r.data as Array<Sesion>;
        this.sesionesDataSource = new MatTableDataSource(this.sesiones);
      }
    });
    return event;
  }
  
  ngOnInit() {
  }
 
}

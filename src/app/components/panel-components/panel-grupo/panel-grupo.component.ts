import { Component, OnInit, ViewChild } from '@angular/core';
import { GrupoService } from 'src/app/services/grupo.service';
import { Grupo, Sesion } from 'src/app/models/models';
import { ActivatedRoute } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
 
 

@Component({
  selector: 'app-panel-grupo',
  templateUrl: './panel-grupo.component.html',
  styleUrls: ['./panel-grupo.component.sass']
})
export class PanelGrupoComponent implements OnInit {

  public miGrupo : Grupo = new Grupo();
  public id: number;
  private sub: any;

  public sesiones: Array<Sesion> = new Array<Sesion>();

  constructor( private route: ActivatedRoute, private grupoService: GrupoService) {
      
  
  }
 

  displayedColumns: string[] = ['presente','correo', 'nombre',  'numeroDeControl', 'canalizar', 'ver'];
  dataSource = new MatTableDataSource(this.miGrupo.estudiantes);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
 
  ngOnInit() {

   
    this.dataSource.sort = this.sort;

    
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.grupoService.showSesiones(this.id.toString()).subscribe(r=>{
      if(r.code == 200){
        this.sesiones = r.data as Array<Sesion>;
      }else{
        console.log("error: ", r.data)
      }
    })
    this.grupoService.get(this.id.toString()).subscribe(
      r => {
        this.miGrupo = r.data as Grupo
        this.dataSource = new MatTableDataSource(this.miGrupo.estudiantes);
       // console.log(this.miGrupo);
      });
  }
  Canalizar(){
    Swal.fire({
    title: 'Canalizar',
    html:
      '<input id="swal-input1" class="swal2-input">' +
      '<input id="swal-input2" class="swal2-input">',
    });
  }
}

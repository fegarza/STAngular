import { Component, OnInit, ViewChild } from '@angular/core';
import { GrupoService } from 'src/app/services/grupo.service';
import { Grupo, Sesion, Estudiante } from 'src/app/models/models';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import * as jsPDF from 'jspdf';
import { FormGroup, FormControl, Validators } from '@angular/forms';
 

@Component({
  selector: 'app-panel-grupo',
  templateUrl: './panel-grupo.component.html',
  styleUrls: ['./panel-grupo.component.sass']
})
export class PanelGrupoComponent implements OnInit {

  //Traer el ID del  url
  public id: number;
  private sub: any;

  //Variables publicas
  public miGrupo: Grupo = new Grupo();
  public sesiones: Array<Sesion> = new Array<Sesion>();
  public seleccionado: boolean = false;
  public asistencia :Array<Estudiante> = new Array<Estudiante>();
  public sesionSeleccionada: number = 0;
  //Tabla
  dataSource = new MatTableDataSource(this.miGrupo.estudiantes);
  displayedColumns: string[] = ['nombre', 'numeroDeControl', 'canalizar'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  asistenciaSource = new MatTableDataSource(this.asistencia);
  asistenciaColumns : string[] = ['presente', 'nombre', 'numeroDeControl'];

  //Formularios
  sesionesForm: FormGroup;


  constructor(private route: ActivatedRoute, private grupoService: GrupoService) {
    this.sesionesForm = new FormGroup({
      sesion: new FormControl('', [Validators.required]),
    });
  }
  AsignarAsistencia(values:any, id: any){
    if(values.checked){
      console.log("-> se ha agregado asistencia a estudiante con el ID: " + id);
      this.asistencia.find(x => x.id == id).presente = true;
    }else{
      console.log("-> se ha quitado asistencia a estudiante con el ID: " + id);
      this.asistencia.find(x => x.id == id).presente = false;
    }
  }
  cargarAsistencias(value) {
    this.sesionSeleccionada = value;
     this.grupoService.showAsistencias(this.id.toString(), value).subscribe(
      r => {
        if (r.code == 200) {
          this.asistencia = r.data as Array<Estudiante>;
          this.asistenciaSource = new MatTableDataSource(this.asistencia);
        }
      }
    );
  }


  

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.grupoService.showSesiones(this.id.toString()).subscribe(r => {
      if (r.code == 200) {
        this.sesiones = r.data as Array<Sesion>;
      } else {
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
  generarReporte(){
     var doc = new jsPDF();   
        

    
    var doc = new jsPDF();

    var headers = [
      {
        'id' : 'NumeroDeControl',
        'name' : 'NumeroDeControl',
        'width': 65,
        'align': 'center',
        'padding': 0
      }
    ];
    var data = [
      {
        id: 1,
        numeroDeControl: "17100218"
      },
      {
        id: 2,
        numeroDeControl: "17100219"
      }
      
    ];

 
    var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: 'landscape' });
    doc.table(1, 1, data, headers);
     doc.save('a4.pdf');
  }
  Canalizar() {
    Swal.fire({
      title: 'Canalizar',
      html:
        '<input id="swal-input1" class="swal2-input">' +
        '<input id="swal-input2" class="swal2-input">',
    });
  }
  Guardar(){
    var nuevaAsistencia: Array<Estudiante> = new Array<Estudiante>();
    this.asistencia.forEach(e => {
      if(e.presente){
        nuevaAsistencia.push(e)
      }
    });
    if(this.sesionSeleccionada != 0 ){
      this.grupoService.AgregarAsistencias(this.id.toString(), this.sesionSeleccionada.toString(), nuevaAsistencia)
      .subscribe(s=>{
        if(s.code == 200){
          Swal.fire(
            'Se ha pasado lista correctamente',
            'la lista de esta sesion ha sido actualizada' ,
            'success'
          );
        }else{

        }
      });
    }

  }
}

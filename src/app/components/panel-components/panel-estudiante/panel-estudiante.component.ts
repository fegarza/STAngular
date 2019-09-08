import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { Estudiante, Grupo } from 'src/app/models/models';
import { GrupoService } from 'src/app/services/grupo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-panel-estudiante',
  templateUrl: './panel-estudiante.component.html',
  styleUrls: ['./panel-estudiante.component.sass']
})

export class PanelEstudianteComponent implements OnInit {

  private sub: any;
  public miEstudiante : Estudiante = new Estudiante();

  constructor(
    private route: ActivatedRoute,
    private estudianteService: EstudianteService,
    private router: Router,
    private grupoService: GrupoService) { }

  ngOnInit() {
    var id: string;
    this.sub = this.route.params.subscribe(params => {
      id = params['id'].toString();
    });
    this.getEstudiante(id);
  }


  public getEstudiante(id: string){
    this.estudianteService.get(id.toString()).subscribe(
      r => {
          this.miEstudiante = r.data as Estudiante;
     });
  }


  public asignarGrupo(){

    var grupos: Array<Grupo>;
    var opciones: Map<string, string> = new Map();
    this.grupoService.getAll().subscribe(
      r => {
        grupos = r.data as Array<Grupo>;
        grupos.map(g => {
           opciones.set(g.id.toString(), g.tutor.usuario.nombreCompleto);
        });
      },
      error=>{
        console.log("ERROR");
      },
      async () => {
       const { value: gId }= await Swal.fire({
          title: 'Selecciona el grupo a asignar',
          input: 'select',
          inputOptions: opciones,
          inputPlaceholder: 'Selecciona el tutor',
          showCancelButton: true
        });
        console.log("se ha seleccionado el grupo id: "+ gId);
        if(gId != undefined && gId != null){
            this.estudianteService.asignarGrupo( this.miEstudiante.numeroDeControl, gId ).subscribe(r => {
              if(r.code == 200){
                Swal.fire(
                  'Se ha logrado cambiar el grupo',
                  'Ahora el alumno: '+ this.miEstudiante.usuario.nombreCompleto + ' pertenece al grupo de ' + opciones.get(gId) ,
                  'success'
                );
              }else{
                Swal.fire(
                  'Ha ocurrido un error',
                  r.mensaje,
                  'error'
                );
              }
          });
        }
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { Estudiante } from 'src/app/models/models';

@Component({
  selector: 'app-panel-estudiante',
  templateUrl: './panel-estudiante.component.html',
  styleUrls: ['./panel-estudiante.component.sass']
})
export class PanelEstudianteComponent implements OnInit {

  public id: number;
  private sub: any;
  public miEstudiante : Estudiante = new Estudiante();

  constructor(private route: ActivatedRoute, private estudianteService: EstudianteService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.estudianteService.get(this.id.toString()).subscribe(
      r => {
        this.miEstudiante = r.data as Estudiante
      });
  }
}

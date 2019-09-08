import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Personal, Usuario } from 'src/app/models/models';
import { PersonalService } from 'src/app/services/personal.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { GrupoService } from 'src/app/services/grupo.service';

@Component({
  selector: 'app-panel-personal',
  templateUrl: './panel-personal.component.html',
  styleUrls: ['./panel-personal.component.sass']
})
export class PanelPersonalComponent implements OnInit {
  public id: number;
  private sub: any;
  public miPersonal: Personal = new Personal();
  public miUsuario: Usuario = new Usuario();
  public rango: string;
  constructor( private route: ActivatedRoute, private personalService: PersonalService,  private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];  
    });
    this.personalService.get(this.id.toString()).subscribe(
      r => {
        if(r.code == 202){
          this.miPersonal = r.data as Personal;
        }else{
          this.router.navigate(['/404']);
        }
       
      });
      this.miUsuario = this.authService.traerUsuario();
      this.rango = this.authService.mostrarTipo();
  }

 

}

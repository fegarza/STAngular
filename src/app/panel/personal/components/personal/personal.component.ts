import { Component, OnInit } from '@angular/core';
import { Personal, Usuario } from 'src/app/models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonalService } from 'src/app/services/personal.service';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.sass']
})
export class PersonalComponent implements OnInit {

  public id: number;
  private sub: any;
  public miPersonal: Personal = new Personal();
  public miUsuario: Usuario = new Usuario();
  public rango: string;
  constructor( private route: ActivatedRoute, private personalService: PersonalService,  private router: Router, private authService: AuthService) 
  {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];  
    });
    this.miUsuario = this.authService.traerUsuario();
    if(this.miUsuario.personal.cargo == "T"){
      if(this.miUsuario.personal.id != parseInt(this.id.toString())){
        this.router.navigate(['/panel']);
      }else{
        this.personalService.get(this.id.toString()).subscribe(
          r => {
            if(r.code == 202){
              this.miPersonal = r.data as Personal;
            }else{
              this.router.navigate(['/404']);
            }
           
          });
      }
    }else{
      this.personalService.get(this.id.toString()).subscribe(
        r => {
          if(r.code == 202){
            this.miPersonal = r.data as Personal;
          }else{
            this.router.navigate(['/404']);
          }
         
        });
    }
   }

  ngOnInit() {
    
    
     
  }
}

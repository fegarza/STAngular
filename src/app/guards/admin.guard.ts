import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth-service.service';
 

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate{
  private sub: any;
  public id: number;

  constructor(private router: Router, private route: ActivatedRoute, private aurhService: AuthService){
      this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];  
    });
  
  }
  canActivate(){
     if(this.aurhService.isEstudiante()){
      this.router.navigate(['/panel'+this.id]);
      return false;
     }else{
          return true;
     }
  }
}

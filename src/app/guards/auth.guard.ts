import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements   CanActivate{
    
  constructor(private authService: AuthService, private router: Router){
   
  }

   

  canActivate(){

    var token: string = localStorage.getItem("token");
    if(token != null){

       return this.authService.comprobarToken(token).pipe(

        map(r => {
          if(r.code == 200){
            return true;
          }
          else{
            this.router.navigate(['/']);
            return false;
          }

        },
        error=>{
          this.router.navigate(['/']);
          return false;
        })
        

      );

    
    }else{
      this.router.navigate(['/']);
      return false;
    }
  }
  
}

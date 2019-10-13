import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements   CanActivate, CanActivateChild{
    
  constructor(private authService: AuthService, private router: Router){
   
  }

  canActivate(){
    //obtenemos el token
    if(this.authService.traerUsuario() != null){
    var token: string = this.authService.traerUsuario().token;
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
        error => {
          this.router.navigate(['/']);
          return false;
        }));
    }else{
      this.router.navigate(['/']);
      return false;
    }
  }else{
    this.router.navigate(['/']);
    return false;
  }

  }
  canActivateChild(){
     //obtenemos el token
     if(this.authService.traerUsuario() != null){
      var token: string = this.authService.traerUsuario().token;
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
          error => {
            this.router.navigate(['/']);
            return false;
          }));
      }else{
        this.router.navigate(['/']);
        return false;
      }
    }else{
      this.router.navigate(['/']);
      return false;
    }
  }
}

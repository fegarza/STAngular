import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      switch(next.data.rol){
        case "personal":
            if(this.authService.isEstudiante()){
              this.router.navigate(['/panel']);
              return false;
             }else{
                  return true;
             }
        break;
      }
      
  }


 

  
  
  
 
  
}

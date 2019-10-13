import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth-service.service';
 
@Injectable({
  providedIn: 'root'
})
export class RoleGuardGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {

  }

     canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
      const allowedRoles = next.data.allowedRoles;
      var autorizado =  this.authService.isAuthorized(allowedRoles);
      if (!autorizado) {
        // if not authorized, show access denied message
        this.router.navigate(['/panel']);
      }
      
      return autorizado;
    }
     








}

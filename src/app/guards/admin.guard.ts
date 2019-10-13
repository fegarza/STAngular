import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private sub: any;
  public id: number;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

  }
  canActivate() {

    if (this.authService.traerUsuario().personal.cargo == "A") {
      return true;
    } else {
      this.router.navigate(['/panel']);
      return false;

    }
  }
}

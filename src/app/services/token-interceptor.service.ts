import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }
  intercept(req, next) {
    var tokenizedRequest;
    if (this.authService.traerUsuario() == null) {
      tokenizedRequest = req.clone({
        setHeaders: {
          Authorization: 'Bearer '
        }
      });
    } else {
      tokenizedRequest = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.authService.traerUsuario().token
        }
      });
    }
    return next.handle(tokenizedRequest);
  }
  
}

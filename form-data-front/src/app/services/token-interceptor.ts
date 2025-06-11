import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from'@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn:  'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1. Grab the token (you stored it after login)
    const token = localStorage.getItem('token');

    // 2. If there is one, clone & add the header
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Cloned request with Authorization header:', req.headers.get('Authorization'));

    }else{
      console.log("No token found in localstorage");

    }
    // 3. Otherwise just pass the request through
    return next.handle(req);
  }
}

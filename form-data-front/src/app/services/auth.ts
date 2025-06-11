// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3333/use';

  constructor(private http: HttpClient) { }

  signup(userData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/signup`, userData);
}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  dashboard() : Observable<any>{
    return this.http.get('http://localhost:3333/use/dashboard')
  }

}

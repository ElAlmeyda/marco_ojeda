import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class StripeService {
  
  private apiUrl = 'http://localhost:3000/crear-sesion';
  constructor(public http: HttpClient) {
  }

  createSession(productos: any[]): Observable<any> {
    return this.http.post(this.apiUrl, { productos });
  }
}

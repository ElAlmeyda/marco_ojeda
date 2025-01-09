import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class StripeService {
  
  private apiUrl = 'https://us-central1-servicio-4f831.cloudfunctions.net/createCheckoutSession';
  constructor(public http: HttpClient) {
  }

  createSession(productos: any[]): Observable<any> {
    return this.http.post(this.apiUrl, { productos });
  }

  private async verificarPagoConBackend(sessionId: string): Promise<void> {
    const response = await fetch('https://us-central1-servicio-4f831.cloudfunctions.net/verificarPago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
  
    if (response.ok) {
      console.log('Pago confirmado y carrito limpiado');
    } else {
      console.error('Error al verificar el pago:', await response.text());
    }
  }
}

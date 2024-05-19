import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleguardService implements CanActivate {

  private adminUID = 'i31dO5XiE0OqKyTdoqtYAceLrnf1'; // Reemplaza con el UID del administrador
  private gestorUID = '2wAu8VLuO8U6J5W2MG6g7Hd3TfC2'; // Reemplaza con el UID del gestor del calendario

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const expectedRole = route.data['expectedRole'];
    let requiredUID: string;
    let alertMessage: string;
    console.log("estoy dentro del salvaguard")

    if (expectedRole.includes('administrador')) {
      console.log("dentro del admin")
      requiredUID = this.adminUID;
    } else if (expectedRole.includes('gestor')) {
      requiredUID = this.gestorUID;
    } else {
      return new Observable(observer => observer.next(false));
    }

    return this.afAuth.authState.pipe(
      take(1),
      map(user => !!user && user.uid === requiredUID),
      tap(isAuthorized => {
        if (!isAuthorized) {
          alert(alertMessage);
          this.router.navigate(['/folder']);
        }
      })
    );
  }
}

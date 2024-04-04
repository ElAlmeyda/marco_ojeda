import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreAuthService {

  constructor(public auth: AngularFireAuth) { }


  login(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    this.auth.signOut();
  }

  registrarse(email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  async getUid(){
    const user = await this.auth.currentUser;
    if(user == undefined){
      return null;
    } else {
      return user.uid;
    }
  }

  stateAuth(){
    return this.auth.authState;
  }

  estaAutenticado(): Observable<boolean> {
    return this.auth.authState.pipe(
      map(user => user !== null) // Verifica si el usuario no es nulo (es decir, está autenticado)
    );
  }
}

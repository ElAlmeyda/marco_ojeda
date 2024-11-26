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

  async logout(){
    await this.auth.signOut();
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
      map(user => user !== null) 
    );
  }

  getStateAuth(): Observable<any> {
    return this.auth.authState;
  }

  async updatePassword(password: string): Promise<void> {
    try {
      const user = await this.auth.currentUser;
      if(user){
        await user.updatePassword(password);
        console.log('Contraseña actualizada correctamente');
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      throw error; // Puedes manejar el error en el componente que llama a este método
    }
  }

  async resetPassword(email: string): Promise<void> {
    return this.auth.sendPasswordResetEmail(email);
  }
}

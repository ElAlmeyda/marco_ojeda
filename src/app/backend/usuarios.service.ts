import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { Usuario } from '../model';
import { Observable, filter, finalize, lastValueFrom, map, pipe, tap } from 'rxjs';
import { FirestoreAuthService } from '../service/firestore-auth.service';
import { NotificacionService } from '../service/notificacion.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private path = 'Usuarios/';

  usuarioLogin:boolean=false;

  usuario: Usuario [] = [];

  uid= '';

  constructor(public firestoreService: FirestoreService,  public firestroreAuth: FirestoreAuthService, public notificacion: NotificacionService, public storage: AngularFireStorage) {
  }

  changeUserLogin(change:boolean){
    return this.usuarioLogin = change;
  }

  getUsuario(){
    return this.usuario;
  }

  getUsuarios(){
    return this.firestoreService.getCollection<Usuario>(this.path).pipe(
      tap((res: Usuario[]) => {
        this.usuario = res;
      })
    );
  }

  async createUser(nombre:string, email:string, password:string, movil:string){
    const data = {nombre, email, movil, uid:'', role: 'user'};
      try{
        await this.firestroreAuth.registrarse(email, password);
        const uid: string | null = await this.firestroreAuth.getUid();
        if(uid){
          const uidString = uid;
          data['uid'] = uid;
          this.firestoreService.creatDoc(data, this.path, uidString);
          this.notificacion.inicializar(uidString);
        } else {
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error al crear usuario:", error);
        return false;
      }
    }

  inicioSesion(email: string, password: string){
    this.changeUserLogin(true);
    return this.firestroreAuth.login(email, password);
  }

  async logout(){
    this.changeUserLogin(false);
    await this.notificacion.eliminarToken();
    return this.firestroreAuth.logout();
  }

  getInfoUser(uid:string){
    return this.firestoreService.getDoc<Usuario>(this.path, uid).pipe(
      map((res: Usuario | undefined) => res ? [res] : [])
    );
  }

  verificarCorreoExiste(email: string){
    const usuarioExistente = this.usuario.find(usuario => usuario.correo === email);
    if(usuarioExistente){
      return false;
    } else {
      return true;
    }
  }

  getUsuarioConcreto(id: string){
    return this.usuario.find(usuario => usuario.uid === id);
  }

  async actualizarInfo(nombre: string, email: string, movil: string, password:string, uid:string){
    const data = {nombre, email, movil, password, uid};
    try {
      await this.firestoreService.updateDoc(data, this.path, uid);
      await this.firestroreAuth.updatePassword(password);
      return true; 
    } catch (error) {
      console.error("Error al actualizar en Firestore:", error);
      return false; 
    }
  }

  verificarCorreoExistente(email: string): Observable<boolean> {
    return this.firestoreService.verificarCorreoExistente(email);
  }

  marcarUsuarioComoEliminado(usuario: any, uid: string): Promise<void> {
    const path = `Eliminado`; // Solo la colección
    const datos = {
      ...usuario,
      eliminadoEn: new Date(),
      eliminado: true
    };

    this.firestoreService.deleteDoc(this.path, uid);
  
    return this.firestoreService.creatDoc(datos, path, uid);
  }

  async updateCorreo(nuevoCorreo: string, uid:string){
    try {
      await this.firestoreService.updateCorreo(nuevoCorreo, uid);
      return true;
    } catch (error) {
      console.error("Error al actualizar en Firestore:", error);
      return false; 
    }
  }  

  async subirImagen(files: File[], uid: string): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
      const filePath = `avatars/${uid}/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      
      const uploadTask = this.storage.upload(filePath, file);
      
      // Espera a que la subida se complete completamente
      await lastValueFrom(uploadTask.snapshotChanges().pipe(
        finalize(() => {
          console.log(`Subida finalizada para: ${file.name}`);
        })
      ));
      
      // Luego obtiene la URL del archivo subido
      const url = await lastValueFrom(fileRef.getDownloadURL());
      urls.push(url);
    }

    return urls;
  }

  async subirImagenResena(files: File[], uidUsuario: string, uidTatuador: string): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
      // Cambiamos la carpeta para reseñas
      const filePath = `resenas/${uidTatuador}/${uidUsuario}_${Date.now()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);

      const uploadTask = this.storage.upload(filePath, file);

      // Espera a que la subida se complete
      await lastValueFrom(uploadTask.snapshotChanges().pipe(
        finalize(() => {
          console.log(`Subida de reseña finalizada para: ${file.name}`);
        })
      ));

      // Obtiene la URL del archivo subido
      const url = await lastValueFrom(fileRef.getDownloadURL());
      urls.push(url);
    }

    return urls;
  }

  async subirImagenBoceto(files: File[], uidUsuario: string, uidTatuador: string): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
      // Cambiamos la carpeta para reseñas
      const filePath = `boceto/${uidTatuador}/${uidUsuario}_${Date.now()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);

      const uploadTask = this.storage.upload(filePath, file);

      // Espera a que la subida se complete
      await lastValueFrom(uploadTask.snapshotChanges().pipe(
        finalize(() => {
          console.log(`Subida de reseña finalizada para: ${file.name}`);
        })
      ));

      // Obtiene la URL del archivo subido
      const url = await lastValueFrom(fileRef.getDownloadURL());
      urls.push(url);
    }

    return urls;
  }

  

  async actualizarAvatar(userId: string, data: string): Promise<void> {
    return this.firestoreService.updateDocAvatar(userId, data);
  }

  getAvatar(uid: string){
    return this.firestoreService.obtenerAvatar(uid);
  }
  
  async isPremium(uid: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.firestoreService.isPremium(uid).subscribe(
        (res) => {
          resolve(res); // Resolvemos la promesa con el valor obtenido
        },
        (error) => {
          console.error("Error al verificar premium:", error);
          reject(false); // Rechazamos la promesa si ocurre un error
        }
      );
    });
  }

}

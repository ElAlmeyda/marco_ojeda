import { Injectable } from '@angular/core';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, switchMap } from 'rxjs';
import { idToken } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  constructor(private database: AngularFirestore, public storage: AngularFireStorage) { }

  creatDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).set(data);
  }

  readDoc(path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string){
    const collection = this.database.collection<any>(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).update(data);
  }

  addDoc(path:string, data: any, id:string){
    return this.database.collection(path).doc(id).set(data);
  }

  getId(){
    return this.database.createId();
  }

  getCollection<tipo>(path: string){
    const collection = this.database.collection<tipo>(path);
    return collection.valueChanges();
  }

  getDoc<tipo>(path: string, uid: string){
    const collection = this.database.collection<tipo>(path);
    return collection.doc(uid).valueChanges();
  }

  getUserCitas(): Observable<any[]> {
    return this.database.collectionGroup('Cita').valueChanges();
  }


  subirImagenes(file: any, path: string, nombre:string): Promise<string>{
    return new Promise( resolve =>{
      const filePath= path;
      const ref = this.storage.refFromURL(filePath);
      const tak = ref.put(file);
      resolve('este es el enlace');
    });
  }

  agregarTokens(idToken: string, uid: string): Promise<void> {
    const docRef = this.database.doc(`Usuarios/${uid}`);
    return docRef.get().toPromise().then((docSnapshot) => {
      if (docSnapshot && docSnapshot.exists) {
        const data = docSnapshot.data() as { token: string[] };
        const currentToken = data.token || [];
        if (!currentToken.includes(idToken)) {
          const updateToken = [...currentToken, idToken];
          return docRef.update({
            token: updateToken
          });
        } else {
          return Promise.resolve();
        }
      } else {
        return docRef.set({
          token: [idToken]
        });
      }
    }).catch((error) => {
      console.error('Error al actualizar los likes: ', error);
      return Promise.reject(error);
    });
  }


  eliminarToken(uid: string, token: string): Promise<void> {
    const docRef = this.database.doc(`Usuarios/${uid}`);
  
    // Obtener el documento actual para no sobrescribir los tokens anteriores
    return docRef.get().toPromise().then((docSnapshot) => {
      if (docSnapshot && docSnapshot.exists) {
        const data = docSnapshot.data() as { token: string[] };
        const currentTokens = data.token || [];
  
        // Filtrar el token que queremos eliminar
        const updatedTokens = currentTokens.filter((t) => t !== token);
  
        // Si el array de tokens cambió (es decir, el token fue eliminado), actualizamos Firestore
        if (updatedTokens.length !== currentTokens.length) {
          return docRef.update({ token: updatedTokens });
        } else {
          // Si el token no estaba en el array, no hacemos nada
          console.log('El token no se encontraba en el array');
          return Promise.resolve();  // O lanzar un error si prefieres
        }
      } else {
        // Si el documento no existe, retornamos una promesa resuelta
        return Promise.resolve();  // O puedes optar por Promise.reject(new Error('Usuario no encontrado'));
      }
    }).catch((error) => {
      console.error('Error al eliminar el token: ', error);
      return Promise.reject(error); // Devolvemos la promesa rechazada en caso de error
    });
  }

  updatePedido(nuevoEstado: string, userId: string, pedidoId: string) {
    const docRef = this.database
      .collection('Usuarios')
      .doc(userId)
      .collection('Pedido')
      .doc(pedidoId);
  
    docRef.get().toPromise().then((docSnapshot) => {
      if (docSnapshot && docSnapshot.exists) {
        // El documento existe, procedemos a actualizar
        return docRef.update({ estado: nuevoEstado });
      } else {
        // El documento no existe, maneja el caso
        return Promise.reject('El documento no existe');
      }
    }).catch((error) => {
      console.error('Error al actualizar el pedido:', error);
      throw error;
    });
  }

  verificarCorreoExistente(correo: string): Observable<boolean> {
    return this.database.collection('Usuarios', ref => ref.where('correo', '==', correo))
      .valueChanges()
      .pipe(map(usuarios => usuarios.length > 0));
  }

  async guardarUbicacion(location: { latitude: number; longitude: number; timestamp: Date; },uid: string): Promise<void> {
    try {
      const docRef = this.database.doc(`Usuarios/${uid}`);

      return docRef.get().toPromise().then((docSnapshot) => {
        if (docSnapshot && docSnapshot.exists) {
          const data = docSnapshot.data() as { ubicacion: string };
          const currentLikes = data.ubicacion || [];
  
          // Filtrar el like que queremos eliminar
  
          // Actualizar la lista en Firestore
          return docRef.update({ ubicacion: location });
        } else {
          // Si el documento no existe, simplemente retornamos una promesa resuelta
          return Promise.resolve(); // O puedes optar por Promise.reject(new Error('Usuario no encontrado'));
        }
      }).catch((error) => {
        return Promise.reject(error); // Devolvemos la promesa rechazada en caso de error
      });
    } catch (error) {
    }
  }

  // Obtener todas las ubicaciones para poder comparar la distancia
  obtenerUbicaciones() {
    return this.database.collection('ubicacion').get();
  }

  updateCorreo(nuevoCorreo: string, userId: string) {
    const docRef = this.database.collection('usuario').doc(userId);
    docRef.get().toPromise().then((docSnapshot) => {
      if (docSnapshot && docSnapshot.exists) {
        // El documento existe, procedemos a actualizar
        return docRef.update({ correo: nuevoCorreo });
      } else {
        // El documento no existe, maneja el caso
        return Promise.reject('El documento no existe');
      }
      
    });
  }
 
}

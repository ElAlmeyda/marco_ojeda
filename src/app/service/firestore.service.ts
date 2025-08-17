import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, switchMap, tap } from 'rxjs';
import { idToken } from '@angular/fire/auth';
import { Tatuador } from '../model';

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

  getTatuadores(): Observable<Tatuador[]> {
    return this.database.collection<Tatuador>('Tatuador').snapshotChanges().pipe(
      map(actions => 
        actions.map(a => {
          const data = a.payload.doc.data() as Tatuador;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getTatuadorById(uid: string): Observable<Tatuador | undefined> {
    return this.database.doc<Tatuador>(`Tatuador/${uid}`).valueChanges();
  }

 getAvatarUrl(uid: string): Observable<string | undefined> {
    return this.database.doc<{ url: string }>(`Tatuador/${uid}/avatar/avatar`).valueChanges().pipe(
      map(doc => doc?.url)
    );
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
    const docRef = this.database.collection('Usuarios').doc(userId);
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
 
  updateDocAvatar(userId: string, avatarUrl: string): Promise<void> {
    const avatarDocRef = this.database.doc(`Tatuador/${userId}/avatar/avatar`);

    const data = {
      url: avatarUrl // 👈 solo una imagen
    };

    return avatarDocRef.set(data)
      .catch(error => {
        console.error('❌ Error al guardar avatar:', error);
        return Promise.reject(error);
      });
  }

   obtenerAvatar(uid: string): Observable<string> {
    const imagenesDocRef = this.database.doc(`Usuarios/${uid}/avatar`);

    return imagenesDocRef.snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as { url: string };
        return data?.url || '';
      })
    );
  }

  async verificarFavorito(uidUsuario: string, uidTatuador: string): Promise<boolean> {
    const docRef = this.database.doc(`Usuarios/${uidUsuario}/favoritos/${uidTatuador}`);
    const docSnap = await docRef.get().toPromise();
    return !!docSnap?.exists;
  }

  obtenerFavorito(uid: string): Observable<any[]> {
    return this.database.collection(`Usuarios/${uid}/favoritos`).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }


  setDocument(path: string, data: any) {
    return this.database.doc(path).set(data);
  }

  deleteDocument(path: string) {
    return this.database.doc(path).delete();
  }

  getDocument(path: string) {
    return this.database.doc(path).get();
  }

  async guardarCita(cita: any, uidCliente: string, uidTatuador: string) {
    // Crear un id único para la cita
    const idCita = this.database.createId();
    // Datos cita con uid y referencias
    const datosCita = {
      ...cita,
      uidCita: idCita,
      uidCliente,
      uidTatuador,
      estado: 'Pendiente', // ejemplo
      fechaCreacion: new Date()
    };
    // Guardar bajo el usuario
    await this.database.collection(`Usuarios/${uidCliente}/citas`).doc(idCita).set(datosCita);
    // Guardar bajo el tatuador
    await this.database.collection(`Tatuador/${uidTatuador}/citas`).doc(idCita).set(datosCita);
  }

  getCitasUsuario(uid: string) {
    return this.database.collection(`Usuarios/${uid}/citas`).valueChanges({ idField: 'id' });
  }

  async guardarResena(resena: any, uidCliente: string, uidTatuador: string) {
    // Crear un id único para la cita
    const idResena = this.database.createId();
    // Datos cita con uid y referencias
    const datosCita = {
      ...resena,
      uidResena: idResena,
      uidCliente,
      uidTatuador,
      fechaCreacion: new Date()
    };
    // Guardar bajo el usuario
    await this.database.collection(`Usuarios/${uidCliente}/reseñas`).doc(idResena).set(datosCita);
    // Guardar bajo el tatuador
    await this.database.collection(`Tatuador/${uidTatuador}/reseñas`).doc(idResena).set(datosCita);
  }

  getResenaTatuador(uid: string) {
    return this.database.collection(`Tatuador/${uid}/reseñas`).valueChanges({ idField: 'id' });
  }

  existeResena(uidCliente: string, uidTatuador: string): Observable<boolean> {
    return this.database.collection(`Usuarios/${uidCliente}/reseñas`, ref => 
      ref.where('uidTatuador', '==', uidTatuador)
    ).valueChanges().pipe(
      map(resenas => resenas.length > 0)
    );
  }

  getResenaUsuario(uidCliente: string): Observable<any[]> {
    return this.database
      .collection(`Usuarios/${uidCliente}/reseñas`)
      .valueChanges({ idField: 'id' }); // opcional: para incluir el ID del documento
  }

  eliminarResena(uidCliente: string, uidTatuador: string, idResena: string): Promise<void> {
    const userRef = this.database.doc(`Usuarios/${uidCliente}/reseñas/${idResena}`);
    const resenaRef = this.database.doc(`Tatuador/${uidTatuador}/reseñas/${idResena}`); // o Tatuadores/{uidTatuador}/reseñas/{idResena} si lo tienes así

    return Promise.all([
      userRef.delete(),
      resenaRef.delete()
    ]).then(() => {
      console.log('Reseña eliminada de usuario y tatuador');
    }).catch(error => {
      console.error('Error eliminando reseña:', error);
      throw error;
    });
  }

  actualizarResena(uidCliente: string, uidTatuador: string, idResena: string, nuevosDatos: any): Promise<void> {
    const userRef = this.database.doc(`Usuarios/${uidCliente}/reseñas/${idResena}`);
    const resenaRef = this.database.doc(`Tatuador/${uidTatuador}/reseñas/${idResena}`); // o "Tatuadores/..." según estructura

    return Promise.all([
      userRef.update(nuevosDatos),
      resenaRef.update(nuevosDatos)
    ])
    .then(() => {
      console.log('Reseña actualizada en usuario y tatuador');
    })
    .catch(error => {
      console.error('Error actualizando reseña:', error);
      throw error;
    });
  }



  updateNombre(data: any, userId: string){
    const docRef = this.database.collection('Usuarios').doc(userId);
    docRef.get().toPromise().then((docSnapshot) => {
      if (docSnapshot && docSnapshot.exists) {
        // El documento existe, procedemos a actualizar
        return docRef.update({ nombre: data });
      } else {
        // El documento no existe, maneja el caso
        return Promise.reject('El documento no existe');
      }
    });
  }

  updateMovil(data: any, userId: string){
    const docRef = this.database.collection('Usuarios').doc(userId);
    docRef.get().toPromise().then((docSnapshot) => {
      if (docSnapshot && docSnapshot.exists) {
        // El documento existe, procedemos a actualizar
        return docRef.update({ movil: data });
      } else {
        // El documento no existe, maneja el caso
        return Promise.reject('El documento no existe');
      }
    });
  }

  getHorasDisponibles(estudioId: string, fecha: string, tatuadorNombre: string, horarioBase: string[]): Observable<string[]> {
    return this.database
      .collection(`Tatuador/${estudioId}/citas`, ref =>
        ref.where('dia', '==', fecha).where('nombreTatuador', '==', tatuadorNombre)
      )
      .valueChanges()
      .pipe(
        map((citas: any[]) => {
          const horasOcupadas = citas.map(c => c.hora);
          return horarioBase.filter(h => !horasOcupadas.includes(h));
        })
      );
  }

}

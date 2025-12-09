import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { idToken } from '@angular/fire/auth';
import { Cita, Evento, Tatuador } from '../model';
import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';

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
    const avatarDocRef = this.database.doc(`Usuarios/${userId}/avatar/avatar`);

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

  async guardarConsulta(cita: any, uidCliente: string, uidTatuador: string) {
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
    await this.database.collection(`Usuarios/${uidCliente}/consulta`).doc(idCita).set(datosCita);
    // Guardar bajo el tatuador
    await this.database.collection(`Tatuador/${uidTatuador}/consulta`).doc(idCita).set(datosCita);
  }

  getCitasUsuario(uid: string) {
    return this.database.collection(`Usuarios/${uid}/citas`).valueChanges({ idField: 'id' });
  }

  async guardarResena(resena: any, uidCliente: string, uidTatuador: string) {
    const tatuadorRef = this.database.doc(`Tatuador/${uidTatuador}`).ref;
    const resenasRef = this.database.collection(`Tatuador/${uidTatuador}/reseñas`);

    const usuarioResenasRef = this.database.collection(`Usuarios/${uidCliente}/reseñas`);

    const idResena = this.database.createId();

    return this.database.firestore.runTransaction(async (transaction) => {
      const tatuadorDoc = await transaction.get(tatuadorRef);
      if (!tatuadorDoc.exists) throw new Error("El tatuador no existe");

      // ✅ Tipos explícitos
      const data = tatuadorDoc.data() as { sumaValoraciones?: number; totalValoraciones?: number; promedio?: number } || {};
      const total = data.totalValoraciones || 0;
      const suma = data.sumaValoraciones || 0;

      const nuevaTotal = total + 1;
      const nuevaSuma = suma + resena.estrella;
      const nuevoPromedio = nuevaSuma / nuevaTotal;

      // ✅ Referencias de reseña
      const resenaDocRefTatuador = resenasRef.doc(idResena).ref;
      const resenaDocRefUsuario = usuarioResenasRef.doc(idResena).ref;

      const resenaData = {
        ...resena,
        uidCliente,
        uidTatuador,
        uidResena: idResena,
        fechaCreacion: new Date()
      };

      // ✅ Guardar reseña en tatuador
      transaction.set(resenaDocRefTatuador, resenaData);

      // ✅ Guardar reseña en usuario
      transaction.set(resenaDocRefUsuario, resenaData);

      // ✅ Actualizar datos del tatuador
      transaction.update(tatuadorRef, {
        sumaValoraciones: nuevaSuma,
        totalValoraciones: nuevaTotal,
        promedio: nuevoPromedio
      });
    });
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

  getTrabajadores(estudioId: string): Observable<any[]> {
    return this.database
      .collection('Tatuador')
      .doc(estudioId)
      .collection('trabajadores')
      .valueChanges({ idField: 'uid' }); // opcional: añade el id de cada trabajador
  }


  eliminarCita(cita: Cita, uidCita:string, userId: string){
    const citaTatuadorRef = this.database
      .collection(`Tatuador/${cita.uidTatuador}/citas`)
      .doc(uidCita);

    const citaUsuarioRef = this.database
      .collection(`Usuarios/${userId}/citas`)
      .doc(uidCita);

    return Promise.all([
      citaTatuadorRef.delete(),
      citaUsuarioRef.delete()
    ])
    .then(() => {
      console.log('✅ Cita eliminada en tatuador y usuario');
    })
    .catch((error) => {
      console.error('❌ Error al eliminar la cita en ambos lugares', error);
      throw error;
    });
  }

  getHorasBloqueadas(estudioId: string, trabajadorId: string, fecha: string): Observable<string[]> {
    const path = `Tatuador/${estudioId}/trabajadores/${trabajadorId}`;
    const campoPlano = `horasReservadas.${fecha}`;
    console.log(campoPlano);
    return this.database.doc(path).valueChanges().pipe(
      map((doc: any) => doc?.[campoPlano] || [])
    );
  }

  getTodosLosAnuncios(): Observable<any[]> {
    // collectionGroup busca en todas las subcolecciones llamadas "anuncios"
    return this.database.collectionGroup('anuncios').valueChanges({ idField: 'id' });
  }

  getEventos(trabajadorId: string, tatuadorId: string): Observable<any[]> {
    const path = `Tatuador/${tatuadorId}/trabajadores/${trabajadorId}/eventos`;
    return this.database.collection(path).valueChanges({ idField: 'id' });
  }

  getFotosTatuador(estudioId: string): Observable<string[]> {
    return this.database
      .collection('Tatuador')           // colección de tatuadores
      .doc(estudioId)                   // documento del tatuador
      .collection('avatar')             // subcolección avatar
      .doc('imagenes')                  // documento que tiene el array de URLs
      .valueChanges()                   // devuelve { urls: [...] }
      .pipe(
        map((doc: any) => doc?.urls || []) // extraemos el array de URLs
      );
  }

  getPromedioValoraciones(tatuadorId: string): Observable<number> {
    return this.database
      .collection(`Tatuador/${tatuadorId}/reseñas`)
      .valueChanges()
      .pipe(
        map((valoraciones: any[]) => {
          if (!valoraciones || valoraciones.length === 0) {
            return 0; // sin valoraciones → promedio 0
          }
          const suma = valoraciones.reduce((acc, v) => acc + (v.puntuacion || 0), 0);
          return suma / valoraciones.length;
        })
      );
  }

   aceptarCita(uidCita: string, userIdTatuador: string, userIdCliente: string, nuevoEstado: string) {
    const citaTatuadorRef = this.database
      .collection('Tatuador')
      .doc(userIdTatuador)
      .collection('citas')
      .doc(uidCita);

    const citaUsuarioRef = this.database
      .collection('Usuarios')
      .doc(userIdCliente)
      .collection('citas')
      .doc(uidCita);

    return Promise.all([
      citaTatuadorRef.update({ estado: nuevoEstado }),
      citaUsuarioRef.update({ estado: nuevoEstado })
    ])
    .then(() => {
      console.log('✅ Estado actualizado en Tatuador y Usuario');
    })
    .catch((error) => {
      console.error('❌ Error al actualizar en ambos lugares', error);
      throw error;
    });
  }

  obtenerTodosLosBocetos(): Observable<any[]> {
    // collectionGroup busca en todas las subcolecciones llamadas 'bocetos'
    return this.database.collectionGroup('bocetos').valueChanges({ idField: 'id' });
  }

  getEvento(): Observable<any[]> {
    return this.database
      .collection(`Eventos/`)
      .valueChanges({ idField: 'id' });
  }

  async guardarFavoritoFoto(uidUsuario: string, tatuadorId: string, fotoUrl: string): Promise<void> {
    const docRef = this.database.doc(`Usuarios/${uidUsuario}/favoritosFotos/${this.database.createId()}`);
    await docRef.set({
      tatuadorId,
      url: fotoUrl,
      fecha: new Date()
    });
  }

  async verificarFavoritoFoto(uidUsuario: string, fotoUrl: string): Promise<boolean> {
    const idFoto = btoa(fotoUrl); // usar la misma clave que al guardar
    const docRef = this.database.doc(`Usuarios/${uidUsuario}/favoritosFotos/${idFoto}`);
    const docSnap = await docRef.get().toPromise();
    return !!docSnap?.exists;
  }

  async eliminarFavoritoFoto(uidUsuario: string, idFavorito: string): Promise<void> {
    const docRef = this.database.doc(`Usuarios/${uidUsuario}/favoritosFotos/${idFavorito}`);

    return docRef.delete()
      .then(() => console.log('✅ Favorito eliminado correctamente:', idFavorito))
      .catch((err) => console.error('❌ Error al eliminar favorito:', err));
  }

   obtenerFavoritosFotos(uidUsuario: string) {
    return this.database.collection(`Usuarios/${uidUsuario}/favoritosFotos`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }


  getCitasDelDia(estudioId: string, trabajadorId: string, fecha: string) {
    // fecha en formato 'YYYY-MM-DD'
    return this.database.collection(`Tatuador/${estudioId}/citas`, ref =>
      ref.where('uidTatuador', '==', estudioId)
         .where('nombreTatuador', '==', trabajadorId) // asegúrate de tener este campo
         .where('dia', '==', fecha)
    ).valueChanges();
  }

  getNoticias(): Observable<any[]> {
    return this.database
      .collection(`Noticias/`)
      .valueChanges({ idField: 'id' });
  }

   isPremium(uid: string): Observable<boolean> {
    return this.database.collection('Usuarios').doc(uid).valueChanges().pipe(
      map((data: any) => {
        return data?.isPremium === true;
      }),
      catchError(() => of(false))
    );
  }

  async updatePremium(userId: string, subscriptionData: any) {
    try {
      const userRef = this.database.collection('Usuarios').doc(userId);

      // Crear un objeto con flags dependiendo del plan comprado
      let flagsUpdate = {
        isPremium: false,
      };

      flagsUpdate.isPremium = true;

      // Actualizar el documento del usuario con la info de suscripción y flags
      await userRef.set({
        suscripcion: subscriptionData,
        ...flagsUpdate
      }, { merge: true });

    } catch (error) {
      console.error('Error actualizando suscripción y flags:', error);
      throw error;
    }
  }

  getEventoPorId(id: string) {
    return this.database.doc<Evento>(`Eventos/${id}`).valueChanges({ idField: 'id' });
  }

  getTatuadoresPorUIDs(uids: string[]) {
    return this.database.collection<Tatuador>(
      'Tatuador',
      ref => ref.where('uid', 'in', uids)
    ).valueChanges({ idField: 'uid' });
  }

}

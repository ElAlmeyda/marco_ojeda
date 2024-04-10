import { Injectable } from '@angular/core';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  constructor(private database: AngularFirestore) { }

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
    console.log(path, id)
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
}

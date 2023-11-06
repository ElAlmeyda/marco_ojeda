import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {

  // Initialize Firebase
  //app = initializeApp(environment.firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  //db = getFirestore(this.app);

  crearUser = {
    nombre: null,
    movil: null,
    correo: null,
    password: null
  }


  constructor() { }

  ngOnInit() {
  }
  /*
  async guardar(){
    console.log(this.crearUser.correo, this.crearUser.movil, this.crearUser.nombre, this.crearUser.password);
    try {
      const docRef = await addDoc(collection(this.db, "users"), {
        nombre: this.crearUser.nombre,
        correo: this.crearUser.correo,
        password: this.crearUser.password,
        movil: this.crearUser.movil
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }*/
}

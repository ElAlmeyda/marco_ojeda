import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import {  Router } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {

  
  crearUser = {
    nombre: '',
    movil: '',
    correo: '',
    password: ''
  }

  usuario: Usuario[]=[];

  correcto = false;


  constructor(private user: UsuariosService, public router: Router) { }

  ngOnInit() {
  }
 


  guardar(){
      this.user.getUsuarios().pipe(
      ).subscribe(async () => {
        this.usuario = this.user.getUsuario();
        const check = await this.user.createUser(this.crearUser.nombre, this.crearUser.correo, this.crearUser.password, this.crearUser.movil);
        if(check){
          alert("Se ha creado su cuenta");
          this.router.navigate(['/folder']);
        } else {
          alert("Ya existe una cuenta asociado a ese correo")
        }
    });
  }
}

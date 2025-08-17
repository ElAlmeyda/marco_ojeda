import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TiendaService } from 'src/app/backend/tienda.service';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Resena, Tatuador, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';

@Component({
  selector: 'app-tatuador',
  templateUrl: './tatuador.page.html',
  styleUrls: ['./tatuador.page.scss'],
})
export class TatuadorPage implements OnInit {

  usuario: Usuario = {
    uid: '',
    nombre: '',
    correo: '',
  };

  tatuador: Tatuador = {
    nombre: '',
    nombreTienda: '',
    telefono: '',
    biografia: '',
    foto: [],
    avatar: '',
    precio: 0,
    uid: '',
  }
  uid='';

  favorito=false;

  avatars: string='';
  diasResumen: string = '';
  horasResumen: string = '';
  resenas!: Resena [];
  estrellaSeleccionada: number = 0;
  mensajeResena: string = '';
  resenaExistente: boolean = false;

  constructor(public auth: FirestoreAuthService, public user: UsuariosService, private route: ActivatedRoute, public tiendaTatuador: TiendaService, public toast: ToastController,
    private router: Router
  ) {
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.usuario.uid = res.uid;
        this.obtenerUsuario();
      } else {
        this.usuario.uid= '';
      }
    });
   }

  ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid') || '';

    this.obtenerTatuador();
  }

   async obtenerUsuario() {
    await this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.usuario.uid);
      if (usuario) {
        this.usuario = usuario;
      }
    });
  }

  async obtenerTatuador() {
    this.tiendaTatuador.getTatuadorById(this.uid).subscribe(async data => {
      if (data) {
        this.tatuador = data;
         this.tiendaTatuador.getAvataresDeTatuador(this.uid).subscribe(avatares => {
          if(avatares)
          this.tatuador.avatar = avatares; // un array sólo con URLs válidas
        });
        if(this.tatuador.fecha)
        this.diasResumen = this.resumirDiasDesdeArray(this.tatuador.fecha);
        if(this.tatuador.hora)
        this.horasResumen = this.resumirHorasDesdeArray(this.tatuador.hora);

       if (this.usuario.uid) {
          this.tiendaTatuador.verificarFavorito(this.usuario.uid, this.uid).then(esFavorito => {
            this.favorito = esFavorito;
          });
        }
        await this.cargarResenas();
        this.verificarSiYaReseno();
      } else {
        console.warn('No se encontró el tatuador');
      }
    });
  }

  async ponerFavorito() {
    if(this.usuario.uid){
      await this.tiendaTatuador.agregarFavorito(this.usuario.uid, this.tatuador);
      this.favorito = true;
    } else {
      this.presentToast("Tienes que iniciar sesion para guardarlo", 'warning');
    }
  }

  async quitarFavorito() {
    if(this.usuario.uid){
      await this.tiendaTatuador.quitarFavorito(this.usuario.uid, this.tatuador.uid);
      this.favorito = false;
    } else {
      this.presentToast("Tienes que iniciar sesion para guardarlo", 'warning');
    }
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color: color
    });

    await toast.present();
  }

  resumirDiasDesdeArray(dias: string[]): string {
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    // Elimina tildes y convierte a minúsculas
    const normalizar = (str: string): string =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const diasNormalizados = dias
      .map(d => normalizar(d.trim()))
      .filter(d => diasSemana.map(normalizar).includes(d));

    // Convertimos los días normalizados a índices
    const indices = diasNormalizados
      .map(d => diasSemana.findIndex(s => normalizar(s) === d))
      .sort((a, b) => a - b);

    if (indices.length === 0) return '';

    // Agrupar días consecutivos
    const rangos: [number, number][] = [];
    let inicio = indices[0];
    let fin = indices[0];

    for (let i = 1; i < indices.length; i++) {
      if (indices[i] === fin + 1) {
        fin = indices[i];
      } else {
        rangos.push([inicio, fin]);
        inicio = fin = indices[i];
      }
    }
    rangos.push([inicio, fin]);

    // Formatear los rangos
    return rangos.map(([start, end]) => {
      if (start === end) {
        return diasSemana[start];
      } else if (end === start + 1) {
        return `${diasSemana[start]}, ${diasSemana[end]}`;
      } else {
        return `${diasSemana[start]} a ${diasSemana[end]}`;
      }
    }).join(', ');
  }

  resumirHorasDesdeArray(horas: string[]): string {
    if (!horas || horas.length === 0) return '';

    // Convertir a números para ordenarlos y comparar
    const horaToNumber = (h: string) => {
      const [hStr, mStr] = h.split(':');
      return parseInt(hStr) * 60 + parseInt(mStr); // minutos totales
    };

    const numberToHora = (n: number) => {
      const h = Math.floor(n / 60);
      const m = n % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const horasNumericas = horas
      .map(h => h.trim())
      .filter(h => /^\d{2}:\d{2}$/.test(h)) // asegurarse que tengan formato correcto
      .map(horaToNumber)
      .sort((a, b) => a - b);

    const rangos: [number, number][] = [];
    let inicio = horasNumericas[0];
    let fin = horasNumericas[0];

    for (let i = 1; i < horasNumericas.length; i++) {
      if (horasNumericas[i] === fin + 60) {
        // siguiente hora exacta → continuar el rango
        fin = horasNumericas[i];
      } else {
        rangos.push([inicio, fin]);
        inicio = fin = horasNumericas[i];
      }
    }
    rangos.push([inicio, fin]);

    // Formatear los rangos
    return rangos.map(([start, end]) => {
      if (start === end) {
        return numberToHora(start);
      } else {
        return `${numberToHora(start)} a ${numberToHora(end)}`;
      }
    }).join(', ');
  }

  async pedirCita(){
    if(this.usuario.uid){
      const uidTatuador = this.tatuador.uid;
      // Navegar a la página 'pedir-cita' pasando el uid como parámetro
      await this.router.navigate(['/pedir-cita', uidTatuador]);
    } else {
      this.presentToast("Tienes que iniciar sesion para pedir una cita", 'warning');
    }
  }

  enviarResena() {
    if (this.estrellaSeleccionada === 0 || !this.mensajeResena.trim()) {
      this.presentToast("Escribaa un comentario o seleccione las estrellas", 'warning');
      return;
    }

    const uidUsuario = this.usuario.uid;
    const uidTatuador = this.tatuador.uid;

    const resena = {
      estrella: this.estrellaSeleccionada,
      mensaje: this.mensajeResena.trim(),
      nombreUsuario: this.usuario.nombre // o displayName
    };

    this.tiendaTatuador.guardarResena(resena, uidUsuario, uidTatuador);

    // Limpia
    this.estrellaSeleccionada = 0;
    this.mensajeResena = '';
    this.resenaExistente = true;
    this.cargarResenas(); // Opcional: recarga
  }

  cargarResenas() {
    const uidTatuador = this.tatuador.uid;
    this.tiendaTatuador.getResenaTatuador(uidTatuador).subscribe(res => {
      this.resenas = res as Resena[];
    });
  }

  getArray(length: number | undefined | null): any[] {
    const safe = Math.max(0, Math.min(5, Number(length) || 0));
    return Array(safe).fill(0);
  }


  verificarSiYaReseno() {
    const uidUsuario = this.usuario.uid;
    const uidTatuador = this.tatuador.uid;
    this.tiendaTatuador.existeResena(uidUsuario, uidTatuador).subscribe(
      (existe) => {
        this.resenaExistente = existe;
      },
      (error) => {
        console.error('Error al verificar reseña:', error);
      }
    );
  }

  seleccionarEstrella(valor: number) {
    this.estrellaSeleccionada = valor;
  }

  abrirRedSocial(red: string, usuario: string) {
    if (!usuario) return;

    let url = '';

    switch (red) {
      case 'instagram':
        url = `https://instagram.com/${usuario}`;
        break;
      case 'facebook':
        url = `https://facebook.com/${usuario}`;
        break;
      case 'tiktok':
        url = `https://www.tiktok.com/@${usuario}`;
        break;
      case 'twitter':
        url = `https://twitter.com/${usuario}`;
        break;
      default:
        return; // No reconocida
    }

    window.open(url, '_blank');
  }

  abrirWhatsapp(telefono: string) {
    if (telefono) {
      const url = `https://wa.me/${telefono}`;
      window.open(url, '_blank');
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Cita, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import 'hammerjs';
import { FirestoreService } from 'src/app/service/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NotificacionService } from 'src/app/service/notificacion.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';
import { ThemeService } from 'src/app/backend/theme.service';
import { take } from 'rxjs';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  imagenSubidaUrl: string[] = ['', '', '', '', '', '']; // Array para las URLs de las fotos subidas
  file: any = []; // Array para almacenar archivos de imagen
  fotoIndex: number = -1;

  uid ='';
  usuario: Usuario = {
    nombre: '',
    uid: '',
    correo: '',
    movil: '',
  };

  correo: string='';
  password: string='';
  showPassword: any;
  correoExistente=false;
  registro=false;
  correoInvalido=false;
  nombre: string='';
  nombreInvcalido=false;
  phone: string='';
  numeroIncorrecto=false;
  usuariosBloqueados: Usuario[] = [];
  temaActual: 'dark' | 'light' = 'dark';

  codigoDescuento: string = '';
  codigoValido: boolean = false;
  codigoTimer: any;

  constructor(public auth: FirestoreAuthService, public user: UsuariosService, private alertController: AlertController,
              private themeService: ThemeService, public firestore: FirestoreService, private loadingCtrl: LoadingController, private afAuth: AngularFireAuth, public toast: ToastController,
              public notificacion: NotificacionService, public translate: TranslateService, public storage: Storage
  ) { 
    this.translate.setDefaultLang('es');
    this.temaActual = this.themeService.getTemaActual();
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
        this.obtenerUsuario();
      } else {
        this.uid= '';
        this.usuario = { nombre: '', uid: '', correo: '', movil: '', avatar: '' };
        this.resetearEstado();
      }
    });
  }

  async cambiarIdioma(lang: string) {
    this.translate.use(lang);
    await this.storage.set('app_language', lang);
  }

  resetearEstado() {
    this.uid = '';
    this.usuario = { nombre: '', uid: '', correo: '', movil: '', avatar: '' };
    this.correo = '';
    this.password = '';
    this.nombre = '';
    this.phone = '';
    this.registro = false;
    this.correoExistente = false;
    this.correoInvalido = false;
    this.nombreInvcalido = false;
    this.numeroIncorrecto = false;
    this.showPassword = false;
  }


  ngOnInit() {
     
  }

  obtenerUsuario() {
    this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.uid);
      if (usuario) {
        this.usuario = usuario;

        // Esta suscripción mantendrá el avatar siempre actualizado
        this.user.getAvatar(usuario.uid).subscribe(url => {
          console.log("Avatar recibido:", url);
          if (url) {
            this.usuario = { ...this.usuario, avatar: url };
          }
        });
      }
    });
  }

  inicioSesion() {
    
    this.user.inicioSesion(this.correo, this.password)
      .then((userCredenciales) => {
        // Inicio de sesión exitoso

        this.presentToast(this.translate.instant('LOGIN.SUCCESS'), 'success');
        const uid = userCredenciales.user?.uid;
        if(uid){
          this.notificacion.inicializar(uid);
        }
      })
      .catch(() => {
        // Error durante el inicio de sesión
        this.presentToast(this.translate.instant('LOGIN.ERROR'), 'danger');
      });
  }

  formatCorreo(){
    const correo = this.correo.trim().toLowerCase();
     this.user.verificarCorreoExistente(correo).subscribe(existe => {
      console.log(existe);
      if(!existe){
        this.registro = true;
        console.log(this.registro, "Rgistro");
      } else {
        this.correoExistente = existe;
      }
    });
  }

  comprobarCorreo(){
    const correo = this.correo.trim().toLowerCase();
    const correoValido = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo)\.(com|es)$/i.test(correo);

    if (!correoValido) {
      this.correoInvalido = true;  // Nuevo flag para mostrar mensaje de error
      return;
    }
    this.correoInvalido = false;  // Es válido, continúa con la verificación en la base de datos
  }

  comprobarNombre(){
    if(this.nombre.length < 3){
      this.nombreInvcalido = true;
    } else {
      this.nombreInvcalido = false;
    }
  }

  comprobarNumero() {
    const phoneRegex = /^\+\d{1,2}[0-9]{9}$/;
    this.numeroIncorrecto = !phoneRegex.test(this.phone);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  isValidPassword(): boolean {
    const passwordPattern = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{6,}/;
    return passwordPattern.test(this.password);
  }

  async crearUsuario(){
    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('LOGIN.CREATING_PROFILE'),
      spinner: 'circles',
      backdropDismiss: false
    });

    await loading.present();

    try {
      // 1. Crear usuario
      const usuario = await this.user.createUser(this.nombre, this.correo, this.password, this.phone);
      if (!usuario) throw new Error('Error creando el usuario');

      const user = await this.afAuth.currentUser;

      try {
        if(user)
        await user.sendEmailVerification();
      } catch (error) {
        console.error('Error enviando correo de verificación:', error);
      }
      // ✅ 8. Ocultar carga después de subir todo correctamente
      await loading.dismiss();
    } catch (error) {
      console.error('Error en el registro:', error);
      // ⚠️ Ocultar carga en caso de error también
      await loading.dismiss();
      // Puedes mostrar aquí un toast o alerta si quieres notificar el fallo
    }
  }

   async cambioContrasena(){
    const user = await this.afAuth.currentUser;
    if (user) {
      if (!user.emailVerified) {
          const alert = await this.alertController.create({
            header: this.translate.instant('LOGIN.CHANGE_HEADER'),
            message: this.translate.instant('LOGIN.CHANGE_MESSAGE'),
            buttons: [
              {
                text: this.translate.instant('LOGIN.CANCEL'),
                role: 'cancel',
                handler: async () => {

                }
              },
              {
                text: this.translate.instant('LOGIN.ACCEPT'),
                handler: async () => {
                    await this.auth.resetPassword(this.correo);
                    this.presentToast(this.translate.instant('LOGIN.MAIL_SENT'), 'success');
                  }
                }
            ],
          });
  
          await alert.present();
      }
    } else {
      const errorAlert = await this.alertController.create({
        header: this.translate.instant('LOGIN.ERROR_HEADER'),
        message: this.translate.instant('LOGIN.ERROR_MESSAGE'),
        buttons: [this.translate.instant('LOGIN.OK')],
      });
      await errorAlert.present();
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

  onFileSelectedAvatar(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    // Aquí puedes hacer la subida a servidor o firebase
    this.subirFotoAvatar(file);
  }

  async subirFotoAvatar(file: File) {
    try {
      const loading = await this.mostrarLoading(
        this.translate.instant('AVATAR.UPLOADING')
      );

      // Preview local inmediato
      const reader = new FileReader();
      reader.onload = (e) => {
        this.usuario = { ...this.usuario, avatar: e.target?.result as string };
      };
      reader.readAsDataURL(file);

      const urls = await this.user.subirImagen([file], this.usuario.uid);
      if (!urls || !urls[0]) throw new Error('No se recibió URL');

      // Guarda en Firestore — getAvatar() lo detectará y actualizará
      await this.user.actualizarAvatar(this.usuario.uid, urls[0]);

      // ✅ Quita la línea: this.usuario = { ...this.usuario, avatar: urls[0] }
      // ya lo hará la suscripción de getAvatar automáticamente

      loading.dismiss();
      this.presentToast(this.translate.instant('AVATAR.UPDATED'), 'success');
    } catch (error) {
      console.error(error);
      this.presentToast(this.translate.instant('AVATAR.ERROR'), 'danger');
    }
  }


  async mostrarLoading(mensaje: string = this.translate.instant('LOADING.PROCESSING')) {
    const loading = await this.loadingCtrl.create({
      message: mensaje,
      spinner: 'circles',
      backdropDismiss: false,
      cssClass: 'mi-loading-personalizado'
    });
    await loading.present();
    return loading;
  }

  cambiarTema(tema: 'dark' | 'light') {
    this.temaActual = tema;
    this.themeService.cambiarTema(tema);
  }

  codigoSorteo: string = '';
  codigoSorteoValido: boolean = false;

  verificarCodigoSorteo() {
    this.codigoSorteoValido = false;
    clearTimeout(this.codigoTimer);

    const codigo = this.codigoSorteo?.trim().toUpperCase();

    if (!codigo) {
      return;
    }

    this.codigoTimer = setTimeout(() => {
      this.firestore.getWhere('codigosSorteo', 'codigo', '==', codigo)
        .pipe(take(1))
        .subscribe({
          next: (docs: any[]) => {
            const doc = docs?.[0];
            const valido = docs?.length > 0 && doc?.activo === true;
            this.codigoSorteoValido = valido;
            if (valido) {
              this.codigoSorteo = codigo;
              // Aquí puedes guardar que el usuario participa en el sorteo
              // por ejemplo: this.usuario.codigoSorteo = codigo;
            }
          },
          error: () => {
            this.codigoSorteoValido = false;
          }
        });
    }, 600);
  }

  
}
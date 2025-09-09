import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { NavController, ToastController } from '@ionic/angular';
import { TiendaService } from 'src/app/backend/tienda.service';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Cita, Horario, Tatuador, Trabajador, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-pedir-cita',
  templateUrl: './pedir-cita.page.html',
  styleUrls: ['./pedir-cita.page.scss'],
})
export class PedirCitaPage implements OnInit {

  usuario: Usuario = {
    uid: '',
    nombre: '',
    correo: '',
  };
  
  datosConsulta = {
    nombre: '',
    diseno: '',
    ubicacion: '',
    tamano: '',
    color: '',
    notas: '',
    tatuador: '',
    telefono: '',
    correo: ''
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
  duracionCita = 0;
  uid=''
  cita: Cita = {} as Cita;consultaTrue: any;
;
  horaSeleccionada: string = '';

  diasResumen: string = '';
  acepto= false;
  primerPaso=true;
  segundoPaso=false;
  tercerPaso=false;
  fechaMin='';
  fechaSeleccionada: string = '';
  fechasDisponibles: string[] = [];
  horasLibres: string[] = [];
  tatuadorSeleccionado!: Trabajador;
  mensaje='';
  tipo='';
  zona='';
  alergias='';
  estilo='';
  bocetoFile: File | null = null;
  bocetoPreview: string | null = null;
  trabajadores: Trabajador[] = [];
  horasBloqueadas: string[] = [];
  eventos: any[] = [];
  diasConEventos: { [fecha: string]: any } = {};
  isPremium=false;

  constructor(public auth: FirestoreAuthService, public user: UsuariosService, private route: ActivatedRoute, public tiendaTatuador: TiendaService, public toast: ToastController,
      private router: Router, public navCtrl: NavController, public firestore: FirestoreService) {
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        
        console.log(this.fechaMin);
        this.usuario.uid = res.uid;
        this.obtenerUsuario();
        
      } else {
        this.usuario.uid= '';
      }
    });
   }

 ngOnInit() {
  const hoy = new Date();
  this.fechaMin = hoy.toISOString().split('T')[0];
  this.fechaSeleccionada = this.fechaMin;       
  this.uid = this.route.snapshot.paramMap.get('uid') || '';
  this.obtenerTatuador();
  this.route.queryParams.subscribe(params => {
    this.consultaTrue = params['consulta'];
    console.log('Query Params:', params);
  });
}

  async obtenerUsuario() {
    await this.user.getUsuarios().subscribe(async () => {
      const usuario = this.user.getUsuarioConcreto(this.usuario.uid);
      if (usuario) {
        this.usuario = usuario;
        this.isPremium = await this.user.isPremium(this.usuario.uid);
      }
    });
  }

  async obtenerTatuador() {
    this.tiendaTatuador.getTatuadorById(this.uid).subscribe(data => {
      if (data) {
        this.tatuador = data;
        console.log(this.tatuador);

        this.tiendaTatuador.getTrabajadores(this.tatuador.uid).subscribe(trabajadores => {
          this.trabajadores = trabajadores;

          // Si solo hay un trabajador, lo seleccionamos automáticamente
          if (trabajadores.length === 1) {
            this.tatuadorSeleccionado = trabajadores[0].nombre;
            this.seleccionarTrabajador(this.trabajadores[0]);
          }

          // Determinar fecha mínima a mostrar en el calendario
          const hoy = new Date();
          let fechaDisponibleDesde = hoy;

          if (this.tatuador.fechaDisponibleDesde) {
            const fechaTatuador = new Date(this.tatuador.fechaDisponibleDesde);
            // Tomamos la fecha más tardía entre hoy y la del tatuador
            fechaDisponibleDesde = fechaTatuador > hoy ? fechaTatuador : hoy;
          }

          // Convertimos a ISO para usar en ion-datetime
          this.fechaMin = fechaDisponibleDesde.toISOString();
          let fechaTatuador: Date;
          // Generar fechas disponibles a partir de esa fecha
          if (this.tatuador.fecha && this.tatuador.fecha.length > 0) {
            fechaTatuador = new Date(this.tatuador.fecha[0]); // tomamos la primera fecha
          } else {
            fechaTatuador = fechaDisponibleDesde; // fallback si no hay fecha
          }
        });

      } else {
        console.warn('No se encontró el tatuador');
      }
    });
  }

  get highlightedDates() {
    return this.fechasDisponibles.map(fecha => {
      if (this.diasConEventos[fecha]) {
        const tipo = this.diasConEventos[fecha].tipo;
        return {
          date: fecha,
          textColor: '#fff',
          backgroundColor: '#ff9800' , // naranja o rojo
          border: '1px solid #000'
        };
      } else {
        return {
          date: fecha,
          textColor: '#ffffff',
          backgroundColor: '#28a745',
          border: '1px solid #1e7e34',
        };
      }
    });
  }


  seleccionarTrabajador(trabajador: any) {
    this.tatuadorSeleccionado = trabajador;
    console.log('Trabajador seleccionado:', this.tatuadorSeleccionado);

    // Reset solo los datos de la cita que no afectan al cálculo de horas
    this.estilo = '';
    this.tipo = '';
    this.zona = '';
    this.mensaje = '';
    this.alergias = '';
    this.bocetoFile = null;
    this.bocetoPreview = null;

    // NO resetear: fechaSeleccionada, horasLibres, etc.
    // Solo si quieres, puedes mantener horaSeleccionada vacía:
    this.horaSeleccionada = '';

    // Generar fechas disponibles según el trabajador
    if (this.tatuador.horario) {
    this.fechasDisponibles =  this.fechasDisponibles = this.generarFechasDesdeHorario(
          this.tatuador.horario,   // el horario del tatuador
          180,                     // número de días hacia adelante
          this.tatuadorSeleccionado.diasLibres  // fechas bloqueadas
        );
    }

    // Recalcular horas disponibles del trabajador
    this.obtenerHoraDisponibles();
    this.obtenerEventosDelTrabajador();
  }

  generarFechasDesdeHorario(horario: Horario[], diasAdelante: number = 180, diasLibres: string[] = []): string[] {
    const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const hoy = new Date();
    const fechasDisponibles: string[] = [];

    // Filtrar solo los días con horario válido (inicio y fin)
    const diasTrabaja = horario
      .filter((h: Horario) => h.inicio && h.fin)
      .map((h: Horario) => h.dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

    for (let i = 0; i <= diasAdelante; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() + i);
      const nombreDia = diasSemana[fecha.getDay()];

      const fechaStr = fecha.toISOString().split("T")[0];
      if (diasTrabaja.includes(nombreDia) && !diasLibres.includes(fechaStr)) {
        fechasDisponibles.push(fechaStr);
      }
    }

    return fechasDisponibles;
  }


  // Función para ion-datetime → habilitar solo las fechas en el array
  habilitarFecha = (fechaIso: string) => {
    const fecha = new Date(fechaIso);

    // Comparamos solo la fecha sin la hora
    return this.fechasDisponibles.some(f => {
      const fDate = new Date(f);
      return fDate.toDateString() === fecha.toDateString();
    });
  };

  async guardarCita() {
    console.log(this.acepto);
    if (!this.cita) this.cita = {} as Cita;

    if(!this.acepto){
      this.presentToast("Debes aceptar las condiciones", "danger");
      return; // salir si no acepta
    }

    if(this.usuario.movil && this.horaSeleccionada && this.estilo && this.mensaje && this.tipo){
      // Rellenar la cita
      this.cita.correo = this.usuario.correo;
      this.cita.nombreUser = this.usuario.nombre;
      this.cita.movil = this.usuario.movil;
      this.cita.dia = this.fechaSeleccionada;
      this.cita.hora = this.horaSeleccionada;
      this.cita.nombreTatuador = this.tatuadorSeleccionado.nombre;
      this.cita.estilo = this.estilo;
      this.cita.mensaje = this.mensaje;
      this.cita.tipo = this.tipo;
      this.cita.zona = this.zona;
      this.cita.alergia = this.alergias;

      try {
        // Subir boceto si existe
        if (this.bocetoFile) {
          const urls = await this.user.subirImagenBoceto([this.bocetoFile], this.usuario.uid, this.tatuador.uid);
          this.cita.boceto = urls[0]; // Guardamos la URL
        }

        // Guardar cita
        await this.tiendaTatuador.guardarCita(this.cita, this.usuario.uid, this.tatuador.uid);
        await this.presentToast("La cita ha sido realizada, espera a que el tatuador conteste.", "success");

        try {
          if (!this.isPremium) {
            await this.mostrarInterstitial();
          }
        } catch (err) {
          console.warn("Interstitial no se pudo mostrar:", err);
        }


        // Resetear campos
        this.cita = {} as Cita;
        this.horaSeleccionada = '';
        this.estilo = '';
        this.mensaje = '';
        this.tipo = '';
        this.tatuadorSeleccionado.nombre = '';
        this.fechaSeleccionada = this.fechaMin;
        this.bocetoFile = null;
        this.bocetoPreview = null;

        this.router.navigate(['/tabs/cita']);
      } catch (err) {
        console.error(err);
        this.presentToast("Error al guardar la cita.", "danger");
      }
    }
  }

  async guardarConsulta() {
    console.log(this.acepto);
    if (!this.cita) this.cita = {} as Cita;

    if(!this.acepto){
      this.presentToast("Debes aceptar las condiciones", "danger");
      return; // salir si no acepta
    }

    if(this.usuario.movil){
      // Rellenar la cita
      this.datosConsulta.nombre = this.usuario.nombre
      this.datosConsulta.telefono = this.usuario.movil
      this.datosConsulta.correo = this.usuario.correo
      this.datosConsulta.diseno = this.estilo
      this.datosConsulta.notas = this.mensaje 
      this.datosConsulta.tamano = this.tipo
      this.datosConsulta.tatuador = this.tatuadorSeleccionado.nombre
      this.datosConsulta.ubicacion = this.zona

      try {
        // Subir boceto si existe
        // Guardar cita
        await this.tiendaTatuador.guardarConsulta(this.datosConsulta, this.usuario.uid, this.tatuador.uid);
        if (!this.isPremium) {
          await this.mostrarInterstitial();
        }

        await this.presentToast("La consulta ha sido realizada, espera a que el tatuador conteste.", "success");

        this.router.navigate(['/tabs/folder/' + this.usuario.uid]);
      } catch (err) {
        console.error(err);
        this.presentToast("Error al guardar la consulta.", "danger");
      }
    }
  }

  async mostrarInterstitial() {
    try {
        const adId = Capacitor.getPlatform() === 'ios' 
          ? 'ca-app-pub-1532953644939730/3954231769' 
          : 'ca-app-pub-1532953644939730/4820289551';

        await AdMob.prepareInterstitial({ adId });
        await AdMob.showInterstitial();

        const listener = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
          listener.remove();
        });

      } catch (error) {
        console.error('Error mostrando anuncio:', error);
      }
    }


  siguiente(){
    this.primerPaso = false;
    this.segundoPaso =true;
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

  volver(){
    if(this.primerPaso){
      this.navCtrl.navigateForward(['/tatuador', this.tatuador.uid]);
    } else {
      this.primerPaso = true;
      this.segundoPaso = false;
    }
  }

  async obtenerHoraDisponibles() {
    if (!this.tatuadorSeleccionado?.uid || !this.duracionCita) return;

    const estudioId = this.tatuador.uid;
    const trabajadorId = this.tatuadorSeleccionado.uid;
    const fecha = this.fechaSeleccionada.split('T')[0];;

    // Revisar si hay eventos del día
    const evento = this.diasConEventos[fecha];
    this.cita.direccion = evento ? evento.ciudad : this.tatuador.ciudad;
    if (evento) this.presentToast(`⚠️ El tatuador estará en ${evento.ciudad}`, 'warning');

    const diasSemanaArray = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];

    // Aseguramos que sea Date
    const fechas = new Date(this.fechaSeleccionada);

    // Ahora sí funciona getDay()
    const nombreDia = diasSemanaArray[fechas.getDay()];


    // Obtener el horario de ese día
    const horarioDelDia = this.tatuador?.horario?.find(
        h => h.dia.toLowerCase() === nombreDia
      );


    // Generar horario base solo si existe
    const horarioBase: string[] = horarioDelDia 
      ? this.generarHorasEntre(horarioDelDia.inicio, horarioDelDia.fin)
      : [];
      
    // 1️⃣ Traer horas bloqueadas
    this.firestore.getHorasBloqueadas(estudioId, trabajadorId, fecha)
      .subscribe(horasBloqueadas => {
        this.horasBloqueadas = horasBloqueadas;
        console.log(this.horasBloqueadas);

        // 2️⃣ Traer todas las citas del día
        this.firestore.getCitasDelDia(estudioId, this.tatuadorSeleccionado.nombre, fecha)
          .subscribe((citasDelDia: any[]) => {

            // 3️⃣ Calcular rangos ocupados
            const rangosOcupados: { inicio: Date, fin: Date }[] = citasDelDia.map(c => {
              const [h, m] = c.hora.split(':').map(Number);
              const inicio = new Date(fecha);
              inicio.setHours(h, m);
              const duracion = c.duracion ?? 80;
              const buffer = 15;
              const fin = new Date(inicio.getTime() + (duracion + buffer) * 60000);
              return { inicio, fin };
            });

            // 4️⃣ Obtener horas base del tatuador
            this.firestore.getHorasDisponibles(
              estudioId, fecha, this.tatuadorSeleccionado.nombre, horarioBase ?? []
            ).subscribe(horasDisponibles => {
              const fechaSeleccionadaDate = new Date(fecha);

              // Filtrar horas pasadas y quitar la última (cierre)
              let horasFiltradas = horasDisponibles
                .slice(0, horasDisponibles.length - 1)
                .filter(hora => {
                  const [h, m] = hora.split(':').map(Number);
                  return fechaSeleccionadaDate > new Date() ||
                        (h > new Date().getHours() || (h === new Date().getHours() && m > new Date().getMinutes()));
                });

              // 5️⃣ Filtrar según duración, bloqueadas y citas previas
              this.horasLibres = horasFiltradas.filter(hora => {
                const [h, m] = hora.split(':').map(Number);
                const inicio = new Date(fechaSeleccionadaDate);
                inicio.setHours(h, m);

                const finNuevaCita = new Date(inicio.getTime() + (this.duracionCita + 15) * 60000);

                const seSolapa = rangosOcupados.some(rango =>
                  inicio < rango.fin && finNuevaCita > rango.inicio
                );

                return !this.horasBloqueadas.some(hBloq => {
                  const [hB, mB] = hBloq.split(':').map(Number);
                  const inicioBloq = new Date(fechaSeleccionadaDate);
                  inicioBloq.setHours(hB, mB);

                  const finBloq = new Date(inicioBloq.getTime() + 60 * 60000);

                  return inicio >= inicioBloq && inicio < finBloq;
                }) && !seSolapa;
              });

              // Ordenar cronológicamente
              this.horasLibres.sort((a, b) => {
                const [ah, am] = a.split(':').map(Number);
                const [bh, bm] = b.split(':').map(Number);
                return ah * 60 + am - (bh * 60 + bm);
              });

              console.log("Horas libres considerando duración y citas previas:", this.horasLibres);
            });
          });
      });
  }

  generarHorasEntre(inicio: string, fin: string): string[] {
    const horas: string[] = [];
    let [hInicio, mInicio] = inicio.split(':').map(Number);
    const [hFin, mFin] = fin.split(':').map(Number);

    while (hInicio < hFin || (hInicio === hFin && mInicio < mFin)) {
      horas.push(`${hInicio.toString().padStart(2,'0')}:${mInicio.toString().padStart(2,'0')}`);
      mInicio += 15; // aumentar cada hora, puedes cambiar si quieres intervalos menores
      if (mInicio >= 60) {
        mInicio = 0;
        hInicio++;
      }
    }

    return horas;
  }


  obtenerEventosDelTrabajador() {
    if (!this.tatuadorSeleccionado?.uid) return;
    this.firestore.getEventos(this.tatuadorSeleccionado.uid, this.tatuador.uid)
      .subscribe(eventos => {
        this.eventos = eventos || [];
        console.log("Eventos", this.eventos);
        this.marcarFechasOcupadas();
      });
  }

  marcarFechasOcupadas() {
    this.diasConEventos = {}; // inicializamos

    this.eventos.forEach(evento => {
      const inicio = new Date(evento.fechaInicio.seconds * 1000);
      const fin = new Date(evento.fechaFin.seconds * 1000);

      // Generamos todos los días entre fechaInicio y fechaFin
      for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
        const fechaStr = d.toISOString().split('T')[0];
        this.diasConEventos[fechaStr] = evento;
      }
    });
  }

  onDateSelected(fecha: string) {
    this.fechaSeleccionada = fecha;

    const evento = this.diasConEventos[fecha];
    if (evento) {
      // Mostrar alerta de ciudad temporal
      this.presentToast(`⚠️ El tatuador estará en ${evento.ciudad}`, 'warning');

      // Actualizar dirección de la cita
      this.cita.direccion = evento.ciudad;
    } else {
      // Dirección normal
      this.cita.direccion = this.tatuador.ciudad;
    }

    // Actualizar horas disponibles según trabajador y fecha
    this.obtenerHoraDisponibles();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.bocetoFile = file;

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.bocetoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  actualizarDuracionHoras() {
    switch (this.tipo) {
      case 'Chico': this.cita.duracion = 80; break;
      case 'Mediano': this.cita.duracion = 180; break;
      case 'Grande': this.cita.duracion = 420; break;
      case 'Proyecto': this.cita.duracion = 480; break;
      case 'Retoque': this.cita.duracion = 60; break;
      case 'Sesion': this.cita.duracion = 240; break;
      default: this.cita.duracion = 60;
    }

    this.duracionCita = this.cita.duracion; // Guardamos duración seleccionada

    // Recalcular horas disponibles solo si hay fecha y trabajador seleccionados
    if (this.fechaSeleccionada && this.tatuadorSeleccionado?.uid) {
      this.obtenerHoraDisponibles();
    }
  }

  
}

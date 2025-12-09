

export interface Usuario {
    uid: string;
    nombre:string;
    correo:string;
    movil?:string;
    avatar?:string;
    token?:string;
}


export interface Tatuador {
    nombre: string;
    nombreTienda: string;
    telefono: string;
    biografia: string;
    foto?: string[];
    estilos?: string[];
    avatar: string;
    precio: number;
    uid: string;
    fecha?:string[];
    hora?:string[];
    fav?: boolean;
    horario?: Horario[];
    ciudad?: string;
    facebook?: string;
    latitude?: number;
    longitude?: number;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    distancia?: string;
    web?: string;
    consentimientoUrl?: string;
    trabajadores?: string[];
    fechaDisponibleDesde?: string;
    promedio?: number;
    objetivos?: boolean [];    
    isPremium?: boolean;
}


export interface Cita {
    nombreUser: string;
    nombreTatuador: string;
    movil: string;
    hora: string;
    dia: string;
    estilo: string;
    tipo:string;
    mensaje:string;
    correo:string;
    uidCita:string;
    estado?:string;
    uidTatuador?:string;
    tatuador?: Tatuador;
    direccion?: string;
    zona?: string;
    alergia?: string;
    boceto?: string;
    consulta?: string;
    duracion: number;      // duración real en minutos
    descanso: number;
}

export interface Resena {
    id?: string;
    estrella: number;
    mensaje: string;
    nombreUsuario: string;
    imagen: string;
    nombreTatuador?: string;
    uidTatuador?: string;

}

export interface Trabajador {
    uid: string;
    nombre: string;
    horario: string;
    diasLibres: string[];
    foto?: string;
}

export interface Ofertas {
    uid: string;
    uidTatuador: string;
    titulo: string;
    descripcion: string;
    imagenUrl: string;
    tatuador: Tatuador;
}

export interface Noticia {
  id?: string;
  titulo: string;
  descripcion: string;
  fecha?: any;   // Timestamp de Firestore
  imagenes?: string;
}

export interface Horario {
  dia: string;
  turnos: Turno[];
}

export interface Turno {
  inicio: string;
  fin: string;
}

export interface Dia {
  nombre: string;
  activo: boolean;
  turnos: Turno[];   // 👈 varios tramos horarios
  horas?: string[];  // opcional, si la sigues usando para el select
}

export interface Evento {
  id?: string;
  titulo?: string;
  descripcion?: string;
  fecha?: any;
  lugar?: string;
  tatuadores?: string[]; // <<--- importante
}

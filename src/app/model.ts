

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
  filter(arg0: (h: any) => any): unknown;
  dia: string;
  inicio: string;
  fin: string;
}
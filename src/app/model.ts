

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
    ciudad?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    trabajadores?: string[];
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
    uid:string;
    estado?:string;
    uidTatuador?:string;
    tatuador?: Tatuador;
}

export interface Resena {
    id?: string;
    puntuacion: number;
    mensaje: string;
    nombreUsuario: string;
    nombreTatuador?: string;
    uidTatuador?: string;
}
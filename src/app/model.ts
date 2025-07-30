

export interface Usuario {
    uid: string;
    nombre:string;
    correo:string;
    movil?:string;
    avatar?:string;
    token?:string;
}


export interface Tienda {
    nombre: string;
    descripcion: string;
    foto: string;
    precio: number;
    id: string;
    favorito?: boolean;
}


export interface Cita {
    nombre: string;
    servicio: string;
    movil: string;
    dentista: string;
    dia: string;
    hora: string;
    estado:string;
    id: string;
    uid:string;
}
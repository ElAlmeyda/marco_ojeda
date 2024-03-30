

export interface Usuario {
    uid: string;
    nombre:string;
    correo:string;
    movil:string;
    password:string;
    rol:string;
}

export interface Producto {
    nombre: string;
    descripcion: string;
    foto: string;
    precio: number;
    id: string;
}

export interface Blog {
    [x: string]: unknown;
    titulo: string;
    descripcion: string;
    foto: string;
    id: string;
    fecha: Date;
}

export interface Empleado {
    nombre: string;
    descripcion: string;
    foto: string;
    tipo: string;
    id: string;
}


export interface Usuario {
    nombre:string;
    correo:string;
    password:string;
    movil:string;
    id: string;
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
    nombre: string;
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
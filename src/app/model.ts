

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

export interface Pedido {
    [x: string]: any;
    cliente: Usuario;
    productos: ProductoPedido [];
    precioTotal: number;
    estado: string;
    id: string;
}

export interface ProductoPedido {
    producto: Producto;
    cantidad: number;
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

export interface Urgencia {
    nombre: string;
    movil: string;
    fecha: string;
    enfermedad: string;
    medicamento: string;
    embarazo: boolean;
    alergias: string;
    sintomas:string;
    foto: string;
    imagenUrl: string;
    id: string;
}

export interface Fotos {
    planta: string;
    imagen: string;
    id?:  string;
}
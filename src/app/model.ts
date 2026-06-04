

export interface Usuario {
    uid: string;
    nombre:string;
    correo:string;
    movil:string;
    password:string;
    rol:string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagenUrl: string;
}

export interface Blog {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagenUrl: string;
  categoria: string;
  fecha: string;
}

export interface Empleado {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  imagenUrl: string;
}

export interface Pedido {
    cliente: Usuario;
    clienteId: string;
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

export interface Planta {
    id: string; 
    label: string;
    nombre: string; 
    desc: string;
}
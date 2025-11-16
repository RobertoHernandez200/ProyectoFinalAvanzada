
export interface Alquimista {
  ID: number;
  Nombre: string;
  Rango: string;
  Especialidad: string;
  CreadoEn?: string;
}

export interface Mision {
  ID: number;
  Titulo: string;
  Descripcion: string;
  Estado: string;
  AlquimistaID: number;
  CreadoEn?: string;
}

export interface Material {
  ID: number;
  Nombre: string;
  Tipo: string;
  Cantidad: number;
  Descripcion: string;
  CreadoEn?: string;
}

export interface Transmutacion {
  ID: number;
  Descripcion: string;
  Resultado: string;
  Costo: string;
  AlquimistaID: number;
  MisionID: number;
  CreadoEn?: string;
}

export interface Auditoria {
  ID: number;
  Accion: string;
  Entidad: string;
  EntidadID: number;
  Descripcion: string;
  CreadoEn?: string;
}

export interface Usuario {
  ID: number;
  Nombre: string;
  Correo: string;
  Rol: "alquimista" | "supervisor";
}

export interface CredencialesLogin {
  Correo: string;
  Password: string;
}

export interface CredencialesRegistro {
  Nombre: string;
  Correo: string;
  Password: string;
  Rol: "alquimista" | "supervisor";
}

export interface RegistroResponse {
  mensaje: string;
  usuario: Usuario;
}

export interface LoginResponse {
  token: string;
}

export interface JwtPayload {
  user_id: number;
  rol: "alquimista" | "supervisor";
  exp: number;
}

// Enums
export enum Rol {
  ADMIN = "ADMIN",
  VETERINARIO = "VETERINARIO",
  ASISTENTE = "ASISTENTE",
  RECEPCIONISTA = "RECEPCIONISTA",
  PROPIETARIO = "PROPIETARIO",
}

export enum EstadoCita {
  PENDIENTE = "PENDIENTE",
  CONFIRMADA = "CONFIRMADA",
  CANCELADA = "CANCELADA",
  COMPLETADA = "COMPLETADA",
}

export enum TipoServicio {
  CONSULTA = "CONSULTA",
  CIRUGIA = "CIRUGIA",
  VACUNACION = "VACUNACION",
  DESPARASITACION = "DESPARASITACION",
  EXAMEN = "EXAMEN",
  OTRO = "OTRO",
}

export enum EstadoFactura {
  PENDIENTE = "PENDIENTE",
  PAGADA = "PAGADA",
  ANULADA = "ANULADA",
  VENCIDA = "VENCIDA",
}

export enum MetodoPago {
  EFECTIVO = "EFECTIVO",
  TARJETA = "TARJETA",
  TRANSFERENCIA = "TRANSFERENCIA",
  CHEQUE = "CHEQUE",
  OTRO = "OTRO",
}

export enum TipoEvento {
  FERIA = "FERIA",
  CONCURSO = "CONCURSO",
  EXPOSICION = "EXPOSICION",
  CLINICA = "CLINICA",
  OTRO = "OTRO",
}

export enum UnidadMedida {
  UNIDAD = "UNIDAD",
  CAJA = "CAJA",
  FRASCO = "FRASCO",
  AMPOLLA = "AMPOLLA",
  SOBRE = "SOBRE",
  OTRO = "OTRO",
}

// Interfaces
export interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  rol: Rol
  clinicaId: number
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Clinica {
  id: number
  nombre: string
  direccion: string
  telefono: string
  email: string
  logo?: string
  createdAt: Date
  updatedAt: Date
}

export interface Veterinario {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  especialidad: string
  licencia: string
  clinicaId: number
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Propietario {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
  clinicaId: number
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Caballeriza {
  id: number
  nombre: string
  direccion: string
  telefono: string
  email: string
  propietarioId: number
  clinicaId: number
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Caballo {
  id: number
  nombre: string
  raza: string
  color: string
  sexo: string
  fechaNacimiento: Date
  propietarioId: number
  caballerizaId: number | null
  clinicaId: number
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HistoriaClinica {
  id: number
  fecha: Date
  motivo: string
  diagnostico: string
  tratamiento: string
  observaciones: string
  caballoId: number
  veterinarioId: number
  clinicaId: number
  createdAt: Date
  updatedAt: Date
}

export interface Cita {
  id: number
  fecha: Date
  hora: string
  motivo: string
  estado: EstadoCita
  caballoId: number
  veterinarioId: number
  clinicaId: number
  createdAt: Date
  updatedAt: Date
}

export interface Servicio {
  id: number
  nombre: string
  descripcion: string
  precio: number
  tipo: TipoServicio
  duracion: number
  clinicaId: number
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface InventarioItem {
  id: number
  nombre: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  unidadMedida: UnidadMedida
  fechaVencimiento?: Date
  clinicaId: number
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Factura {
  id: number
  fecha: Date
  total: number
  estado: EstadoFactura
  metodoPago: MetodoPago
  propietarioId: number
  caballoId: number
  clinicaId: number
  createdAt: Date
  updatedAt: Date
  items: FacturaItem[]
}

export interface FacturaItem {
  id: number
  facturaId: number
  servicioId?: number
  inventarioId?: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  descripcion: string
  createdAt: Date
  updatedAt: Date
}

export interface Evento {
  id: number
  nombre: string
  descripcion: string
  fechaInicio: Date
  fechaFin: Date
  ubicacion: string
  tipo: TipoEvento
  clinicaId: number
  createdAt: Date
  updatedAt: Date
}

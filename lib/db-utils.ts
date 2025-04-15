import type { Database } from "./database.types"
import type {
  Caballo,
  Propietario,
  Caballeriza,
  HistoriaClinica,
  Cita,
  ItemInventario,
  Factura,
  Evento,
  Veterinario,
  Servicio,
  Clinica,
  Usuario,
} from "./types"

// Convertir de DB a tipos de la aplicación
export const dbToCaballo = (dbCaballo: Database["public"]["Tables"]["caballos"]["Row"]): Caballo => {
  return {
    id: dbCaballo.id,
    nombre: dbCaballo.nombre,
    raza: dbCaballo.raza,
    edad: dbCaballo.edad,
    sexo: dbCaballo.sexo,
    color: dbCaballo.color,
    numeroChip: dbCaballo.numero_chip,
    propietarioId: dbCaballo.propietario_id,
    caballerizaId: dbCaballo.caballeriza_id,
    ultimaRevision: dbCaballo.ultima_revision || undefined,
    clinicaId: dbCaballo.clinica_id,
  }
}

export const dbToPropietario = (dbPropietario: Database["public"]["Tables"]["propietarios"]["Row"]): Propietario => {
  return {
    id: dbPropietario.id,
    nombre: dbPropietario.nombre,
    telefono: dbPropietario.telefono,
    email: dbPropietario.email,
    direccion: dbPropietario.direccion || "",
    cedula: dbPropietario.cedula || "",
    rif: dbPropietario.rif || "",
    clinicaId: dbPropietario.clinica_id,
  }
}

export const dbToCaballeriza = (dbCaballeriza: Database["public"]["Tables"]["caballerizas"]["Row"]): Caballeriza => {
  return {
    id: dbCaballeriza.id,
    nombre: dbCaballeriza.nombre,
    direccion: dbCaballeriza.direccion,
    telefono: dbCaballeriza.telefono || "",
    contacto: dbCaballeriza.contacto || "",
    clinicaId: dbCaballeriza.clinica_id,
  }
}

export const dbToHistoriaClinica = (
  dbHistoria: Database["public"]["Tables"]["historias_clinicas"]["Row"],
): HistoriaClinica => {
  return {
    id: dbHistoria.id,
    caballoId: dbHistoria.caballo_id,
    fecha: dbHistoria.fecha,
    tipo: dbHistoria.tipo,
    veterinarioId: dbHistoria.veterinario_id,
    observaciones: dbHistoria.observaciones,
    servicios: dbHistoria.servicios as any,
    totalNeto: Number(dbHistoria.total_neto),
    iva: Number(dbHistoria.iva),
    ivaRate: Number(dbHistoria.iva_rate),
    totalConIva: Number(dbHistoria.total_con_iva),
    facturaGenerada: dbHistoria.factura_generada,
    facturaId: dbHistoria.factura_id || undefined,
    clinicaId: dbHistoria.clinica_id,
    usuarioId: dbHistoria.usuario_id,
    eventoId: dbHistoria.evento_id || undefined,
    inventarioUsado: (dbHistoria.inventario_usado as any) || [],
  }
}

export const dbToCita = (dbCita: Database["public"]["Tables"]["citas"]["Row"]): Cita => {
  return {
    id: dbCita.id,
    caballoId: dbCita.caballo_id,
    fecha: dbCita.fecha,
    hora: dbCita.hora,
    tipo: dbCita.tipo,
    ubicacion: dbCita.ubicacion,
    notas: dbCita.notas || "",
    completada: dbCita.completada,
    clinicaId: dbCita.clinica_id,
    usuarioId: dbCita.usuario_id,
    eventoId: dbCita.evento_id || undefined,
  }
}

export const dbToInventarioItem = (dbItem: Database["public"]["Tables"]["inventario"]["Row"]): ItemInventario => {
  return {
    id: dbItem.id,
    nombre: dbItem.nombre,
    categoria: dbItem.categoria,
    stock: dbItem.stock,
    minimo: dbItem.minimo,
    unidad: dbItem.unidad,
    precio: dbItem.precio ? Number(dbItem.precio) : undefined,
    proveedor: dbItem.proveedor || "",
    ultimaCompra: dbItem.ultima_compra || "",
    clinicaId: dbItem.clinica_id,
  }
}

export const dbToFactura = (dbFactura: Database["public"]["Tables"]["facturas"]["Row"]): Factura => {
  return {
    id: dbFactura.id,
    historiaClinicaId: dbFactura.historia_clinica_id,
    caballoId: dbFactura.caballo_id,
    propietarioId: dbFactura.propietario_id,
    fecha: dbFactura.fecha,
    numero: dbFactura.numero,
    servicios: dbFactura.servicios as any,
    observaciones: dbFactura.observaciones,
    totalNeto: Number(dbFactura.total_neto),
    iva: Number(dbFactura.iva),
    totalConIva: Number(dbFactura.total_con_iva),
    clinicaId: dbFactura.clinica_id,
    eventoId: dbFactura.evento_id || undefined,
  }
}

export const dbToEvento = (dbEvento: Database["public"]["Tables"]["eventos"]["Row"]): Evento => {
  return {
    id: dbEvento.id,
    nombre: dbEvento.nombre,
    fecha: dbEvento.fecha,
    fechaFin: dbEvento.fecha_fin || undefined,
    ubicacion: dbEvento.ubicacion,
    descripcion: dbEvento.descripcion || "",
    organizador: dbEvento.organizador || "",
    contacto: dbEvento.contacto || "",
    tipo: dbEvento.tipo,
    estado: dbEvento.estado,
    clinicaId: dbEvento.clinica_id,
    usuarioId: dbEvento.usuario_id,
    servicios: dbEvento.servicios as any,
    caballosAtendidos: dbEvento.caballos_atendidos,
    ingresos: Number(dbEvento.ingresos),
    gastos: Number(dbEvento.gastos),
    imagenes: dbEvento.imagenes || [],
  }
}

export const dbToVeterinario = (dbVeterinario: Database["public"]["Tables"]["veterinarios"]["Row"]): Veterinario => {
  return {
    id: dbVeterinario.id,
    nombre: dbVeterinario.nombre,
    especialidad: dbVeterinario.especialidad || "",
    telefono: dbVeterinario.telefono || "",
    email: dbVeterinario.email || "",
    clinicaId: dbVeterinario.clinica_id,
  }
}

export const dbToServicio = (dbServicio: Database["public"]["Tables"]["servicios"]["Row"]): Servicio => {
  return {
    id: dbServicio.id,
    nombre: dbServicio.nombre,
    descripcion: dbServicio.descripcion,
    precio: Number(dbServicio.precio),
    categoria: dbServicio.categoria,
    clinicaId: dbServicio.clinica_id,
  }
}

export const dbToClinica = (dbClinica: Database["public"]["Tables"]["clinicas"]["Row"]): Clinica => {
  return {
    id: dbClinica.id,
    nombre: dbClinica.nombre,
    direccion: dbClinica.direccion,
    telefono: dbClinica.telefono,
    email: dbClinica.email,
    logo: dbClinica.logo || undefined,
    instagram: dbClinica.instagram || "",
    rif: dbClinica.rif || "",
  }
}

export const dbToUsuario = (dbUsuario: Database["public"]["Tables"]["usuarios"]["Row"]): Usuario => {
  return {
    id: dbUsuario.id,
    nombre: dbUsuario.nombre,
    email: dbUsuario.email,
    rol: dbUsuario.rol as any,
    clinicaId: dbUsuario.clinica_id,
    activo: dbUsuario.activo,
    avatar: dbUsuario.avatar || undefined,
    telefono: dbUsuario.telefono || "",
    especialidad: dbUsuario.especialidad || "",
  }
}

// Convertir de tipos de la aplicación a DB
export const caballoToDb = (caballo: Omit<Caballo, "id">): Database["public"]["Tables"]["caballos"]["Insert"] => {
  return {
    nombre: caballo.nombre,
    raza: caballo.raza,
    edad: caballo.edad,
    sexo: caballo.sexo,
    color: caballo.color,
    numero_chip: caballo.numeroChip,
    propietario_id: caballo.propietarioId,
    caballeriza_id: caballo.caballerizaId,
    ultima_revision: caballo.ultimaRevision || null,
    clinica_id: caballo.clinicaId,
  }
}

export const propietarioToDb = (
  propietario: Omit<Propietario, "id">,
): Database["public"]["Tables"]["propietarios"]["Insert"] => {
  return {
    nombre: propietario.nombre,
    telefono: propietario.telefono,
    email: propietario.email,
    direccion: propietario.direccion || null,
    cedula: propietario.cedula || null,
    rif: propietario.rif || null,
    clinica_id: propietario.clinicaId,
    // Eliminamos la propiedad activo ya que no existe en la tabla
  }
}

export const caballerizaToDb = (
  caballeriza: Omit<Caballeriza, "id">,
): Database["public"]["Tables"]["caballerizas"]["Insert"] => {
  return {
    nombre: caballeriza.nombre,
    direccion: caballeriza.direccion,
    telefono: caballeriza.telefono || null,
    contacto: caballeriza.contacto || null,
    clinica_id: caballeriza.clinicaId,
  }
}

export const historiaClinicaToDb = (
  historia: Omit<HistoriaClinica, "id">,
): Database["public"]["Tables"]["historias_clinicas"]["Insert"] => {
  return {
    caballo_id: historia.caballoId,
    fecha: historia.fecha,
    tipo: historia.tipo,
    veterinario_id: historia.veterinarioId,
    observaciones: historia.observaciones,
    servicios: historia.servicios as any,
    total_neto: historia.totalNeto,
    iva: historia.iva,
    iva_rate: historia.ivaRate,
    total_con_iva: historia.totalConIva,
    factura_generada: historia.facturaGenerada,
    factura_id: historia.facturaId || null,
    clinica_id: historia.clinicaId,
    usuario_id: historia.usuarioId,
    evento_id: historia.eventoId === "none" ? null : historia.eventoId || null,
    inventario_usado: (historia.inventarioUsado as any) || null,
  }
}

export const citaToDb = (cita: Omit<Cita, "id">): Database["public"]["Tables"]["citas"]["Insert"] => {
  return {
    caballo_id: cita.caballoId,
    fecha: cita.fecha,
    hora: cita.hora,
    tipo: cita.tipo,
    ubicacion: cita.ubicacion,
    notas: cita.notas || null,
    completada: cita.completada,
    clinica_id: cita.clinicaId,
    usuario_id: cita.usuarioId,
    evento_id: cita.eventoId || null,
  }
}

export const inventarioItemToDb = (
  item: Omit<ItemInventario, "id">,
): Database["public"]["Tables"]["inventario"]["Insert"] => {
  return {
    nombre: item.nombre,
    categoria: item.categoria,
    stock: item.stock,
    minimo: item.minimo,
    unidad: item.unidad,
    precio: item.precio || null,
    proveedor: item.proveedor || null,
    ultima_compra: item.ultimaCompra || null,
    clinica_id: item.clinicaId,
  }
}

export const facturaToDb = (factura: Omit<Factura, "id">): Database["public"]["Tables"]["facturas"]["Insert"] => {
  return {
    historia_clinica_id: factura.historiaClinicaId,
    caballo_id: factura.caballoId,
    propietario_id: factura.propietarioId,
    fecha: factura.fecha,
    numero: factura.numero,
    servicios: factura.servicios as any,
    observaciones: factura.observaciones,
    total_neto: factura.totalNeto,
    iva: factura.iva,
    total_con_iva: factura.totalConIva,
    clinica_id: factura.clinicaId,
    evento_id: factura.eventoId || null,
  }
}

export const eventoToDb = (evento: Omit<Evento, "id">): Database["public"]["Tables"]["eventos"]["Insert"] => {
  return {
    nombre: evento.nombre,
    fecha: evento.fecha,
    fecha_fin: evento.fechaFin || null,
    ubicacion: evento.ubicacion,
    descripcion: evento.descripcion || null,
    organizador: evento.organizador || null,
    contacto: evento.contacto || null,
    tipo: evento.tipo,
    estado: evento.estado,
    clinica_id: evento.clinicaId,
    usuario_id: evento.usuarioId,
    servicios: evento.servicios as any,
    caballos_atendidos: evento.caballosAtendidos,
    ingresos: evento.ingresos,
    gastos: evento.gastos,
    imagenes: evento.imagenes || null,
  }
}

export const veterinarioToDb = (
  veterinario: Omit<Veterinario, "id">,
): Database["public"]["Tables"]["veterinarios"]["Insert"] => {
  return {
    nombre: veterinario.nombre,
    especialidad: veterinario.especialidad || null,
    telefono: veterinario.telefono || null,
    email: veterinario.email || null,
    clinica_id: veterinario.clinicaId,
  }
}

export const servicioToDb = (servicio: Omit<Servicio, "id">): Database["public"]["Tables"]["servicios"]["Insert"] => {
  return {
    nombre: servicio.nombre,
    descripcion: servicio.descripcion,
    precio: servicio.precio,
    categoria: servicio.categoria,
    clinica_id: servicio.clinicaId,
  }
}

export const clinicaToDb = (clinica: Omit<Clinica, "id">): Database["public"]["Tables"]["clinicas"]["Insert"] => {
  return {
    nombre: clinica.nombre,
    direccion: clinica.direccion,
    telefono: clinica.telefono,
    email: clinica.email,
    logo: clinica.logo || null,
    instagram: clinica.instagram || null,
    rif: clinica.rif || null,
  }
}

export const usuarioToDb = (usuario: Omit<Usuario, "id">): Database["public"]["Tables"]["usuarios"]["Insert"] => {
  return {
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    clinica_id: usuario.clinicaId,
    activo: usuario.activo,
    avatar: usuario.avatar || null,
    telefono: usuario.telefono || null,
    especialidad: usuario.especialidad || null,
  }
}

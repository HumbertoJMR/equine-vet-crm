import type {
  Caballo,
  HistoriaClinica,
  Cita,
  ItemInventario,
  Propietario,
  Caballeriza,
  ConfiguracionEmpresa,
  Usuario,
  Clinica,
  Evento,
  Veterinario,
  Servicio,
} from "@/lib/types"

// Configuración de la empresa
export const configuracionEmpresa: ConfiguracionEmpresa = {
  nombre: "Equinmedical",
  telefonos: ["0412 - 041.1715", "0412 - 556.70.53"],
  email: "equinmedicalgroup@gmail.com",
  instagram: "equinmedical",
}

// Datos iniciales para clínicas
export const initialClinicas: Clinica[] = [
  {
    id: "clinica1",
    nombre: "Equinmedical Group",
    direccion: "Av. Principal, Caracas",
    telefono: "0412 - 041.1715",
    email: "equinmedicalgroup@gmail.com",
    instagram: "equinmedical",
    rif: "J-12345678-9",
  },
]

// Datos iniciales para usuarios
export const initialUsuarios: Usuario[] = [
  {
    id: "user1",
    nombre: "Administrador",
    email: "admin@equinmedical.com",
    rol: "admin",
    clinicaId: "clinica1",
    activo: true,
    telefono: "0412-1234567",
    especialidad: "Administración",
  },
  {
    id: "user2",
    nombre: "Juan Pérez",
    email: "juan@equinmedical.com",
    rol: "veterinario",
    clinicaId: "clinica1",
    activo: true,
    telefono: "0412-2345678",
    especialidad: "Medicina Equina",
  },
  {
    id: "user3",
    nombre: "María López",
    email: "maria@equinmedical.com",
    rol: "asistente",
    clinicaId: "clinica1",
    activo: true,
    telefono: "0412-3456789",
    especialidad: "Asistente Veterinario",
  },
]

// Datos iniciales para veterinarios
export const initialVeterinarios: Veterinario[] = [
  {
    id: "vet1",
    nombre: "Dr. Juan Pérez",
    especialidad: "Medicina Equina",
    telefono: "0412-2345678",
    email: "juan@equinmedical.com",
    clinicaId: "clinica1",
  },
  {
    id: "vet2",
    nombre: "Dra. Ana Rodríguez",
    especialidad: "Cirugía Equina",
    telefono: "0412-3456789",
    email: "ana@equinmedical.com",
    clinicaId: "clinica1",
  },
]

// Datos iniciales para propietarios
export const initialPropietarios: Propietario[] = []

// Datos iniciales para caballerizas
export const initialCaballerizas: Caballeriza[] = []

// Datos iniciales para caballos
export const initialCaballos: Caballo[] = []

// Datos iniciales para historias clínicas
export const initialHistoriasClinicas: HistoriaClinica[] = []

// Datos iniciales para citas
export const initialCitas: Cita[] = []

// Datos iniciales para inventario
export const initialInventario: ItemInventario[] = []

// Datos iniciales para eventos
export const initialEventos: Evento[] = []

// Añadir datos iniciales para servicios
export const initialServicios: Servicio[] = [
  {
    id: "serv1",
    nombre: "Consulta general",
    descripcion: "Revisión general del estado de salud del caballo",
    precio: 50.0,
    categoria: "consulta",
    clinicaId: "clinica1",
  },
  {
    id: "serv2",
    nombre: "Vacunación",
    descripcion: "Administración de vacunas según protocolo",
    precio: 35.0,
    categoria: "procedimiento",
    clinicaId: "clinica1",
  },
  {
    id: "serv3",
    nombre: "Revisión dental",
    descripcion: "Examen y limpieza dental completa",
    precio: 75.0,
    categoria: "procedimiento",
    clinicaId: "clinica1",
  },
  {
    id: "serv4",
    nombre: "Herraje",
    descripcion: "Servicio completo de herraje",
    precio: 120.0,
    categoria: "procedimiento",
    clinicaId: "clinica1",
  },
]

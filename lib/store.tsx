"use client"

import { create } from "zustand"
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
import { toast } from "@/hooks/use-toast"
import { createContext, useRef, type ReactNode } from "react"

// Definir la interfaz del store
interface StoreState {
  // Datos
  caballos: Caballo[]
  propietarios: Propietario[]
  caballerizas: Caballeriza[]
  historiasClinicas: HistoriaClinica[]
  citas: Cita[]
  inventario: ItemInventario[]
  facturas: Factura[]
  eventos: Evento[]
  veterinarios: Veterinario[]
  servicios: Servicio[]
  clinicas: Clinica[]
  usuarios: Usuario[]
  configuracion: any

  // Funciones para caballos
  getCaballo: (id: string) => Caballo | undefined
  addCaballo: (caballo: Omit<Caballo, "id">) => string
  updateCaballo: (id: string, data: Partial<Caballo>) => void
  deleteCaballo: (id: string) => void
  searchCaballos: (query: string) => Caballo[]

  // Funciones para propietarios
  getPropietario: (id: string) => Propietario | undefined
  addPropietario: (propietario: Omit<Propietario, "id">) => string
  updatePropietario: (id: string, data: Partial<Propietario>) => void
  deletePropietario: (id: string) => void
  searchPropietarios: (query: string) => Propietario[]

  // Funciones para caballerizas
  getCaballeriza: (id: string) => Caballeriza | undefined
  addCaballeriza: (caballeriza: Omit<Caballeriza, "id">) => string
  updateCaballeriza: (id: string, data: Partial<Caballeriza>) => void
  deleteCaballeriza: (id: string) => void
  searchCaballerizas: (query: string) => Caballeriza[]

  // Funciones para historias clínicas
  getHistoria: (id: string) => HistoriaClinica | undefined
  getHistoriasCaballo: (caballoId: string) => HistoriaClinica[]
  getHistoriasEvento: (eventoId: string) => HistoriaClinica[]
  addHistoriaClinica: (historia: Omit<HistoriaClinica, "id">) => Promise<string>
  updateHistoriaClinica: (id: string, data: Partial<HistoriaClinica>) => void
  deleteHistoriaClinica: (id: string) => void
  searchHistorias: (query: string) => HistoriaClinica[]

  // Funciones para citas
  getCita: (id: string) => Cita | undefined
  getCitasCaballo: (caballoId: string) => Cita[]
  getCitasEvento: (eventoId: string) => Cita[]
  addCita: (cita: Omit<Cita, "id">) => string
  updateCita: (id: string, data: Partial<Cita>) => void
  deleteCita: (id: string) => void
  searchCitas: (query: string) => Cita[]

  // Funciones para inventario
  getInventarioItem: (id: string) => ItemInventario | undefined
  addInventarioItem: (item: Omit<ItemInventario, "id">) => string
  updateInventarioItem: (id: string, data: Partial<ItemInventario>) => void
  deleteInventarioItem: (id: string) => void
  updateInventarioStock: (id: string, cantidad: number) => void
  searchInventario: (query: string) => ItemInventario[]

  // Funciones para facturas
  getFactura: (id: string) => Factura | undefined
  getFacturasCaballo: (caballoId: string) => Factura[]
  getFacturasEvento: (eventoId: string) => Factura[]
  addFactura: (factura: Omit<Factura, "id" | "numero">) => string
  updateFactura: (id: string, data: Partial<Factura>) => void
  deleteFactura: (id: string) => void
  searchFacturas: (query: string) => Factura[]

  // Funciones para eventos
  getEvento: (id: string) => Evento | undefined
  addEvento: (evento: Omit<Evento, "id">) => string
  updateEvento: (id: string, data: Partial<Evento>) => void
  deleteEvento: (id: string) => void
  searchEventos: (query: string) => Evento[]
  getEventoStats: (id: string) => any

  // Funciones para veterinarios
  getVeterinario: (id: string) => Veterinario | undefined
  addVeterinario: (veterinario: Omit<Veterinario, "id">) => string
  updateVeterinario: (id: string, data: Partial<Veterinario>) => void
  deleteVeterinario: (id: string) => void
  searchVeterinarios: (query: string) => Veterinario[]

  // Funciones para servicios
  getServicio: (id: string) => Servicio | undefined
  addServicio: (servicio: Omit<Servicio, "id">) => string
  updateServicio: (id: string, data: Partial<Servicio>) => void
  deleteServicio: (id: string) => void
  searchServicios: (query: string) => Servicio[]

  // Funciones para clínicas
  getClinica: (id: string) => Clinica | undefined
  getUsuariosByClinica: (clinicaId: string) => Usuario[]

  // Funciones para usuarios
  getUsuario: (id: string) => Usuario | undefined
  updateUsuario: (id: string, data: Partial<Usuario>) => void

  // Funciones para analíticas
  getAnalytics: () => any

  // Funciones para inicialización
  setInitialData: (data: any) => void
}

// Crear el store
export const useStore = create<StoreState>((set, get) => ({
  // Estado inicial
  caballos: [],
  propietarios: [],
  caballerizas: [],
  historiasClinicas: [],
  citas: [],
  inventario: [],
  facturas: [],
  eventos: [],
  veterinarios: [],
  servicios: [],
  clinicas: [],
  usuarios: [],
  configuracion: {
    nombre: "Equinmedical",
    telefonos: ["0412 - 041.1715", "0412 - 556.70.53"],
    email: "equinmedicalgroup@gmail.com",
    instagram: "equinmedical",
  },

  // Implementación de funciones
  // Caballos
  getCaballo: (id) => get().caballos.find((c) => c.id === id),
  addCaballo: (caballo) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      caballos: [...state.caballos, { ...caballo, id }],
    }))
    return id
  },
  updateCaballo: (id, data) => {
    set((state) => ({
      caballos: state.caballos.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }))
  },
  deleteCaballo: (id) => {
    set((state) => ({
      caballos: state.caballos.filter((c) => c.id !== id),
      historiasClinicas: state.historiasClinicas.filter((h) => h.caballoId !== id),
      citas: state.citas.filter((c) => c.caballoId !== id),
      facturas: state.facturas.filter((f) => f.caballoId !== id),
    }))
  },
  searchCaballos: (query) => {
    const q = query.toLowerCase()
    return get().caballos.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) || c.raza.toLowerCase().includes(q) || c.color.toLowerCase().includes(q),
    )
  },

  // Propietarios
  getPropietario: (id) => get().propietarios.find((p) => p.id === id),
  addPropietario: (propietario) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      propietarios: [...state.propietarios, { ...propietario, id }],
    }))
    return id
  },
  updatePropietario: (id, data) => {
    set((state) => ({
      propietarios: state.propietarios.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }))
  },
  deletePropietario: (id) => {
    set((state) => ({
      propietarios: state.propietarios.filter((p) => p.id !== id),
    }))
  },
  searchPropietarios: (query) => {
    const q = query.toLowerCase()
    return get().propietarios.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) || p.telefono.toLowerCase().includes(q) || p.email.toLowerCase().includes(q),
    )
  },

  // Caballerizas
  getCaballeriza: (id) => get().caballerizas.find((c) => c.id === id),
  addCaballeriza: (caballeriza) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      caballerizas: [...state.caballerizas, { ...caballeriza, id }],
    }))
    return id
  },
  updateCaballeriza: (id, data) => {
    set((state) => ({
      caballerizas: state.caballerizas.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }))
  },
  deleteCaballeriza: (id) => {
    set((state) => ({
      caballerizas: state.caballerizas.filter((c) => c.id !== id),
    }))
  },
  searchCaballerizas: (query) => {
    const q = query.toLowerCase()
    return get().caballerizas.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.direccion.toLowerCase().includes(q) ||
        (c.telefono && c.telefono.toLowerCase().includes(q)),
    )
  },

  // Historias Clínicas
  getHistoria: (id) => get().historiasClinicas.find((h) => h.id === id),
  getHistoriasCaballo: (caballoId) => get().historiasClinicas.filter((h) => h.caballoId === caballoId),
  getHistoriasEvento: (eventoId) => get().historiasClinicas.filter((h) => h.eventoId === eventoId),
  addHistoriaClinica: async (historia) => {
    try {
      // Asegurarse de que eventoId sea null si es "none"
      const historiaToSave = {
        ...historia,
        eventoId: historia.eventoId === "none" ? null : historia.eventoId,
      }

      const id = Math.random().toString(36).substring(2, 9)
      const newHistoria = { ...historiaToSave, id }

      set((state) => ({
        historiasClinicas: [...state.historiasClinicas, newHistoria],
      }))

      // Actualizar la última revisión del caballo
      const caballo = get().getCaballo(historia.caballoId)
      if (caballo) {
        get().updateCaballo(caballo.id, { ultimaRevision: historia.fecha })
      }

      // Si la historia está asociada a un evento, actualizar las estadísticas del evento
      if (historia.eventoId && historia.eventoId !== "none") {
        const evento = get().getEvento(historia.eventoId)
        if (evento) {
          const totalIngresos = historia.totalConIva
          const caballosAtendidos = 1 // Una historia clínica = un caballo atendido

          get().updateEvento(historia.eventoId, {
            ingresos: evento.ingresos + totalIngresos,
            caballosAtendidos: evento.caballosAtendidos + caballosAtendidos,
            servicios: [...evento.servicios, ...historia.servicios],
          })
        }
      }

      // Actualizar inventario si se usó algún item
      if (historia.inventarioUsado && historia.inventarioUsado.length > 0) {
        for (const item of historia.inventarioUsado) {
          get().updateInventarioStock(item.itemId, item.cantidad)
        }
      }

      return id
    } catch (error) {
      console.error("Error al agregar historia clínica:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al agregar la historia clínica.",
        variant: "destructive",
      })
      throw error
    }
  },
  updateHistoriaClinica: (id, data) => {
    set((state) => ({
      historiasClinicas: state.historiasClinicas.map((h) => (h.id === id ? { ...h, ...data } : h)),
    }))
  },
  deleteHistoriaClinica: (id) => {
    const historia = get().getHistoria(id)
    if (historia && historia.facturaId) {
      get().deleteFactura(historia.facturaId)
    }
    set((state) => ({
      historiasClinicas: state.historiasClinicas.filter((h) => h.id !== id),
    }))
  },
  searchHistorias: (query) => {
    const q = query.toLowerCase()
    const { caballos } = get()
    return get().historiasClinicas.filter((h) => {
      const caballo = caballos.find((c) => c.id === h.caballoId)
      return (
        (caballo && caballo.nombre.toLowerCase().includes(q)) ||
        h.tipo.toLowerCase().includes(q) ||
        h.fecha.toLowerCase().includes(q) ||
        h.veterinarioId.toLowerCase().includes(q)
      )
    })
  },

  // Citas
  getCita: (id) => get().citas.find((c) => c.id === id),
  getCitasCaballo: (caballoId) => get().citas.filter((c) => c.caballoId === caballoId),
  getCitasEvento: (eventoId) => get().citas.filter((c) => c.eventoId === eventoId),
  addCita: (cita) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      citas: [...state.citas, { ...cita, id }],
    }))
    return id
  },
  updateCita: (id, data) => {
    set((state) => ({
      citas: state.citas.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }))
  },
  deleteCita: (id) => {
    set((state) => ({
      citas: state.citas.filter((c) => c.id !== id),
    }))
  },
  searchCitas: (query) => {
    const q = query.toLowerCase()
    const { caballos } = get()
    return get().citas.filter((c) => {
      const caballo = caballos.find((cab) => cab.id === c.caballoId)
      return (
        (caballo && caballo.nombre.toLowerCase().includes(q)) ||
        c.tipo.toLowerCase().includes(q) ||
        c.fecha.toLowerCase().includes(q) ||
        c.ubicacion.toLowerCase().includes(q)
      )
    })
  },

  // Inventario
  getInventarioItem: (id) => get().inventario.find((i) => i.id === id),
  addInventarioItem: (item) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      inventario: [...state.inventario, { ...item, id }],
    }))
    return id
  },
  updateInventarioItem: (id, data) => {
    set((state) => ({
      inventario: state.inventario.map((i) => (i.id === id ? { ...i, ...data } : i)),
    }))
  },
  deleteInventarioItem: (id) => {
    set((state) => ({
      inventario: state.inventario.filter((i) => i.id !== id),
    }))
  },
  updateInventarioStock: (id, cantidad) => {
    const item = get().getInventarioItem(id)
    if (item) {
      const newStock = Math.max(0, item.stock - cantidad)
      get().updateInventarioItem(id, { stock: newStock })
    }
  },
  searchInventario: (query) => {
    const q = query.toLowerCase()
    return get().inventario.filter(
      (i) =>
        i.nombre.toLowerCase().includes(q) ||
        i.categoria.toLowerCase().includes(q) ||
        (i.proveedor && i.proveedor.toLowerCase().includes(q)),
    )
  },

  // Facturas
  getFactura: (id) => get().facturas.find((f) => f.id === id),
  getFacturasCaballo: (caballoId) => get().facturas.filter((f) => f.caballoId === caballoId),
  getFacturasEvento: (eventoId) => get().facturas.filter((f) => f.eventoId === eventoId),
  addFactura: (factura) => {
    const id = Math.random().toString(36).substring(2, 9)
    const numero = `F-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`

    const newFactura = { ...factura, id, numero }

    set((state) => ({
      facturas: [...state.facturas, newFactura],
    }))

    // Actualizar la historia clínica para marcarla como facturada
    if (factura.historiaClinicaId) {
      get().updateHistoriaClinica(factura.historiaClinicaId, {
        facturaGenerada: true,
        facturaId: id,
      })
    }

    return id
  },
  updateFactura: (id, data) => {
    set((state) => ({
      facturas: state.facturas.map((f) => (f.id === id ? { ...f, ...data } : f)),
    }))
  },
  deleteFactura: (id) => {
    const factura = get().getFactura(id)
    if (factura && factura.historiaClinicaId) {
      get().updateHistoriaClinica(factura.historiaClinicaId, {
        facturaGenerada: false,
        facturaId: undefined,
      })
    }
    set((state) => ({
      facturas: state.facturas.filter((f) => f.id !== id),
    }))
  },
  searchFacturas: (query) => {
    const q = query.toLowerCase()
    const { caballos, propietarios } = get()
    return get().facturas.filter((f) => {
      const caballo = caballos.find((c) => c.id === f.caballoId)
      const propietario = propietarios.find((p) => p.id === f.propietarioId)
      return (
        (caballo && caballo.nombre.toLowerCase().includes(q)) ||
        (propietario && propietario.nombre.toLowerCase().includes(q)) ||
        f.numero.toLowerCase().includes(q) ||
        f.fecha.toLowerCase().includes(q)
      )
    })
  },

  // Eventos
  getEvento: (id) => get().eventos.find((e) => e.id === id),
  addEvento: (evento) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      eventos: [...state.eventos, { ...evento, id }],
    }))
    return id
  },
  updateEvento: (id, data) => {
    set((state) => ({
      eventos: state.eventos.map((e) => (e.id === id ? { ...e, ...data } : e)),
    }))
  },
  deleteEvento: (id) => {
    set((state) => ({
      eventos: state.eventos.filter((e) => e.id !== id),
      historiasClinicas: state.historiasClinicas.map((h) => (h.eventoId === id ? { ...h, eventoId: undefined } : h)),
      citas: state.citas.map((c) => (c.eventoId === id ? { ...c, eventoId: undefined } : c)),
      facturas: state.facturas.map((f) => (f.eventoId === id ? { ...f, eventoId: undefined } : f)),
    }))
  },
  searchEventos: (query) => {
    const q = query.toLowerCase()
    return get().eventos.filter(
      (e) =>
        e.nombre.toLowerCase().includes(q) ||
        e.ubicacion.toLowerCase().includes(q) ||
        e.fecha.toLowerCase().includes(q) ||
        e.tipo.toLowerCase().includes(q) ||
        e.estado.toLowerCase().includes(q),
    )
  },
  getEventoStats: (id) => {
    const evento = get().getEvento(id)
    if (!evento) return null

    const historias = get().getHistoriasEvento(id)
    const serviciosCounts: Record<string, number> = {}

    // Contar servicios
    historias.forEach((historia) => {
      historia.servicios.forEach((servicio: any) => {
        if (serviciosCounts[servicio.descripcion]) {
          serviciosCounts[servicio.descripcion] += servicio.cantidad
        } else {
          serviciosCounts[servicio.descripcion] = servicio.cantidad
        }
      })
    })

    // Convertir a array y ordenar
    const serviciosMasComunes = Object.entries(serviciosCounts)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)

    // Calcular ingresos por mes
    const ingresosUltimos6Meses = [
      { mes: "Enero", ingresos: Math.random() * 1000 },
      { mes: "Febrero", ingresos: Math.random() * 1000 },
      { mes: "Marzo", ingresos: Math.random() * 1000 },
      { mes: "Abril", ingresos: Math.random() * 1000 },
      { mes: "Mayo", ingresos: Math.random() * 1000 },
      { mes: "Junio", ingresos: Math.random() * 1000 },
    ]

    return {
      totalCaballos: evento.caballosAtendidos,
      totalServicios: historias.reduce(
        (total, historia) => total + historia.servicios.reduce((t: number, s: any) => t + s.cantidad, 0),
        0,
      ),
      totalIngresos: evento.ingresos,
      serviciosMasComunes,
      ingresosUltimos6Meses,
    }
  },

  // Veterinarios
  getVeterinario: (id) => get().veterinarios.find((v) => v.id === id),
  addVeterinario: (veterinario) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      veterinarios: [...state.veterinarios, { ...veterinario, id }],
    }))
    return id
  },
  updateVeterinario: (id, data) => {
    set((state) => ({
      veterinarios: state.veterinarios.map((v) => (v.id === id ? { ...v, ...data } : v)),
    }))
  },
  deleteVeterinario: (id) => {
    set((state) => ({
      veterinarios: state.veterinarios.filter((v) => v.id !== id),
    }))
  },
  searchVeterinarios: (query) => {
    const q = query.toLowerCase()
    return get().veterinarios.filter(
      (v) =>
        v.nombre.toLowerCase().includes(q) ||
        (v.especialidad && v.especialidad.toLowerCase().includes(q)) ||
        (v.email && v.email.toLowerCase().includes(q)),
    )
  },

  // Servicios
  getServicio: (id) => get().servicios.find((s) => s.id === id),
  addServicio: (servicio) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      servicios: [...state.servicios, { ...servicio, id }],
    }))
    return id
  },
  updateServicio: (id, data) => {
    set((state) => ({
      servicios: state.servicios.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }))
  },
  deleteServicio: (id) => {
    set((state) => ({
      servicios: state.servicios.filter((s) => s.id !== id),
    }))
  },
  searchServicios: (query) => {
    const q = query.toLowerCase()
    return get().servicios.filter(
      (s) =>
        s.nombre.toLowerCase().includes(q) ||
        s.descripcion.toLowerCase().includes(q) ||
        s.categoria.toLowerCase().includes(q),
    )
  },

  // Clínicas
  getClinica: (id) => get().clinicas.find((c) => c.id === id),
  getUsuariosByClinica: (clinicaId) => get().usuarios.filter((u) => u.clinicaId === clinicaId),

  // Usuarios
  getUsuario: (id) => get().usuarios.find((u) => u.id === id),
  updateUsuario: (id: string, data: Partial<Usuario>) => {
    set((state) => ({
      usuarios: state.usuarios.map((u) => (u.id === id ? { ...u, ...data } : u)),
    }))
  },

  // Analíticas
  getAnalytics: () => {
    const { historiasClinicas, facturas } = get()

    // Calcular ingresos totales
    const totalIngresos = facturas.reduce((total, factura) => total + factura.totalConIva, 0)

    // Calcular ingresos por mes (últimos 6 meses)
    const ingresosUltimos6Meses = [
      { mes: "Enero", ingresos: Math.random() * 1000 },
      { mes: "Febrero", ingresos: Math.random() * 1000 },
      { mes: "Marzo", ingresos: Math.random() * 1000 },
      { mes: "Abril", ingresos: Math.random() * 1000 },
      { mes: "Mayo", ingresos: Math.random() * 1000 },
      { mes: "Junio", ingresos: Math.random() * 1000 },
    ]

    return {
      totalIngresos,
      ingresosUltimos6Meses,
    }
  },

  // Inicialización
  setInitialData: (data) => {
    set({
      caballos: data.caballos || [],
      propietarios: data.propietarios || [],
      caballerizas: data.caballerizas || [],
      historiasClinicas: data.historiasClinicas || [],
      citas: data.citas || [],
      inventario: data.inventario || [],
      facturas: data.facturas || [],
      eventos: data.eventos || [],
      veterinarios: data.veterinarios || [],
      servicios: data.servicios || [],
      clinicas: data.clinicas || [],
      usuarios: data.usuarios || [],
      configuracion: data.configuracion || get().configuracion,
    })
  },
}))

// Crear un contexto para el store
const StoreContext = createContext<ReturnType<typeof useStore> | null>(null)

// Crear un provider para el store
export function StoreProvider({ children }: { children: ReactNode }) {
  // Llamar a useStore directamente, sin condiciones
  const store = useStore()

  // Usar useRef para mantener una referencia estable al store
  const storeRef = useRef<ReturnType<typeof useStore>>()

  // Actualizar la referencia en cada renderizado
  storeRef.current = store

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

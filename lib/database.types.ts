export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      caballos: {
        Row: {
          id: string
          nombre: string
          raza: string
          edad: number
          sexo: string
          color: string
          numero_chip: string
          propietario_id: string
          caballeriza_id: string
          ultima_revision: string | null
          clinica_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          raza: string
          edad: number
          sexo: string
          color: string
          numero_chip: string
          propietario_id: string
          caballeriza_id: string
          ultima_revision?: string | null
          clinica_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          raza?: string
          edad?: number
          sexo?: string
          color?: string
          numero_chip?: string
          propietario_id?: string
          caballeriza_id?: string
          ultima_revision?: string | null
          clinica_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      propietarios: {
        Row: {
          id: string
          nombre: string
          telefono: string
          email: string
          direccion: string | null
          cedula: string | null
          rif: string | null
          clinica_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          telefono: string
          email: string
          direccion?: string | null
          cedula?: string | null
          rif?: string | null
          clinica_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          telefono?: string
          email?: string
          direccion?: string | null
          cedula?: string | null
          rif?: string | null
          clinica_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      caballerizas: {
        Row: {
          id: string
          nombre: string
          direccion: string
          telefono: string | null
          contacto: string | null
          clinica_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          direccion: string
          telefono?: string | null
          contacto?: string | null
          clinica_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          direccion?: string
          telefono?: string | null
          contacto?: string | null
          clinica_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      historias_clinicas: {
        Row: {
          id: string
          caballo_id: string
          fecha: string
          tipo: string
          veterinario_id: string
          observaciones: string
          servicios: Json
          total_neto: number
          iva: number
          iva_rate: number
          total_con_iva: number
          factura_generada: boolean
          factura_id: string | null
          clinica_id: string
          usuario_id: string
          evento_id: string | null
          inventario_usado: Json | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          caballo_id: string
          fecha: string
          tipo: string
          veterinario_id: string
          observaciones: string
          servicios: Json
          total_neto: number
          iva: number
          iva_rate: number
          total_con_iva: number
          factura_generada: boolean
          factura_id?: string | null
          clinica_id: string
          usuario_id: string
          evento_id?: string | null
          inventario_usado?: Json | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          caballo_id?: string
          fecha?: string
          tipo?: string
          veterinario_id?: string
          observaciones?: string
          servicios?: Json
          total_neto?: number
          iva?: number
          iva_rate?: number
          total_con_iva?: number
          factura_generada?: boolean
          factura_id?: string | null
          clinica_id?: string
          usuario_id?: string
          evento_id?: string | null
          inventario_usado?: Json | null
          created_at?: string
          updated_at?: string | null
        }
      }
      citas: {
        Row: {
          id: string
          caballo_id: string
          fecha: string
          hora: string
          tipo: string
          ubicacion: string
          notas: string | null
          completada: boolean
          clinica_id: string
          usuario_id: string
          evento_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          caballo_id: string
          fecha: string
          hora: string
          tipo: string
          ubicacion: string
          notas?: string | null
          completada: boolean
          clinica_id: string
          usuario_id: string
          evento_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          caballo_id?: string
          fecha?: string
          hora?: string
          tipo?: string
          ubicacion?: string
          notas?: string | null
          completada?: boolean
          clinica_id?: string
          usuario_id?: string
          evento_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      inventario: {
        Row: {
          id: string
          nombre: string
          categoria: string
          stock: number
          minimo: number
          unidad: string
          precio: number | null
          proveedor: string | null
          ultima_compra: string | null
          clinica_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          categoria: string
          stock: number
          minimo: number
          unidad: string
          precio?: number | null
          proveedor?: string | null
          ultima_compra?: string | null
          clinica_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          categoria?: string
          stock?: number
          minimo?: number
          unidad?: string
          precio?: number | null
          proveedor?: string | null
          ultima_compra?: string | null
          clinica_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      facturas: {
        Row: {
          id: string
          historia_clinica_id: string
          caballo_id: string
          propietario_id: string
          fecha: string
          numero: string
          servicios: Json
          observaciones: string
          total_neto: number
          iva: number
          total_con_iva: number
          clinica_id: string
          evento_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          historia_clinica_id: string
          caballo_id: string
          propietario_id: string
          fecha: string
          numero: string
          servicios: Json
          observaciones: string
          total_neto: number
          iva: number
          total_con_iva: number
          clinica_id: string
          evento_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          historia_clinica_id?: string
          caballo_id?: string
          propietario_id?: string
          fecha?: string
          numero?: string
          servicios?: Json
          observaciones?: string
          total_neto?: number
          iva?: number
          total_con_iva?: number
          clinica_id?: string
          evento_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      eventos: {
        Row: {
          id: string
          nombre: string
          fecha: string
          fecha_fin: string | null
          ubicacion: string
          descripcion: string | null
          organizador: string | null
          contacto: string | null
          tipo: string
          estado: string
          clinica_id: string
          usuario_id: string
          servicios: Json
          caballos_atendidos: number
          ingresos: number
          gastos: number
          imagenes: string[] | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          fecha: string
          fecha_fin?: string | null
          ubicacion: string
          descripcion?: string | null
          organizador?: string | null
          contacto?: string | null
          tipo: string
          estado: string
          clinica_id: string
          usuario_id: string
          servicios: Json
          caballos_atendidos: number
          ingresos: number
          gastos: number
          imagenes?: string[] | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          fecha?: string
          fecha_fin?: string | null
          ubicacion?: string
          descripcion?: string | null
          organizador?: string | null
          contacto?: string | null
          tipo?: string
          estado?: string
          clinica_id?: string
          usuario_id?: string
          servicios?: Json
          caballos_atendidos?: number
          ingresos?: number
          gastos?: number
          imagenes?: string[] | null
          created_at?: string
          updated_at?: string | null
        }
      }
      veterinarios: {
        Row: {
          id: string
          nombre: string
          especialidad: string | null
          telefono: string | null
          email: string | null
          clinica_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          especialidad?: string | null
          telefono?: string | null
          email?: string | null
          clinica_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          especialidad?: string | null
          telefono?: string | null
          email?: string | null
          clinica_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      servicios: {
        Row: {
          id: string
          nombre: string
          descripcion: string
          precio: number
          categoria: string
          clinica_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          descripcion: string
          precio: number
          categoria: string
          clinica_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string
          precio?: number
          categoria?: string
          clinica_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      clinicas: {
        Row: {
          id: string
          nombre: string
          direccion: string
          telefono: string
          email: string
          logo: string | null
          instagram: string | null
          rif: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          direccion: string
          telefono: string
          email: string
          logo?: string | null
          instagram?: string | null
          rif?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          direccion?: string
          telefono?: string
          email?: string
          logo?: string | null
          instagram?: string | null
          rif?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      usuarios: {
        Row: {
          id: string
          nombre: string
          email: string
          rol: string
          clinica_id: string
          activo: boolean
          avatar: string | null
          telefono: string | null
          especialidad: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          email: string
          rol: string
          clinica_id: string
          activo: boolean
          avatar?: string | null
          telefono?: string | null
          especialidad?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          rol?: string
          clinica_id?: string
          activo?: boolean
          avatar?: string | null
          telefono?: string | null
          especialidad?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

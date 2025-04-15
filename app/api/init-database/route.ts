import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Verificar si ya existe la clínica principal
    const { data: existingClinica } = await supabase
      .from("clinicas")
      .select("id")
      .eq("nombre", "Equinmedical Group")
      .limit(1)

    // Si no existe, crear datos iniciales
    if (!existingClinica || existingClinica.length === 0) {
      // Crear clínica
      const { data: clinica, error: clinicaError } = await supabase
        .from("clinicas")
        .insert({
          nombre: "Equinmedical Group",
          direccion: "Av. Principal, Caracas",
          telefono: "0412 - 041.1715",
          email: "equinmedicalgroup@gmail.com",
          instagram: "equinmedical",
          rif: "J-12345678-9",
        })
        .select()

      if (clinicaError) {
        throw new Error(`Error al crear clínica: ${clinicaError.message}`)
      }

      const clinicaId = clinica[0].id

      // Crear usuario administrador
      const { error: usuarioError } = await supabase.from("usuarios").insert({
        nombre: "Administrador",
        email: "admin@equinmedical.com",
        rol: "admin",
        clinica_id: clinicaId,
        activo: true,
        telefono: "0412-1234567",
        especialidad: "Administración",
      })

      if (usuarioError) {
        throw new Error(`Error al crear usuario: ${usuarioError.message}`)
      }

      // Crear veterinario de ejemplo
      const { error: veterinarioError } = await supabase.from("veterinarios").insert({
        nombre: "Dr. Juan Pérez",
        especialidad: "Medicina Equina",
        telefono: "0412-2345678",
        email: "juan@equinmedical.com",
        clinica_id: clinicaId,
      })

      if (veterinarioError) {
        throw new Error(`Error al crear veterinario: ${veterinarioError.message}`)
      }

      // Crear servicios de ejemplo
      const serviciosEjemplo = [
        {
          nombre: "Consulta general",
          descripcion: "Revisión general del estado de salud del caballo",
          precio: 50.0,
          categoria: "consulta",
          clinica_id: clinicaId,
        },
        {
          nombre: "Vacunación",
          descripcion: "Administración de vacunas según protocolo",
          precio: 35.0,
          categoria: "procedimiento",
          clinica_id: clinicaId,
        },
        {
          nombre: "Revisión dental",
          descripcion: "Examen y limpieza dental completa",
          precio: 75.0,
          categoria: "procedimiento",
          clinica_id: clinicaId,
        },
      ]

      const { error: serviciosError } = await supabase.from("servicios").insert(serviciosEjemplo)

      if (serviciosError) {
        throw new Error(`Error al crear servicios: ${serviciosError.message}`)
      }

      return NextResponse.json({
        success: true,
        message: "Base de datos inicializada correctamente",
        details: "Se han creado datos de ejemplo para comenzar a usar el sistema",
      })
    }

    return NextResponse.json({
      success: true,
      message: "La base de datos ya está inicializada",
      details: "Ya existen datos en el sistema",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error al inicializar la base de datos",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

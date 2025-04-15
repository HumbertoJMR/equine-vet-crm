import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Verificar conexión a Supabase
    const { data: connectionTest, error: connectionError } = await supabase.from("clinicas").select("count").limit(1)

    if (connectionError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al conectar con Supabase",
          error: connectionError.message,
          details: "Verifica tus variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY",
        },
        { status: 500 },
      )
    }

    // Verificar tablas necesarias
    const tables = [
      "clinicas",
      "usuarios",
      "caballos",
      "propietarios",
      "caballerizas",
      "historias_clinicas",
      "citas",
      "facturas",
      "inventario",
      "eventos",
      "veterinarios",
      "servicios",
    ]

    const tableResults = {}

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select("count").limit(1)
      tableResults[table] = {
        exists: !error,
        error: error ? error.message : null,
      }
    }

    // Verificar autenticación
    const { data: authSettings, error: authError } = await supabase.auth.getSession()

    return NextResponse.json({
      success: true,
      message: "Conexión a Supabase exitosa",
      tables: tableResults,
      auth: {
        working: !authError,
        error: authError ? authError.message : null,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error al verificar Supabase",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
